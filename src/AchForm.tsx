import React, { Component, CSSProperties } from "react"
import { submitForm, getToken } from "./actions/FormActions"
import {
  convertAPIError,
  getDefaultValue,
  getErrorText,
  isInstrumentUpdate,
} from "./FormHelpers"
import ButtonGroup from "./ButtonGroup"
import * as SharedStyles from "./SharedStyles"
import Field from "./Field"
import TogglePlaid from "./TogglePlaid"
import { PropertyHelper } from "./helpers/PropHelpers"
import Instrument from "./models/Instrument"
import Account from "./models/Account"
import configure from "./client/VaultConfig"
import { logError, logInfo } from "./helpers/Logger"
import { configureVault } from "./index"
import { PaymentMethods, PaymentProps } from "./shared/types"

/*
TODO: figure out what VGSCollect is?
 */

const NUMBER_OF_FIELDS = 7

interface State {
  account: Account
  errors: Record<string, { errorMessages: string[] }>
  loading: boolean
  saving: boolean
  status: string
  response: unknown
}

export default class AchForm extends Component<PaymentProps, State> {
  private form: {
    state: Record<string, unknown>
    field: (selector: unknown, options: Record<string, unknown>) => void
  } | null
  private loadingTimeOut: NodeJS.Timeout | null

  constructor(props) {
    super(props)
    this.state = {
      account: {} as Account,
      errors: {},
      loading: true,
      saving: false,
      status: "",
      response: false,
    }
    this.form = null
    this.loadingTimeOut = null
  }

  componentDidMount() {
    const { apiOptions, loadingState } = this.props
    const conf = configure(apiOptions)

    configureVault(conf, this.initialize)

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
    this.loadingTimeOut && clearTimeout(this.loadingTimeOut)
  }

  componentDidUpdate(prevProps: PaymentProps) {
    const { method } = this.props
    if (prevProps.method !== method) {
      // clean up the timeout if the previous method was this method and is no longer
      if (
        prevProps.method === PaymentMethods.METHOD_ACH &&
        this.loadingTimeOut
      ) {
        clearTimeout(this.loadingTimeOut)
      }
      this.setState({ loading: false })
    }
  }

  isFormFieldCreated(field) {
    return !!this.form?.state?.[field]
  }

  createFormField(fieldSelector, field, defaultValue, options = {}) {
    const {
      inputStyles = SharedStyles.inputStyles,
      errorColor = SharedStyles.errorColor,
    } = this.props
    if (!this.isFormFieldCreated(field)) {
      this.form?.field(fieldSelector, {
        name: field,
        defaultValue: defaultValue,
        css: inputStyles,
        errorColor,
        ...options,
      })
    }
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
      inputStyles = SharedStyles.inputStyles,
      overrideProps = {},
      apiOptions,
    } = this.props

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    if (!this.form) {
      const conf = configure(apiOptions)

      // eslint-disable-next-line
      this.form = VGSCollect.create(conf.vaultId, state =>
        this.finishedLoading(state),
      )
    }
    const prefix = createAccount ? "instrument." : ""

    this.initForm("bank-name", () =>
      this.createFormField(
        "#bank-name .field-space",
        prefix + "bank_name",
        getDefaultValue(instrument, "bankName", ""),
        {
          type: "text",
          placeholder: "Name of Bank Institution",
          validations: ["required"],
          ...propHelper.overrideCollectProps("bank-name"),
        },
      ),
    )

    this.initForm("bank-postalcode", () =>
      this.createFormField(
        "#bank-postalcode .field-space",
        prefix + "postal_code",
        getDefaultValue(instrument, "postalCode", ""),
        {
          type: "zip-code",
          placeholder: "Postal code",
          validations: ["required"],
          ...propHelper.overrideCollectProps("bank-postalcode"),
        },
      ),
    )

    this.initForm("bank-account-country", () =>
      this.createFormField(
        "#bank-account-country .field-space",
        prefix + "country",
        getDefaultValue(instrument, "bankCountry", "USA"),
        {
          type: "dropdown",
          validations: ["required"],
          options: [
            { value: "USA", text: "United States of America" },
            { value: "Canada", text: "Canada" },
            { value: "Mexico", text: "Mexico" },
          ],
          ...propHelper.overrideCollectProps("bank-account-country"),
        },
      ),
    )

    this.initForm("bank-holder-name", () =>
      this.createFormField(
        "#bank-holder-name .field-space",
        prefix + "holder_name",
        getDefaultValue(instrument, "holderName", ""),
        {
          type: "text",
          placeholder: "Name on the account",
          validations: ["required"],
          ...propHelper.overrideCollectProps("bank-holder-name"),
        },
      ),
    )

    this.initForm("bank-account-type", () =>
      this.createFormField(
        "#bank-account-type .field-space",
        prefix + "bank_account_holder_type",
        getDefaultValue(instrument, "bankAccountHolderType", "company"),
        {
          type: "dropdown",
          validations: ["required"],
          options: [
            { value: "company", text: "Company" },
            { value: "individual", text: "Individual" },
          ],
          ...propHelper.overrideCollectProps("bank-account-type"),
        },
      ),
    )

    this.initForm("bank-account-number", () =>
      this.createFormField(
        "#bank-account-number .field-space",
        prefix + "account_number",
        getDefaultValue(instrument, "accountNumber", ""),
        {
          type: "text",
          placeholder: "Enter bank account number",
          validations: ["required"],
          ...propHelper.overrideCollectProps("bank-account-number"),
        },
      ),
    )

    this.initForm("bank-routing-number", () =>
      this.createFormField(
        "#bank-routing-number .field-space",
        prefix + "routing_number",
        getDefaultValue(instrument, "routingNumber", ""),
        {
          type: "text",
          placeholder: "Enter bank routing number",
          validations: ["required"],
          ...propHelper.overrideCollectProps("bank-routing-number"),
        },
      ),
    )
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

  onComplete = response => {
    const { onComplete } = this.props
    this.setState({
      saving: false,
    })
    onComplete?.(response)
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

  getPayload = () => {
    const { createAccount, account, instrument } = this.props

    // non PCI values are added to the information from the secure fields
    let payload: Instrument | Account = new Instrument({
      ...instrument,
      businessAccountId: account.id,
      isIndividual: false,
      isBusiness: true,
      method: "ach",
    })

    // if we are also making an account, nest the instrument in the account payload
    if (createAccount) {
      payload = new Account({
        ...account, // add in the account information on the payload
        instrument: {
          ...payload,
        } as Instrument,
      })
    }
    return payload
  }

  onSubmit = async () => {
    const { form } = this
    const { account, apiOptions, instrument, saveRef } = this.props
    const isUpdate = isInstrumentUpdate(instrument)

    // Clear state
    this.setState({
      account: (account as unknown) as Account,
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

  creditCardLink = () => {
    const {
      changePaymentMethod,
      linkStyling = SharedStyles.linkStyling,
    } = this.props
    return (
      <a
        className="pay-by-cc-link"
        onClick={changePaymentMethod}
        style={linkStyling}>
        Pay by credit card instead
      </a>
    )
  }

  getCreditCardLink = () => {
    const {
      showCardLink = true,
      creditCardLink = this.creditCardLink(),
    } = this.props

    if (!showCardLink) {
      return null
    }
    return creditCardLink
  }

  getPlaidLink = () => {
    const { hideTogglePlaid = false, plaidLink = this.plaidLink() } = this.props

    if (hideTogglePlaid) {
      return null
    }
    return plaidLink
  }

  plaidLink = () => {
    const { linkStyling, togglePlaidHandler } = this.props
    return (
      <TogglePlaid
        linkStyling={linkStyling}
        togglePlaidHandler={togglePlaidHandler}
      />
    )
  }

  isThisMethod = () => {
    const { method } = this.props
    return method === PaymentMethods.METHOD_ACH
  }

  finishedLoading = formState => {
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

  getSectionDisplayProps = (): CSSProperties => {
    const { loading } = this.state
    const {
      loadingState,
      sectionStyle = SharedStyles.sectionStyle,
      cardWidth,
    } = this.props

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

  render() {
    const { errors, loading } = this.state
    const {
      onLast,
      children,
      overrideProps = {},
      showInlineError = true,
      showNetworkError = true,
      isUpdate,
      achLabel = <label className="ach-label">Paying by ACH</label>,
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
          {achLabel}
          {this.getCreditCardLink()}
          <div className="form-container" id="ach-form">
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
                  id="bank-name"
                  label="Bank Name"
                  name="bankName"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-name")}
                />

                <Field
                  errors={errors}
                  id="bank-holder-name"
                  label="Account Holder Name"
                  name="holderName"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-holder-name")}
                />

                <Field
                  errors={errors}
                  id="bank-postalcode"
                  label="Postal Code"
                  name="postalCode"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-postalcode")}
                />

                <Field
                  errors={errors}
                  id="bank-account-country"
                  label="Bank Country"
                  name="country"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-account-country")}
                />

                <Field
                  errors={errors}
                  id="bank-account-type"
                  label="Account Type"
                  name="bankAccountHolderType"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-account-type")}
                />

                <Field
                  errors={errors}
                  id="bank-routing-number"
                  label="Routing Number"
                  name="routingNumber"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-routing-number")}
                />

                <Field
                  errors={errors}
                  id="bank-account-number"
                  label="Account Number"
                  name="accountNumber"
                  showInlineError={showInlineError}
                  {...propHelper.overrideFieldProps("bank-account-number")}
                />
              </React.Fragment>
            )}
          </div>
          <div className="ui clearing divider" />
          {showNetworkError && (
            <span className="network-error">
              {getErrorText("", "networkError", errors)}
            </span>
          )}
          {this.getPlaidLink()}
          {!saveRef && (
            <ButtonGroup
              //@ts-ignore
              buttonStylesPrimary={buttonStylesPrimary}
              //@ts-ignore
              buttonStylesSecondary={buttonStylesSecondary}
              finalStep={true}
              onLast={onLast}
              onSubmit={this.onSubmit}
            />
          )}
        </section>
      </React.Fragment>
    )
  }
}
