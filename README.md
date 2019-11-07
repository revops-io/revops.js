# revops-js

> Official RevOps Javascript Component Library

[![Build Status](https://travis-ci.org/revops-io/revops.js.svg?branch=master)](https://travis-ci.org/revops-io/revops.js) [![NPM](https://img.shields.io/npm/v/revops-js.svg)](https://www.npmjs.com/package/revops-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

RevOps helps software businesses setup their usage-based pricing and billing. Request an account at https://www.revops.io to start automate your pricing today.

## Usage

### Create a payment portal to create and manage new customers with a few lines of code.
Here we use the public API key found in RevOps at `https://<your-organization>.revops.io/integrations/api/key`. 
For more information on authentication see [Authentication Overview](https://github.com/revops-io/revops.js/wiki/Authentication-Overview).

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

We built an example at https://codesandbox.io/s/sample-revopsjs-form-tx6kv for you!

It only takes a few steps:

1. Copy your public API key from `https://<your_instance>.revops.io/integrations/api/key`
2. Replace the __public key__, line 38 if you haven't made any changes
3. Complete the form
4. Find the account at `https://<your_instance>.revops.io/accounts`

## Integrating Revops-js
Revops-js is highly customizable and supports a number of ways to integrate it into an existing application.
- [Authentication Overview](https://github.com/revops-io/revops.js/wiki/Authentication-Overview)
- [Styling Revops-js Components](https://github.com/revops-io/revops.js/wiki/Styling-Revops-js-Components)
- [Using Callbacks](https://github.com/revops-io/revops.js/wiki/Using-Callback-to-Integrate-Revops-js)
- [Using Refs](https://github.com/revops-io/revops.js/wiki/Using-Refs-with-Revops-js)
- [Logging Levels](https://github.com/revops-io/revops.js/wiki/Logging-Levels)



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
| billingPreferences | PropTypes.object | Object defining preferences filled out by revops-js `<PaymentMethod />`. See `BillingPreferences` object for more info.
| onComplete(response) | PropTypes.func | This callback returns the response of a successful HTTP request. [onComplete](#onComplete)
| onError({error}) | PropTypes.func | Called when revops-js detects an error. See [onError](#onError) for more details.
| onValidationError() | PropTypes.func | Called when a validation error is detected See [onValidationError](#onValidationError) for more details.

## BillingPreferences Object
BillingPreferences can be found on the account object and defaults can be set at runtime by setting the `billingPreferences` property on `account`.

__Note:__ Many properties that were once part of the BillingPreferences object have moved to our Instrument API. To support any legacy accounts we support both methods but strongly recommend that you use the Instrument API as it supports multiple instrument. 

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
|------------------|:--------------:|-------------:|:--------:|
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


## License

MIT © [RevOps, Inc.](https://revops.io)
