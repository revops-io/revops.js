import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { submitForm, getToken } from './actions/FormActions'

import {
  PropertyHelper,
} from './helpers/PropHelpers'

import { makeAccount } from './actions/AccountActions'
import {
  getErrorText,
  convertAPIError,
  getDefaultValue,
  getDefaultCardExpDate,
  isInstrumentUpdate,
} from './FormHelpers'

import configure from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'
import { linkStyling } from './SharedStyles'

import {
  Field,
  configureVault,
} from './index'
import { Instrument, Account } from './models'

export default class CreditCardForm extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string,

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

    /** CSS in JS styling for the parent html element */
    sectionStyle: PropTypes.object,

    /** Deprecated property for controlling the style of the parent component */
    cardWidth: PropTypes.object,

    /** Color of error text, a valid color name or hex. */
    errorColor: PropTypes.string,

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** 
     * a token that grants permission to interact with the RevOps API 
     * takes the place of the public key when performing secure operations 
    */
    accessToken: PropTypes.string,

    children: PropTypes.element,

    /** model for of a revops payment instrument */
    instrument: PropTypes.object,

    /** getToken (accountId) => { access_token } callback function that is called before every call requiring authorization */
    getToken: PropTypes.func,

    /** tells the component to create an account with the instrument */
    createAccount: PropTypes.bool,

    /**
     * overrideProps is an object where keys names are ids of the particular 
     * element in the DOM. `<div id="bank-name" > = "bank-name": {}`. 
     * Only allowed properties are passed see 
     */
    overrideProps: PropTypes.shape({
      css: PropTypes.object, // CSS in JS
      placeholder: PropTypes.string,
      color: PropTypes.string,
      errorColor: PropTypes.string,
      showCardLink: PropTypes.bool, // some fields only
      label: PropTypes.string,
      options: PropTypes.arrayOf( // select lists only
        PropTypes.shape({
          value: PropTypes.string,
          text: PropTypes.string
      }))
    })

  }

  static defaultProps = {
    showACHLink: false,
    inputStyles: SharedStyles.inputStyles,
    sectionStyle: SharedStyles.sectionStyle,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
    errorColor: SharedStyles.errorColor,
  }

  constructor(props) {
    super(props)
    this.state = {
      account: {},
      errors: false,
      status: false,
      response: false,

    }
    this.form = {};
  }

  componentDidMount() {
    configureVault(
      this.props.apiOptions,
      this.initialize,
    )
  }

  componentDidUpdate(prevProps) {
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
    const {
      instrument,
      createAccount = false,
      inputStyles,
      overrideProps = {},
    } = this.props
    let conf = configure(this.props.apiOptions)

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    // eslint-disable-next-line
    const form = VGSCollect.create(conf.vaultId, function (state) { });
    const prefix = createAccount === true ? "instrument." : ""

    this.initForm('card-name',
      () => form.field("#card-name .field-space", {
        type: "text",
        errorColor: this.props.errorColor,
        name: prefix + 'holder_name',
        defaultValue: getDefaultValue(instrument, 'holderName', ''),
        placeholder: "Florence Izote",
        validations: ["required"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-name'),
      })
    )

    this.initForm('card-number', () =>
      form.field("#card-number .field-space", {
        type: "card-number",
        errorColor: this.props.errorColor,
        name: prefix + 'card_number',
        defaultValue: getDefaultValue(instrument, 'cardNumber', ''),
        placeholder: "Card number",
        validations: ["required", "validCardNumber"],
        showCardIcon: true,
        autoComplete: 'card-number',
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-number', ["showCardIcon"]),
      })
    )

    this.initForm('card-cvc', () =>
      form.field("#card-cvc .field-space", {
        type: "card-security-code",
        errorColor: this.props.errorColor,
        name: prefix + 'card_cvv',
        defaultValue: getDefaultValue(instrument, 'cardCvv', ''),
        placeholder: "311",
        validations: ["required", "validCardSecurityCode"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-cvc'),
      })
    )

    this.initForm('card-expdate', () =>
      form.field("#card-expdate .field-space", {
        type: "card-expiration-date",
        name: prefix + 'card_expdate',
        errorColor: this.props.errorColor,
        placeholder: "01 / 2022",
        defaultValue: getDefaultCardExpDate(instrument, inputStyles),
        serializers: [
          form.SERIALIZERS.separate({
            monthName: 'month',
            yearName: 'year',
          })
        ],
        validations: ["required", "validCardExpirationDate"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-expdate'),
      })
    )

    this.initForm('card-postalcode', () =>
      form.field("#card-postalcode .field-space", {
        type: "zip-code",
        errorColor: this.props.errorColor,
        defaultValue: getDefaultValue(instrument, 'postalCode', ''),
        name: prefix + 'postal_code',
        placeholder: "Postal code",
        validations: ["required"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('card-postalcode'),
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

  bindCallbacks = () => {
    return {
      onError: this.onError,
      onComplete: this.onComplete,
      onValidationError: this.onValidationError,
    }
  }

  // build the payload to submit to the vault
  getPayload = () => {
    const { createAccount, account, instrument } = this.props

    // non PCI values are added to the information from the secure fields
    let payload = new Instrument({
      ...instrument,
      businessAccountId: account.id,
      method: "credit-card",
    })

    // if we are also making an account, nest the instrument in the account payload
    if (createAccount === true) {
      payload = new Account({
        ...account, // add in the account information on the payload
        instrument: {
          ...payload,
        }
      })
    }
    return payload
  }

  onSubmit = async () => {
    const { form } = this
    const { account, apiOptions, instrument = {} } = this.props
    const isUpdate = isInstrumentUpdate(instrument)

    // Clear state
    this.setState({
      account: account,
      errors: false,
      loading: true,
      status: false,
      response: false,
    })

    // get all the values we need to submit the form securely
    const payload = this.getPayload()
    const callbacks = this.bindCallbacks()
    const token = await getToken({ ...this.props, isUpdate })

    submitForm(
      payload,
      token,
      form,
      callbacks,
      apiOptions,
    )
  }

  render() {
    const { errors } = this.state
    const {
      onLast,
      onCancel,
      children,
      instrument,
      sectionStyle,
      cardWidth = false,
      overrideProps = {},
    } = this.props

    const propHelper = new PropertyHelper(overrideProps)

    return (
      <section style={!!cardWidth === true ? cardWidth : sectionStyle}>
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
                  {...propHelper.overrideFieldProps("card-name")}
                />

                <Field
                  id="card-number"
                  name="cardNumber"
                  label="Card Number"
                  defaultValue={getDefaultValue(instrument, 'cardNumber', '')}
                  showInlineError={true}
                  errors={errors}
                  {...propHelper.overrideFieldProps("card-number")}
                />

                <Field
                  id="card-expdate"
                  name="cardExpdate"
                  label="Expiration"
                  defaultValue={getDefaultValue(instrument, 'cardExpdate', '')}
                  showInlineError={true}
                  errors={errors}
                  {...propHelper.overrideFieldProps("card-expdate")}
                />

                <Field
                  id="card-cvc"
                  name="cardCvv"
                  label="CVC/CVV"
                  defaultValue={getDefaultValue(instrument, 'cardCvv', '')}
                  showInlineError={true}
                  errors={errors}
                  {...propHelper.overrideFieldProps("card-cvc")}
                />

                <Field
                  id="card-postalcode"
                  name="postalCode"
                  label="Postal Code"
                  defaultValue={getDefaultValue(instrument, 'postalCode', '')}
                  showInlineError={true}
                  errors={errors}
                  {...propHelper.overrideFieldProps("card-postalcode")}
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
