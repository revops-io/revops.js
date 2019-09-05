import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'
import { inputStyles } from './SharedStyles'

const defaultStyles = {
  border: 'none',
  background: 'rgba(215, 224, 235, 0.18);',
  height: '40px',
  lineHeight: 'normal',
  padding: '0 10px',
  color: 'white',
  fontSize: '12px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  letterSpacing: '.7px',
  '&::placeholder': {
    color: 'white',
    fontSize: '12px',
    opacity: '.5',
  },
};

export class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = {};
  }

  static propTypes = {
    styles: PropTypes.object,
    onComplete: PropTypes.func,
    onNext: PropTypes.func,
    onCancel: PropTypes.func,
    onLast: PropTypes.func,
    onError: PropTypes.func,
  }

  componentDidMount() {
    const script = document.createElement("script")

    script.src = REVOPS_VAULT_COLLECT
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const { accountModel } = this.props
    let form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    form.field("#signup-email .field-space", {
      type: "text",
      name: "email",
      defaultValue: !!accountModel.email === true
        ? accountModel.email
        : "",
      placeholder: "johndoe@example.com",
      validations: ["required"],
      css: inputStyles
    });

    form.field("#signup-password .field-space", {
      type: "password",
      name: "password",
      placeholder: "**********",
      validations: ["required"],
      css: inputStyles
    });

    this.form = form
  }

  onSubmit = () => {
    const { form } = this
    const { onNext, accountModel, onError, onComplete = false } = this.props

    accountModel.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
  }

  render() {
    return (
      <section>
        <form id="contact-form" className="ui form">
          <div id="signup-email" className="field">
            <label>Email</label>
            <span className="field-space"></span>
          </div>

          <div id="signup-password" className="field">
            <label>Password</label>
            <span className="field-space"></span>
          </div>

        </form>
        <div className="ui clearing divider"></div>
        <ButtonGroup
          onSubmit={this.onSubmit}
          hidePrevious={true}
        />
      </section>
    )
  }
}

export default SignUp
