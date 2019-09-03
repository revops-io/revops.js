import {
  Account,
  BillingContact,
  ShippingContact,
} from '../models'

import {
  RevOpsAPIClient
} from '../client'

export function makeAccount(props = {
  id,
  name,
  email,
  billingContact,
  shippingContact,
  billingPreferences,
}) {
  return new Account({
    ...props,
    billingContact: !!props.billingContact !== false ?
      { ...props.billingContact } : {},
    shippingContact: !!props.shippingContact !== false ?
      { ...props.shippingContact } : {},
    billingPreferences: !!props.billingPreferences !== false ?
      { ...props.billingPreferences } : {},
  })
}

/* `createAccount` will create an account on RevOps
 * account - An account object.
 * returns { request, source }
 */
export function createAccount(
  account: Account,
  onSuccess,
  onError,
  onCancel,
) {
  let client = new RevOpsAPIClient()
  return client.put(`/accounts/${account.id}`, account, {
    onSuccess, onError, onCancel
  })
}
