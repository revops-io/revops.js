import React, { Component } from 'react'

import { PayAsYouGoForm } from 'revops-js'

export default class App extends Component {
  render () {
    return (
      <div className="ui container" style={{marginTop: '3em'}}>
        <h1>Example Company Onboarding.</h1>

        <h2 className="ui dividing header">Setup your account:</h2>
        <h3>Onboarding Widget inside dotted line ⬇︎</h3>
        <div style={{ border: '5px dotted grey', padding: '5px' }}>
            <div className="content">
              <PayAsYouGoForm
                onSubmit={() => {
                  alert('test')
                }}
              />
            </div>
        </div>
      </div>
    )
  }
}
