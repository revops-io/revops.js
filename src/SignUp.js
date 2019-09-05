import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

import { ButtonGroup } from './ButtonGroup'

import './styles.css'

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

const inputStyles = {
  background: 'hsla(0,0%,74%,.13)',
  borderRadius: '4px',
  padding: '8px',
  fontSize: '18px',
  lineHeight: '20px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all .15s ease-in-out 0s',
  '&:focus': {
    background: 'white',
    border: '2px solid #c550ff'
  },
}
const buttonStylesPrimary = {
  // Styling for primary button
  // is there a way to get shared styling across all the buttons?
  // shared
    padding: '.6875em 1.1875em',
    transition: 'all .15s ease-in-out 0s',
    borderRadius: '4px',
  // end of shared
  background: '#80c',
  border: '1px solid #80c',
  color: '#fff',
  '&:hover': {
    background: '#a0f',
    border: '1px solid #a0f',
    transform: 'translateY(-1px)'
  },
}
const buttonStylesSecondary = {
  // Styling for secondary button
  // shared
    padding: '.6875em 1.1875em',
    transition: 'all .15s ease-in-out 0s',
    borderRadius: '4px',
  // end of shared
  color: '#4c4a57',
  background: '#fff',
  border: '.0625em solid #c2c1c7',
  '&:hover': {
    boxShadow: '0 1px 4px rgba(27,26,33,.25)',
    transform: 'translateY(-1px)',
    filter: 'brightness(1.1)'
  },
  '&:focus': {
    boxShadow: '0 1px 4px rgba(27,26,33,.25)',
    transform: 'translateY(-1px)',
    filter: 'brightness(1.1)'
  },
}
const buttonStylesTertiary = {
  // shared
    padding: '.6875em 1.1875em',
    transition: 'all .15s ease-in-out 0s',
    borderRadius: '4px',
  color: '#4c4a57',
  border: 'none',
  background: 'none'
}

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

  // buttonGrp = () => {
  //   const { onLast, onCancel, finalStep } = this.props
  //   return (
  //     <div id="form-nav">
  //       <button
  //         id="form-cancel-btn"
  //         className="ui left floated button"
  //         onClick={() => onCancel()}
  //         style={buttonStylesTertiary}
  //         >Cancel</button>
  //       <button
  //         id="form-next-btn"
  //         className="ui right floated button"
  //         onClick={this.onSubmit}
  //         style={buttonStylesPrimary}
  //         >{finalStep ? 'Submit' : 'Next'}</button>
  //       <button
  //         id="form-prev-btn"
  //         className="ui right floated button"
  //         onClick={() => onLast()}
  //         style={buttonStylesSecondary}
  //         >Previous</button>
  //     </div>
  //   )
  // }

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
        <ButtonGroup onSubmit={this.onSubmit}/>
      </section>
    )
  }
}

export default SignUp
