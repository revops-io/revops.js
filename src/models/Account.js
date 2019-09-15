import {
  EntityModel,
  BillingContact,
  ShippingContact,
  BillingPreferences,
} from './index'

export class Account extends EntityModel {
  id = ""
  accountId = ""
  name = ""
  billingContact = new BillingContact()
  shippingContact = new ShippingContact()
  billingPreferences = new BillingPreferences()

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
    this.billingContact = new BillingContact(
      !!params === true ? params.billingContact : {}
    )
    this.shippingContact = new ShippingContact(
      !!params === true ? params.shippingContact : {}
    )
    this.billingPreferences = new BillingPreferences(
      !!params === true ? params.billingPreferences : {}
    )
  }

  saveWithSecureForm(
    form,
    {
      onError,
      onSuccess,
      onNext,
    }
  ) {
    form.submit(`/v1/accounts/${this.accountId}`,
      {
        serializer: 'deep',
        serialization: 'json',
        data: this,
        mapDotToObject: 'merge',
      },
      (status, response) => {
        if (status >= 400) {
          if (!!onError !== false && typeof (onError) === 'function') {
            onError({ status, response })
          }
        } else {
          Object.keys(response).map(attrName =>
            this._setAttr(attrName, response[attrName])
          )

          if(!!onNext !== false && typeof(onNext) === 'function') {
            onNext(status, {
              ...response,
            })
          }
          if(!!onSuccess !== false && typeof(onSuccess) === 'function') {
            onSuccess(response)
          }
        }
      },
      (errors) => {
        if (!!onError !== false && typeof (onError) === 'function') {
          onError({
            errors,
            status: false,
            response: false,
          })
        }
      }
    )
  }
}
