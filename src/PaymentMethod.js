import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'

import {
  CreditCardForm,
  PlaidForm,
  AchForm,
  EmailInvoice,
  StripeForm,
  jsDependencies,
  addJS,
} from './index'

import { ButtonGroup } from './ButtonGroup'


const PaymentMethods = [
  { value: '', text: '' },
  { value: 'ACH', text: 'Pay by Check' },
  { value: 'CC', text: 'Credit Card' },
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

  componentDidMount() {
    jsDependencies.forEach(js => addJS(js))
    this.initializeAccount()
  }

  initializeAccount() {
    const { account } = this.props
    this.setState({
      accountModel: makeAccount({
        ...account,
      })
    })
  }

  setAccount(accountProperty, field, value) {
    this.setState({
      accountModel: {
        ...this.state.accountModel,
        [accountProperty]: {
          ...this.state.accountModel[accountProperty],
          value,
        }
      }
    })
  }

  changePaymentMethodACH() {
    this.setState({ method: 'ACH' })
  }

  changePaymentMethodCC() {
    this.setState({ method: 'CC' })
  }

  togglePlaidHandler = () => {
    this.setState({
      method: this.state.method === 'ACH'?
        'PLAID' : 'ACH'
    })
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
              account={this.state.accountModel}
              setAccount={(accountProperty, field, value) =>
                this.setAccount(accountProperty, field, value)
              }
              changePaymentMethod={() => this.changePaymentMethodACH()}
              {...this.props}
            />
          </div>
        }
        {
          method === 'ACH' &&
          <div id="bank-info">
            <AchForm
              account={this.state.accountModel}
              setAccount={(accountProperty, field, value) =>
                this.setAccount(accountProperty, field, value)
              }
              changePaymentMethod={() => this.changePaymentMethodCC()}
              togglePlaidHandler={this.togglePlaidHandler}
              {...this.props}
            />
          </div>
        }
        {
          method === 'PLAID' &&
          <div id="bank-info">
            <PlaidForm
              account={this.state.accountModel}
              setAccount={(accountProperty, field, value) =>
                this.setAccount(accountProperty, field, value)
              }
              changePaymentMethod={() => this.changePaymentMethodCC()}
              togglePlaidHandler={this.togglePlaidHandler}
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
