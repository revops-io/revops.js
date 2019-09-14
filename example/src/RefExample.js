import React from 'react'

import {
  CreditCardForm,
  PaymentMethod,
} from 'revops-js'


class RefExample extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  submitSecure = (e) => {
    e.preventDefault()
    if (!!this.myRef === false) {
      this.myRef.current.onSubmit()
    }
  }

  render() {
    return (
      <div style={{ marginTop: 350 }}>
        <form>
          First name:<br />
          <input type="text" name="firstname" value="John" /><br />
          Last name:<br />
          <input type="text" name="lastname" value="Doe" /><br />
          <PaymentMethod
            childRef={this.myRef}
            accountModel={{ saveWithSecureForm: () => { } }}
            onCancel={() => { }}
            onError={() => { }}
            onLast={() => { }}
            onNext={() => { }} />
          <input type="submit" value="Submit" onClick={(e) => this.submitSecure(e)} />
        </form>
      </div>
    )
  }
}

export default RefExample