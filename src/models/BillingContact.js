import {
  EntityModel,
} from './index'

export class BillingContact extends EntityModel {
  id: string
  email: string
  name: string
  phone: string
  title: string

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }
}
