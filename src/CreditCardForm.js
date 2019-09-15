import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'
import {
  getErrorText,
  getClassName,
  convertAPIError,
  getDefaultValue,
  getDefaultCardExpDate,
} from './FormHelpers'

import configure from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'
import { inputStyles, cardWidth } from './SharedStyles'

import {
  styleDependencies,
  jsDependencies,
  addJS,
  addStylesheet,
  configureVault,
} from './index'

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
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

    /** CreditCardForm can have custom styles,
     ** these styles are passed onto children components */
    styles: PropTypes.object,

    /** Boolean prop for showing/hiding ACH Link */
    showACHLink: PropTypes.bool,

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

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),
  }

  static defaultProps = {
    styles: {},
    showACHLink: false,
  }

  state = {
    errors: false,
    status: false,
    response: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = {};
  }

  componentDidMount() {
    jsDependencies.forEach(js => addJS(js))

    configureVault(
      this.props.env,
      this.initialize,
    )
  }

  initialize = () => {
    const styles = this.props.styles === undefined ? defaultStyles : {
      ...defaultStyles,
      ...this.props.styles,
    }
    const { account } = this.props
    const form = VGSCollect.create(configure(this.props.env).vaultId, function (state) { });

    form.field("#cc-holder .field-space", {
      type: "text",
      errorColor: styles.errorColor,
      name: "billingPreferences.cardName",
      defaultValue: getDefaultValue(account, 'cardName', ''),
      placeholder: "Florence Izote",
      validations: ["required"],
      css: inputStyles
    });

    form.field("#cc-number .field-space", {
      type: "card-number",
      errorColor: styles.errorColor,
      name: "billingPreferences.cardNumber",
      defaultValue: getDefaultValue(account, 'cardNumber', ''),
      placeholder: "Card number",
      validations: ["required", "validCardNumber"],
      showCardIcon: true,
      autoComplete: 'cc-number',
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
      defaultValue: getDefaultCardExpDate(account, ''),
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

  onError = ({status, errors, response}) => {
    const { onError } = this.props
    this.setState({
      errors: {
        ...errors,
        ...convertAPIError(status, response),
      },
      status,
      response,
      loading: false,
    })

    if(onError !== false && typeof(onError) === 'function') {
      onError(errors)
    }
  }

  onSubmit = () => {
    const { form } = this
    const { onNext, onComplete = false } = this.props
    let { account } = this.props

    account = makeAccount({
      ...account,
      status: 'activating', // trigger activating state.
      billingPreferences: {
        ...account.billingPreferences,
        paymentMethod: "credit-card"
      }
    })

    // Clear state
    this.setState({
      errors: false,
      loading: true,
      status: false,
      response: false,
    })

    const onError = this.onError
    account.saveWithSecureForm(
      this.props.publicKey,
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
      <section style={cardWidth}>

        <label className="h3">Paying by credit card</label>
        {this.props.showACHLink === true &&
          <a
            className="pay-by-ach-link"
            onClick={this.props.changePaymentMethod}>
            Pay by ACH instead
          </a>
        }
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
        <span>{getErrorText('', 'networkError', errors)}</span>
        {!!this.props.saveRef === false &&
          <ButtonGroup
            loading={this.state.loading}
            onSubmit={this.onSubmit}
            onLast={onLast}
            onCancel={onCancel}
            finalStep={true}
          />
        }
      </section>
    )
  }
}
