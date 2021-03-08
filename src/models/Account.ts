import { logError, logWarning } from "../helpers/Logger"
import EntityModel from "./EntityModel"
import { ShippingContact } from "./ShippingContact"
import Instrument from "./Instrument"
import { BillingContact } from "./BillingContact"

const ACCOUNTS_LIST_RESOURCE = "/v1/accounts"

export default class Account extends EntityModel {
  accountId = ""
  name = ""
  email = ""
  billingContact = new BillingContact()
  shippingContact = new ShippingContact()
  instrument: Instrument | undefined = new Instrument()

  constructor(params: Partial<Account>) {
    super(params)
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName]),
    )
    this.billingContact = new BillingContact(
      params
        ? {
            ...this.billingContact,
            ...params.billingContact,
          }
        : {},
    )
    this.shippingContact = new ShippingContact(
      params
        ? {
            ...this.shippingContact,
            ...params.shippingContact,
          }
        : {},
    )
    this.instrument = new Instrument(
      params
        ? {
            ...this.instrument,
            ...params.instrument,
          }
        : {},
    )
  }

  saveWithSecureForm(
    apiKey,
    form,
    { onError, onComplete, onNext, onValidationError },
    apiOptions,
  ) {
    const { loggingLevel = "" } = apiOptions

    if (!!apiKey === false) {
      throw new Error(
        "Unable to call save. Empty `apiKey`, make sure you have set your publicKey prop.",
      )
    }
    if (apiKey.startsWith("sk_") === true) {
      throw new Error(
        "Unable to call save. You are attempting to use a secret key.",
      )
    }

    return new Promise((resolve, reject) => {
      form.submit(
        ACCOUNTS_LIST_RESOURCE,
        {
          headers: {
            "X-RevOps-Client": "RevOps-JS",
            "X-RevOps-API-Version": "1.0.2",
            "Authorization": `Bearer ${apiKey}`,
          },
          serializer: "deep",
          serialization: "json",
          data: this.marshalize(),
          mapDotToObject: "merge",
        },
        (status, response) => {
          if (status >= 400) {
            if (status === 401) {
              logWarning(
                "[401] RevOps API access denied. Update your `publicKey`.",
                loggingLevel,
              )
            } else if (status === 400) {
              logWarning(
                "[400] RevOps API bad request:",
                loggingLevel,
                response,
              )
            } else {
              logError(`[${status}] RevOps API error:`, loggingLevel, response)
            }

            const error =
              !!response.error === true
                ? response.error
                : {
                    message: "Unknown Error",
                    code: "unknown_error",
                  }

            if (!!onError !== false && typeof onError === "function") {
              onError(error)
            }

            reject(error)
          } else {
            Object.keys(response).map(attrName =>
              this._setAttr(attrName, response[attrName]),
            )

            if (!!onNext !== false && typeof onNext === "function") {
              onNext(status, {
                ...response,
              })
            }

            if (!!onComplete !== false && typeof onComplete === "function") {
              onComplete(response)
            }

            resolve(response)
          }
        },
        errors => {
          // lift up instrument data and remove the prefix
          let _errors = Object.entries(errors).map(([key, value]) => {
            const keyName = key.replace("instrument.", "")
            return [
              keyName,
              {
                ...(value as Record<string, unknown>),
                elementId: keyName,
              },
            ]
          })

          // map back to object
          _errors = _errors.reduce(
            (mappedObject, [key, value]) => ({
              ...mappedObject,
              [key as string]: value,
            }),
            {},
          ) as any

          reject(_errors)

          if (!!onValidationError && typeof onValidationError === "function") {
            onValidationError(_errors)
          }
        },
      )
    })
  }
}
