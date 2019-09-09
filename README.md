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

const YourPaymentPortal = ({ publicKey = 'your-public-api-key' }) => (
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
```

## License

MIT © [RevOps, Inc.](https://revops.io)
