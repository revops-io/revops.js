import React, { Component } from 'react'

import {
  PaymentPortal,
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
  background: 'url("../example_logos/memsql_banner.svg") repeat-x top left white',
}

export default class App extends Component {
  render() {
    return (
      <div className="ui container" style={backgroundStyles}>
        <div>
          <PaymentPortal
            account={{
              accountId: "ACmy58bitaccountid",
            }}
            logo="../example_logos/memsql.png"
            companyName="memSQL"
            styles={defaultStyles}
          />
        </div>
      </div>
    )
  }
}
