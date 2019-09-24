import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'

import {
  CreditCardForm,
  PlaidForm,
  AchForm,
} from './index'

import { ButtonGroup } from './ButtonGroup'

export const PaymentMethods = {
  METHOD_ACH: 'ach',
  METHOD_CARD: 'card',
  METHOD_PLAID: 'plaid',
}

export default class PaymentMethod extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

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
    cardWidth: PropTypes.number,

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

    /** Render customized Card forms */
    renderCardForms: PropTypes.func,

    /** Render customized ACH forms */
    renderAchForms: PropTypes.func,

    /** Optional API Options **/
    apiOptions: PropTypes.object,
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

      /** if a default method isn't provided, default to first method. */
      method: !!this.props.defaultMethod === false?
        this.props.methods[0] : this.props.defaultMethod,
    }
    this.form = null
  }

  validateMethods(props) {
    if(!!props.defaultMethod === false) {
      return
    }

    let method = props.methods.find(
      m => m === props.defaultMethod
    )

    if (!method) {
      throw new Error('[PaymentMethod.props.defaultMethod missing from `PaymentMethod.props.methods`]')
    }

  }

  componentDidMount() {
    const { account } = this.props
    this.setAccount(account)
  }

  componentDidUpdate(prevProps, prevState) {
    if(!!prevProps.account !== false &&
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
    this.setState({ method: PaymentMethods.METHOD_ACH })
  }

  changePaymentMethodCC() {
    this.setState({ method: PaymentMethods.METHOD_CARD })
  }

  togglePlaidHandler = () => {
    this.setState({
      method: this.state.method === PaymentMethods.METHOD_ACH?
        PaymentMethods.METHOD_PLAID : PaymentMethods.METHOD_ACH
    })
  }

  isPlaidEnabled = () => {
    let plaidMethod = this.props.methods.find(
      m => m === PaymentMethods.METHOD_PLAID
    )
    return !!plaidMethod
  }

  isACHEnabled = () => {
    let achMethod = this.props.methods.find(
      m => m === PaymentMethods.METHOD_ACH
    )
    return !!achMethod
  }

  isCardEnabled = () => {
    let cardMethod = this.props.methods.find(
      m => m === PaymentMethods.METHOD_CARD
    )
    return !!cardMethod
  }

  render() {
    const { method } = this.state
    const {
      onLast,
      onCancel,
      renderCardForms,
      renderAchForms,
    } = this.props

    let subProperties = {
      ...this.props,
      account: this.state.accountModel,
    }

    return (
      <section className="">
        <br />
        {
          method === PaymentMethods.METHOD_CARD &&
            <div id="cc-info">
              <CreditCardForm
                ref={this.props.saveRef}
                account={this.state.accountModel}
                setAccount={(accountProperty, field, value) =>
                  this.setAccount(accountProperty, field, value)
                }
                showACHLink={this.isACHEnabled()}
                changePaymentMethod={() => this.changePaymentMethodACH()}
                {...subProperties}
              >
                {renderCardForms}
              </CreditCardForm>
            </div>
        }
        {
          method === PaymentMethods.METHOD_ACH &&
            <div id="bank-info">
              <AchForm
                ref={this.props.saveRef}
                hideTogglePlaid={this.isPlaidEnabled() === true?
                  false: true
                }
                setAccount={(accountProperty, field, value) =>
                  this.setAccount(accountProperty, field, value)
                }
                changePaymentMethod={() => this.changePaymentMethodCC()}
                showCardLink={this.isCardEnabled()}
                togglePlaidHandler={this.togglePlaidHandler}
                {...subProperties}
              >
                {renderAchForms}
              </AchForm>
            </div>
        }
        {
          method === PaymentMethods.METHOD_PLAID &&
            <div id="bank-info">
              <PlaidForm
                ref={this.props.saveRef}
                account={this.state.accountModel}
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
    )
  }
}
