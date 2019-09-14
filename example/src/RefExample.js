import React from 'react'

import {
  PaymentMethod,
} from 'revops-js'


class RefExample extends React.Component {
  constructor(props) {
    super(props);
    this.saveRef = React.createRef();
  }

  // submit your form and the revops component here
  submitSecure = (e) => {
    e.preventDefault()

    // tell the revops form to submit itself
    if (!!this.saveRef === true) {
      this.saveRef.current.onSubmit()
    }
  }

  render() {
    return (
      <div style={{ marginTop: 250 }}>
        <form className="ui form">
          <h4 className="ui dividing header">Your Custom Form</h4>
          <div className="field">
            <label>Name</label>
            <div className="two fields">
              <div className="field">
                <input type="text" name="shipping[first-name]" placeholder="First Name" />
              </div>
              <div className="field">
                <input type="text" name="shipping[last-name]" placeholder="Last Name" />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Billing Address</label>
            <div className="fields">
              <div className="twelve wide field">
                <input type="text" name="shipping[address]" placeholder="Street Address" />
              </div>
              <div className="four wide field">
                <input type="text" name="shipping[address-2]" placeholder="Apt #" />
              </div>
            </div>
          </div>
          <h4>Include the RevOps.js Payment Method component</h4>
          <PaymentMethod
            accountModel={{ saveWithSecureForm: () => { } }}
            saveRef={this.saveRef}
            onCancel={() => { }}
            onError={() => { }}
            onLast={() => { }}
            onNext={() => { }}
            {...this.props} />
          <h4>Submit the form and </h4>
          <div className="ui button" onClick={(e) => this.submitSecure(e)} tabIndex="0">Submit Order</div>
        </form>
      </div>
    )
  }
}

export default RefExample