import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  CreditCardForm,
  AchForm,
  EmailInvoice,
  StripeForm,
} from './index'

import { ButtonGroup } from './ButtonGroup'


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
      method: 'CC',
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

  // changePaymentMethod = (e) => {
  //   this.setState({ method: e.target.value })
  // }

  changePaymentMethodACH() {
    this.setState({ method: 'ACH' })
  }
  changePaymentMethodCC() {
    this.setState({ method: 'CC' })
  }

  render() {
    const { method } = this.state
    const { onLast, onCancel } = this.props
    return (
      <section className="">
        <br />
        {
          method === 'CC' &&
          <div id="cc-info">
            <CreditCardForm
              changePaymentMethod={() => this.changePaymentMethodACH()}
              {...this.props}
            />
          </div>
        }
        {
          method === 'ACH' &&
          <div id="bank-info">
            <AchForm
              changePaymentMethod={() => this.changePaymentMethodCC()}
              {...this.props}
            />
          </div>
        }
        {method === false && <div className="ui clearing divider"></div>}
        {method === false &&
          <ButtonGroup
            onLast={onLast}
            onCancel={onCancel}
            hideNext={true}
          />
        }
      </section>
    )
  }
}
