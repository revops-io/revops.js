import React, { Component } from 'react'

import {
  PaymentMethod,
} from 'revops-js'

import "revops-js/themes/defaultStyles.css"


export default class App extends Component {
  state = {
    email: '',
    success: false,
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
      <div className="revops-demo">
        <div>
          <label className="revops-demo-label">
            Email
          </label>
          <input
            className="revops-demo-input"
            type="text"
            name="email"
            onChange={
              (e) => this.setState({
                email: e.target.value,
              })
            }
          />
          <PaymentMethod
            publicKey="pk_sandbox_123"
            methods={['card', 'ach', 'plaid']}
            account={{
              accountId: "100000-3",
              email: this.state.email,
            }}
            onComplete={(response) => {
              this.setState({ success: true })
            }}

          />
          {this.state.success === true &&
            <h1>Details Saved!</h1>
          }

        </div>
      </div>
    )
  }
}
