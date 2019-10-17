import {
  EntityModel,
} from './index'

import _ from 'lodash'

const ACCOUNTS_LIST_RESOURCE = '/v1/accounts'

export class InstrumentModel extends EntityModel {
  accountId = ""
  businessAccountId = ""
  id = ""
  uri = ""
  accountNumber = ""
  cardCvv = ""
  cardExpdate = {
    month: "",
    year: ""
  }
  cardNumber = ""
  postalCode = ""
  cardToken = ""
  country = ""
  currency = ""
  holderName = ""
  isBusiness = ""
  isIndividual = ""
  last4 = ""
  method = ""
  provider = ""
  providerFingerprint = ""
  providerId = ""
  providerToken = ""
  routingNumber = ""
  status = ""

  constructor(params = {}) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    )
  }

  static fetchInstrument = async (accountId, id, token ) => {
    let options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const url = `https://vault.revops.io${ACCOUNTS_LIST_RESOURCE}/${accountId}/instruments/${id}`
    
    let response = await fetch(url, options)
    let responseOK = response && response.ok
    if (responseOK) {
      let data = await response.json()
      return new InstrumentModel(data)
    }

    return undefined
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
    if (!!apiKey === false) {
      throw new Error("Unable to call save. Empty `apiKey`, make sure you have set your publicKey prop.")
    }
    if (apiKey.startsWith('sk_') === true) {
      throw new Error("Unable to call save. You are attempting to use a secret key.")
    }

    form.submit(`${ACCOUNTS_LIST_RESOURCE}/${this.businessAccountId}/instruments`,
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${apiKey}`,
        },
        serializer: 'deep',
        serialization: 'json',
        data: this.marshalize(),
        mapDotToObject: 'merge',
      },
      (status, response) => {
        if (status >= 400) {
          if (status === 401) {
            console.warn("[401] RevOps API access denied. Update your `publicKey`.")
          } else if (status === 400) {
            console.warn(`[400] RevOps API bad request:` + response)
          } else {
            console.error(`[${status}] RevOps API error:` + response)
          }
          if (!!onError !== false && typeof (onError) === 'function') {
            onError(response)
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
      (errors) => {
        if (!!onValidationError !== false && typeof (onValidationError) === 'function') {
          // tell the developer a validation issue has occurred
          errors = Object.entries(errors).map(([key, value]) => {
            return [key, {
              ...value,
              key,
            }]
          })
          // map back to object
          errors = errors.reduce((
            mappedObject,
            [key, value]) =>
            ({
              ...mappedObject,
              [key]: value
            }),
            {}
          )
          onValidationError(errors)
        }
      }
    )
  }
}
