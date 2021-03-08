import React, { Component } from "react"
import { submitForm, getToken } from "./actions/FormActions"
import { makeAccount } from "./actions/AccountActions"
import { getErrorText, convertAPIError, getDefaultValue } from "./FormHelpers"
import configure from "./client/VaultConfig"
import ButtonGroup from "./ButtonGroup"
import * as SharedStyles from "./SharedStyles"
import { PropertyHelper } from "./helpers/PropHelpers"
import Field from "./Field"
import { configureVault } from "./index"

import { PaymentProps } from "./shared/types"
import Account from "./models/Account"

type Props = PaymentProps

interface State {
  errors: Record<string, unknown>
  loading: boolean
  account: Account
  status: string
  response: unknown
}

export class _SignUp extends Component<Props, State> {
  private form: {
    state: Record<string, unknown>
    field: (selector: unknown, options: Record<string, unknown>) => void
  } | null

  state = {
    loading: false,
    errors: {},
    account: {} as Account,
    status: "",
    response: false,
  }

  constructor(props) {
    super(props)
    this.form = null
  }

  componentDidMount() {
    const { apiOptions } = this.props
    configureVault(apiOptions, this.initialize)
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props
    if (!!prevProps.account && !!account && prevProps.account !== account) {
      this.updateAccount(account)
    }
  }

  updateAccount(account) {
    this.setAccount(account)
  }

  setAccount = account => {
    this.setState({
      account: makeAccount({
        ...account,
      }),
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
      apiOptions,
      errorColor,
    } = this.props
    const conf = configure(apiOptions)

    // eslint-disable-next-line
    const form = VGSCollect.create(conf.vaultId, function (state) {})

    const propHelper = new PropertyHelper(overrideProps, inputStyles)

    this.initForm("signup-email", () =>
      form.field("#signup-email .field-space", {
        type: "text",
        errorColor: errorColor,
        name: "email",
        defaultValue: getDefaultValue(account, "email", ""),
        placeholder: "you@example.com",
        validations: ["required"],
        css: inputStyles,
        ...propHelper.overrideCollectProps("signup-email"),
      }),
    )

    this.form = form
  }

  onComplete = response => {
    const { onComplete } = this.props

    this.setState({
      loading: false,
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
      status: error.http_status,
      response: error,
      loading: false,
    })

    onError?.(error)
  }

  onValidationError = errors => {
    const { onValidationError } = this.props
    this.setState({
      errors: {
        ...errors,
      },
      loading: false,
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

  onSubmit = async () => {
    const { form } = this
    const { account, apiOptions } = this.props

    // Clear state
    this.setState({
      account: (account as unknown) as Account,
      errors: {},
      loading: true,
      status: "",
      response: false,
    })

    // get all the values we need to submit the form securely
    const payload = new Account({ ...account })
    const callbacks = this.bindCallbacks()
    const token = await getToken({ ...this.props })

    // delete the instrument so it doesn't try and create an empty one
    delete payload.instrument

    submitForm(payload, token, form, callbacks, apiOptions)
  }

  render() {
    const { errors, loading } = this.state
    const {
      onLast,
      sectionStyle,
      cardWidth = false,
      overrideProps = {},
      showInlineError = true,
      showNetworkError = true,
      saveRef,
      buttonStylesPrimary = SharedStyles.buttonStylesPrimary,
      buttonStylesSecondary = SharedStyles.buttonStylesSecondary,
    } = this.props

    const propHelper = new PropertyHelper(overrideProps)

    return (
      <section style={cardWidth ? cardWidth : sectionStyle}>
        <div id="signup-form">
          <Field
            errors={errors}
            id="signup-email"
            label="Email"
            name="email"
            showInlineError={showInlineError}
            {...propHelper.overrideFieldProps("signup-email")}
          />
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
            loading={loading}
            onLast={onLast}
            onSubmit={this.onSubmit}
            showAccept={false}
          />
        )}
      </section>
    )
  }
}

/**
 * We wrap the component so we can apply the ref
 */
export const SignUp = props => {
  return <_SignUp ref={props.saveRef} {...props} />
}

export default SignUp
