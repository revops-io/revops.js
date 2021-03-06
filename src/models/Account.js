import {
  EntityModel,
  BillingContact,
  ShippingContact,
  Instrument
} from "./index";

import { logError, logWarning } from "../helpers/Logger";

const ACCOUNTS_LIST_RESOURCE = "/v1/accounts";

export class Account extends EntityModel {
  accountId = "";
  name = "";
  email = "";
  billingContact = new BillingContact();
  shippingContact = new ShippingContact();
  instrument = new Instrument();

  constructor(params = {}) {
    super(params);
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    );
    this.billingContact = new BillingContact(
      !!params === true
        ? {
            ...this.billingContact,
            ...params.billingContact
          }
        : {}
    );
    this.shippingContact = new ShippingContact(
      !!params === true
        ? {
            ...this.shippingContact,
            ...params.shippingContact
          }
        : {}
    );
    this.instrument = new Instrument(
      !!params === true
        ? {
            ...this.instrument,
            ...params.instrument
          }
        : {}
    );
  }

  saveWithSecureForm(
    apiKey,
    form,
    { onError, onComplete, onNext, onValidationError },
    apiOptions
  ) {
    const { loggingLevel = "" } = apiOptions;

    return new Promise((resolve, reject) => {
      form.submit(
        ACCOUNTS_LIST_RESOURCE,
        {
          headers: {
            "X-RevOps-Client": "RevOps-JS",
            "X-RevOps-API-Version": "1.0.2",
            Authorization: `Bearer ${apiKey}`
          },
          serializer: "deep",
          serialization: "json",
          data: this.marshalize(),
          mapDotToObject: "merge"
        },
        (status, response) => {
          if (status >= 400) {
            if (status === 401) {
              logWarning(
                "[401] RevOps API access denied. Update your `publicKey` or `getToken` callback.",
                loggingLevel
              );
            } else if (status === 400) {
              logWarning(
                "[400] RevOps API bad request:",
                loggingLevel,
                response
              );
            } else {
              logError(`[${status}] RevOps API error:`, loggingLevel, response);
            }

            const error =
              !!response.error === true
                ? response.error
                : {
                    message: "Unknown Error",
                    code: "unknown_error"
                  };

            if (!!onError && typeof onError === "function") {
              onError(error);
            }

            reject(error);
          } else {
            Object.keys(response).map(attrName =>
              this._setAttr(attrName, response[attrName])
            );

            if (!!onNext && typeof onNext === "function") {
              onNext(status, {
                ...response
              });
            }

            if (!!onComplete && typeof onComplete === "function") {
              onComplete(response);
            }

            resolve(response);
          }
        },
        errors => {
          // lift up instrument data and remove the prefix
          let _errors = Object.entries(errors).map(([key, value]) => {
            const keyName = key.replace("instrument.", "");
            return [
              keyName,
              {
                ...value,
                elementId: keyName
              }
            ];
          });

          // map back to object
          _errors = _errors.reduce(
            (mappedObject, [key, value]) => ({
              ...mappedObject,
              [key]: value
            }),
            {}
          );

          reject(_errors);

          if (
            !!onValidationError &&
            typeof onValidationError === "function"
          ) {
            onValidationError(_errors);
          }
        }
      );
    });
  }
}
