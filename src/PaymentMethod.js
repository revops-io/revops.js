import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  CreditCardForm,
  AchForm,
  EmailInvoice,
  StripeForm,
} from './index'

import { ButtonGroup } from './ButtonGroup'

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

  changePaymentMethodACH() {
    this.setState({ method: 'ACH' })
  }
  changePaymentMethodCC() {
    this.setState({ method: 'CC' })
  }

  render() {
    const { method } = this.state
    const { onLast, onCancel, saveRef } = this.props
    return (
      <section className="">
        <br />
        {
          method === 'CC' &&
          <div id="cc-info">
            <CreditCardForm
              ref={saveRef}
              changePaymentMethod={() => this.changePaymentMethodACH()}
              {...this.props}
            />
          </div>
        }
        {
          method === 'ACH' &&
          <div id="bank-info">
            <AchForm
              ref={saveRef}
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
