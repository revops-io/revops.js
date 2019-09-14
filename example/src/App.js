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
  constructor(props) {
    super(props)
    this.state = {
      exampleIndex: 0
    }
  }

  render() {
    const { exampleIndex } = this.state
    let hash = document.location.hash.replace('#', '')
    let accountId = ''
    if (hash !== '') {
      accountId = hash
    }

    return (
      <div className="ui container" style={backgroundStyles}>
        <div>
          {
            exampleIndex === 0 &&
            <PaymentPortal
              account={{
                accountId: accountId,
              }}
              logo="../example_logos/memsql.png"
              companyName="memSQL"
              styles={defaultStyles}
            />
          }
          {
            exampleIndex === 1 &&
            <RefExample  styles={defaultStyles} />
          }
        <button
          className="ui button"
          onClick={() => this.setState({ exampleIndex: (exampleIndex + 1) % 2 })}>
          Next Example
        </button>
        </div>
      </div>
    )
  }
}
