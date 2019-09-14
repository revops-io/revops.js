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
  render() {
    return (
      <div className="ui container" style={backgroundStyles}>
        <div>
          <PaymentMethod
            env={"staging"}
            account={{
              accountId: "my-account-id",
            }}
            logo="../example_logos/memsql.png"
            companyName="memSQL"
            styles={defaultStyles}
            methods={[
              "card",
              "ach",
            ]}
            defaultMethod="card"
          />
        </div>
      </div>
    )
  }
}
