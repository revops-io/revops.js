import {
  Account,
  BillingContact,
  ShippingContact,
} from '../models'

import {
  RevOpsAPIClient
} from '../client'

export function makeAccount(props) {
  return new Account({
    billingContact: new BillingContact(props.billingContact),
    shippingContact: new ShippingContact(props.shippingContact),
    externalId: props.externalId,
    name: props.name,
  })
}

/* `createAccount` will create an account on RevOps
 * account - An account object.
 * returns { request, source }
 */
export function createAccount(
  account: Account,
  onSuccess: function,
  onError: function,
  onCancel: function,
) {
  let client = new RevOpsAPIClient()
  return client.put(`/accounts/${account.id}`, account, {
    onSuccess, onError, onCancel
  })
}
