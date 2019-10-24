import {
  EntityModel,
} from './index'

import { logError, logWarning } from '../helpers/Logger'

import _ from 'lodash'


const INSTRUMENTS_LIST_RESOURCE = (account_id) => `/v1/accounts/${account_id}/instruments`

/**
 * Instruments are methods of payment
 * See more at https://www.revops.io/docs/rest-api/instruments
 */
export class Instrument extends EntityModel {
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
  isPrimary = ""
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

  static fetchInstrument = async (accountId, id, token, apiOptions = {} ) => {
    let options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    
    const url = `https://vault.revops.io${INSTRUMENTS_LIST_RESOURCE(accountId)}/${id}`
    try {
      let response = await fetch(url, options)
      let responseOK = response && response.ok
      if (responseOK) {
        let data = await response.json()
        return new Instrument(data)
      }
    } catch(err){
      logError("Unable to fetch instruments", apiOptions.loggingLevel, err)
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
    },
    apiOptions,
  ) {
    const { loggingLevel = "" } = apiOptions

    if (!!apiKey === false) {
      throw new Error("Unable to call save. Empty `apiKey`, make sure you have set your publicKey prop.")
    }
    if (apiKey.startsWith('sk_') === true) {
      throw new Error("Unable to call save. You are attempting to use a secret key.")
    }

    form.submit(INSTRUMENTS_LIST_RESOURCE(this.businessAccountId),
      {
        headers: {
          'X-RevOps-Client': 'RevOps-JS',
          'X-RevOps-API-Version': '1.0.2',
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
            logWarning("[401] RevOps API access denied. Update your `publicKey`.", loggingLevel)
          } else if (status === 400) {
            logWarning("[400] RevOps API bad request:", loggingLevel, response)
          } else {
            logError(`[${status}] RevOps API error:`, loggingLevel, response)
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
