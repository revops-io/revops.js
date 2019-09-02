import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  CreditCardForm,
} from 'revops-js'

import './styles.css'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  padding: "0 16px"
};

const PaymentMethods = [
  { value: 'Stripe', text: 'Stripe' },
  { value: 'ACH', text: 'Pay by Check' },
  { value: 'CC', text: 'Credit Card' },
  { value: 'EMAIL', text: 'Email the bill' },
]


export default class PaymentMethod extends Component {
  constructor(props){
    super(props)
    this.state = {
      errors: false,
    }
    this.form = null
  }

  static propTypes = {
    styles: PropTypes.object,
    onComplete: PropTypes.func,
  }

  componentDidMount() {
    const script = document.createElement("script")

    script.src = "https://js.verygoodvault.com/vgs-collect/1/ACkcn4HYv7o2XoRa7idWwVEX.js"
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    const form = VGSCollect.create("tnt6ryfiprp", function (state) { });
    // Create VGS Collect field for country
    form.field('#payment-method .field-space', {
      type: 'dropdown',
      name: 'payment_type',
      placeholder: 'Select a payment method',
      validations: ['required'],
      options: [...PaymentMethods],
      defaultValue: PaymentMethods[0],
      css: styles
    });

    this.form = form

  }

  handleError = (errors) => this.setState({
    errors
  })

  onSubmit = () => {


    this.form.submit(
      "/post",
      {
        headers: {
          "x-custom-header": "Oh yes. I am a custom header"
        }
      },
      function (status, data) {
        console.log(data)
        if (this.props.onSubmit !== false) {
          this.props.onComplete()
        }
      },
      function (errors) {
        () => this.handleError(errors)
      }
    )

    this.props.onNext()
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
    const { method } = this.state
    return (
      <section className="">
        <select 
          className="ui dropdown"
          onChange={e => this.setState({method: e.target.value})}>
          {
            PaymentMethods.map(method => {
              return <option key={method.value} value={method.value}>{method.text}</option>
            })
          }
        </select>
        <form id="contact-form" className="ui form">
          <div id="payment-method" className="field">
            <label >Payment methods</label>
            <span className="field-space"></span>
          </div>
          {
            method === 'CC' && 
            <div id="cc-info">
              <CreditCardForm {...this.props} />
            </div>
          }
          {
            method === 'Stripe' && 
            <div id="stripe-info">
              <h1>Stripe Info</h1>
            </div>
          }
          {
            method === 'EMAIL' && 
            <div id="email-info">
              <h1>Email</h1>
            </div>
          }
          {
            method === 'ACH' && 
            <div id="bank-info">
              <h1>Bank Info</h1>
            </div>
          }
        </form>
        {this.buttonGrp()}
      </section>
    )
  }
}
