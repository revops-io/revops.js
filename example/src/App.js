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
  alignItems: 'center',
  width: '100vw',
  minHeight: '100vh',
  maxHeight: '100%',
  // end
  backgroundColor: 'black',
}
const cardWidth = {
  width: '550px',
}

export default class App extends Component {
  render() {
    return (
      <div className="ui container" style={backgroundStyles}>
        <div style={cardWidth}>
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
