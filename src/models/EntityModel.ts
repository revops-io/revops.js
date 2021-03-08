import _ from "lodash"
import uuidv4 from "uuid/v4"
import EntityDate from "./EntityDate"

export default class EntityModel {
  id: string
  dateUpdated: string
  dateCreated: string
  constructor(params: Partial<EntityModel> = {}) {
    this.id = params.id || this._generateUUID()
    this.dateUpdated = params.dateUpdated || new EntityDate().toIsoString()
    this.dateCreated = params.dateCreated || new EntityDate().toIsoString()
  }

  _generateUUID() {
    return uuidv4()
  }

  _setDecimalValue(param, value, precision = 8) {
    if (
      value !== null &&
      value !== false &&
      value !== "" &&
      !isNaN(value) &&
      value !== "-"
    ) {
      this[param] = parseFloat(value).toFixed(precision)
    } else if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === false ||
      value === "-"
    ) {
      this[param] = null
    } else {
      // do not allow garbage-in
      this[param] = null
      console.warn(
        "Error assigning value to parameter in EntityModel._setDecimalValue, default to null.",
        !isNaN(value),
        param,
        value,
        typeof value,
      )
    }
  }

  _setAttr(param, value, precision = 2) {
    param = _.camelCase(param)
    if (typeof this[param] === "number") {
      this._setDecimalValue(param, value, precision)
    } else {
      this[param] = value
    }
  }

  marshalize() {
    const marshalizedObject = {}
    Object.entries(this).forEach(([name, item]) => {
      if (item instanceof EntityModel) {
        marshalizedObject[_.snakeCase(name)] = item.marshalize()
      } else {
        marshalizedObject[_.snakeCase(name)] = item
      }
    })

    return marshalizedObject
  }
}
