import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  CreditCardForm,
  AchForm,
  EmailInvoice,
  StripeForm,
} from './index'

import './styles.css'


const PaymentMethods = [
  { value: '', text: '' },
  // { value: 'Stripe', text: 'Stripe' },
  { value: 'ACH', text: 'Pay by Check' },
  { value: 'CC', text: 'Credit Card' },
  // { value: 'EMAIL', text: 'Email the bill' },
]


export default class PaymentMethod extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: false,
      method: false,
    }
    this.form = null
  }

  static propTypes = {
    styles: PropTypes.object,
    onComplete: PropTypes.func,
    onNext: PropTypes.func,
    onCancel: PropTypes.func,
    onLast: PropTypes.func,
    onError: PropTypes.func,
  }

  buttonGrp = () => {
    const { onLast, onCancel } = this.props
    return (
      <div id="form-nav">
        <button
          className="ui left floated button"
          onClick={() => onCancel()}>Cancel</button>
        <button
          className="ui right floated button"
          onClick={() => onLast()}>Previous</button>
      </div>
    )
  }

  changePaymentMethod = (e) => {

    this.setState({ method: e.target.value })
  }

  render() {
    const { method } = this.state
    return (
      <section className="">
        {method === false &&
          <React.Fragment>
            <label>Select Payment Method</label>
            <select
              style={{ width: '100%' }}
              className="ui dropdown"
              onChange={(e) => this.changePaymentMethod(e)} >
              {
                PaymentMethods.map(method => {
                  return <option key={method.value} value={method.value}>{method.text}</option>
                })
              }
            </select>
          </React.Fragment>
        }
        <br />
        {
          method === 'CC' &&
          <div id="cc-info">
            <CreditCardForm {...this.props} />
          </div>
        }
        {
          method === 'Stripe' &&
          <div id="stripe-info">
            <StripeForm {...this.props} />
          </div>
        }
        {
          method === 'EMAIL' &&
          <div id="email-info">
            <EmailInvoice {...this.props} />
          </div>
        }
        {
          method === 'ACH' &&
          <div id="bank-info">
            <AchForm {...this.props} />
          </div>
        }
        {method === false && <div class="ui clearing divider"></div>}
        {method === false && this.buttonGrp()}
      </section>
    )
  }
}
