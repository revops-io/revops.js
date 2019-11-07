# revops-js

> Official RevOps Javascript Component Library

[![Build Status](https://travis-ci.org/revops-io/revops.js.svg?branch=master)](https://travis-ci.org/revops-io/revops.js) [![NPM](https://img.shields.io/npm/v/revops-js.svg)](https://www.npmjs.com/package/revops-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

RevOps helps software businesses set up their usage-based pricing and billing. Request early access at https://www.revops.io and automate your pricing today.

## Usage

### Build a payment portal to create new manage exisitng customers with a few lines of code.
Here we use the public API key found in RevOps at `https://<your-organization>.revops.io/integrations/api/key`. 
For more information on authentication see [Authentication Overview](https://github.com/revops-io/revops.js/wiki/Authentication-Overview).

```jsx
import React from 'react'

import { PaymentMethod } from 'revops-js'

/* Default stylesheet to configure the look and feel */
import 'revops-js/themes/defaultStyles.css'


export const App = ({ 
  accountId = 'your-acct-id', 
  publicKey = 'your-public-api-key' 
}) => (
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

See a live example and play with a demo at https://codesandbox.io/s/sample-revopsjs-form-tx6kv

It only takes a few steps:

1. Copy your public API key from `https://<your_instance>.revops.io/integrations/api/key`
2. Replace the __public key__
3. Complete the form
4. Find the account at `https://<your_instance>.revops.io/accounts`

## Main Components
- [SignUp](https://github.com/revops-io/revops.js/wiki/SignUp) - Creates an acccount in RevOps
- [PaymentMethod](https://github.com/revops-io/revops.js/wiki/Payment-Method) - Creates and modifies payment instruments. Also supports the creation of accounts in Revops for a unified workflow.
- [RevOpsAuth](https://github.com/revops-io/revops.js/wiki/RevOpsAuth-Component) - Wrapper component used to authenticate and coordinate state between multiple components. 

## Integrating Revops-js
Revops-js is highly customizable and supports a number of ways to integrate it into an existing application.
- [PaymentMethod Integration Guide](https://github.com/revops-io/revops.js/wiki/Guide-to-Integrating-PaymentMethod-Components)
- [Styling Revops-js Components](https://github.com/revops-io/revops.js/wiki/Styling-Revops-js-Components)
- [Authentication Overview](https://github.com/revops-io/revops.js/wiki/Authentication-Overview)
- [Using Callbacks](https://github.com/revops-io/revops.js/wiki/Using-Callback-to-Integrate-Revops-js)
- [Using Refs](https://github.com/revops-io/revops.js/wiki/Using-Refs-with-Revops-js)
- [Logging Levels](https://github.com/revops-io/revops.js/wiki/Logging-Levels)

## API Documentation
- [Accounts](https://www.revops.io/docs/rest-api/accounts)
- [Instruments](https://www.revops.io/docs/rest-api/instruments)


## License

MIT © [RevOps, Inc.](https://revops.io)
