import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { submitForm, getToken } from './actions/FormActions'

import { makeAccount } from './actions/AccountActions'
import {
  getErrorText,
  convertAPIError,
  getDefaultValue,
} from './FormHelpers'

import configure from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'
import * as SharedStyles from './SharedStyles'

import {
  PropertyHelper,
} from './helpers/PropHelpers'

import {
  Field,
  configureVault,
} from './index'
import { Account } from './models'

export class _SignUp extends Component {
  state = {
    loading: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = {};
  }

  static defaultProps = {
    inputStyles: SharedStyles.inputStyles,
    sectionStyle: SharedStyles.sectionStyle,
    buttonStylesPrimary: SharedStyles.buttonStylesPrimary,
    buttonStylesSecondary: SharedStyles.buttonStylesSecondary,
    linkStyling: SharedStyles.linkStyling,
    errorColor: SharedStyles.errorColor,
  }

  static propTypes = {
    styles: PropTypes.object,

    /** `inputStyles` for input fields. `&:focus` state can also be styled. */
    inputStyles: PropTypes.object,

    /** Styles for your primary CTA button. */
    buttonStylesPrimary: PropTypes.object,

    /** Styles for your secondary CTA button.
    ** Eg. Previous, Cancel buttons. */
    buttonStylesSecondary: PropTypes.object,

    /** A callable function to fire when form is complete */
    onComplete: PropTypes.func,

    /** A callable function to fire when cancel event occurs */
    onCancel: PropTypes.func,

    /** A callable function to fire when last event occurs */
    onLast: PropTypes.func,

    /** A callable function to fire when an error occurs on the form. */
    onError: PropTypes.func,

    /** A callable function to fire when an validation error occurs on the form. */
    onValidationError: PropTypes.func,

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** Color of error text, a valid color name or hex. */
    errorColor: PropTypes.string,

    /** Account object allows preconfigured account options to be set */
    account: PropTypes.object,

    /** Optional reference to allow your own save buttons */
    saveRef: PropTypes.shape({ current: PropTypes.any }),

    /** How wide you want the content area of the component. */
    sectionStyle: PropTypes.object,

    /** Deprecated property for controlling the style of the parent component */
    cardWidth: PropTypes.object,

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
    }),

    /** determines if validation errors should be shown */
    showInlineError: PropTypes.bool,

    /** optional prop to disable the network errors */
    showNetworkError: PropTypes.bool,
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
      account,
      inputStyles,
      overrideProps = {},
    } = this.props
    const conf = configure(this.props.apiOptions)

    // eslint-disable-next-line
    const form = VGSCollect.create(conf.vaultId, function (state) { });

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    this.initForm('signup-email',
      () => form.field("#signup-email .field-space", {
        type: "text",
        errorColor: this.props.errorColor,
        name: 'email',
        defaultValue: getDefaultValue(account, 'email', ''),
        placeholder: "you@example.com",
        validations: ["required"],
        css: this.props.inputStyles,
        ...propHelper.overrideCollectProps('signup-email'),
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
      loading: false,
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

  onSubmit = async () => {
    const { form } = this
    const { account, apiOptions } = this.props

    // Clear state
    this.setState({
      account: account,
      errors: false,
      loading: true,
      status: false,
      response: false,
    })

    // get all the values we need to submit the form securely
    const payload = new Account({ ...account })
    const callbacks = this.bindCallbacks()
    const token = await getToken({ ...this.props })

    // delete the instrument so it doesn't try and create an empty one
    delete payload.instrument

    submitForm(
      payload,
      token,
      form,
      callbacks,
      apiOptions,
    )
  }

  render() {
    const { errors, account } = this.state
    const {
      onLast,
      onCancel,
      sectionStyle,
      cardWidth = false,
      overrideProps = {},
      showInlineError = true,
      showNetworkError = true,
    } = this.props

    const propHelper = new PropertyHelper(overrideProps)

    return (
      <section style={!!cardWidth === true ? cardWidth : sectionStyle}>
        <div id="signup-form" >
          <Field
            id="signup-email"
            name="email"
            label="Email"
            defaultValue={getDefaultValue(account, 'email', '')}
            showInlineError={showInlineError}
            errors={errors}
            {...propHelper.overrideFieldProps("signup-email")}
          />
        </div>
        <div className="ui clearing divider"></div>
        {showNetworkError === true &&
          <span className="network-error">{getErrorText('', 'networkError', errors)}</span>
        }
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
      </section >
    )
  }
}

/**
 * We wrap the component so we can apply the ref
 */
export const SignUp = (props) => {
  return (
    <_SignUp ref={props.saveRef} {...props} />
  )
}

SignUp.propTypes = {
  /** Optional reference to allow your own save buttons */
  saveRef: PropTypes.shape({ current: PropTypes.any }),
}

export default SignUp
