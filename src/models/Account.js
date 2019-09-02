import {
  EntityModel,
  BillingContact,
  ShippingContact,
} from './index'

export class Account extends EntityModel {
  id: string
  externalId: string
  name: string
  billingContact: BillingContact
  shippingContact: ShippingContact

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }
}
