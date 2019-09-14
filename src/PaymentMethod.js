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

export const PaymentMethods = {
  METHOD_ACH: 'ach',
  METHOD_CARD: 'card',
  METHOD_PLAID: 'plaid',
}

export default class PaymentMethod extends Component {
  static propTypes = {
    /** PaymentMethod can have custom styles,
     ** these styles are passed onto children components */
    styles: PropTypes.object,

    /** An enumerated list of supported payment method types
     * that the developer can enable for their customers.
     */
    methods: PropTypes.arrayOf(
       PropTypes.oneOf(Object.values(PaymentMethods))),

    /** Default payment method property */
    defaultMethod: PropTypes.oneOf(Object.values(PaymentMethods)),

    /** A callable function to fire when form is complete */
    onComplete: PropTypes.func,

    /** A callable function to fire when next event occurs */
    onNext: PropTypes.func,

    /** A callable function to fire when cancel event occurs */
    onCancel: PropTypes.func,

    /** A callable function to fire when last event occurs */
    onLast: PropTypes.func,

    /** A callable function to fire when an error occurs on the form. */
    onError: PropTypes.func,

    /** Toggle for showing/hiding plaid info */
    togglePlaidHandler: PropTypes.func,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),
  }


  static defaultProps = {
    styles: {},
    methods: [
      PaymentMethods.METHOD_CARD,
      PaymentMethods.METHOD_ACH,
    ],
    defaultMethod: PaymentMethod.METHOD_CARD,
  }

  constructor(props) {
    super(props)

    this.validateMethods(props)

    this.state = {
      errors: false,
      method: this.props.defaultMethod,
    }
    this.form = null
  }

  validateMethods(props) {
    let method = props.methods.find(
      m => m === props.defaultMethod
    )

    if (!method) {
      throw new Error('[PaymentMethod.props.defaultMethod missing from `PaymentMethod.props.methods`]')
    }

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
    this.setState({ method: PaymentMethods.METHOD_ACH })
  }

  changePaymentMethodCC() {
    this.setState({ method: PaymentMethods.METHOD_CARD })
  }

  togglePlaidHandler = () => {
    this.setState({
      method: this.state.method === PaymentMethods.METHOD_ACH?
        PaymentMethods.METHOD_PLAID : PaymentMethods.METHOD_ACH
    })
  }

  isPlaidEnabled = () => {
    let plaidMethod = this.props.methods.find(
      m => m === PaymentMethods.METHOD_PLAID
    )
    return !!plaidMethod
  }

  isACHEnabled = () => {
    let achMethod = this.props.methods.find(
      m => m === PaymentMethods.METHOD_ACH
    )
    return !!achMethod
  }

  isCardEnabled = () => {
    let cardMethod = this.props.methods.find(
      m => m === PaymentMethods.METHOD_CARD
    )
    return !!cardMethod
  }

  render() {
    const { method } = this.state
    const { onLast, onCancel } = this.props
    return (
      <section className="">
        <br />
        {
          method === PaymentMethods.METHOD_CARD &&
          <div id="cc-info">
            <CreditCardForm
              ref={this.props.saveRef}
              account={this.state.accountModel}
              setAccount={(accountProperty, field, value) =>
                this.setAccount(accountProperty, field, value)
              }
              showACHLink={this.isACHEnabled()}
              changePaymentMethod={() => this.changePaymentMethodACH()}
              {...this.props}
            />
          </div>
        }
        {
          method === PaymentMethods.METHOD_ACH &&
          <div id="bank-info">
            <AchForm
              ref={this.props.saveRef}
              hideTogglePlaid={this.isPlaidEnabled() === true?
                false: true
              }
              account={this.state.accountModel}
              setAccount={(accountProperty, field, value) =>
                this.setAccount(accountProperty, field, value)
              }
              changePaymentMethod={() => this.changePaymentMethodCC()}
              showCardLink={this.isCardEnabled()}
              togglePlaidHandler={this.togglePlaidHandler}
              {...this.props}
            />
          </div>
        }
        {
          method === PaymentMethods.METHOD_PLAID &&
          <div id="bank-info">
            <PlaidForm
              ref={this.props.saveRef}
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
