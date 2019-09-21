import React, { Component } from 'react'

import {
  PaymentMethod,
} from 'revops-js'

import "revops-js/themes/defaultStyles.css"

const backgroundStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  width: '100vw',
  minHeight: '100vh',
  maxHeight: '100%',
}

export default class App extends Component {
  state = {
    email: '',
    success: false,
  }

  constructor(props) {
    super(props)
    this.saveRef = React.createRef()
  }

  submitSecure = () => {
    // tell the revops form to submit itself
    if (!!this.saveRef === true) {
      this.saveRef.current.onSubmit()
    }
  }

  // this callback is called when an error occurs in revops-js
  onError = ({ message, http_status }) => {
    if(http_status >= 500){
      this.setState({error: true, errorMsg: 'Please contact support'})
    } else {
      this.setState({error: true, errorMsg: message})
    }
  }

  onValidationError = (errors) => {
    console.warn(errors)
    this.setState({formDirty: true })
  }

  render() {
    return (
      <div style={backgroundStyles} className="revops-demo">
        <div>
          <label>
            Email
            <input
              type="text"
              name="email"
              onChange={
                (e) => this.setState({
                  email: e.target.value,
                })
              }
            />
          </label>
          <PaymentMethod
            publicKey="pk_sandbox_0f7048228ee34af7a727f584a0091ce4"
            methods={['card', 'ach', 'plaid']}
            account={{
              accountId: "100000-3",
              email: this.state.email,
            }}
            onComplete={(accountObject) => {
              this.setState({ success: true, accountObject })
            }}
            onValidationError={this.onValidationError}
            onError={this.onError}
            saveRef={this.saveRef}
          />
          <input type="submit" onClick={this.submitSecure} />
          {this.state.success === true &&
            <h1>Details Saved!</h1>
          }

        </div>
      </div>
    )
  }
}
