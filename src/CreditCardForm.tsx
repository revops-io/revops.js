import React, { Component, CSSProperties, ReactNode, RefObject } from "react"
import { submitForm, getToken } from "./actions/FormActions"
import { PropertyHelper } from "./helpers/PropHelpers"
import {
  getErrorText,
  convertAPIError,
  getDefaultValue,
  getDefaultCardExpDate,
  isInstrumentUpdate,
} from "./FormHelpers"
import configure from "./client/VaultConfig"
import ButtonGroup from "./ButtonGroup"
import { linkStyling } from "./SharedStyles"
import Field from "./Field"
import Instrument from "./models/Instrument"
import Account from "./models/Account"
import PaymentMethods from "./PaymentMethod"
import { logError, logInfo } from "./helpers/Logger"
import { PaymentProps } from "./shared/types"
import * as SharedStyles from "./SharedStyles"
import { configureVault } from "./index"

const NUMBER_OF_FIELDS = 5

interface Props extends PaymentProps {
  showACHLink: boolean
  achLink?: ReactNode
  onCancel: () => void
  creditCardLabel?: ReactNode
  changePaymentMethod: () => void
  ref: RefObject<HTMLElement> | any
}

interface State {
  account: Account
  errors: Record<string, unknown>
  loading: boolean
  saving: boolean
  status: string
  response: unknown
}

export default class CreditCardForm extends Component<Props, State> {
  private form: {
    state: Record<string, unknown>
    field: (selector: unknown, options: Record<string, unknown>) => void
  } | null
  private loadingTimeOut: number | null

  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      status: "",
      response: false,
      loading: true,
      account: {} as Account,
      saving: false,
    }
    this.form = null
    this.loadingTimeOut = null
  }

  componentDidMount() {
    const { apiOptions, loadingState } = this.props
    configureVault(apiOptions, this.initialize)

    // setup debug information when using `loadingState`
    if (!!loadingState && this.isThisMethod()) {
      this.loadingTimeOut = setTimeout(() => {
        logError(
          "The form has not loaded after 5 seconds.",
          apiOptions.loggingLevel,
        )
        this.onError({
          message: "Form not loaded successfully.",
          code: "form_timeout",
        })
      }, 5000)
    }
  }

  componentWillUnmount() {
    if (this.loadingTimeOut) {
      clearTimeout(this.loadingTimeOut)
    }
  }

  initForm(id, fieldRender) {
    if (document.getElementById(id)) {
      fieldRender()
    }
  }

  componentDidUpdate(prevProps) {
    const { method } = this.props
    if (prevProps.method !== method) {
      // clean up the timeout if the previous method was this method and is no longer
      if (
        prevProps.method === PaymentMethods.METHOD_CARD ||
        prevProps.method === "card"
      ) {
        this.loadingTimeOut && clearTimeout(this.loadingTimeOut)
      }
      this.setState({ loading: false })
    }
  }

  initialize = () => {
    const {
      instrument,
      createAccount = false,
      inputStyles = SharedStyles.inputStyles,
      overrideProps = {},
      apiOptions,
      errorColor = SharedStyles.errorColor,
    } = this.props
    const conf = configure(apiOptions)

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    // eslint-disable-next-line
    const form = VGSCollect.create(conf.vaultId, state =>
      this.isFinishedLoading(state),
    )
    const prefix = createAccount ? "instrument." : ""

    this.initForm("card-name", () =>
      form.field("#card-name .field-space", {
        type: "text",
        errorColor: errorColor,
        name: prefix + "holder_name",
        defaultValue: getDefaultValue(instrument, "holderName", ""),
        placeholder: "Florence Izote",
        validations: ["required"],
        css: inputStyles,
        ...propHelper.overrideCollectProps("card-name"),
      }),
    )

    this.initForm("card-number", () =>
      form.field("#card-number .field-space", {
        type: "card-number",
        errorColor: errorColor,
        name: prefix + "card_number",
        defaultValue: getDefaultValue(instrument, "cardNumber", ""),
        placeholder: "Card number",
        validations: ["required", "validCardNumber"],
        showCardIcon: true,
        autoComplete: "card-number",
        css: inputStyles,
        ...propHelper.overrideCollectProps("card-number", ["showCardIcon"]),
      }),
    )

    this.initForm("card-cvc", () =>
      form.field("#card-cvc .field-space", {
        type: "card-security-code",
        errorColor: errorColor,
        name: prefix + "card_cvv",
        defaultValue: getDefaultValue(instrument, "cardCvv", ""),
        placeholder: "311",
        validations: ["required", "validCardSecurityCode"],
        css: inputStyles,
        ...propHelper.overrideCollectProps("card-cvc"),
      }),
    )

    this.initForm("card-expdate", () =>
      form.field("#card-expdate .field-space", {
        type: "card-expiration-date",
        name: prefix + "card_expdate",
        errorColor: errorColor,
        placeholder: "01 / 2022",
        defaultValue: getDefaultCardExpDate(instrument),
        serializers: [
          form.SERIALIZERS.separate({
            monthName: "month",
            yearName: "year",
          }),
        ],
        validations: ["required", "validCardExpirationDate"],
        css: inputStyles,
        ...propHelper.overrideCollectProps("card-expdate"),
      }),
    )

    this.initForm("card-postalcode", () =>
      form.field("#card-postalcode .field-space", {
        type: "zip-code",
        errorColor: errorColor,
        defaultValue: getDefaultValue(instrument, "postalCode", ""),
        name: prefix + "postal_code",
        placeholder: "Postal code",
        validations: ["required"],
        css: inputStyles,
        ...propHelper.overrideCollectProps("card-postalcode"),
      }),
    )

    this.form = form
  }

  onComplete = response => {
    const { onComplete } = this.props

    this.setState({
      saving: false,
    })

    onComplete?.(response)
  }

  onError = error => {
    const { onError } = this.props
    this.setState({
      errors: {
        ...error,
        ...convertAPIError(error.http_status, error),
      },
      status,
      saving: false,
    })
    onError?.(error)
  }

  onValidationError = errors => {
    const { onValidationError } = this.props
    this.setState({
      errors: {
        ...errors,
      },
    })
    onValidationError?.(errors)
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
    let payload: Instrument | Account = new Instrument({
      ...instrument,
      businessAccountId: account.id,
      method: "credit-card",
    })

    // if we are also making an account, nest the instrument in the account payload
    if (createAccount) {
      payload = new Account({
        ...account, // add in the account information on the payload
        instrument: {
          ...payload,
        },
      })
    }
    return payload
  }

  isFinishedLoading = formState => {
    const { onLoad } = this.props
    const { loading } = this.state

    if (loading && this.isThisMethod()) {
      if (Object.keys(formState).length === NUMBER_OF_FIELDS) {
        this.setState({ loading: false })

        this.loadingTimeOut && clearTimeout(this.loadingTimeOut)
        onLoad?.()
      }
    }
  }

  isThisMethod = () => {
    const { method } = this.props
    return method === PaymentMethods.METHOD_CARD
  }

  getSectionDisplayProps = (): CSSProperties => {
    const { loading } = this.state
    const { loadingState, sectionStyle, cardWidth } = this.props

    const isThisMethod = this.isThisMethod()

    // if the first method os loading hide it but keep the space in the DOM
    if (isThisMethod && !!loadingState && loading) {
      return { ...cardWidth, ...sectionStyle, visibility: "hidden" }
    }

    // if it is another method, hide it from DOM completely
    if (!isThisMethod) {
      return { ...cardWidth, ...sectionStyle, display: "none" }
    }

    return { ...cardWidth, ...sectionStyle }
  }

  onSubmit = async () => {
    const { form } = this
    const { apiOptions, instrument = {}, saveRef } = this.props
    const isUpdate = isInstrumentUpdate(instrument)

    // Clear state
    this.setState({
      errors: {},
      saving: true,
      status: "",
      response: false,
    })

    // get all the values we need to submit the form securely
    const payload = this.getPayload()
    const callbacks = this.bindCallbacks()
    const token = await getToken({ ...this.props, isUpdate })

    if (!saveRef) {
      submitForm(payload, token, form, callbacks, apiOptions)
        .then(res => {
          logInfo("Form submitted successfully.", apiOptions.loggingLevel, res)
        })
        .catch(e => {
          logError(
            "There was and issue with the submitting the form.",
            apiOptions.loggingLevel,
            e,
          )
        })
    } else {
      return submitForm(payload, token, form, callbacks, apiOptions)
    }
  }

  achLink = () => {
    const { changePaymentMethod } = this.props
    return (
      <a
        className="pay-by-ach-link"
        onClick={changePaymentMethod}
        style={linkStyling}>
        Pay by ACH instead
      </a>
    )
  }

  getACHLink = () => {
    const { showACHLink = true, achLink = this.achLink() } = this.props

    if (!showACHLink) {
      return null
    }
    return achLink
  }

  render() {
    const { errors, loading, saving } = this.state
    const {
      onLast,
      children,
      instrument,
      overrideProps = {},
      showInlineError = true,
      showNetworkError = true,
      isUpdate = false,
      creditCardLabel = (
        <label className="cc-label">Paying by Credit Card</label>
      ),
      loadingState,
      saveRef,
      buttonStylesPrimary = SharedStyles.buttonStylesPrimary,
      buttonStylesSecondary = SharedStyles.buttonStylesSecondary,
    } = this.props

    const propHelper = new PropertyHelper(overrideProps)

    return (
      <React.Fragment>
        {!isUpdate && loading && this.isThisMethod() && (
          <div className="loader-holder">{loadingState}</div>
        )}
        <section style={this.getSectionDisplayProps()}>
          {creditCardLabel}
          {this.getACHLink()}
          <div className="form-container">
            <div id="card-form">
              {!!children &&
                React.createElement(
                  //todo: figure out what's going on here
                  children,
                  {
                    ...this.props,
                    ...this.state,
                  },
                  null,
                )}
              {!children && (
                <React.Fragment>
                  <Field
                    errors={errors}
                    id="card-name"
                    label="Card Holder"
                    name="holderName"
                    showInlineError={showInlineError}
                    {...propHelper.overrideFieldProps("card-name")}
                  />

                  <Field
                    errors={errors}
                    id="card-number"
                    label="Card Number"
                    name="cardNumber"
                    showInlineError={showInlineError}
                    {...propHelper.overrideFieldProps("card-number", [
                      "showCardIcon",
                    ])}
                  />

                  <Field
                    errors={errors}
                    id="card-expdate"
                    label="Expiration"
                    name="cardExpdate"
                    showInlineError={showInlineError}
                    {...propHelper.overrideFieldProps("card-expdate")}
                  />

                  <Field
                    errors={errors}
                    id="card-cvc"
                    label="CVC/CVV"
                    name="cardCvv"
                    showInlineError={showInlineError}
                    {...propHelper.overrideFieldProps("card-cvc")}
                  />

                  <Field
                    errors={errors}
                    id="card-postalcode"
                    label="Postal Code"
                    name="postalCode"
                    showInlineError={showInlineError}
                    {...propHelper.overrideFieldProps("card-postalcode")}
                  />
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="ui clearing divider" />
          {showNetworkError && (
            <span className="network-error">
              {getErrorText("", "networkError", errors)}
            </span>
          )}
          {!saveRef && (
            <ButtonGroup
              buttonStylesPrimary={buttonStylesPrimary}
              buttonStylesSecondary={buttonStylesSecondary}
              finalStep={true}
              loading={saving}
              onLast={onLast}
              onSubmit={this.onSubmit}
              showAccept={false}
            />
          )}
        </section>
      </React.Fragment>
    )
  }
}
