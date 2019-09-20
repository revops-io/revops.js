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
  jsDependencies,
  addJS,
} from './index'

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

    /** Internal Use-only: Environment string: local, staging, production */
    env: PropTypes.string,

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),

    children: PropTypes.element,
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

  componentDidMount() {
    jsDependencies.forEach(js => addJS(js))
    configureVault(
      this.props.env,
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
    if(this.isFormFieldCreated(field) === false) {
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
    if(document.getElementById(id)) {
      fieldRender()
    }
  }

  initialize = () => {
    const { account } = this.props

    if(!!this.form === false) {
      // eslint-disable-next-line
      this.form = VGSCollect.create(configure(this.props.env).vaultId, function () { });
    }

    this.initForm('bank-name',
      () => this.createFormField(
      "#bank-name .field-space",
      'billingPreferences.bankName',
      getDefaultValue(account, 'bankName', ''),
      {
        type: "text",
        placeholder: "Name of Bank Institution",
        validations: ["required"],
      }
    ))

    this.initForm('bank-account-country',
      () => this.createFormField(
      "#bank-account-country .field-space",
      'billingPreferences.bankCountry',
      getDefaultValue(account, 'bankCountry', 'USA'),
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
      "billingPreferences.bankAccountHolderName",
      getDefaultValue(account, 'bankAccountHolderName', ''),
      {
        type: "text",
        placeholder: "Name on the account",
        validations: ["required"],
      }
    ))

    this.initForm('bank-account-type',
      () => this.createFormField(
      "#bank-account-type .field-space",
      "billingPreferences.bankAccountHolderType",
      getDefaultValue(account, 'bankAccountHolderType', 'company'),
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
      "billingPreferences.bankAccountNumber",
      getDefaultValue(account, 'bankAccountNumber', ''),
      {
        type: "text",
        placeholder: "Enter bank account number",
        validations: ["required"],
      }
    ))

    this.initForm('bank-routing-number', () =>
      this.createFormField(
        "#bank-routing-number .field-space",
        "billingPreferences.bankRoutingNumber",
        getDefaultValue(account, 'bankRoutingNumber', ''),
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
    const { status, errors, response } = error
    this.setState({
      errors: {
        ...errors,
        ...convertAPIError(status, response),
      },
      status,
      response,
      loading: false,
    })

    if(onError !== false && typeof (onError) === 'function') {
      onError(error)
    }
  }

  onComplete = (response) => {
    const { onComplete } = this.props
    this.setState({
      loading: false,
    })

    if(onComplete !== false && typeof(onComplete) === 'function') {
      onComplete(response)
    }
  }

  onSubmit = () => {
    const { form } = this
    const { onNext, onValidationError } = this.props
    let { account } = this.props

    account = makeAccount({
      ...account, // prop state
      ...this.state.account, // current component state takes priority
      status: 'activating', // trigger activating state.
      billingPreferences: {
        ...account.billingPreferences,
        paymentMethod: "ach"
      }
    })

    this.setState({
      account: account,
      errors: false,
      loading: true,
      status: false,
      response: false,
    })

    const onError = this.onError
    const onComplete = this.onComplete
    account.saveWithSecureForm(
      this.props.publicKey,
      form,
      {
        onError,
        onComplete,
        onNext,
        onValidationError,
      })
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
    } = this.props

    return (
      <section style={this.props.cardWidth}>
        <label className="h3">Paying by ACH</label>
        {this.props.showCardLink === true &&
          <a
            className="pay-by-cc-link"
            onClick={this.props.changePaymentMethod}>
            Pay by credit card instead
          </a>
        }

        <div id="ach-form" className="ui form">
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
                defaultValue={getDefaultValue(this.props.account, 'bankName', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-holder-name"
                name="bankAccountHolderName"
                label="Account Holder Name"
                defaultValue={getDefaultValue(this.props.account, 'bankAccountHolderName', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-account-country"
                name="bankCountry"
                label="Bank Country"
                defaultValue={getDefaultValue(this.props.account, 'bankCountry', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-account-type"
                name="bankAccountHolderType"
                label="Account Type"
                defaultValue={getDefaultValue(this.props.account, 'bankAccountHolderType', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-routing-number"
                name="bankRoutingNumber"
                label="Routing Number"
                defaultValue={getDefaultValue(this.props.account, 'bankRoutingNumber', '')}
                showInlineError={true}
                errors={errors}
              />

              <Field
                id="bank-account-number"
                name="bankAccountNumber"
                label="Account Number"
                defaultValue={getDefaultValue(this.props.account, 'bankAccountNumber', '')}
                showInlineError={true}
                errors={errors}
              />
            </React.Fragment>
          }
        </div>
        <div className="ui clearing divider"></div>
        {this.props.hideTogglePlaid === false &&
          <TogglePlaid
            style={this.props.linkStyling}
            toggleHandler={this.props.togglePlaidHandler}
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
