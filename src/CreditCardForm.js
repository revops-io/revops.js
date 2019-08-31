import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
  transition: 'border-color .15s ease-in-out',
  "&::placeholder": {
    color: "white",
    fontSize: "12px",
    opacity: ".5"
  }
};


export default class CreditCardForm extends Component {
  form = null
  state = {
    errors: false,
  }

  static propTypes = {
    styles: PropTypes.object,
    onComplete: PropTypes.func,
  }

  componentDidMount () {
    const script = document.createElement("script")

    script.src = "https://js.verygoodvault.com/vgs-collect/1/ACkcn4HYv7o2XoRa7idWwVEX.js"
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const styles = this.props.styles === undefined? defaultStyles : this.props.styles

    const form = VGSCollect.create("tnt6ryfiprp", function(state) {});
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
      showCardIcon: true,
      css: styles
    });

    form.field("#cc-cvc .field-space", {
      type: "card-security-code",
      name: "card.cvc",
      placeholder: "344",
      validations: ["required", "validCardSecurityCode"],
      errorColor: "rgba(240, 0, 0)",
      css: styles
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "card.expirationDate",
      placeholder: "01 / 2016",
      validations: ["required", "validCardExpirationDate"],
      css: styles
    })


    this.form = form

  }

  handleError = (errors) => this.setState({
    errors
  })

  onSubmit() {
    this.props.onComplete()

    const handleError = this.handleError.bind(this)
    this.form.submit(
      "/post",
      {
        headers: {
          "x-custom-header": "Oh yes. I am a custom header"
        }
      },
      function(status, data) {
        let elem = document.getElementsByClassName("card-success")[0];
        elem.classList.remove("hidden");
        if(this.props.onSubmit !== false) {
          this.props.onComplete()
        }
      },
      function(errors) {
        handleError(errors)
      }
    )
  }

  render() {
    const {
      text
    } = this.props

    return (
      <section
        id="credit-card-example"
        className="container py-lg-5 example-container"
        >

          <div className="card-success hidden">
            <i className="fa fa-check"></i>
            <p>Payment Successful!</p>
          </div>
          <div className="form-container">
            <div className="card-front">
              <div className="shadow"></div>
              <div className="image-container">
                <span className="amount">Bank of Awesome</span>
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
          <button onClick={() => this.onSubmit()} type="submit" className="fluid ui button">
            Connect Card <i className="fas fa-arrow-circle-right"></i>
          </button>
        </section>
    )
  }
}
