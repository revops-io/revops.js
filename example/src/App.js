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
          <label>
            Email
            <input
              type="text"
              name="email"
              onChange={
                (e, data) => this.setState({
                  email: e.target.value,
                })
              }
            />
          </label>
          <PaymentMethod
            publicKey="pk_live_b5fd0042bb1447689a473059c051f17a"
            env={"localhost"}
            account={{
              accountId: "my-account-id",
              email: this.state.email,
            }}
            companyName="myDatabaseService, Inc."
            styles={defaultStyles}
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
