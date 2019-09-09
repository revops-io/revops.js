# revops-js

> Official RevOps Javascript Component Library

[![NPM](https://img.shields.io/npm/v/revops-js.svg)](https://www.npmjs.com/package/revops-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save revops-js
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

### Example launches an application below:
<img alt="Pigeon Example Signup" src="https://bill.sh/example-screens/pigeon-screen.png" width="350">

## Props for `<PaymentPortal />`

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| publicKey |  PropTypes.string.isRequired | RevOps API Public Key. |
| account |    PropTypes.object   |  Initial account object to. |
| logo | PropTypes.string | URL to your company logo |


## Account Object `<PaymentPortal account={{ ... }} />`

The following table describes all the properties on the account object that are used
to initial new accounts.

| Prop     |      type      |  Description |
|----------|:--------------:|-------------:|
| accountId |    PropTypes.string   |  Your accountId to connect with a RevOps Account. |


## License

MIT © [RevOps, Inc.](https://revops.io)
