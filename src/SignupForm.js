import React, { Component } from 'react'
import PropTypes from 'prop-types'

import configure from './client/VaultConfig'

import { inputStyles } from './SharedStyles'
import { ButtonGroup } from './ButtonGroup'

export default class SignupForm extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  form = null

  componentDidMount() {
    styleDependencies.forEach(stylesheet => addStylesheet(stylesheet))
    jsDependencies.forEach(js => addJS(js))
    configureVault(
      this.props.env,
      this.initialize(),
    )
  }

  initialize() {

    const form = VGSCollect.create(configure(this.props.env).vaultId, function(state) {});

    form.field("#cc-holder .field-space", {
      type: "text",
      name: "card.name",
      placeholder: "Joe Business",
      validations: ["required"],
      css: inputStyles
    });

    form.field("#cc-number .field-space", {
      type: "card-number",
      name: "card.number",
      placeholder: "Card number",
      validations: ["required", "validCardNumber"],
      css: inputStyles
    });

    form.field("#cc-cvc .field-space", {
      type: "card-security-code",
      name: "card.cvc",
      placeholder: "344",
      validations: ["required", "validCardSecurityCode"],
      css: inputStyles
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "card.expirationDate",
      placeholder: "01 / 2016",
      validations: ["required", "validCardExpirationDate"],
      css: inputStyles
    });

    this.form = form
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

              <div id="cc-form">
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
              </div>
            </div>
            <div className="card-back"><div className="card-stripe"></div></div>
          </div>
          <ButtonGroup onSubmit={this.onSubmit}/>
        </section>
    )
  }
}
