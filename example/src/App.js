import React, { Component } from 'react'

import {
  PaymentPortal,
} from 'revops-js'

import RefExample from './RefExample'

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
    let hash = document.location.hash.replace('#', '')
    let accountId = ''
    if (hash !== '') {
      accountId = hash
    }

    return (
      <div className="ui container" style={backgroundStyles}>
        <div>
          <RefExample />
          {/* <PaymentPortal
            account={{
              accountId: accountId,
            }}
            logo="../example_logos/memsql.png"
            companyName="memSQL"
            styles={defaultStyles}
          /> */}
        </div>
      </div>
    )
  }
}
