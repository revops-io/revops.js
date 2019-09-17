

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
    '&:focus': { // the focus pseudo-class
      background: '#ffffff',
      border: `2px solid papayawhip`
    }
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
| onComplete(response) | PropTypes.func | This callback returns the response of a successful HTTP request.
| onError({errors, status, response}) | PropTypes.func | This callback returns an error for an unsuccessful HTTP request.

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

## Error Handling and Validation
If an error occurs we have you covered with the `onError` callback. It is designed 
to be called anytime we detect an error with revops-js and will return
a useful error object that can be used to implement custom validation or error handling. 
This can be particularly useful when you need to keep branding consistent or need to 
integrate revops-js with an existing application. 

### Validation Errors
Prior to submitting the form a validation step is performed and if the form cannot 
be submitted revops-js will return an object that indicates the current problem areas.

```json
{
  "errors": 
  {
    "billingPreferences.propertyName": // name of field
    {
      "errorMessages": ["is required"], // one or more fields that could not be accepted
      "isDirty": "true",
      "isEmpty": "true",
      "isFocused": "false",
      "isValid": "false",
      "name": "billingPreferences.propertyName"
    }
    ...
  },
  "response": "false", // response will always equal false for validation errors
  "status": "false"   // status will always equal false for validation errors
} 
```

### Network Errors
Network errors share a the same signature but the errors will include the response
from the server and the response field will be returned true.

```json
{
  "errors": 
  {
    "http_status": "401",
    "message":"Unauthorized"
  },
  "response": "true", // indicates a network was made but was unsuccessful
  "status": "401"     // HTTP status of the response
}
```

#### HTTP Status
| Status | Meaning |
|----------|:-------------------|
| 200 | OK Everything worked as expected.
| 400 | RevOps API bad request.
| 401 | RevOps API access denied. Update your `publicKey`.
| 404 | The requested resource doesn't exist.
| 500 | Server Errors, contact [RevOps](https://revops.io) for assistance. 

### Example
```jsx
export default class App extends Component {
  // called when an error occurs in revops-js
  onError = ({errors, response, status}) => {
    if(response === false){
      this.setState({formDirty: true, errors})
    } else if (status >= 500) {
      this.setState({networkError: true })
    } else {
      this.setState({networkError: true, errors})
    }
  }

  render() {
    return (
      <div className="ui container" style={backgroundStyles}>
        <PaymentMethod
          publicKey="pk_sandbox"
          methods={['card', 'ach', 'plaid']}
          account={{
            accountId: "100000-3",
            email: this.state.email,
          }}
          onError={this.onError} />
      </div>
    )
  }
}
```

## License

MIT © [RevOps, Inc.](https://revops.io)
