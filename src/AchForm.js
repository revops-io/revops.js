import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  getErrorText,
  getClassName,
  convertAPIError,
} from './FormHelpers'

import { makeAccount } from './actions/AccountActions'
import { ButtonGroup } from './ButtonGroup'
import { inputStyles, cardWidth } from './SharedStyles'

import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  padding: "0 16px"
};

export default class AchForm extends Component {
  state = {
    errors: false,
    plaidLinkPublicToken: false,
    plaidAccountId: false,
    disablePlaid: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = {};
  }

  static propTypes = {
    styles: PropTypes.object,
    onComplete: PropTypes.func,
    onNext: PropTypes.func,
    onCancel: PropTypes.func,
    onLast: PropTypes.func,
    onError: PropTypes.func,
  }

  componentDidMount() {
    const vault = document.createElement("script")
    const plaid = document.createElement("script")
    vault.src = REVOPS_VAULT_COLLECT
    plaid.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
    vault.async = true
    plaid.async = true
    plaid.onload = () => {

      const handleOnSuccess = (public_token, metadata) => {
        this.setState({
          plaidLinkPublicToken: public_token,
          plaidAccountId: metadata.account_id,
          plaidMetadata: metadata,
        })
        this.initialize()
      }

      this.plaidLink = window.Plaid.create({
        env: 'sandbox',
        clientName: 'Stripe/Plaid Test',
        key: 'c648203cbd9ce4b7ea39f26c61f115',
        product: ['auth'],
        selectAccount: true,
        onSuccess: handleOnSuccess,
        onExit: function(err, metadata) {
          // The user exited the Link flow.
          if (err != null) {
            // The user encountered a Plaid API error prior to exiting.
          }
        },
      })
    }
    document.body.appendChild(vault);
    document.body.appendChild(plaid);
  }

  togglePlaid = () => {
    this.setState({
      disablePlaid: !this.state.disablePlaid
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.disablePlaid === false &&
      prevState.disablePlaid !== this.state.disablePlaid) {
      this.initialize()
    }
  }

  initialize = (disablePlaid = false) => {
    const { accountModel } = this.props
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    let form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });

    let defaultBankName = !!accountModel.billingPreferences.bankName === true
      ? accountModel.billingPreferences.bankName
      : ""

    if(!!this.state.plaidMetadata !== false &&
      !!this.state.plaidMetadata.institution !== false) {
        defaultBankName = this.state.plaidMetadata.institution.name
    }

    form.field("#bank-name .field-space", {
      type: "text",
      readOnly: disablePlaid === false? 'readOnly': null,
      errorColor: styles.errorColor,
      name: "billingPreferences.bankName",
      defaultValue: defaultBankName,
      placeholder: "Chase Bank",
      validations: ["required"],
      css: inputStyles
    });

    if (disablePlaid === true) {
      form.field("#bank-acct-country .field-space", {
        type: "dropdown",
        errorColor: styles.errorColor,
        name: "billingPreferences.bankCountry",
        validations: ["required"],
        defaultValue: !!accountModel.billingPreferences.bankCountry === true
          ? accountModel.billingPreferences.bankCountry
          : "USA",
        options: [
          { value: 'USA', text: 'United States of America' },
          { value: 'Canada', text: 'Canada' },
          { value: 'Mexico', text: 'Mexico' },
        ],
        css: inputStyles
      });

      form.field("#bank-holder-name .field-space", {
        type: "text",
        errorColor: styles.errorColor,
        name: "billingPreferences.bankAccountHolderName",
        defaultValue: !!accountModel.billingPreferences.bankAccountHolderName === true
          ? accountModel.billingPreferences.bankAccountHolderName
          : "",
        placeholder: "Pat Smalley",
        validations: ["required"],
        css: inputStyles
      });

      form.field("#bank-acct-type .field-space", {
        type: "dropdown",
        errorColor: styles.errorColor,
        name: "billingPreferences.bankAccountHolderType",
        defaultValue: !!accountModel.billingPreferences.bankAccountHolderType === true
          ? accountModel.billingPreferences.bankAccountHolderType
          : "company",
        validations: ["required"],
        options: [
          { value: 'company', text: 'Company' },
          { value: 'individual', text: 'Individual' },
        ],
        css: inputStyles
      });

      form.field("#bank-acct-number .field-space", {
        type: "text",
        errorColor: styles.errorColor,
        name: "billingPreferences.bankAccountNumber",
        defaultValue: !!accountModel.billingPreferences.bankAccountNumber === true
          ? accountModel.billingPreferences.bankAccountNumber
          : "",
        placeholder: "XXXXXXXXXXXXX",
        placeholder: "Enter bank account number",
        validations: ["required"],
        css: inputStyles
      });

      form.field("#bank-routing-number .field-space", {
        type: "text",
        name: "billingPreferences.bankRoutingNumber",
        defaultValue: !!accountModel.billingPreferences.bankRoutingNumber === true
          ? accountModel.billingPreferences.bankRoutingNumber
          : "",
        placeholder: "Enter bank routing number",
        validations: ["required"],
        css: inputStyles
      });
    }

    this.form = form

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
    let { accountModel } = this.props

    this.setState({
      errors: false,
      loading: true,
    })

    const onError = this.onError

    // Attach plaid state to model on submit.
    accountModel.billingPreferences.plaidLinkPublicToken = this.state.plaidLinkPublicToken
    accountModel.billingPreferences.plaidAccountId = this.state.plaidAccountId

    accountModel.saveWithSecureForm(
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

        <button onClick={() => this.openPlaid()}>Sync your Bank account</button>
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
              <span>Account Name: {this.state.plaidMetadata.account.name} ({this.state.plaidMetadata.account.mask})</span>
              <span>{this.state.plaidMetadata.account.subtype}</span>
              <span>{this.state.plaidMetadata.account.type}</span>
            </form>
        }
        <a className="manual-link" onClick={() => this.togglePlaid()}>Manually enter bank account details</a>

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
