import React, { Component } from 'react'
import PropTypes from 'prop-types'

import config from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'

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

const inputStyles = {
  background: 'hsla(0,0%,74%,.13)',
  borderRadius: '4px',
  padding: '8px',
  fontSize: '18px',
  lineHeight: '20px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all .15s ease-in-out 0s',
  '&:focus': {
    background: 'white',
    border: '2px solid #c550ff'
  },
}

export default class SignupForm extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  form = null

  componentDidMount() {
    const script = document.createElement("script")

    script.src = config.vaultCollectUrl
    script.async = true
    script.onload = () => {
      this.initialize()
    }

    document.body.appendChild(script);
  }

  initialize() {
    const styles = this.props.styles === undefined? defaultStyles : this.props.styles

    const form = VGSCollect.create(config.vaultId, function(state) {});

    form.field("#cc-holder .field-space", {
      type: "text",
      name: "card.name",
      placeholder: "Joe Business",
      validations: ["required"],
      // css: styles
      css: inputStyles
    });

    form.field("#cc-number .field-space", {
      type: "card-number",
      name: "card.number",
      placeholder: "Card number",
      validations: ["required", "validCardNumber"],
      // css: styles
      css: inputStyles
    });

    form.field("#cc-cvc .field-space", {
      type: "card-security-code",
      name: "card.cvc",
      placeholder: "344",
      validations: ["required", "validCardSecurityCode"],
      // css: styles
      css: inputStyles
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "card.expirationDate",
      placeholder: "01 / 2016",
      validations: ["required", "validCardExpirationDate"],
      // css: styles
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
          <ButtonGroup onSubmit={this.onSubmit}/>
        </section>
    )
  }
}
