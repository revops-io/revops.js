import {
  Account,
  BillingContact,
  ShippingContact,
} from '../models'

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
