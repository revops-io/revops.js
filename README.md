
# revops-js

> Official RevOps Javascript Component Library

[![NPM](https://img.shields.io/npm/v/revops-js.svg)](https://www.npmjs.com/package/revops-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

RevOps helps software businesses setup their usage-based pricing and billing. Request an account at https://www.revops.io to start automate your pricing today.

## Install

### Step 0.
Sign-up for an account with RevOps: https://www.revops.io

### Step 1.
```bash
npm install --save revops-js
```

### Step 2.

Import the `<PaymentMethod />` component into your Signup Form.
```jsx
import { PaymentMethod } from 'revops-js'
```

### Step 3.

Next, let's add a credit card payment method to the form below. We set `defaultMethod='card'` on `<PaymentMethod />` to prompt the customer to fill in credit card information first. Alternatively, you can try `defaultMethod='ach'` or `defaultMethod='plaid'` if you have either of those in your supported `methods`.

```jsx
import React, { Component } from 'react'
import { PaymentMethod } from 'revops-js'

class SignupForm extends Component {
	constructor(props) {
		super(props)
		this.saveRef = React.createRef()
	}

	submitSecure = (e) => {
		e.preventDefault()

		// Tell RevOps to create the account.
	    if (!!this.saveRef === true) {
	      this.saveRef.current.onSubmit()
	    }
	}

	render() {
		const {
			/* RevOps API Sandbox Key */
			publicKey = 'pk_test_1234567543',

			/* Your Customer's Account ID,
			 * can be a string up to 255 characters long. */
			accountId = 'this-account-id',

			/* Your Customer's email address. */
			email,
		} = this.props

		return (
		  <div>
			 <form>
				<label>Email
				  <input type="email" name="email" value={email} />
				</label>
				<label>Password
					<input type="password" name="password" />
				</label>
				<PaymentMethod
					publicKey={publicKey}
					account={{
						accountId: accountId,
						email: email
					}}
					defaultMethod="card"
					saveRef={this.saveRef}
				/>
				<input type="submit" onClick={this.submitSecure} />
			</form>
		  </div>
		)
	}
}
```

## Usage

### Create a payment portal to create and manage new customers with a few lines of code.

```jsx
import React from 'react'

import { PaymentPortal } from 'revops-js'

export const App = ({ accountId, defaultStyles = {}, publicKey = 'your-public-api-key' }) => (
  <PaymentPortal
    publicKey={publicKey}
    account={{
      accountId: accountId,
    }}
    logo="https://bill.sh/example_logos/pigeon.png"
    companyName="pigeonDelivery , Inc."
    styles={defaultStyles}
  />
)

export default App
```

## Props for `<PaymentPortal />`

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| publicKey |  PropTypes.string.isRequired | RevOps API Public Key. |
| account |    PropTypes.object   |  Initial account object to. |
| logo | PropTypes.string | URL to your company logo |
| methods | PropTypes.arrayOf(PropTypes.oneOf(['ach', 'card', 'plaid'])) | List of supported payment methods.
| defaultMethod | PropTypes.oneOf(['ach', 'card', 'plaid']) | The payment method shown first.
| saveRef | PropTypes.shape({ current: PropTypes.any }) | Assign a ref to add an external save button. If assigned, it will hide built-in buttons.
| styles | PropTypes.object | Inelin CSS Style definition to customize the form.



## Account Object `<PaymentPortal account={{ ... }} />`

The following table describes all the properties on the account object that are used
to initial new accounts.

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| accountId |    PropTypes.string   |  The customer `accountId` to connect with a RevOps Account. |
| email | PropTypes.string | The customer's `email` address. This is a unique value in RevOps. If an email already exists, the API will return a `400 BAD REQUEST`.


## License

MIT © [RevOps, Inc.](https://revops.io)
