import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  getErrorText,
  getClassName,
  getDefaultValue,
} from './FormHelpers'

import { makeAccount } from './actions/AccountActions'
import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'

import {
  TogglePlaid,
  configureVault,
  configurePlaid,
  jsDependencies,
  addJS,
} from './index'

import configure from './client/VaultConfig'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  padding: "0 16px"
};

export default class PlaidForm extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

    /** An AchForm can have custom styles */
    styles: PropTypes.object,

    /** Account object allows preconfigured account options to be set */
    account: PropTypes.object,

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

    /** Toggle for showing/hiding plaid info */
    togglePlaidHandler: PropTypes.func,

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

    /** Internal Use-only: Environment string: local, staging, production */
    env: PropTypes.string,

    /** Internal Use-only: Change payment method swaps current payment method state */
    changePaymentMethod: PropTypes.func,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),
  }

  static defaultProps = {
    styles: {},
    inputStyles: SharedStyles.inputStyles,
    cardWidth: SharedStyles.cardWidth,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
  }

  state = {
    account: {},
    errors: false,
    plaidLinkPublicToken: false,
    plaidAccountId: false,
    loaded: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = null
  }

  componentDidMount() {
    jsDependencies.forEach(js => addJS(js))
    configureVault(
      this.props.env,
      this.initialize,
    )

    configurePlaid(
      this.props.env,
      (plaidLink) => {
        this.onPlaidLoad(plaidLink)
      },
      this.onPlaidSelect,
    )
  }


  onPlaidLoad = (plaidLink) => {
    this.plaidLink = plaidLink
  }

  onPlaidSelect(publicToken, metadata) {
    this.setState({
      plaidLinkPublicToken: publicToken,
      plaidAccountId: metadata.account_id,
      plaidMetadata: metadata,
    })
  }

  isFormFieldCreated(field) {
    return (!!this.form === true &&
      !!this.form.state === true &&
      !!this.form.state[field] === true
    )
  }

  createFormField(fieldSelector, field, defaultValue, options = {}) {
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    if(this.isFormFieldCreated(field) === false) {
      this.form.field(fieldSelector, {
        name: field,
        defaultValue: defaultValue,
        css: this.props.inputStyles,
        errorColor: styles.errorColor,
        ...options,
      })
    }
  }

  getBankName = () => {
    const { account } = this.props

    let defaultBankName = getDefaultValue(account, 'bankName', '')

    if(!!this.state.plaidMetadata !== false &&
      !!this.state.plaidMetadata.institution !== false) {
        defaultBankName = this.state.plaidMetadata.institution.name
    }

    return defaultBankName
  }

  initialize = () => {
    if(!!this.form === false) {
      // eslint-disable-next-line
      this.form = VGSCollect.create(configure(this.props.env).vaultId, function (state) { });
    }

    this.createFormField(
      "#bank-name .field-space",
      'billingPreferences.bankName',
      this.getBankName(),
      {
        type: "text",
        readOnly: 'readOnly',
        placeholder: "Name of Bank Institution",
        validations: ["required"],
      }
    )
  }

  onError = ({errors}) => {
    const { onError } = this.props
    this.setState({
      errors
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
        plaidLinkPublicToken: this.state.plaidLinkPublicToken,
        plaidAccountId: this.state.plaidAccountId,
        paymentMethod: "plaid",
      }
    })

    this.setState({
      account: account,
      errors: false,
      loading: true,
    })

    const onError = this.onError

    // Attach plaid state to model on submit.


    account.saveWithSecureForm(
      this.props.publicKey,
      form,
      {
        onError,
        onComplete,
        onNext
      }
    )
  }

  openPlaid = () => {
    this.plaidLink.open()
  }

  render() {
    const { errors, } = this.state
    const { onLast, onCancel, } = this.props
    return (
      <section style={this.props.cardWidth}>
        <label className="h3">Paying by ACH</label>
        <a
          className="pay-by-cc-link"
          onClick={this.props.changePaymentMethod}>
          Pay by credit card instead
        </a>
        <button
          className="ui button big centered single"
          style={this.props.buttonStylesPrimary}
          onClick={() => this.openPlaid()}>
          Sync your bank account
        </button>
        {!!this.state.plaidMetadata !== false &&
          <form id="content-form" className="ui form">
            <div id="bank-name"
              className={
               getClassName(
                 "field",
                 "billingPreferences.bankName",
                 errors
               )
             }>
              <label>Bank Name</label>
              <span className="field-space"></span>
              <span>{getErrorText('Bank name', 'billingPreferences.bankName', errors)}</span>
            </div>

            <div className="ui info message">
              <div className="content">
                <i aria-hidden="true" className="university icon"></i>
                <span>{this.state.plaidMetadata.account.name} XXXXXXXXX {this.state.plaidMetadata.account.mask}</span>&nbsp;
                <span>{this.state.plaidMetadata.account.subtype}</span>&nbsp;
              </div>
            </div>
          </form>
        }

        <TogglePlaid
          style={this.props.linkStyling}
          toggleHandler={this.props.togglePlaidHandler}
        />

        <div className="ui clearing divider"></div>
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
