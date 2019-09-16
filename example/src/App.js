import React, { Component } from 'react'

import {
  PaymentMethod,
} from 'revops-js'


// Example-specific
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
            publicKey="pk_live_b5fd0042bb1447689a473059c051f17a"
            env={"localhost"}
            account={{
              accountId: "my-account-id",
              email: this.state.email,
            }}
            inputStyles={{
              background: 'red',
              borderRadius: '50px',
            }}
            buttonStylesPrimary={{
              background: 'red',
            }}
            linkStyling={{
              color: 'red',
            }}
          />
        </div>
      </div>
    )
  }
}
