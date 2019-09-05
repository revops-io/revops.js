import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'

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
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles
    const { accountModel } = this.props
    const form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });

    form.field("#cc-holder .field-space", {
      type: "text",
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
      name: "billingPreferences.cardCvv",
      placeholder: "311",
      defaultValue: !!accountModel.billingPreferences.cardCvv === true
        ? accountModel.billingPreferences.cardCvv
        : "",
      validations: ["required", "validCardSecurityCode"],
      errorColor: "rgba(240, 0, 0)",
      css: inputStyles
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "billingPreferences.cardExpdate",
      placeholder: "01 / 2022",
      defaultValue: !!accountModel.billingPreferences.cardExpdate === true
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

  onSubmit = () => {
    const { form } = this
    const { onNext, onError, onComplete = false } = this.props
    let { accountModel } = this.props

    accountModel = makeAccount({
      ...accountModel,
      status: 'activating', // trigger activating state.
      billingPreferences: {
        ...accountModel.billingPreferences,
        paymentMethod: "credit-card"
      }
    })

    accountModel.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
  }

  render() {
   const { onLast, onCancel, form, } = this.props
    return (
      <section>
        <div className="form-container">

          <form id="cc-form">
            <div id="cc-holder" className="cardholder-container">
              <label htmlFor="cc-holder" className="hidden">Card Holder</label>
              <span className="field-space"></span>
            </div>

            <div id="cc-number" className="card-number-container">
              <label htmlFor="cc-number" className="hidden"> Card Number </label>
              <span className="field-space">  </span>
            </div>

            {/* <div id="cc-exp" className="exp-container">
              <label htmlFor="cc-exp" className="hidden"> Expiration </label>
              <span className="field-space"></span>
            </div>

            <div id="cc-cvc" className="cvc-container">
              <label htmlFor="cc-cvc" className="hidden"> CVC/CVV</label>
              <span className="field-space"></span>
            </div> */}

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
        <div class="ui clearing divider"></div>
        {/* {this.buttonGrp()} */}
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
