import {
  EntityModel,
  BillingContact,
  ShippingContact,
  BillingPreferences,
} from './index'

export class Account extends EntityModel {
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
    apiKey,
    form,
    {
      onError,
      onComplete,
      onNext,
      onValidationError,
    }
  ) {
    if (!!apiKey === false || apiKey.startsWith('pk_') === false) {
      throw new Error("Unable to call save. Empty `apiKey`, make sure you have set your publicKey prop.")
    }
    form.submit(`/v1/accounts/${this.id}`,
      {
        headers: {
          'X-RevOps-Client': 'RevOps-JS',
          'X-RevOps-API-Version': '1.0.2',
          'Authorization': `Bearer ${apiKey}`,
        },
        serializer: 'deep',
        serialization: 'json',
        data: this,
        mapDotToObject: 'merge',
      },
      (status, response) => {
        if (status >= 400) {
          if (status === 401) {
            console.warn("[401] RevOps API access denied. Update your `publicKey`.")
          } else if (status === 400) {
            console.warn(`[400] RevOps API bad request: ${response}`)
          } else {
            console.error(`[${status}] RevOps API error: ${JSON.stringify(response)}`)
          }
          if (!!onError !== false && typeof (onError) === 'function') {
            onError({ status, error: response.error })
          }
        } else {
          Object.keys(response).map(attrName =>
            this._setAttr(attrName, response[attrName])
          )

          if (!!onNext !== false && typeof (onNext) === 'function') {
            onNext(status, {
              ...response,
            })
          }

          if (!!onComplete !== false && typeof (onComplete) === 'function') {
            onComplete(response)
          }
        }
      },
      () => {
        if (!!onValidationError !== false && typeof (onValidationError) === 'function') {
          // tell the developer a validation issue has occurred
          onValidationError()
        }
      }
    )
  }
}
