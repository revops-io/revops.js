import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

import './styles.css'

const defaultStyles = {
  border: "none",
  background: "rgba(215, 224, 235, 0.18);",
  height: "40px",
  lineHeight: "normal",
  padding: "0 10px",
  color: "white",
  fontSize: "12px",
  boxSizing: "border-box",
  borderRadius: "4px",
  letterSpacing: ".7px",
  "&::placeholder": {
    color: "white",
    fontSize: "12px",
    opacity: ".5"
  }
};

export default class SignupForm extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  form = null

  componentDidMount() {
    const script = document.createElement("script")

    script.src = REVOPS_VAULT_COLLECT
    script.async = true
    script.onload = () => {
      this.initialize()
    }

    document.body.appendChild(script);
  }

  initialize() {
    const styles = this.props.styles === undefined? defaultStyles : this.props.styles

    const form = VGSCollect.create(REVOPS_VAULT_ID, function(state) {});

    form.field("#cc-holder .field-space", {
      type: "text",
      name: "card.name",
      placeholder: "Joe Business",
      validations: ["required"],
      css: styles
    });

    form.field("#cc-number .field-space", {
      type: "card-number",
      name: "card.number",
      placeholder: "Card number",
      validations: ["required", "validCardNumber"],
      css: styles
    });

    form.field("#cc-cvc .field-space", {
      type: "card-security-code",
      name: "card.cvc",
      placeholder: "344",
      validations: ["required", "validCardSecurityCode"],
      css: styles
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "card.expirationDate",
      placeholder: "01 / 2016",
      validations: ["required", "validCardExpirationDate"],
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
    const { onLast, onCancel } = this.props
    return (
      <div>
        <button
          className="ui left floated button"
          onClick={() => onCancel()}>Cancel</button>
        <button
          className="ui right floated button"
          onClick={this.onSubmit}>Next</button>
        <button
          className="ui right floated button"
          onClick={() => onLast()}>Previous</button>
      </div>
    )
  }

  render() {

    return (
      <section
        id="credit-card-example"
        className="container py-lg-5 example-container"
        >
          <div className="form-container">
            <div className="card-front">
              <div className="shadow"></div>
              <div className="image-container">
                <span className="amount">Set Recharge Card: <strong>$20.00</strong></span>
                <span className="card-image"> <i className="far fa-credit-card"></i> </span>
              </div>

              <form id="cc-form">
                <div id="cc-number" className="card-number-container">
                  <label htmlFor="cc-number" className="hidden"> Card Number </label>
                  <span className="field-space">  </span>

                </div>

                <div id="cc-holder" className="cardholder-container">
                  <label htmlFor="cc-holder" className="hidden">Card Holder</label>
                  <span className="field-space"></span>
                </div>

                <div id="cc-exp" className="exp-container">
                  <label htmlFor="cc-exp" className="hidden"> Expiration </label>
                  <span className="field-space"></span>
                </div>
                <div id="cc-cvc" className="cvc-container">
                  <label htmlFor="cc-cvc" className="hidden"> CVC/CVV</label>
                  <span className="field-space"></span>
                </div>
              </form>
            </div>
            <div className="card-back"><div className="card-stripe"></div></div>
          </div>
          {this.buttonGrp()}
        </section>
    )
  }
}
