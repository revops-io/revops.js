import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { submitForm, getToken } from './actions/FormActions'

import {
  convertAPIError,
  getDefaultValue,
  isInstrumentUpdate,
} from './FormHelpers'

import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'

import {
  Field,
  TogglePlaid,
  configureVault,
} from './index'

import {
  PropertyHelper,
} from './helpers/PropHelpers'

import { Instrument, Account } from './models'

import configure from './client/VaultConfig'

import { PaymentMethods } from './PaymentMethod'

import _ from 'lodash'

const expectedFormFields = [
  'bank-routing-number',
  'bank-account-number',
  'bank-account-type',
  'bank-holder-name',
  'bank-postalcode',
  'bank-account-country',
  'bank-name'
]

export default class AchForm extends Component {
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

    /** A boolean to hide the plaid toggler, it defaults to hidden. */
    hideTogglePlaid: PropTypes.bool,

    /** A boolean to show/hide change to credit card link. */
    showCardLink: PropTypes.bool,

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
    isUpdate: PropTypes.bool
  }

  static defaultProps = {
    hideTogglePlaid: true,
    showCardLink: false,
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
      account: {},
      errors: false,
      loading: true,
      saving: false,
    }
    this.form = null
  }

  componentDidMount() {
    const conf = configure(this.props.apiOptions)

    configureVault(
      conf,
      this.initialize,
    )
  }

  componentDidUpdate(prevProps) {
    const { method } = this.props
    if (prevProps.method !== method && this.isThisMethod()) {
      this.setState({ loading: false })
    }
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

  initForm(id, fieldRender) {
    if (document.getElementById(id)) {
      fieldRender()
    }
  }

  initialize = () => {
    const {
      instrument,
      createAccount = false,
      inputStyles = {},
      overrideProps = {},
    } = this.props

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    if (!!this.form === false) {
      let conf = configure(this.props.apiOptions)

      // eslint-disable-next-line
      this.form = VGSCollect.create(conf.vaultId, state => this.finishedLoading(state));
    }
    const prefix = createAccount === true ? "instrument." : ""

    this.initForm('bank-name',
      () => this.createFormField(
        "#bank-name .field-space",
        prefix + 'bank_name',
        getDefaultValue(instrument, 'bankName', ''),
        {
          type: "text",
          placeholder: "Name of Bank Institution",
          validations: ["required"],
          ...propHelper.overrideCollectProps('bank-name'),
        },
      ))

    this.initForm('bank-postalcode',
      () => this.createFormField(
        "#bank-postalcode .field-space",
        prefix + `postal_code`,
        getDefaultValue(instrument, 'postalCode', ''),
        {
          type: "zip-code",
          placeholder: "Postal code",
          validations: ["required"],
          ...propHelper.overrideCollectProps('bank-postalcode'),
        },
      ))

    this.initForm('bank-account-country',
      () => this.createFormField(
        "#bank-account-country .field-space",
        prefix + 'country',
        getDefaultValue(instrument, 'bankCountry', 'USA'),
        {
          type: "dropdown",
          validations: ["required"],
          options: [
            { value: 'USA', text: 'United States of America' },
            { value: 'Canada', text: 'Canada' },
            { value: 'Mexico', text: 'Mexico' },
          ],
          ...propHelper.overrideCollectProps('bank-account-country'),
        })
    )

    this.initForm('bank-holder-name',
      () => this.createFormField(
        "#bank-holder-name .field-space",
        prefix + 'holder_name',
        getDefaultValue(instrument, 'holderName', ''),
        {
          type: "text",
          placeholder: "Name on the account",
          validations: ["required"],
          ...propHelper.overrideCollectProps('bank-holder-name'),
        },
      ))

    this.initForm('bank-account-type',
      () => this.createFormField(
        "#bank-account-type .field-space",
        prefix + 'bank_account_holder_type',
        getDefaultValue(instrument, 'bankAccountHolderType', 'company'),
        {
          type: "dropdown",
          validations: ["required"],
          options: [
            { value: 'company', text: 'Company' },
            { value: 'individual', text: 'Individual' },
          ],
          ...propHelper.overrideCollectProps('bank-account-type'),
        },
      ))

    this.initForm('bank-account-number',
      () => this.createFormField(
        "#bank-account-number .field-space",
        prefix + 'account_number',
        getDefaultValue(instrument, 'accountNumber', ''),
        {
          type: "text",
          placeholder: "Enter bank account number",
          validations: ["required"],
          ...propHelper.overrideCollectProps('bank-account-number')
        },
      ))

    this.initForm('bank-routing-number', () =>
      this.createFormField(
        "#bank-routing-number .field-space",
        prefix + 'routing_number',
        getDefaultValue(instrument, 'routingNumber', ''),
        {
          type: "text",
          placeholder: "Enter bank routing number",
          validations: ["required"],
          ...propHelper.overrideCollectProps('bank-routing-number')
        },
      )
    )
  }

  onError = (error) => {
    const { onError } = this.props
    this.setState({
      errors: {
        ...error,
        ...convertAPIError(error.http_status, error),
      },
      status,
      response: error,
      saving: false,
    })

    if (onError !== false && typeof (onError) === 'function') {
      onError(error)
    }
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

  getPayload = () => {
    const { createAccount, account, instrument } = this.props

    // non PCI values are added to the information from the secure fields
    let payload = new Instrument({
      ...instrument,
      businessAccountId: account.id,
      isIndividual: false,
      isBusiness: true,
      method: "ach",
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

  onSubmit = async () => {
    const { form } = this
    const { account, apiOptions, instrument = {} } = this.props
    const isUpdate = isInstrumentUpdate(instrument)

    // Clear state
    this.setState({
      account: account,
      errors: false,
      saving: true,
      status: false,
      response: false,
    })

    // get all the values we need to submit the form securely
    const payload = this.getPayload()
    const callbacks = this.bindCallbacks()
    const token = await getToken({ ...this.props, isUpdate })

    submitForm(
      payload,
      token,
      form,
      callbacks,
      apiOptions,
    )
  }

  openPlaid = () => {
    this.plaidLink.open()
  }

  isThisMethod = () => {
    const { method } = this.props
    return method === PaymentMethods.METHOD_ACH
  }

  finishedLoading = (formState) => {
    const { onLoad } = this.props
    if (this.state.loading === true && this.isThisMethod()) {
      if (_.intersection(formState, expectedFormFields).length === 0) {
        this.setState({ loading: false })

        if (onLoad !== false && typeof (onLoad) === 'function') {
          onLoad()
        }
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

  render() {
    const { errors, } = this.state
    const {
      onLast,
      onCancel,
      children,
      instrument,
      overrideProps = {},
      showInlineError = true,
      isUpdate
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
          <label className="h3">Paying by ACH</label>
          {this.props.showCardLink === true &&
            <a
              style={this.props.linkStyling}
              className="pay-by-cc-link"
              onClick={this.props.changePaymentMethod}>
              Pay by credit card instead
          </a>
          }

          <div id="ach-form" className="form-container">
            {!!children !== false &&
              React.createElement(children, {
                ...this.props,
                ...this.state,
              }, null)
            }
            {!!children === false &&
              <React.Fragment>
                <Field
                  id="bank-name"
                  name="bankName"
                  label="Bank Name"
                  defaultValue={getDefaultValue(instrument, 'bankName', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-name")}
                />

                <Field
                  id="bank-holder-name"
                  name="holderName"
                  label="Account Holder Name"
                  defaultValue={getDefaultValue(instrument, 'bankAccountHolderName', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-holder-name")}
                />

                <Field
                  id="bank-postalcode"
                  name="postalCode"
                  label="Postal Code"
                  defaultValue={getDefaultValue(instrument, 'postalcode', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-postalcode")}
                />

                <Field
                  id="bank-account-country"
                  name="country"
                  label="Bank Country"
                  defaultValue={getDefaultValue(instrument, 'country', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-account-country")}
                />

                <Field
                  id="bank-account-type"
                  name="bankAccountHolderType"
                  label="Account Type"
                  defaultValue={getDefaultValue(instrument, 'accountHolderType', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-account-type")}
                />

                <Field
                  id="bank-routing-number"
                  name="routingNumber"
                  label="Routing Number"
                  defaultValue={getDefaultValue(instrument, 'routingNumber', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-routing-number")}
                />

                <Field
                  id="bank-account-number"
                  name="accountNumber"
                  label="Account Number"
                  defaultValue={getDefaultValue(instrument, 'accountNumber', '')}
                  showInlineError={showInlineError}
                  errors={errors}
                  {...propHelper.overrideFieldProps("bank-account-number")}
                />
              </React.Fragment>
            }
          </div>
          <div className="ui clearing divider"></div>
          {this.props.hideTogglePlaid === false &&
            <TogglePlaid
              togglePlaidHandler={this.props.togglePlaidHandler}
            />
          }
          {!!this.props.saveRef === false &&
            <ButtonGroup
              onLast={onLast}
              onCancel={onCancel}
              finalStep={true}
              onSubmit={this.onSubmit}
              loading={this.state.saving}
              buttonStylesPrimary={this.props.buttonStylesPrimary}
              buttonStylesSecondary={this.props.buttonStylesSecondary}
            />
          }
        </section>
      </React.Fragment>
    )
  }
}
