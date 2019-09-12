import {
  EntityModel,
} from './index'

export class BillingPreferences extends EntityModel {
  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }
}
