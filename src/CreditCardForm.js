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
import { linkStyling } from './SharedStyles'

import {
  Field,
  configureVault,
} from './index'
import { InstrumentModel } from './models'

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

    /** A callable function to fire when an validation error occurs on the form. */
    onValidationError: PropTypes.func,

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

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** a string that indicated the destination of the operation */
    model: PropTypes.string,

    /** a token that grants permission to interact with the RevOps API */
    accessToken: PropTypes.string,

    children: PropTypes.element,

    /** model for of a revops instrument */
    instrument: PropTypes.object.isRequired,
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
    configureVault(
      this.props.apiOptions,
      this.initialize,
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (!!prevProps.account !== false &&
      !!this.props.account !== false &&
      prevProps.account !== this.props.account
    ) {
      this.updateAccount(this.props.account)
    }
  }

  updateAccount(account) {
    this.setAccount(account)
  }

  setAccount = (account) => {
    this.setState({
      account: makeAccount({
        ...account,
      })
    })
  }

  initForm(id, fieldRender) {
    if (document.getElementById(id)) {
      fieldRender()
    }
  }

  initialize = () => {
    const { instrument } = this.props
    let conf = configure(this.props.apiOptions)
    // eslint-disable-next-line
    const form = VGSCollect.create(conf.vaultId, function (state) { });

    this.initForm('card-name',
      () => form.field("#card-name .field-space", {
        type: "text",
        errorColor: this.props.errorColor,
        name: 'holder_name',
        defaultValue: getDefaultValue(instrument, 'cardName', ''),
        placeholder: "Florence Izote",
        validations: ["required"],
        css: this.props.inputStyles,
      })
    )

    this.initForm('card-number', () =>
      form.field("#card-number .field-space", {
        type: "card-number",
        errorColor: this.props.errorColor,
        name: 'card_number',
        defaultValue: getDefaultValue(instrument, 'cardNumber', ''),
        placeholder: "Card number",
        validations: ["required", "validCardNumber"],
        showCardIcon: true,
        autoComplete: 'card-number',
        css: this.props.inputStyles,
      })
    )

    this.initForm('card-cvc', () =>
      form.field("#card-cvc .field-space", {
        type: "card-security-code",
        errorColor: this.props.errorColor,
        name: 'card_cvv',
        defaultValue: getDefaultValue(instrument, 'cardCvv', ''),
        placeholder: "311",
        validations: ["required", "validCardSecurityCode"],
        css: this.props.inputStyles,
      })
    )

    this.initForm('card-expdate', () =>
      form.field("#card-expdate .field-space", {
        type: "card-expiration-date",
        name: 'card_expdate',
        errorColor: this.props.errorColor,
        placeholder: "01 / 2022",
        defaultValue: getDefaultCardExpDate(instrument, ''),
        serializers: [
          form.SERIALIZERS.separate({
            monthName: 'month',
            yearName: 'year',
          })
        ],
        validations: ["required", "validCardExpirationDate"],
        css: this.props.inputStyles,
      })
    )

    this.initForm('card-postalcode', () =>
      form.field("#card-postalcode .field-space", {
        type: "zip-code",
        errorColor: this.props.errorColor,
        name: 'postal_code',
        placeholder: "Postal code",
        validations: ["required"],
        css: this.props.inputStyles,
      })
    )

    this.form = form
  }

  onComplete = (response) => {
    const { onComplete } = this.props

    this.setState({
      loading: false,
    })

    if (onComplete !== false && typeof (onComplete) === 'function') {
      onComplete(response)
    }
  }

  onError = (error) => {
    const { onError } = this.props
    this.setState({
      errors: {
        ...error,
        ...convertAPIError(error.http_status, error),
      },
      status,
      response: error,
      loading: false,
    })

    if (onError !== false && typeof (onError) === 'function') {
      onError(error)
    }
  }

  onValidationError = (errors) => {
    const { onValidationError } = this.props
    this.setState({
      errors: {
        ...errors,
      },
    })

    if (onValidationError !== false && typeof (onValidationError) === 'function') {
      onValidationError(errors)
    }
  }

  onSubmit = () => {
    const { form } = this
    const { onNext, accessToken } = this.props
    let { account, instrument } = this.props

    instrument = new InstrumentModel({
      ...instrument,
      businessAccountId: account.id,
      method: "credit-card"
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
    const onComplete = this.onComplete
    const onValidationError = this.onValidationError

    if(!!accessToken === true){
      instrument.saveWithSecureForm(
        accessToken,
        form,
        {
          onError,
          onComplete,
          onNext,
          onValidationError,
        })
    } else {
      // TODO: Notifiy auth error
    }
  }

  render() {
    const { errors, } = this.state
    const { onLast, onCancel, children, instrument } = this.props

    return (
      <section style={this.props.cardWidth}>

        <label className="h3">Paying by credit card</label>
        {this.props.showACHLink === true &&
          <a
            className="pay-by-ach-link"
            style={linkStyling}
            onClick={this.props.changePaymentMethod}>
            Pay by ACH instead
          </a>
        }
        <div className="form-container">
          <div id="card-form" >
            {!!children !== false &&
              React.createElement(children, {
                ...this.props,
                ...this.state,
              }, null)
            }
            {!!children === false &&
              <React.Fragment>
                <Field
                  id="card-name"
                  name="holderName"
                  label="Card Holder"
                  defaultValue={getDefaultValue(instrument, 'cardName', '')}
                  showInlineError={true}
                  errors={errors}
                />
                <Field
                  id="card-number"
                  name="cardNumber"
                  label="Card Number"
                  defaultValue={getDefaultValue(instrument, 'cardNumber', '')}
                  showInlineError={true}
                  errors={errors}
                />

                <Field
                  id="card-expdate"
                  name="cardExpdate"
                  label="Expiration"
                  defaultValue={getDefaultValue(instrument, 'cardExpdate', '')}
                  showInlineError={true}
                  errors={errors}
                />

                <Field
                  id="card-cvc"
                  name="cardCvv"
                  label="CVC/CVV"
                  defaultValue={getDefaultValue(instrument, 'cardCvv', '')}
                  showInlineError={true}
                  errors={errors}
                />

                <Field
                  id="card-postalcode"
                  name="postalCode"
                  label="Postal Code"
                  defaultValue={getDefaultValue(instrument, 'postalCode', '')}
                  showInlineError={true}
                  errors={errors}
                />
              </React.Fragment>
            }
          </div>
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
