import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { submitForm, getToken } from './actions/FormActions'

import {
  PropertyHelper,
} from './helpers/PropHelpers'

import {
  getErrorText,
  convertAPIError,
  getDefaultValue,
  getDefaultCardExpDate,
  isInstrumentUpdate,
} from './FormHelpers'

import configure from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'
import { linkStyling } from './SharedStyles'

import {
  Field,
  configureVault,
} from './index'

import { Instrument, Account } from './models'

import { PaymentMethods } from './PaymentMethod'
import { logError } from './helpers/Logger'

const NUMBER_OF_FIELDS = 5

export default class CreditCardForm extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string,

    /** Boolean prop for showing/hiding ACH Link */
    showACHLink: PropTypes.bool,

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

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),

    /** Account object allows preconfigured account options to be set */
    account: PropTypes.object,

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

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** 
     * a token that grants permission to interact with the RevOps API 
     * takes the place of the public key when performing secure operations 
    */
    accessToken: PropTypes.string,

    children: PropTypes.element,

    /** model for of a revops payment instrument */
    instrument: PropTypes.object,

    /** getToken (accountId) => { access_token } callback function that is called before every call requiring authorization */
    getToken: PropTypes.func,

    /** tells the component to create an account with the instrument */
    createAccount: PropTypes.bool,

    /**
     * overrideProps is an object where keys names are ids of the particular 
     * element in the DOM. `<div id="bank-name" > = "bank-name": {}`. 
     * Only allowed properties are allowed, see see documentation for details.
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

    /** User defined header used for the credit card payment method */
    creditCardLabel: PropTypes.node,

    /** Customized link that switches to the ACH payment method */
    achLink: PropTypes.node,

    /** optional prop to disable the network errors */
    showNetworkError: PropTypes.bool,

  }

  static defaultProps = {
    showACHLink: false,
    inputStyles: SharedStyles.inputStyles,
    sectionStyle: SharedStyles.sectionStyle,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
    errorColor: SharedStyles.errorColor,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
      status: false,
      response: false,
      loading: true,
    }
    this.form = {};
    this.loadingTimeOut = null
  }

  componentDidMount() {
    const { apiOptions = {}, loadingState } = this.props
    configureVault(
      apiOptions,
      this.initialize,
    )

    // setup debug information when using `loadingState`
    if (!!loadingState === true && this.isThisMethod()) {
      this.loadingTimeOut = setTimeout(() => {
        logError("The form has not loaded after 5 seconds.", apiOptions.loggingLevel)
        this.onError({
          "message": "Form not loaded successfully.",
          "code": "form_timeout"
        })
      }, 5000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.loadingTimeOut)
  }

  initForm(id, fieldRender) {
    if (document.getElementById(id)) {
      fieldRender()
    }
  }

  componentDidUpdate(prevProps) {
    const { method } = this.props
    if (prevProps.method !== method) {
      // clean up the timeout if the previous method was this method and is no longer
      if((prevProps.method === PaymentMethods.METHOD_CARD || prevProps.method === 'card')){
        clearTimeout(this.loadingTimeOut)
      }
      this.setState({ loading: false })
    }
  }

  initialize = () => {
    const {
      instrument,
      createAccount = false,
      inputStyles,
      overrideProps = {},
    } = this.props
    let conf = configure(this.props.apiOptions)

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    // eslint-disable-next-line
    const form = VGSCollect.create(conf.vaultId, state => this.isFinishedLoading(state));
    const prefix = createAccount === true ? "instrument." : ""

    this.initForm('card-name',
      () => form.field("#card-name .field-space", {
        type: "text",
        errorColor: this.props.errorColor,
        name: prefix + 'holder_name',
        defaultValue: getDefaultValue(instrument, 'holderName', ''),
        placeholder: "Florence Izote",
        validations: ["required"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-name'),
      })
    )

    this.initForm('card-number', () =>
      form.field("#card-number .field-space", {
        type: "card-number",
        errorColor: this.props.errorColor,
        name: prefix + 'card_number',
        defaultValue: getDefaultValue(instrument, 'cardNumber', ''),
        placeholder: "Card number",
        validations: ["required", "validCardNumber"],
        showCardIcon: true,
        autoComplete: 'card-number',
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-number', ["showCardIcon"]),
      })
    )

    this.initForm('card-cvc', () =>
      form.field("#card-cvc .field-space", {
        type: "card-security-code",
        errorColor: this.props.errorColor,
        name: prefix + 'card_cvv',
        defaultValue: getDefaultValue(instrument, 'cardCvv', ''),
        placeholder: "311",
        validations: ["required", "validCardSecurityCode"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-cvc'),
      })
    )

    this.initForm('card-expdate', () =>
      form.field("#card-expdate .field-space", {
        type: "card-expiration-date",
        name: prefix + 'card_expdate',
        errorColor: this.props.errorColor,
        placeholder: "01 / 2022",
        defaultValue: getDefaultCardExpDate(instrument, inputStyles),
        serializers: [
          form.SERIALIZERS.separate({
            monthName: 'month',
            yearName: 'year',
          })
        ],
        validations: ["required", "validCardExpirationDate"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-expdate'),
      })
    )

    this.initForm('card-postalcode', () =>
      form.field("#card-postalcode .field-space", {
        type: "zip-code",
        errorColor: this.props.errorColor,
        defaultValue: getDefaultValue(instrument, 'postalCode', ''),
        name: prefix + 'postal_code',
        placeholder: "Postal code",
        validations: ["required"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-postalcode'),
      })
    )

    this.form = form
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
      status,
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

  bindCallbacks = () => {
    return {
      onError: this.onError,
      onComplete: this.onComplete,
      onValidationError: this.onValidationError,
    }
  }

  // build the payload to submit to the vault
  getPayload = () => {
    const { createAccount, account, instrument } = this.props

    // non PCI values are added to the information from the secure fields
    let payload = new Instrument({
      ...instrument,
      businessAccountId: account.id,
      method: "credit-card",
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

  isFinishedLoading = (formState) => {
    const { onLoad } = this.props

    if (this.state.loading === true && this.isThisMethod()) {
      if (Object.keys(formState).length === NUMBER_OF_FIELDS) {
        this.setState({ loading: false })

        clearTimeout(this.loadingTimeOut)

        if (onLoad !== false && typeof (onLoad) === 'function') {
          onLoad()
        }
      }
    }
  }

  isThisMethod = () => {
    const { method } = this.props
    return method === PaymentMethods.METHOD_CARD || method === 'card'
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

    return submitForm(
      payload,
      token,
      form,
      callbacks,
      apiOptions,
    )
  }

  achLink = () => (
    <a style={linkStyling}
      className="pay-by-ach-link"
      onClick={this.props.changePaymentMethod}>
      Pay by ACH instead
    </a>
  )

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

  render() {
    const { errors } = this.state
    const {
      onLast,
      onCancel,
      children,
      instrument,
      overrideProps = {},
      showInlineError = true,
      showNetworkError = true,
      isUpdate = false,
      creditCardLabel = <label className="cc-label">Paying by Credit Card</label>,
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
          {creditCardLabel}
          {this.getACHLink()}
          <div className="form-container">
            <div id="card-form" >
              {!!children !== false &&
                React.createElement(children, {
                  ...this.props,
                  ...this.state,
                }, null)
              }
              {!!children === false &&
                <React.Fragment>
                  <Field
                    id="card-name"
                    name="holderName"
                    label="Card Holder"
                    defaultValue={getDefaultValue(instrument, 'cardName', '')}
                    showInlineError={showInlineError}
                    errors={errors}
                    {...propHelper.overrideFieldProps("card-name")}
                  />

                  <Field
                    id="card-number"
                    name="cardNumber"
                    label="Card Number"
                    defaultValue={getDefaultValue(instrument, 'cardNumber', '')}
                    showInlineError={showInlineError}
                    errors={errors}
                    {...propHelper.overrideFieldProps("card-number", ["showCardIcon"])}
                  />

                  <Field
                    id="card-expdate"
                    name="cardExpdate"
                    label="Expiration"
                    defaultValue={getDefaultValue(instrument, 'cardExpdate', '')}
                    showInlineError={showInlineError}
                    errors={errors}
                    {...propHelper.overrideFieldProps("card-expdate")}
                  />

                  <Field
                    id="card-cvc"
                    name="cardCvv"
                    label="CVC/CVV"
                    defaultValue={getDefaultValue(instrument, 'cardCvv', '')}
                    showInlineError={showInlineError}
                    errors={errors}
                    {...propHelper.overrideFieldProps("card-cvc")}
                  />

                  <Field
                    id="card-postalcode"
                    name="postalCode"
                    label="Postal Code"
                    defaultValue={getDefaultValue(instrument, 'postalCode', '')}
                    showInlineError={showInlineError}
                    errors={errors}
                    {...propHelper.overrideFieldProps("card-postalcode")}
                  />
                </React.Fragment>
              }
            </div>
          </div>
          <div className="ui clearing divider"></div>
          {showNetworkError === true && 
            <span className="network-error">{getErrorText('', 'networkError', errors)}</span>
          }
          {!!this.props.saveRef === false &&
            <ButtonGroup
              showAccept={false}
              loading={this.state.saving}
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
