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

  saveWithSecureForm(
    form,
    {
      formName,
      onError,
      onComplete,
      onNext,
    }
  ) {

    form.submit(`/v1/accounts/${this.id}`,
      {
        serializer: 'deep',
        serialization: 'json',
        data: this,
        mapDotToObject: 'merge',
      },
      (status, response) => {
        if (status >= 400) {
          if(!!onError !== false && typeof(onError) === 'function') {
            onError({status, response})
          }
        } else {
          Object.keys(response).map(attrName =>
            this._setAttr(attrName, response[attrName])
          )

          if(!!onNext !== false && typeof(onNext) === 'function') {
            onNext(status, {
              ...response,
              [formName]: true
            })
          }
          if(!!onComplete !== false && typeof(onComplete) === 'function') {
            onComplete(response)
          }

        }
      },
      (errors) => {
        if(!!onError !== false && typeof(onError) === 'function') {
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
