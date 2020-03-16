import { EntityModel } from "./index";

import { isInstrumentUpdate } from "../FormHelpers";

import { logError, logWarning } from "../helpers/Logger";

const INSTRUMENTS_LIST_RESOURCE = account_id =>
  `/v1/accounts/${account_id}/instruments`;
const INSTRUMENTS_INSTANCE_RESOURCE = (account_id, instrument_id) => {
  return `/v1/accounts/${account_id}/instruments/${instrument_id}`;
};

/**
 * Instruments are methods of payment
 * See more at https://www.revops.io/docs/rest-api/instruments
 */
export class Instrument extends EntityModel {
  accountId = "";
  businessAccountId = "";
  id = "";
  uri = "";
  accountNumber = "";
  cardCvv = "";
  cardExpdate = {
    month: "",
    year: ""
  };
  cardNumber = "";
  postalCode = "";
  cardToken = "";
  country = "";
  currency = "";
  holderName = "";
  isBusiness = "";
  isIndividual = "";
  isPrimary = "";
  last4 = "";
  method = "";
  provider = "";
  providerFingerprint = "";
  providerId = "";
  providerToken = "";
  routingNumber = "";
  status = "";

  constructor(params = {}) {
    super(params);
    Object.keys(params).map(attrName =>
      this._setAttr(attrName, params[attrName])
    );
  }

  static fetchInstrument = async function(
    accountId,
    id,
    token,
    apiOptions = {}
  ) {
    let options = {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json;charset=UTF-8"
      }
    };

    const url = `https://vault.revops.io${INSTRUMENTS_LIST_RESOURCE(
      accountId
    )}/${id}`;
    try {
      let response = await fetch(url, options);
      let responseOK = response && response.ok;
      if (responseOK) {
        let data = await response.json();
        return new Instrument(data);
      }
    } catch (err) {
      logError("Unable to fetch instruments", apiOptions.loggingLevel, err);
    }

    return undefined;
  };

  saveWithSecureForm(
    apiKey,
    form,
    { onError, onComplete, onNext, onValidationError },
    apiOptions
  ) {
    const { loggingLevel = "" } = apiOptions;

    if (!!apiKey === false) {
      throw new Error(
        "Unable to call save. Empty `apiKey`, make sure you have set your publicKey prop."
      );
    }
    if (apiKey.startsWith("sk_") === true) {
      throw new Error(
        "Unable to call save. You are attempting to use a secret key."
      );
    }

    const url = isInstrumentUpdate(this)
      ? INSTRUMENTS_INSTANCE_RESOURCE(this.businessAccountId, this.id)
      : INSTRUMENTS_LIST_RESOURCE(this.businessAccountId);

    return new Promise((resolve, reject) => {
      form.submit(
        url,
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
                "[401] RevOps API access denied. Update your `publicKey`.",
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

            if (!!onError !== false && typeof onError === "function") {
              onError(error);
            }

            if (!!reject !== false && typeof reject === "function") {
              reject(error);
            } else {
              logError("No 'reject' function was supplied to the promise");
            }
          } else {
            Object.keys(response).map(attrName =>
              this._setAttr(attrName, response[attrName])
            );

            if (!!onNext !== false && typeof onNext === "function") {
              onNext(status, {
                ...response
              });
            }

            if (!!onComplete !== false && typeof onComplete === "function") {
              onComplete(response);
            }

            if (!!resolve !== false && typeof resolve === "function") {
              resolve(response);
            } else {
              logError("No 'resolve' function was supplied to the promise");
            }
          }
        },
        errors => {
          let _errors = Object.entries(errors).map(([key, value]) => {
            return [
              key,
              {
                ...value,
                key
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

          if (!!reject !== false && typeof reject === "function") {
            reject(_errors);
          }

          if (
            !!onValidationError !== false &&
            typeof onValidationError === "function"
          ) {
            // tell the developer a validation issue has occurred
            onValidationError(_errors);
          }
        }
      );
    });
  }
}
