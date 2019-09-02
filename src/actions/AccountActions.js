import {
  Account,
  BillingContact,
  ShippingContact,
} from '../models'

import {
  RevOpsAPIClient
} from '../client'

export  function createAccount(props, onSuccess, onError, onCancel) {
  let account = new Account({
    billingContact: new BillingContact(props.billingContact),
    shippingContact: new ShippingContact(props.shippingContact),
    externalId: props.externalId,
    name: props.name,
  })

  let client = new RevOpsAPIClient()
  let response = client.post('/accounts', account, {
    onSuccess, onError, onCancel
  })

  return account
}
