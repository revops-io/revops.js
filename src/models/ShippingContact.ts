import EntityModel from "./EntityModel"

export class ShippingContact extends EntityModel {
  friendlyName = ""

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName]),
    )
  }
}
