

# revops-js

> Official RevOps Javascript Component Library

[![NPM](https://img.shields.io/npm/v/revops-js.svg)](https://www.npmjs.com/package/revops-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

RevOps helps software businesses setup their usage-based pricing and billing. Request an account at https://www.revops.io to start automate your pricing today.

## Usage

### Create a payment portal to create and manage new customers with a few lines of code.

```jsx
import React from 'react'

import { PaymentMethod } from 'revops-js'

/* Default stylesheet to configure look and feel */
import "revops-js/themes/defaultStyles.css"


export const App = ({ accountId, publicKey = 'your-public-api-key' }) => (
  <PaymentMethod
    publicKey={publicKey}
    account={{
      accountId: accountId,
      email: 'bugs@bunny.com',
    }}
  />
)

export default App
```

## Getting Started

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

/* Default stylesheet to configure look and feel */
import "revops-js/themes/defaultStyles.css"

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

  onComplete = (response) => {
    console.log(response)
  }

  onValidationError = () => {
    console.warn('Validation Error')
  }
  
  onError = (error) => {
    console.error(error)
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
          onComplete={this.onComplete}
          onError={this.onError}
        />
        <input type="submit" onClick={this.submitSecure} />
        </form>
      </div>
    )
  }
}
```

### Step 4.

Now that `<PaymentMethod />` is working, it's important for it look that it fits seamlessly into your application. These are the props available for styling:

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| inputStyles | PropTypes.object | Styles for input fields. `&:focus` state can also be styled. |
| buttonStylesPrimary | PropTypes.object | Styles for your primary CTA. |
| buttonStylesSecondary | PropTypes.object | Styles for your secondary CTA. |
| linkStyling | PropTypes.object | Styles for your text links. |
| cardWidth | PropTypes.object | How wide you want the content area of `<PaymentMethod />` to be. Give it `margin: 0 auto`. |
| errorColor | PropTypes.string | Give the hex code for the color of the input borders and text when a field is missing or incorrect. |

You can use CSS properties to customize the appearance of `<PaymentMethod />`. Popular properties to use are:
- `background`
- `border`
- `borderRadius`
- `color`
- `fontSize`
- `lineHeight`
- `padding`

Here is an example how to style inputs:
```
<PaymentMethod
  publicKey={publicKey}
  account={{
    accountId: accountId,
    email: email
  }}
  defaultMethod="card"
  saveRef={this.saveRef}
  inputStyles={{
    background: '#eeeeee',
    borderRadius: '2px',
    padding: '4px 8px',
    fontSize: '18px',
    lineHeight: '20px',
    outline: 'none',
    transition: 'all .15s ease-in-out 0s',
    border: '2px solid mistyrose',
    boxSizing: "border-box",
    '&:focus': { // the focus pseudo-class
      background: '#ffffff',
      border: `2px solid papayawhip`
    },
    '&::placeholder': { 
      color: '#ccc',
    },
  }}
/>
```



## Props for `<PaymentMethod />`

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| publicKey |  PropTypes.string.isRequired | RevOps API Public Key. |
| account |    PropTypes.object   |  Initial account object to. |
| logo | PropTypes.string | URL to your company logo |
| methods | PropTypes.arrayOf(PropTypes.oneOf(['ach', 'card', 'plaid'])) | List of supported payment methods.
| defaultMethod | PropTypes.oneOf(['ach', 'card', 'plaid']) | The payment method shown first.
| saveRef | PropTypes.shape({ current: PropTypes.any }) | Assign a ref to add an external save button. If assigned, it will hide built-in buttons.
| styles | PropTypes.object | Inline CSS Style definition to customize the form.



## Account Object `<PaymentMethod account={{ ... }} />`

When the `account` property is defined on a `<PaymentMethod />` component, it will instantiate a set of default values for the form. This allows you to set specific account details necessary to bill them later.

Only two fields are required:
1. `account.accountId` - The customer `accountId` to connect with a RevOps Account.
2. `account.email` - The customer's `email` address. This is a unique value in RevOps. If an email already exists, the API will return a `400 BAD REQUEST`


The following table describes all the properties on the account object that are used
to initial new accounts.

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| accountId |    PropTypes.string.isRequired   |  The customer `accountId` to connect with a RevOps Account. |
| email | PropTypes.string.isRequired | The customer's `email` address. This is a unique value in RevOps. If an email already exists, the API will return a `400 BAD REQUEST`.
| billingContact | PropTypes.object | Object defining `email`, `name`, `phone`, and `title` of the direct billing contact, if it is different than the `account.email` provided.
| billingPreferences | PropTypes.object | Object defining preferences filled out by RevOps.js `<PaymentMethod />`. See `BillingPreferences` object for more info.
| onComplete(response) | PropTypes.func | This callback returns the response of a successful HTTP request. [onComplete](#onComplete)
| onError(error) | PropTypes.func | Called when revops-js detects an error. See [onError](#onError) for more details.
| onValidationError() | PropTypes.func | Called when a validation error is detected See [onValidationError](#onValidationError) for more details.

## BillingPreferences Object
BillingPreferences can be found on the account object and defaults can be set at runtime by setting the `billingPreferences` property on `account`.

An example of `billingPreferences` looks like:
```jsx
account = {
  /*...*/
  billingPreferences: {
    plaidLinkPublicToken: "",
    bankAccountHolderName: "",
    bankAccountHolderType: "",
    bankAccountNumber: "",
    bankCountry: "",
    bankName: "",
    bankRoutingNumber: "",
    cardName: "3vffvd4v4455dx",
    cardToken: "w4cr4f4yf4fdvcf",
    paymentMethod: "card"
  }
}
```

| Prop     |      type      |  Description |  Tokenized |
|------------------|:--------------:|-------------:|---------|
| paymentMethod    | PropTypes.oneOf(['ach', 'card', 'plaid']) | The primary method used for paying. | ✅ |
| cardName | PropTypes.string | Name on the credit card. |  ✅
| cardToken | PropTypes.string | Token used for authorizing payment. | ✅
| cardNumber | PropTypes.string | Number on the credit card | ✅
| cardExpdate | PropTypes.string | Date of Expiration on the credit card.| ✅
| bankAccountHolderName | PropTypes.string | Name on the Bank Account | ✅
| bankName | PropTypes.string | Name of Bank Institution | ✅
| bankRoutingNumber | PropTypes.string | Routing Number of Issuing Bank | ✅
| bankAccountNumber | PropTypes.string | Account Number of Issuing Bank | ✅
| bankCountry | PropTypes.string | Country of Issuing Bank | ✅
| plaidLinkToken | PropTypes.string | Link Token of Connected Plaid Bank | ✅


## Available Callbacks
Revops-js provides callbacks that can be used to implement custom validation or error handling. They are particularly useful when you need to keep branding consistent or need to integrate revops-js with an existing application. 

### `onComplete` 
This callback is triggered when the revops-js component successfully submits its information and returns the [Account Object](#Account-Object-`<PaymentMethod-account={{-...-}}-/>`) that has been created. 

This is the ideal time to capture and extend the data model for your specific needs. 

### `onValidationError`
This callback returns the form's state when a validation error is detected. Validation errors are handled locally and are not submitted to the server. This is useful in larger workflows where the next step is dependent on the success of the previous one.

### `onError`
The `onError` callback is called when the form submission process is unsuccessful. This typically indicates a configuration issue or a problem with a network request as validation is handled locally and will not reach the server.

__Example Error__
```jsx
{
  "http_status": 401,
  "message": "Unauthorized",
  "code": "invalid_auth"
}
```

| Code | Meaning |
|--------|:--------|
| invalid_auth | This indicates a problem with authentication. |
| invalid_param | One or more of the required parameters are missing. |
| invalid_param_dup | This happens when a duplicate email address is detected. |
| plaid_timeout | The Plaid authentication has timed out. |
| unknown | This is is for all unhandled errors on the backend.  |

__Additional HTTP Statuses__

| Status | Meaning |
|--------|:--------|
| 200s | OK Everything worked as expected.
| 400  | RevOps API bad request.
| 401  | RevOps API access denied. Update your `publicKey`.
| 404  | The requested resource doesn't exist.
| 500s | Server errors, contact [RevOps](https://revops.io) for assistance. 
 

### Callback Example 

```jsx
import React, { Component } from 'react'

import {
  PaymentMethod,
} from 'revops-js'

import "revops-js/themes/defaultStyles.css"

class App extends Component {

  // this callback is called when an error occurs in revops-js
  onError = (error) => {
    let errorMsg =  'Please contact support' 
    if (error.http_status < 500) {
      errorMsg = error.message
    }
    this.setState({error: true, errorMsg}) 
  }

  // This is a great chance save data internally
  onComplete = (response) => {
    console.log(response)
  }

  render() {
    const { email } = this.props
    return (
      <div className="ui container">
        <PaymentMethod
          publicKey="pk_sandbox"
          methods={['card', 'ach', 'plaid']}
          account={{
            accountId: "100000-3",
            email,
          }}
          onComplete={this.onComplete}
          onError={this.onError}
          onValidationError={() => {
            this.setState({ formDirty: true })
          }}
        />
        {this.state.success === true &&
          <p className="confirmation-msg"> Details Saved! </p>
        }
        {this.state.formDirty === true &&
          <p className="validation-msg"> Form Not Complete </p>
        }
        {this.state.error === true &&
          <p className="error-msg"> {this.state.errorMsg} </p>
        }
      </div>
    )
  }
}
```

## Using a React Ref to Submit Form
Let's talk about how to integrate revops.js into a larger workflow using [React Refs](https://reactjs.org/docs/refs-and-the-dom.html) to control the revops child component. First, we need to define the `saveRef` property. This is done in two parts. 

First, define the ref to pass down to the component. 
```jsx
class SignupForm extends Component {
  constructor(props) {
    super(props)

    // define the reference to the component
    this.saveRef = React.createRef()
  }
  render() {
  const { accountId, email } = this.props
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
          account={{ accountId, email }}
          defaultMethod="card"
          // pass the reference to the revops component
          saveRef={this.saveRef}
        />
        </form>
      </div>
    )
  }
}
```

Next, we will call the revops `onSubmit` method using the ref by defining the `submitSecure` method in our component.

```jsx
class SignupForm extends Component {
  constructor(props) {
    super(props)

    // define the reference to the component
    this.saveRef = React.createRef()
  }

  submitSecure = (e) => {
    // only needed if part of a form
    e.preventDefault()

    // Tell RevOps to create the account.
    if (!!this.saveRef === true) {
      this.saveRef.current.onSubmit()
    }
  }

  render() {
  const { accountId, email } = this.props
  return (
    <div>
      <form>
        {/* ... */}
        <PaymentMethod
          publicKey={publicKey}
          account={{ accountId, email }}
          defaultMethod="card"
          saveRef={this.saveRef}
        />
        {/* Now we can call it when we submit the entire form */}
        <input type="submit" onClick={this.submitSecure} />
        </form>
      </div>
    )
  }
}
```

## License

MIT © [RevOps, Inc.](https://revops.io)
