import {
  Account,
  BillingContact,
  ShippingContact,
} from '../models'

import {
  RevOpsAPIClient
} from '../client'

export function makeAccount(props = {}) {
  return new Account({
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
  onSuccess,
  onError,
  onCancel,
) {
  let client = new RevOpsAPIClient()
  return client.put(`/accounts/${account.id}`, account, {
    onSuccess, onError, onCancel
  })
}
