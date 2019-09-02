import {
  EntityModel,
} from './index'

export class ShippingContact extends EntityModel {
  id: string
  friendlyName: string

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }
}
