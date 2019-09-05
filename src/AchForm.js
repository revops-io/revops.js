import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'
import { ButtonGroup } from './ButtonGroup'
import { inputStyles } from './SharedStyles'

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
    const script = document.createElement("script")

    script.src = REVOPS_VAULT_COLLECT
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const { accountModel } = this.props
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    let form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });

    form.field("#bank-name .field-space", {
      type: "text",
      name: "billingPreferences.bankName",
      defaultValue: !!accountModel.billingPreferences.bankName === true
        ? accountModel.billingPreferences.bankName
        : "",
      placeholder: "Chase Bank",
      validations: ["required"],
      css: inputStyles
    });

    form.field("#bank-acct-country .field-space", {
      type: "dropdown",
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
      name: "billingPreferences.bankAccountNumber",
      defaultValue: !!accountModel.billingPreferences.bankAccountNumber === true
        ? accountModel.billingPreferences.bankAccountNumber
        : "",
      placeholder: "XXXXXXXXXXXXX",
      placeholder: "#############",
      validations: ["required"],
      css: inputStyles
    });

    form.field("#bank-routing-number .field-space", {
      type: "text",
      name: "billingPreferences.bankRoutingNumber",
      defaultValue: !!accountModel.billingPreferences.bankRoutingNumber === true
        ? accountModel.billingPreferences.bankRoutingNumber
        : "",
      placeholder: "##########",
      validations: ["required"],
      css: inputStyles
    });

    this.form = form

  }

  onSubmit = () => {
    const { form } = this
    const { onNext, onError, onComplete = false } = this.props
    let { accountModel } = this.props

    accountModel.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
  }

  render() {
    const { onLast, onCancel, form, } = this.props
    return (
      <section>
        <label className="h3">Paying by ACH</label>
        <a className="pay-by-cc-link" onClick={this.props.changePaymentMethod}>Pay by credit card instead</a>
        <form id="contact-form" className="ui form">
          <div id="bank-name" className="field">
            <label>Bank Name</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-holder-name" className="field">
            <label >Account Holder Name</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-acct-country" className="field">
            <label >Bank Country</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-acct-type" className="field">
            <label >Account Type</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-routing-number" className="field">
            <label >Routing Number</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-acct-number" className="field">
            <label>Account Number</label>
            <span className="field-space"></span>
          </div>

        </form>
        <div class="ui clearing divider"></div>
        {/* {this.buttonGrp()} */}
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
