import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { submitForm, getToken } from './actions/FormActions'

import {
  convertAPIError,
  getDefaultValue,
  isInstrumentUpdate,
  getErrorText,
} from './FormHelpers'

import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'

import {
  TogglePlaid,
  configureVault,
  configurePlaid,
  Field
} from './index'

import {
  PropertyHelper,
} from './helpers/PropHelpers'

import { Instrument, Account } from './models'

import configure from './client/VaultConfig'

import { PaymentMethods } from './PaymentMethod'

import { logError, logInfo } from './helpers/Logger'

export default class PlaidForm extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string,

    /** Account object allows preconfigured account options to be set */
    account: PropTypes.object,

    /** A callable function to fire when form is complete */
    onComplete: PropTypes.func,

    /** A callable function to fire when next event occurs */
    onNext: PropTypes.func,

    /** A callable function to fire when cancel event occurs */
    onCancel: PropTypes.func,

    /** A callable function to fire when last event occurs */
    onLast: PropTypes.func,

    /** A callable function to fire when an error occurs on the form. */
    onError: PropTypes.func,

    /** A callable function to fire when an validation error occurs on the form. */
    onValidationError: PropTypes.func,

    /** Toggle for showing/hiding plaid info */
    togglePlaidHandler: PropTypes.func,

    /** `inputStyles` for input fields. `&:focus` state can also be styled. */
    inputStyles: PropTypes.object,

    /** Styles for your primary CTA button. */
    buttonStylesPrimary: PropTypes.object,

    /** Styles for your secondary CTA button.
    ** Eg. Previous, Cancel buttons. */
    buttonStylesSecondary: PropTypes.object,

    /** Styles for your text links. */
    linkStyling: PropTypes.object,

    /** CSS in JS styling for the parent html element */
    sectionStyle: PropTypes.object,

    /** Deprecated property for controlling the style of the parent component */
    cardWidth: PropTypes.object,

    /** Color of error text, a valid color name or hex. */
    errorColor: PropTypes.string,

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** tells the component to create an account with the instrument */
    createAccount: PropTypes.bool,

    /** getToken (accountId) => { access_token } callback function that is called before every call requiring authorization */
    getToken: PropTypes.func,

    /** 
     * a token that grants permission to interact with the RevOps API 
     * takes the place of the public key when performing secure operations 
    */
    accessToken: PropTypes.string,

    children: PropTypes.element,

    /** model for of a revops payment instrument */
    instrument: PropTypes.object,

    /**
     * overrideProps is an object where keys names are ids of the particular 
     * element in the DOM. `<div id="bank-name" > = "bank-name": {}`. 
     * Only allowed properties are allowed, see documentation for details. 
     */
    overrideProps: PropTypes.shape({
      css: PropTypes.object, // CSS in JS
      placeholder: PropTypes.string,
      color: PropTypes.string,
      errorColor: PropTypes.string,
      showCardLink: PropTypes.bool, // some fields only
      label: PropTypes.string,
    }),

    /** determines if validation errors should be shown */
    showInlineError: PropTypes.bool,

    /** A callable function to fire when the PaymentMethod initializes all fields */
    onLoad: PropTypes.func,

    /** user defined loading element */
    loadingState: PropTypes.node,

    /** internal system flag to indicate that the system is loading an Instrument to update */
    isUpdate: PropTypes.bool,

    /** A boolean to show/hide change to credit card link. */
    showCardLink: PropTypes.bool,

    /** Boolean prop for showing/hiding ACH Link */
    showACHLink: PropTypes.bool,

    /** User defined header used for the Plaid payment method */
    plaidLabel: PropTypes.node,

    /** Customized link that switches to the ACH payment method */
    achLink: PropTypes.node,

    /** Customized link that switches to the credit card payment method */
    creditCardLink: PropTypes.node,

    /** optional prop to disable the network errors */
    showNetworkError: PropTypes.bool,

  }

  static defaultProps = {
    inputStyles: SharedStyles.inputStyles,
    sectionStyle: SharedStyles.sectionStyle,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
  }

  state = {
    account: {},
    errors: false,
    plaidLinkPublicToken: false,
    plaidAccountId: false,
    loaded: false,
    saving: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
      loading: true,
    }
    this.form = null
    this.loadingTimeOut = null
  }

  componentDidMount() {
    const { apiOptions, loadingState } = this.props
    const conf = configure(apiOptions)

    configureVault(
      conf,
      this.initialize,
    )

    if (apiOptions) {
      configurePlaid(
        conf.env,
        (plaidLink) => {
          this.onPlaidLoad(plaidLink)
        },
        this.onPlaidSelect,
      )
    }

    // setup debug information when using `loadingState`
    if(!!loadingState === true && this.isThisMethod()){
      this.loadingTimeOut = setTimeout(() => {
        logError("The form has not loaded after 5 seconds.", apiOptions.loggingLevel)
        this.onError({
          "message": "Form not loaded successfully.",
          "code": "form_timeout"
        })
      }, 5000)
    }
  }

  componentWillUnmount(){
    clearTimeout(this.loadingTimeOut)
  }

  componentDidUpdate(prevProps) {
    const { method } = this.props
    if (prevProps.method !== method) {
      // clean up the timeout if the previous method was this method and is no longer
      if(prevProps.method === PaymentMethods.METHOD_PLAID){
        clearTimeout(this.loadingTimeOut)
      }
      this.setState({ loading: false })
    }
  }

  onPlaidLoad = (plaidLink) => {
    this.plaidLink = plaidLink
  }

  onPlaidSelect(publicToken, metadata) {
    this.setState({
      plaidLinkPublicToken: publicToken,
      plaidAccountId: metadata.account_id,
      plaidMetadata: metadata,
    })
  }

  isFormFieldCreated(field) {
    return (!!this.form === true &&
      !!this.form.state === true &&
      !!this.form.state[field] === true
    )
  }

  createFormField(fieldSelector, field, defaultValue, options = {}) {

    if (this.isFormFieldCreated(field) === false) {
      this.form.field(fieldSelector, {
        name: field,
        defaultValue: defaultValue,
        css: this.props.inputStyles,
        errorColor: this.props.errorColor,
        ...options,
      })
    }
  }

  getBankName = () => {
    const { account } = this.props

    let defaultBankName = getDefaultValue(account, 'bankName', '')

    if (!!this.state.plaidMetadata !== false &&
      !!this.state.plaidMetadata.institution !== false) {
      defaultBankName = this.state.plaidMetadata.institution.name
    }

    return defaultBankName
  }

  initialize = () => {
    const {
      createAccount = false,
    } = this.props
    if (!!this.form === false) {
      // eslint-disable-next-line
      this.form = VGSCollect.create(configure(this.props.env).vaultId, state => this.isFinishedLoading(state));
    }

    this.createFormField(
      "#bank-name-plaid .field-space",
      createAccount === true ? "instrument." : "" + 'bank_name',
      this.getBankName(),
      {
        type: "text",
        readOnly: 'readOnly',
        placeholder: "Name of Bank Institution",
        validations: ["required"],
        defaultValue: "Plaid Bank"
      }
    )
  }

  onComplete = (response) => {
    const { onComplete } = this.props

    this.setState({
      saving: false,
    })

    if (onComplete !== false && typeof (onComplete) === 'function') {
      onComplete(response)
    }
  }

  onError = (error) => {
    const { onError } = this.props
    this.setState({
      errors: {
        ...error,
        ...convertAPIError(error.http_status, error),
      },
      saving: false,
    })

    if (onError !== false && typeof (onError) === 'function') {
      onError(error)
    }
  }

  onValidationError = (errors) => {
    const { onValidationError } = this.props
    this.setState({
      errors: {
        ...errors,
      },
    })

    if (onValidationError !== false && typeof (onValidationError) === 'function') {
      onValidationError(errors)
    }
  }

  // build the payload to submit to the vault
  getPayload = () => {
    const { createAccount, account, instrument } = this.props

    // non PCI values are added to the information from the secure fields
    let payload = new Instrument({
      ...instrument,
      businessAccountId: account.id,
      providerToken: this.state.plaidLinkPublicToken,
      providerId: this.state.plaidAccountId,
      method: "plaid",
    })

    // if we are also making an account, nest the instrument in the account payload
    if (createAccount === true) {
      payload = new Account({
        ...account, // add in the account information on the payload
        instrument: {
          ...payload,
        }
      })
    }
    return payload
  }

  bindCallbacks = () => {
    return {
      onError: this.onError,
      onComplete: this.onComplete,
      onValidationError: this.onValidationError,
    }
  }

  onSubmit = async () => {
    const { form } = this
    const { apiOptions, instrument = {} } = this.props
    const isUpdate = isInstrumentUpdate(instrument)

    // Clear state
    this.setState({
      errors: false,
      saving: true,
      status: false,
      response: false,
    })

    // get all the values we need to submit the form securely
    const payload = this.getPayload()
    const callbacks = this.bindCallbacks()
    const token = await getToken({ ...this.props, isUpdate })

    if (!!this.props.saveRef === false) {
      submitForm(payload, token, form, callbacks, apiOptions)
        .then(res => {
          logInfo("Form submitted successfully.", apiOptions.loggingLevel, res);
        })
        .catch(e => {
          logError(
            "There was and issue with the submitting the form.",
            apiOptions.loggingLevel,
            e
          );
        });
    } else {
      return submitForm(payload, token, form, callbacks, apiOptions);
    }
  }

  openPlaid = () => {
    this.plaidLink.open()
  }

  isFinishedLoading = () => {
    const { onLoad } = this.props

    if (this.state.loading === true && this.isThisMethod()) {
      this.setState({ loading: false })

      clearTimeout(this.loadingTimeOut)

      if (onLoad !== false && typeof (onLoad) === 'function') {
        onLoad()
      }
    }
  }

  getSectionDisplayProps = () => {
    const { loading } = this.state
    const { loadingState, sectionStyle, cardWidth } = this.props

    const isThisMethod = this.isThisMethod()

    // if the first method os loading hide it but keep the space in the DOM
    if (isThisMethod === true && !!loadingState === true && loading === true) {
      return { ...cardWidth, ...sectionStyle, visibility: "hidden" }
    }

    // if it is another method, hide it from DOM completely
    if (isThisMethod === false) {
      return { ...cardWidth, ...sectionStyle, display: "none" }
    }

    return { ...cardWidth, ...sectionStyle }
  }

  isThisMethod = () => {
    const { method } = this.props
    return method === PaymentMethods.METHOD_PLAID
  }

  creditCardLink = () => (
    <a style={this.props.linkStyling}
      className="pay-by-cc-link"
      onClick={this.props.changePaymentMethod}>
      Pay by credit card instead
    </a>
  )

  getCreditCardLink = () => {
    const {
      showCardLink = true,
      creditCardLink = this.creditCardLink(),
    } = this.props

    if (showCardLink === false) {
      return null
    }
    return creditCardLink
  }

  getACHLink = () => {
    const {
      showACHLink = true,
      achLink = this.achLink(),
    } = this.props

    if (showACHLink === false) {
      return null
    }
    return achLink
  }

  achLink = () => (
    <TogglePlaid
      style={this.props.linkStyling}
      togglePlaidHandler={this.props.togglePlaidHandler}
      plaidSelected={true}
    />
  )

  render() {
    const { errors, } = this.state
    const {
      onLast,
      onCancel,
      instrument,
      overrideProps = {},
      showInlineError = true,
      showNetworkError = true,
      isUpdate,
      plaidLabel = <label className="ach-label">Paying by ACH</label>,
    } = this.props

    const propHelper = new PropertyHelper(overrideProps)

    return (
      <React.Fragment>
        {
          isUpdate === false &&
          this.state.loading === true &&
          this.isThisMethod() &&
          <div className="loader-holder">
            {this.props.loadingState}
          </div>
        }
        <section style={this.getSectionDisplayProps()}>
          {plaidLabel}
          {this.getCreditCardLink()}
          <button
            className="btn-primary centered single"
            style={this.props.buttonStylesPrimary}
            onClick={() => this.openPlaid()}>
            Sync your bank account
        </button>
          {!!this.state.plaidMetadata !== false &&
            <div id="plaid-form" >
              <div className="ui info message">
                <div className="content">
                  <i aria-hidden="true" className="university icon"></i>
                  <span>{this.state.plaidMetadata.account.name} XXXXXXXXX {this.state.plaidMetadata.account.mask}</span>&nbsp;
                <span>{this.state.plaidMetadata.account.subtype}</span>&nbsp;
              </div>
              </div>
            </div>
          }

          <div style={{ display: 'none' }}>
            <Field
              id="bank-name-plaid"
              name="bankName"
              label="Bank Name"
              defaultValue={getDefaultValue(instrument, 'bankName', '')}
              showInlineError={showInlineError}
              errors={errors}
              {...propHelper.overrideFieldProps("bank-name")}
            />
          </div>
          {this.getACHLink()}
          <div className="ui clearing divider"></div>
          {showNetworkError === true && 
            <span className="network-error">{getErrorText('', 'networkError', errors)}</span>
          }
          {!!this.props.saveRef === false &&
            <ButtonGroup
              loading={this.state.loading}
              onSubmit={this.onSubmit}
              onLast={onLast}
              onCancel={onCancel}
              finalStep={true}
              buttonStylesPrimary={this.props.buttonStylesPrimary}
              buttonStylesSecondary={this.props.buttonStylesSecondary}
            />
          }
        </section>
      </React.Fragment>
    )
  }
}
