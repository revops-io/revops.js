import {
  EntityModel,
} from './index'

export class BillingPreferences extends EntityModel {
  id = ""
  plaidLinkPublicToken = ""
  bankAccountHolderName = ""
  bankAccountHolderType = ""
  bankAccountNumber = ""
  bankCountry = ""
  bankName = ""
  bankRoutingNumber = ""
  cardCvv = ""
  cardExpdate = ""
  cardName = ""
  cardNumber = ""
  cardToken = ""
  paymentMethod = ""

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }
}
