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
  }

  constructor(props) {
    super(props)
    this.saveRef = React.createRef()
  }

  submitSecure = (e) => {
    e.preventDefault()

    // tell the revops form to submit itself
    if (!!this.saveRef === true) {
      this.saveRef.current.onSubmit()
    }
  }

  render() {
    return (
      <div className="ui container" style={backgroundStyles}>
        <div>
          <label className="ui label fluid">
            Email
            <input
              className="ui input fluid"
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
            publicKey="pk_sandbox_test"
            methods={['plaid', 'ach', 'card']}
            account={{
              accountId: "my-account-id",
              email: this.state.email,
            }}
          />
        </div>
      </div>
    )
  }
}
