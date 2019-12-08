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

    overrideProps: PropTypes.shape({
      css: PropTypes.object, // CSS in JS
      placeholder: PropTypes.string,
      color: PropTypes.string,
      errorColor: PropTypes.string,
      showCardLink: PropTypes.bool, // some fields only
      label: PropTypes.string,
    }),

    /** determines if validation errors should be shown */
    showInlineError: PropTypes.bool,

    /** used to set the current method, overrides internal method state */
    method: PropTypes.oneOf(Object.values(PaymentMethods)),

    /** user defined loading element */
    loadingState: PropTypes.node,

    /** optional prop to disable the network errors */
    showNetworkError: PropTypes.bool,

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
      loading: false,
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

  changeMethod(method) {
    if (this.state.isUpdate === false) {
      this.setState({ method })
    }
  }

  isMethodEnabled = (methodToCheck) => {
    const { method, methods } = this.props

    // explicit method prop takes precedent, then check to see if it is in `methods`
    return methodToCheck === method || _.includes(methods, methodToCheck)
  }

  render() {
    const { method } = this.state
    const {
      onLast,
      onCancel,
      renderCardForms,
      renderAchForms,
      instrument,
    } = this.props

    const isUpdate = isInstrumentUpdate(instrument)

    const subProperties = {
      ...this.props,
      account: this.state.accountModel,
      createAccount: this.state.createAccount,
      instrument: this.state.instrument,
      method: this.state.method,
      isUpdate
    }

    
    return (
      <React.Fragment>
        {this.state.loading === true &&
          <div className="loader-holder">
            {this.props.loadingState}
          </div>
        }
        <section id="revops-payment-method">
          {
            this.isMethodEnabled(PaymentMethods.METHOD_CARD) &&
            <div id="cc-info">
              <CreditCardForm
                ref={(method === 'card' || method === PaymentMethods.METHOD_CARD) ? this.props.saveRef : null}
                account={this.state.accountModel}
                showACHLink={isUpdate === false && this.isMethodEnabled(PaymentMethods.METHOD_ACH)}
                changePaymentMethod={() => this.changeMethod(PaymentMethods.METHOD_ACH)}
                {...subProperties}>
                {renderCardForms}
              </CreditCardForm>
            </div>
          }
          {
            this.isMethodEnabled(PaymentMethods.METHOD_ACH) &&
            <div id="bank-info">
              <AchForm
                ref={method === PaymentMethods.METHOD_ACH ? this.props.saveRef : null}
                hideTogglePlaid={(isUpdate === false && this.isMethodEnabled(PaymentMethods.METHOD_PLAID)) ?
                  false : true
                }
                changePaymentMethod={() => this.changeMethod(PaymentMethods.METHOD_CARD)}
                showCardLink={isUpdate === false && this.isMethodEnabled(PaymentMethods.METHOD_CARD)}
                togglePlaidHandler={() => this.changeMethod(PaymentMethods.METHOD_PLAID)}
                {...subProperties}
              >
                {renderAchForms}
              </AchForm>
            </div>
          }
          {
            this.isMethodEnabled(PaymentMethods.METHOD_PLAID) &&
            <div id="bank-info">
              <PlaidForm
                ref={method === PaymentMethods.METHOD_PLAID ? this.props.saveRef : null}
                changePaymentMethod={() => this.changeMethod(PaymentMethods.METHOD_CARD)}
                togglePlaidHandler={() => this.changeMethod(PaymentMethods.METHOD_ACH)}
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
      </React.Fragment>
    )
  }
}
