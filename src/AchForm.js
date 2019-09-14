import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  getErrorText,
  getClassName,
  convertAPIError,
  getDefaultValue,
} from './FormHelpers'

import { makeAccount } from './actions/AccountActions'
import { ButtonGroup } from './ButtonGroup'
import { inputStyles, buttonStylesPrimary, linkStyling, cardWidth } from './SharedStyles'

import {
  configureVault,
  configurePlaid,
  jsDependencies,
  addJS,
} from './index'

import configure from './client/VaultConfig'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  padding: "0 16px"
};

export default class AchForm extends Component {
  static propTypes = {
    /** An AchForm can have custom styles */
    styles: PropTypes.object,

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
  }

  static defaultProps = {
    styles: {},
  }

  state = {
    errors: false,
    plaidLinkPublicToken: false,
    plaidAccountId: false,
    disablePlaid: false,
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
    alert('test')
    jsDependencies.forEach(js => addJS(js))
    configureVault(
      this.props.env,
      this.initialize,
    )

    configurePlaid(
      this.props.env,
      (plaidLink) => {
        alert('test')
        this.onPlaidLoad(plaidLink)
      },
      this.onPlaidSelect,
    )
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
    this.initializePlaid(this.state.disablePlaid)
  }

  togglePlaid = () => {
    this.setState({
      disablePlaid: !this.state.disablePlaid
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.disablePlaid !== this.state.disablePlaid) {
      this.initialize(this.state.disablePlaid)
    }
  }

  isFormFieldCreated(field) {
    return (!!this.form === true &&
      !!this.form.state === true &&
      !!this.form.state[field] === true
    )
  }

  createFormField(fieldSelector, field, defaultValue, options = {}) {
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    if(this.isFormFieldCreated(field) === false) {
      this.form.field(fieldSelector, {
        name: field,
        defaultValue: defaultValue,
        css: inputStyles,
        errorColor: styles.errorColor,
        ...options,
      })
    }
  }

  getBankName = () => {
    const { account } = this.props

    let defaultBankName = getDefaultValue(account, 'bankName', '')

    if(!!this.state.plaidMetadata !== false &&
      !!this.state.plaidMetadata.institution !== false) {
        defaultBankName = this.state.plaidMetadata.institution.name
    }

    return defaultBankName
  }

  initialize = (disablePlaid = false) => {
    const { account } = this.props

    if(!!this.form === false) {
      this.form = VGSCollect.create(configure(this.props.env).vaultId, function (state) { });
    }

    this.createFormField(
      "#bank-name .field-space",
      'billingPreferences.bankName',
      this.getBankName(),
      {
        type: "text",
        readOnly: disablePlaid === false? 'readOnly': null,
        placeholder: "Chase Bank",
        validations: ["required"],
      }
    )

    if (disablePlaid === true) {
      this.createFormField(
        "#bank-acct-country .field-space",
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

      this.createFormField(
        "#bank-holder-name .field-space",
        "billingPreferences.bankAccountHolderName",
        getDefaultValue(account, 'bankAccountHolderName', ''),
        {
          type: "text",
          placeholder: "Pat Smalley",
          validations: ["required"],
        }
      )

      this.createFormField(
        "#bank-acct-type .field-space",
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
      )

      this.createFormField(
        "#bank-acct-number .field-space",
        "billingPreferences.bankAccountNumber",
        getDefaultValue(account, 'bankAccountNumber', ''),
        {
          type: "text",
          placeholder: "XXXXXXXXXXXXX",
          placeholder: "Enter bank account number",
          validations: ["required"],
        }
      )

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
    }
  }

  onError = ({errors}) => {
    const { onError } = this.props
    this.setState({
      errors
    })

    if(onError !== false && typeof(onError) === 'function') {
      onError(errors)
    }
  }

  onSubmit = () => {
    const { form } = this
    const { onNext, onComplete = false } = this.props
    let { account } = this.props

    this.setState({
      errors: false,
      loading: true,
    })

    const onError = this.onError

    // Attach plaid state to model on submit.
    account.billingPreferences.plaidLinkPublicToken = this.state.plaidLinkPublicToken
    account.billingPreferences.plaidAccountId = this.state.plaidAccountId

    account.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
  }

  openPlaid = () => {
    this.plaidLink.open()
  }

  render() {
    const { errors, } = this.state
    const { onLast, onCancel, form, } = this.props
    return (
      <section style={cardWidth}>
        <label className="h3">Paying by ACH</label>
        <a className="pay-by-cc-link" onClick={this.props.changePaymentMethod}>Pay by credit card instead</a>

        {this.state.disablePlaid !== true &&
          <button
            className="ui button big centered single"
            style={buttonStylesPrimary}
            onClick={() => this.openPlaid()}>
            Sync your bank account
          </button>
        }
        {!!this.state.plaidMetadata !== false &&
            <form id="content-form" className="ui form">
              <div id="bank-name"
                className={
                 getClassName(
                   "field",
                   "billingPreferences.bankName",
                   errors
                 )
               }>
                <label>Bank Name</label>
                <span className="field-space"></span>
                <span>{getErrorText('Bank name', 'billingPreferences.bankName', errors)}</span>
              </div>

              <div className="ui info message">
                <div className="content">
                  <i aria-hidden="true" class="university icon"></i>
                  <span>{this.state.plaidMetadata.account.name} XXXXXXXXX {this.state.plaidMetadata.account.mask}</span>&nbsp;
                  <span>{this.state.plaidMetadata.account.subtype}</span>&nbsp;
                </div>
              </div>
            </form>
        }
        <a className="manual-link single centered" style={linkStyling} onClick={() => this.togglePlaid()}>
          {
            this.state.disablePlaid !== true ?
              'or manually enter bank account details'
              :
              'or connect your bank instantly with Plaid'
          }
        </a>

        {this.state.disablePlaid === true &&
          <form id="contact-form" className="ui form">

              <div id="bank-name"
                className={
                 getClassName(
                   "field",
                   "billingPreferences.bankName",
                   errors
                 )
               }>
                <label>Bank Name</label>
                <span className="field-space"></span>
                <span>{getErrorText('Bank name', 'billingPreferences.bankName', errors)}</span>
              </div>

            <div id="bank-holder-name"
              className={
               getClassName(
                 "field",
                 "billingPreferences.bankAccountHolderName",
                 errors
               )
             }>
              <label >Account Holder Name</label>
              <span className="field-space"></span>
              <span>{getErrorText('Name', 'billingPreferences.bankAccountHolderName', errors)}</span>
            </div>

            <div id="bank-acct-country"
              className="field">
              <label >Bank Country</label>
              <span className="field-space"></span>
            </div>

            <div id="bank-acct-type"
            className="field">
              <label >Account Type</label>
              <span className="field-space"></span>
            </div>

            <div id="bank-routing-number"
              className={
               getClassName(
                 "field",
                 "billingPreferences.bankRoutingNumber",
                 errors
               )
            }>
              <label >Routing Number</label>
              <span className="field-space"></span>
              <span>{getErrorText('Routing number', 'billingPreferences.bankRoutingNumber', errors)}</span>
            </div>
            <div id="bank-acct-number"
              className={
               getClassName(
                 "field",
                 "billingPreferences.bankAccountNumber",
                 errors
               )
            }>
              <label>Account Number</label>
              <span className="field-space"></span>
              <span>{getErrorText('Account number', 'billingPreferences.bankAccountNumber', errors)}</span>
            </div>
          </form>
        }
        <div className="ui clearing divider"></div>
        <ButtonGroup
          onLast={onLast}
          onCancel={onCancel}
          finalStep={true}
          onSubmit={this.onSubmit}
        />
      </section>
    )
  }
}
