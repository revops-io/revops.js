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
import * as SharedStyles from './SharedStyles'

import {
  jsDependencies,
  addJS,
  configureVault,
} from './index'


export default class CreditCardForm extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

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

    /** Account object allows preconfigured account options to be set */
    account: PropTypes.object,

    /** `inputStyles` for input fields. `&:focus` state can also be styled. */
    inputStyles: PropTypes.object,

    /** Styles for your primary CTA button. */
    buttonStylesPrimary: PropTypes.object,

    /** Styles for your secondary CTA button.
    ** Eg. Previous, Cancel buttons. */
    buttonStylesSecondary: PropTypes.object,

    /** Styles for your text links. */
    linkStyling: PropTypes.object,

    /** How wide you want the content area of `<PaymentMethod />`. */
    cardWidth: PropTypes.object,

    /** Color of error text, a valid color name or hex. */
    errorColor: PropTypes.string,

    /** Internal Use-only: Environment string: local, staging, production */
    env: PropTypes.string,

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,
  }

  static defaultProps = {
    showACHLink: false,
    inputStyles: SharedStyles.inputStyles,
    cardWidth: SharedStyles.cardWidth,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
    errorColor: SharedStyles.errorColor,
  }

  state = {
    account: {},
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
    const { account } = this.props

    // eslint-disable-next-line
    const form = VGSCollect.create(configure(this.props.env).vaultId, function (state) { });

    form.field("#cc-holder .field-space", {
      type: "text",
      errorColor: this.props.errorColor,
      name: "billingPreferences.cardName",
      defaultValue: getDefaultValue(account, 'cardName', ''),
      placeholder: "Florence Izote",
      validations: ["required"],
      css: this.props.inputStyles,
    });

    form.field("#cc-number .field-space", {
      type: "card-number",
      errorColor: this.props.errorColor,
      name: "billingPreferences.cardNumber",
      defaultValue: getDefaultValue(account, 'cardNumber', ''),
      placeholder: "Card number",
      validations: ["required", "validCardNumber"],
      showCardIcon: true,
      autoComplete: 'cc-number',
      css: this.props.inputStyles,
    });

    form.field("#cc-cvc .field-space", {
      type: "card-security-code",
      errorColor: this.props.errorColor,
      name: "billingPreferences.cardCvv",
      placeholder: "311",
      validations: ["required", "validCardSecurityCode"],
      css: this.props.inputStyles,
    });

    form.field("#cc-exp .field-space", {
      type: "card-expiration-date",
      name: "billingPreferences.cardExpdate",
      errorColor: this.props.errorColor,
      placeholder: "01 / 2022",
      defaultValue: getDefaultCardExpDate(account, ''),
      serializers: [
        form.SERIALIZERS.separate({
          monthName: 'month',
          yearName: 'year',
        })
      ],
      validations: ["required", "validCardExpirationDate"],
      css: this.props.inputStyles,
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
      ...account, // prop state
      ...this.state.account, // current component state takes priority
      status: 'activating', // trigger activating state.
      billingPreferences: {
        ...account.billingPreferences,
        paymentMethod: "credit-card"
      }
    })

    // Clear state
    this.setState({
      account: account,
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
    const { onLast, onCancel, } = this.props

    return (
      <section style={this.props.cardWidth}>

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
            showAccept={false}
            loading={this.state.loading}
            onSubmit={this.onSubmit}
            onLast={onLast}
            onCancel={onCancel}
            finalStep={true}
            buttonStylesPrimary={this.props.buttonStylesPrimary}
            buttonStylesSecondary={this.props.buttonStylesSecondary}
          />
        }
      </section>
    )
  }
}
