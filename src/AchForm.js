import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  convertAPIError,
  getDefaultValue,
} from './FormHelpers'

import { makeAccount } from './actions/AccountActions'
import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'

import {
  Field,
  TogglePlaid,
  configureVault,
} from './index'

import { InstrumentModel } from './models'

import configure from './client/VaultConfig'

export default class AchForm extends Component {
  static propTypes = {

    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

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

    /** How wide you want the content area of `<PaymentMethod />`. */
    cardWidth: PropTypes.object,

    /** Color of error text, a valid color name or hex. */
    errorColor: PropTypes.string,

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    children: PropTypes.element,

    /** a token that grants permission to interact with the RevOps API */
    accessToken: PropTypes.string,

    /** model for of a revops instrument */
    instrument: PropTypes.object.isRequired,
  }

  static defaultProps = {
    hideTogglePlaid: true,
    showCardLink: false,
    inputStyles: SharedStyles.inputStyles,
    cardWidth: SharedStyles.cardWidth,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
    errorColor: SharedStyles.errorColor,
  }

  state = {
    account: {},
    errors: false,
    loaded: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!!prevProps.account !== false &&
      !!this.props.account !== false &&
      prevProps.account !== this.props.account
    ) {
      this.updateAccount(this.props.account)
    }
  }

  updateAccount(account) {
    this.setAccount(account)
  }

  setAccount = (account) => {
    this.setState({
      account: makeAccount({
        ...account,
      })
    })
  }

  componentDidMount() {
    configureVault(
      this.props.apiConfig,
      this.initialize,
    )
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
    const { instrument } = this.props

    if (!!this.form === false) {
      let conf = configure(this.props.apiOptions)

      // eslint-disable-next-line
      this.form = VGSCollect.create(conf.vaultId, function () { });
    }

    this.initForm('bank-name',
      () => this.createFormField(
        "#bank-name .field-space",
        'bank_name',
        getDefaultValue(instrument, 'bankName', ''),
        {
          type: "text",
          placeholder: "Name of Bank Institution",
          validations: ["required"],
        }
      ))
    this.initForm('bank-postalcode',
      () => this.createFormField(
        "#bank-postalcode .field-space",
        `postal_code`,
        getDefaultValue(instrument, 'postalCode', ''),
        {
          type: "zip-code",
          placeholder: "Postal code",
          validations: ["required"],
        }
      ))
    this.initForm('bank-account-country',
      () => this.createFormField(
        "#bank-account-country .field-space",
        'country',
        getDefaultValue(instrument, 'bankCountry', 'USA'),
        {
          type: "dropdown",
          validations: ["required"],
          options: [
            { value: 'USA', text: 'United States of America' },
            { value: 'Canada', text: 'Canada' },
            { value: 'Mexico', text: 'Mexico' },
          ],
        })
    )

    this.initForm('bank-holder-name',
      () => this.createFormField(
        "#bank-holder-name .field-space",
        'holder_name',
        getDefaultValue(instrument, 'holderName', ''),
        {
          type: "text",
          placeholder: "Name on the account",
          validations: ["required"],
        }
      ))

    this.initForm('bank-account-type',
      () => this.createFormField(
        "#bank-account-type .field-space",
        'bank_account_holder_type',
        getDefaultValue(instrument, 'bankAccountHolderType', 'company'),
        {
          type: "dropdown",
          validations: ["required"],
          options: [
            { value: 'company', text: 'Company' },
            { value: 'individual', text: 'Individual' },
          ],
        }
      ))

    this.initForm('bank-account-number',
      () => this.createFormField(
        "#bank-account-number .field-space",
        'account_number',
        getDefaultValue(instrument, 'accountNumber', ''),
        {
          type: "text",
          placeholder: "Enter bank account number",
          validations: ["required"],
        }
      ))

    this.initForm('bank-routing-number', () =>
      this.createFormField(
        "#bank-routing-number .field-space",
        'routing_number',
        getDefaultValue(instrument, 'routingNumber', ''),
        {
          type: "text",
          placeholder: "Enter bank routing number",
          validations: ["required"],
        }
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
      loading: false,
    })

    if (onError !== false && typeof (onError) === 'function') {
      onError(error)
    }
  }

  onComplete = (response) => {
    const { onComplete } = this.props
    this.setState({
      loading: false,
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

  onSubmit = () => {
    const { form } = this
    const { onNext, accessToken, getToken } = this.props
    let { account, instrument } = this.props

    instrument = new InstrumentModel({
      ...instrument,
      businessAccountId: account.id,
      // TODO: make this field dynamic
      isIndividual: true,
      isBusiness: false,
      method: "ach"
    })

    // Clear state
    this.setState({
      account: account,
      errors: false,
      loading: true,
      status: false,
      response: false,
    })

    const onError = this.onError
    const onComplete = this.onComplete
    const onValidationError = this.onValidationError
    if (!!getToken !== false && typeof (getToken) === 'function') {
      getToken(account.accountId)
        .then(token => {
          instrument.saveWithSecureForm(
            token,
            form,
            {
              onError,
              onComplete,
              onNext,
              onValidationError,
            })
        })
        .catch(it => console.error(it))
    } else {
      if (!!accessToken === true) {
        instrument.saveWithSecureForm(
          accessToken,
          form,
          {
            onError,
            onComplete,
            onNext,
            onValidationError,
          })
      }
    }
  }

  openPlaid = () => {
    this.plaidLink.open()
  }

  render() {
    const { errors, } = this.state
    const {
      onLast,
      onCancel,
      children,
      instrument,
    } = this.props

    return (
      <section style={this.props.cardWidth}>
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
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-holder-name"
                name="holderName"
                label="Account Holder Name"
                defaultValue={getDefaultValue(instrument, 'bankAccountHolderName', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-postalcode"
                name="postalCode"
                label="Postal Code"
                defaultValue={getDefaultValue(instrument, 'postalcode', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-account-country"
                name="country"
                label="Bank Country"
                defaultValue={getDefaultValue(instrument, 'country', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-account-type"
                name="bankAccountHolderType"
                label="Account Type"
                defaultValue={getDefaultValue(instrument, 'accountHolderType', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-routing-number"
                name="routingNumber"
                label="Routing Number"
                defaultValue={getDefaultValue(instrument, 'routingNumber', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-account-number"
                name="accountNumber"
                label="Account Number"
                defaultValue={getDefaultValue(instrument, 'accountNumber', '')}
                showInlineError={true}
                errors={errors}
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
            buttonStylesPrimary={this.props.buttonStylesPrimary}
            buttonStylesSecondary={this.props.buttonStylesSecondary}
          />
        }
      </section>
    )
  }
}
