import React, { Component, ReactNode } from "react"
import { logError } from "./helpers/Logger"
import { makeAccount } from "./actions/AccountActions"
import ButtonGroup from "./ButtonGroup"
import Instrument from "./models/Instrument"
import { getToken } from "./actions/FormActions"
import { isInstrumentUpdate } from "./FormHelpers"

import _ from "lodash"
import { PaymentMethods, PaymentProps } from "./shared/types"
import Account from "./models/Account"
import CreditCardForm from "./CreditCardForm"
import AchForm from "./AchForm"
import PlaidForm from "./PlaidForm"

interface Props extends PaymentProps {
  methods: PaymentMethod[]
  defaultMethod: PaymentMethod
  renderCardForms: ReactNode
  showNetworkError: boolean
}

interface State {
  account: Account
  errors: Record<string, { errorMessages: string[] }>
  loading: boolean
  saving: boolean
  status: string
  response: unknown
  createAccount?: boolean
  instrument?: Instrument
  method: PaymentMethods | null
  isUpdate: boolean
}

export default class PaymentMethod extends Component<Props, State> {
  private form: {
    state: Record<string, unknown>
    field: (selector: unknown, options: Record<string, unknown>) => void
  } | null
  constructor(props) {
    super(props)

    this.validateMethods(props)

    this.state = {
      errors: {},
      loading: false,
      isUpdate: false,
      method: props.method
        ? props.method
        : props.defaultMethod
        ? props.defaultMethod
        : props.methods[0] || PaymentMethods.METHOD_CARD,
      account: {} as Account,
      saving: false,
      response: false,
      status: "",
    }
    this.form = null
  }

  validateMethods(props) {
    if (!props.defaultMethod) {
      return
    }

    const method = props.methods.find(m => m === props.defaultMethod)

    if (!method) {
      throw new Error(
        "[PaymentMethod.props.defaultMethod missing from `PaymentMethod.props.methods`]",
      )
    }
  }

  async componentDidMount() {
    const { account, instrument, apiOptions } = this.props

    const isUpdate = isInstrumentUpdate(instrument)

    // if we don't have a RevOps id, indicate we need to make the account
    if (!account.id) {
      this.setState({ createAccount: true })
    }

    this.setAccount(account)

    if (!instrument) {
      this.setState({ instrument: new Instrument({}) })
    } else {
      this.setState({ instrument: new Instrument(instrument) })
    }

    if (isUpdate) {
      this.setState({ method: null, loading: true, isUpdate: true })
      if (!!account.id && !!instrument.id) {
        const token = await getToken(this.props)
        const fetchedInstrument = await Instrument.fetchInstrument(
          account.id,
          instrument.id,
          token,
        )
        this.setupInstrument(fetchedInstrument)
      } else {
        logError("Unable to fetch instruments", apiOptions.loggingLevel)
      }
    }
  }

  // Helper to set the PaymentMethods's method to the method of the incoming instrument
  setupInstrument = fetchedInstrument => {
    const { instrument = {}, apiOptions } = this.props

    if (!fetchedInstrument || !fetchedInstrument.method) {
      logError(
        "Unable to determine instruments method",
        apiOptions.loggingLevel,
      )
      return
    }
    this.setState({
      instrument, // <== this.props.instrument
      // use the fetched instrument to choose correct component
      method: fetchedInstrument.method,
      loading: false,
    })
  }

  componentDidUpdate(prevProps) {
    const { account, instrument, method } = this.props
    if (!!prevProps.account && !!account && prevProps.account !== account) {
      this.updateAccount(account)
    }

    if (
      !!prevProps.instrument &&
      !!instrument &&
      prevProps.instrument !== instrument
    ) {
      this.setState({ instrument: new Instrument(instrument) })
    }

    if (prevProps.method !== method) {
      this.setState({ method })
    }
  }

  updateAccount(account) {
    this.setAccount(account)
  }

  setAccount = account => {
    this.setState({
      account: makeAccount({
        ...account,
      }) as Account,
    })
  }

  changeMethod(method) {
    if (!this.state.isUpdate) {
      this.setState({ method })
    }
  }

  isMethodEnabled = methodToCheck => {
    const { method, methods } = this.props

    // explicit method prop takes precedent, then check to see if it is in `methods`
    return methodToCheck === method || _.includes(methods, methodToCheck)
  }

  render() {
    const { method, loading, account } = this.state
    const {
      onLast,
      renderCardForms,
      renderAchForms,
      instrument,
      loadingState,
      saveRef,
    } = this.props

    const isUpdate = isInstrumentUpdate(instrument)

    const subProperties = {
      ...this.props,
      account: this.state.accountModel,
      createAccount: this.state.createAccount,
      instrument: this.state.instrument,
      method: this.state.method,
      isUpdate,
    }

    return (
      <React.Fragment>
        {loading && <div className="loader-holder">{loadingState}</div>}
        <section id="revops-payment-method">
          {this.isMethodEnabled(PaymentMethods.METHOD_CARD) && (
            <div id="cc-info">
              <CreditCardForm
                {...subProperties}
                changePaymentMethod={() =>
                  this.changeMethod(PaymentMethods.METHOD_ACH)
                }
                ref={method === PaymentMethods.METHOD_CARD ? saveRef : null}
                showACHLink={
                  !isUpdate && this.isMethodEnabled(PaymentMethods.METHOD_ACH)
                }>
                {renderCardForms}
              </CreditCardForm>
            </div>
          )}
          {this.isMethodEnabled(PaymentMethods.METHOD_ACH) && (
            <div id="bank-info">
              <AchForm
                changePaymentMethod={() =>
                  this.changeMethod(PaymentMethods.METHOD_CARD)
                }
                hideTogglePlaid={
                  !(
                    isUpdate === false &&
                    this.isMethodEnabled(PaymentMethods.METHOD_PLAID)
                  )
                }
                ref={
                  method === PaymentMethods.METHOD_ACH
                    ? this.props.saveRef
                    : null
                }
                showCardLink={
                  isUpdate === false &&
                  this.isMethodEnabled(PaymentMethods.METHOD_CARD)
                }
                togglePlaidHandler={() =>
                  this.changeMethod(PaymentMethods.METHOD_PLAID)
                }
                {...subProperties}>
                {renderAchForms}
              </AchForm>
            </div>
          )}
          {this.isMethodEnabled(PaymentMethods.METHOD_PLAID) && (
            <div id="bank-info">
              <PlaidForm
                changePaymentMethod={() =>
                  this.changeMethod(PaymentMethods.METHOD_CARD)
                }
                ref={
                  method === PaymentMethods.METHOD_PLAID
                    ? this.props.saveRef
                    : null
                }
                togglePlaidHandler={() =>
                  this.changeMethod(PaymentMethods.METHOD_ACH)
                }
                {...subProperties}
              />
            </div>
          )}

          {method === false && <div className="ui clearing divider"></div>}
          {method === false && (
            <ButtonGroup
              buttonStylesPrimary={this.props.buttonStylesPrimary}
              buttonStylesSecondary={this.props.buttonStylesSecondary}
              hideNext={true}
              onLast={onLast}
              showAccept={false}
            />
          )}
        </section>
      </React.Fragment>
    )
  }
}
