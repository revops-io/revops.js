import React, { Component } from 'react'

import {
  PaymentMethod,
} from 'revops-js'


const defaultStyles = {
  primaryColor: "blue",
  secondaryColor: "red",
};

// Should we move this elsewhere? This should be defined by the Business
const backgroundStyles = {
  // should be true for every instance
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  width: '100vw',
  minHeight: '100vh',
  maxHeight: '100%',
  // end
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.saveRef = React.createRef()
  }

  submitSecure(e) {
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
          <PaymentMethod
            publicKey="pk_sandbox_123"
            account={{
              accountId: "my-account-id",
            }}
            methods={[
              "card",
              "ach",
            ]}
            defaultMethod="card"
            saveRef={this.saveRef}
          />
          <div className="ui button" onClick={(e) => this.submitSecure(e)} tabIndex="0">
            Submit Order
          </div>
        </div>
      </div>
    )
  }
}
