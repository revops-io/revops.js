import React, { Component } from 'react'

import {
  PaymentPortal,
} from 'revops-js'



const defaultStyles = {
  primaryColor: "blue",
  secondaryColor: "red",
};

export default class App extends Component {
  render() {
    return (
      <div className="ui container" style={{ marginTop: '3em' }}>
        <div>
          <PaymentPortal
            account={{
              accountId: "ACmy58bitaccountid",
            }}
            companyName="Bill.sh"
            styles={defaultStyles} />
        </div>
      </div>
    )
  }
}
