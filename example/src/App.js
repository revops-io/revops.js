import React, { Component } from 'react'

import {
  PaymentMethod,
  RevOpsAuth,
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

  /**
   * getToken() calls our example auth server with an accountId 
   * to produce an authorization token that can be used to view and 
   * manipulate the account. The RevOps components will make the 
   * appropriate calls to it using the accountId or '*' when necessary.
   */
  getToken = async (accountId) => {
    let searchParams = new URLSearchParams({
      accountId: accountId,
    })

    let options = {
      method: 'GET',
      mode: 'cors',
    };

    const url = `http://localhost:5000/token?${searchParams.toString()}`
    let response = await fetch(url, options)
    let responseOK = response && response.ok
    if (responseOK) {
      let data = await response.json()
      if (!!data.access_token === true) {
        this.setState({ accessToken: data.access_token })
        return data.access_token
      } else {
        console.warn("Unable to get token for requested operation.")
        return false
      }
    }
  }

  // this callback is called when an error occurs in revops-js
  onError = ({ message, http_status }) => {
    if (http_status >= 500) {
      this.setState({ error: true, errorMsg: 'Please contact support' })
    } else {
      this.setState({ error: true, errorMsg: message })
    }
  }

  onValidationError = (errors) => {
    console.warn(errors)
    this.setState({ formDirty: true })
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
          <RevOpsAuth
            getToken={this.getToken}
            apiOptions={{
              loggingLevel: "error", // "warning" // "log"
            }}
            account={{
              accountId: "your-account-id",
              email: this.state.email,
            }}>
            <PaymentMethod
              methods={['credit-card', 'ach', 'plaid']}
              onComplete={(accountObject) => {
                this.setState({ success: true, accountObject })
              }}
              instrument={{ 
                isPrimary: true, // make instrument primary
              }}
              onValidationError={this.onValidationError}
              onError={this.onError}
              saveRef={this.saveRef}
            />
          </RevOpsAuth>
          <input type="submit" onClick={this.submitSecure} />
          {this.state.success === true &&
            <h1>Details Saved!</h1>
          }
        </div>
      </div>
    )
  }
}
