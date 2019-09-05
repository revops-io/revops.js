import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'
import { getErrorText, getClassName} from './FormHelpers'

import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'
import { inputStyles } from './SharedStyles'

const defaultStyles = {
  border: 'none',
  background: 'rgba(215, 224, 235, 0.18);',
  height: '40px',
  lineHeight: 'normal',
  padding: '0 10px',
  color: 'white',
  fontSize: '12px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  letterSpacing: '.7px',
  '&::placeholder': {
    color: 'white',
    fontSize: '12px',
    opacity: '.5',
  },
};

export default class CreditCardForm extends Component {
  state = {
    errors: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = {};
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
    const script = document.createElement("script")

    script.src = REVOPS_VAULT_COLLECT
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const styles = this.props.styles === undefined ? defaultStyles : {
      ...defaultStyles,
      ...this.props.styles,
    }
    const { accountModel } = this.props
    const form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });

    form.field("#cc-holder .field-space", {
      type: "text",
      errorColor: styles.errorColor,
      name: "billingPreferences.cardName",
      defaultValue: !!accountModel.billingPreferences.cardName === true
        ? accountModel.billingPreferences.cardName
        : "",
      placeholder: "Joe Business",
      validations: ["required"],
      css: inputStyles
    });

    form.field("#cc-number .field-space", {
      type: "card-number",
      errorColor: styles.errorColor,
      name: "billingPreferences.cardNumber",
      defaultValue: !!accountModel.billingPreferences.cardNumber === true
        ? accountModel.billingPreferences.cardNumber
        : "",
      placeholder: "Card number",
      validations: ["required", "validCardNumber"],
      showCardIcon: true,
      css: inputStyles
    });

    form.field("#cc-cvc .field-space", {
      type: "card-security-code",
      errorColor: styles.errorColor,
      name: "billingPreferences.cardCvv",
      placeholder: "311",
      validations: ["required", "validCardSecurityCode"],
      css: inputStyles
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "billingPreferences.cardExpdate",
      errorColor: styles.errorColor,
      placeholder: "01 / 2022",
      defaultValue: !!accountModel.billingPreferences.cardExpdate.month || !!accountModel.billingPreferences.cardExpdate.year === true
        ? accountModel.billingPreferences.cardExpdate.month
          + '/' +
          accountModel.billingPreferences.cardExpdate.year
        : "",
      serializers: [
        form.SERIALIZERS.separate({
          monthName: 'month',
          yearName: 'year',
        })
      ],
      validations: ["required", "validCardExpirationDate"],
      css: inputStyles
    })

    this.form = form
  }

  onError = ({errors}) => {
    const { onError } = this.props
    this.setState({
      errors
    })

    if(onError !== false && typeof(onError) === 'function') {
      onError(errors)
    }
  }

  onSubmit = () => {
    const { form } = this
    const { onNext, onComplete = false } = this.props
    let { accountModel } = this.props

    accountModel = makeAccount({
      ...accountModel,
      status: 'activating', // trigger activating state.
      billingPreferences: {
        ...accountModel.billingPreferences,
        paymentMethod: "credit-card"
      }
    })

    this.setState({ errors: false, loading: true })

    const onError = this.onError
    accountModel.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
  }

  render() {
    const { errors, } = this.state
    const { onLast, onCancel, form, } = this.props

    return (
      <section>
        <label className="h3">Paying by credit card</label>
        <a className="pay-by-ach-link" onClick={this.props.changePaymentMethod}>Pay by ACH instead</a>
        <div className="form-container">
          <form id="cc-form">
            <div id="cc-holder" className={
              getClassName(
                "cardholder-container",
                "billingPreferences.cardName",
                errors
              )
            }>
              <label htmlFor="cc-holder" className="hidden">Card Holder</label>
              <span className="field-space"></span>
              <span>{getErrorText('Name', 'billingPreferences.cardName', errors)}</span>
            </div>

            <div id="cc-number" className={
              getClassName(
                "card-number-container",
                "billingPreferences.cardNumber",
                errors
              )
            }>
              <label htmlFor="cc-number" className="hidden"> Card Number </label>
              <span className="field-space"></span>
              <span>{getErrorText('Number', 'billingPreferences.cardNumber', errors)}</span>
            </div>

            <div id="cc-exp" className={
              getClassName(
                "exp-container",
                "billingPreferences.cardExpdate",
                errors
              )
            }>
              <label htmlFor="cc-exp" className="hidden"> Expiration </label>
              <span className="field-space"></span>
              <span>{getErrorText('Expiration', 'billingPreferences.cardExpdate', errors)}</span>
            </div>

            <div id="cc-cvc" className={
              getClassName(
                "cvc-container",
                "billingPreferences.cardCvv",
                errors
              )
            }>
              <label htmlFor="cc-cvc" className="hidden"> CVC/CVV</label>
              <span className="field-space"></span>
              <span>{getErrorText('CVC/CVV', 'billingPreferences.cardCvv', errors)}</span>
            </div>

          </form>
        </div>
        <div className="ui clearing divider"></div>
        <ButtonGroup
         onSubmit={this.onSubmit}
         onLast={onLast}
         onCancel={onCancel}
         finalStep={true}
       />
      </section>
    )
  }
}
