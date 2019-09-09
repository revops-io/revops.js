import {
  EntityModel,
} from './index'

export class BillingPreferences extends EntityModel {
  plaidLinkPublicToken: string
  bankAccountHolderName: string
  bankAccountHolderType: string
  bankAccountNumber: string
  bankCountry: string
  bankName: string
  bankRoutingNumber: string
  cardCvv: string
  cardExpdate: string
  cardName: string
  cardNumber: string
  cardToken: string
  id: string
  paymentMethod: string

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }
}
