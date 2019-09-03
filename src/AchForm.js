import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'


import './styles.css'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height:  "40px",
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
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    let form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });
    
    form.field("#bank-name .field-space", {
      type: "text",
      name: "billingPreferences.bankName",
      placeholder: "Chase Bank",
      validations: ["required"],
      css: styles
    });

    form.field("#bank-acct-country .field-space", {
      type: "dropdown",
      name: "billingPreferences.bankCountry",
      validations: ["required"],
      options: [
        { value: 'USA', text: 'United States of America' },
        { value: 'Canada', text: 'Canada' },
        { value: 'Mexico', text: 'Mexico' },
      ],
      css: styles
    });

    form.field("#bank-holder-name .field-space", {
      type: "text",
      name: "billingPreferences.bankAccountHolderName",
      validations: ["required"],
      css: styles
    });

    form.field("#bank-acct-type .field-space", {
      type: "dropdown",
      name: "billingPreferences.bankAccountHolderType",
      validations: ["required"],
      options: [
        { value: 'company', text: 'Company' },
        { value: 'individual', text: 'Individual' },
      ],
      css: styles
    });

    form.field("#bank-acct-number .field-space", {
      type: "text",
      name: "billingPreferences.bankAccountNumber",
      placeholder: "XXXXXXXXXXXXX",
      validations: ["required"],
      css: styles
    });

    form.field("#bank-routing-number .field-space", {
      type: "text",
      name: "billingPreferences.bankRoutingNumber",
      placeholder: "XXXXXXXXXX",
      validations: ["required"],
      css: styles
    });

    this.form = form

  }

  onSubmit = () => {
    const { form } = this
    const { onNext, accountModel, onError, onComplete = false } = this.props

    accountModel.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
  }

  buttonGrp = () => {
    const { onLast, onCancel, finalStep } = this.props
    return (
      <div>
        <button
          id="form-cancel-btn"
          className="ui left floated button secondary basic"
          onClick={() => onCancel()}>Cancel</button>
        <button
          id="form-next-btn"
          className="ui right floated button positive"
          onClick={this.onSubmit}>{finalStep ? 'Submit' : 'Next'}</button>
        <button
          id="form-prev-btn"
          className="ui right floated button positive basic"
          onClick={() => onLast()}>Previous</button>
      </div>
    )
  }

  render() {
    return (
      <section>
        <form id="contact-form" className="ui form">
          <div id="bank-name" className="field">
            <label>Bank Name</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-acct-country" className="field">
            <label >Bank Country</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-holder-name" className="field">
            <label >Account Holder Name</label>
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
        {this.buttonGrp()}
      </section>
    )
  }
}
