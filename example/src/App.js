import React, { Component } from 'react'

import {
  PaymentMethod,
  RevOps,
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

  // getAccountToken calls the authorization server to get an access
  getAccountToken = async (accountId) => {
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
      if (!!data.token === true) {
        this.setState({ accessToken: data.token })
        return data.token
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
          <RevOps
            getToken={this.getAccountToken}
            account={{
              accountId: "100000-3",
              email: this.state.email,
            }}>
            <PaymentMethod
              methods={['card', 'ach', 'plaid']}
              onComplete={(accountObject) => {
                this.setState({ success: true, accountObject })
              }}
              onValidationError={this.onValidationError}
              onError={this.onError}
              saveRef={this.saveRef}
            />
          </RevOps>
          <input type="submit" onClick={this.submitSecure} />
          {this.state.success === true &&
            <h1>Details Saved!</h1>
          }
        </div>
      </div>
    )
  }
}
