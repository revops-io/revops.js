import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { logError } from './helpers/Logger'

import { makeAccount } from './actions/AccountActions'

import {
  CreditCardForm,
  PlaidForm,
  AchForm,
} from './index'

import { ButtonGroup } from './ButtonGroup'
import { Instrument } from './models'

import { getToken } from './actions/FormActions'

import {
  isInstrumentUpdate,
} from './FormHelpers'

import _ from 'lodash'

export const PaymentMethods = {
  METHOD_ACH: 'ach',
  METHOD_CARD: 'credit-card',
  METHOD_PLAID: 'plaid',
}

export default class PaymentMethod extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string,

    /** PaymentMethod can have custom styles,
     ** these styles are passed onto children components */

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
    sectionStyle: PropTypes.number,

    /** Deprecated property for controlling the style of the parent component */
    cardWidth: PropTypes.object,

    /** Color of error text, a valid color name or hex. */
    errorColor: PropTypes.string,

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

    /** A callable function to fire when an validation error occurs on the form. */
    onValidationError: PropTypes.func,

    /** Toggle for showing/hiding plaid info */
    togglePlaidHandler: PropTypes.func,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),

    /** Account object allows preconfigured account options to be set */
    account: PropTypes.object,

    /** Instrument object allows preconfigured account options to be set */
    instrument: PropTypes.object,

    /** Render customized Card forms */
    renderCardForms: PropTypes.func,

    /** Render customized ACH forms */
    renderAchForms: PropTypes.func,

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** used to set the current method, overrides internal method state */
    method: PropTypes.oneOf(Object.values(PaymentMethods)),

    /** A callable function to fire when the PaymentMethod initializes all fields */
    onLoad: PropTypes.func,

    /** loadingState */
    loadingState: PropTypes.node

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
      loading: true,
      isUpdate: false,
      method: !!props.method === true
        ? props.method
        : !!props.defaultMethod === true
          ? props.defaultMethod
          : props.methods[0] || PaymentMethods.METHOD_CARD
    }
    this.form = null
  }

  validateMethods(props) {
    if (!!props.defaultMethod === false) {
      return
    }

    let method = props.methods.find(
      m => m === props.defaultMethod
    )

    if (!method) {
      throw new Error('[PaymentMethod.props.defaultMethod missing from `PaymentMethod.props.methods`]')
    }
  }

  async componentDidMount() {
    const {
      account,
      instrument,
      apiOptions = {}
    } = this.props

    const isUpdate = isInstrumentUpdate(instrument)

    // if we don't have a RevOps id, indicate we need to make the account
    if (!!account.id === false) {
      this.setState({ createAccount: true })
    }

    this.setAccount(account)

    if (!!instrument === false) {
      this.setState({ instrument: new Instrument({}) })
    } else {
      this.setState({ instrument: new Instrument(instrument) })
    }

    if (isUpdate === true) {
      this.setState({ method: "", loading: true, isUpdate: true })
      if (!!account.id === true && !!instrument.id === true) {
        const token = await getToken(this.props)
        const fetchedInstrument = await Instrument.fetchInstrument(account.id, instrument.id, token, apiOptions)
        this.setupInstrument(fetchedInstrument)
      } else {
        logError("Unable to fetch instruments", apiOptions.loggingLevel)
      }
    }
  }

  // Helper to set the PaymentMethods's method to the method of the incoming instrument
  setupInstrument = (fetchedInstrument) => {
    const { instrument = {}, apiOptions = {} } = this.props

    if (!!fetchedInstrument === false || !!fetchedInstrument.method === false) {
      logError("Unable to determine instruments method", apiOptions.loggingLevel)
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
    if (
      !!prevProps.account !== false &&
      !!account !== false &&
      prevProps.account !== account
    ) {
      this.updateAccount(this.props.account)
    }

    if (
      !!prevProps.instrument !== false &&
      !!instrument !== false &&
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

  setAccount = (account) => {
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
    if (this.state.isUpdate === false) {
      this.setState({ method: PaymentMethods.METHOD_ACH })
    }
  }

  changePaymentMethodCC() {
    if (this.state.isUpdate === false) {
      this.setState({ method: PaymentMethods.METHOD_CARD })
    }
  }

  togglePlaidHandler = () => {
    if (this.state.isUpdate === false) {
      this.setState({
        method: PaymentMethods.METHOD_PLAID,
      })
    }
  }

  isMethodEnabled = (methodToCheck) => {
    const { method, methods } = this.props

    return methodToCheck === method || _.includes(methods, methodToCheck)
  }

  endLoading = () => {
    const { onLoad } = this.props

    if(this.state.loading === true){
      this.setState({ loading: false })
  
      if (onLoad !== false && typeof (onLoad) === 'function') {
        onLoad()
      }
    }
  }

  isDoneLoading = (formState = {}) => {

    if (this.state.method === PaymentMethods.METHOD_CARD) {
      if (Object.keys(formState).length === 5) {
        this.endLoading()
      }
    }

    if (this.state.method === PaymentMethods.METHOD_ACH) {
      if (Object.keys(formState).length === 7) {
        this.endLoading()
      }
    }

    if (this.state.method === PaymentMethods.METHOD_PLAID) {
      this.endLoading()
    }

  }

  isVisible = (method) => {
    const { loading } = this.state

    if (loading === true || method !== this.state.method) {
      return { display: "none" }
    }
  }

  render() {
    const { method } = this.state
    const {
      onLast,
      onCancel,
      renderCardForms,
      renderAchForms,
    } = this.props

    const subProperties = {
      ...this.props,
      account: this.state.accountModel,
      createAccount: this.state.createAccount,
      instrument: this.state.instrument,
      finishedLoading: (state) => this.isDoneLoading(state)
    }

    return (
      <React.Fragment>
        <section className="" style={{ display: this.state.loading === true ? "" : "" }}>
          <br />
          {
            this.isMethodEnabled(PaymentMethods.METHOD_CARD) &&
            <div id="cc-info" style={this.isVisible(PaymentMethods.METHOD_CARD)}>
              <CreditCardForm
                ref={(method === 'card' || method === PaymentMethods.METHOD_CARD) ? this.props.saveRef : null}
                account={this.state.accountModel}
                setAccount={(accountProperty, field, value) =>
                  this.setAccount(accountProperty, field, value)
                }
                showACHLink={this.isMethodEnabled(PaymentMethods.METHOD_ACH)}
                changePaymentMethod={() => this.changePaymentMethodACH()}
                {...subProperties}
              >
                {renderCardForms}
              </CreditCardForm>
            </div>
          }
          {
            this.isMethodEnabled(PaymentMethods.METHOD_ACH) &&
            <div id="bank-info" style={this.isVisible(PaymentMethods.METHOD_ACH)}>
              <AchForm
                ref={method === PaymentMethods.METHOD_ACH ? this.props.saveRef : null}
                hideTogglePlaid={this.isMethodEnabled(PaymentMethods.METHOD_PLAID) ?
                  false : true
                }
                setAccount={(accountProperty, field, value) =>
                  this.setAccount(accountProperty, field, value)
                }
                changePaymentMethod={() => this.changePaymentMethodCC()}
                showCardLink={this.isMethodEnabled(PaymentMethods.METHOD_CARD)}
                togglePlaidHandler={this.togglePlaidHandler}
                {...subProperties}
              >
                {renderAchForms}
              </AchForm>
            </div>
          }
          {
            this.isMethodEnabled(PaymentMethods.METHOD_PLAID) &&
            <div id="bank-info" style={this.isVisible(PaymentMethods.METHOD_PLAID)}>
              <PlaidForm
                ref={method === PaymentMethods.METHOD_PLAID ? this.props.saveRef : null}
                setAccount={(accountProperty, field, value) =>
                  this.setAccount(accountProperty, field, value)
                }
                changePaymentMethod={() => this.changePaymentMethodCC()}
                togglePlaidHandler={this.togglePlaidHandler}
                {...subProperties}
              />
            </div>
          }

          {method === false && <div className="ui clearing divider"></div>}
          {method === false &&
            <ButtonGroup
              showAccept={false}
              onLast={onLast}
              onCancel={onCancel}
              hideNext={true}
              buttonStylesPrimary={this.props.buttonStylesPrimary}
              buttonStylesSecondary={this.props.buttonStylesSecondary}
            />
          }
        </section>
        {this.state.loading === true &&
          <React.Fragment>
            {this.props.loadingState}
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}
