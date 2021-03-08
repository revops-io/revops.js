/* FormHelpers - lightweight helper methods for rendering information
 */

/* getErrorText - reveals error messages when errors are return */
import Instrument from "./models/Instrument"

export const getErrorText = (
  prefix: string,
  errorKey: string,
  errors: Record<string, { errorMessages: string[] }>,
) => {
  if (!!errors && !!errors[errorKey]) {
    return prefix + " " + errors[errorKey].errorMessages[0]
  } else {
    return ""
  }
}

/* getClassName - reveals correct className when an error occurs */
export const getClassName = (
  className: string,
  errorKey: string,
  errors: Record<string, { errorMessages: string[] }>,
) => {
  className = `field ${className}`
  if (!!errors && !!errors[errorKey]) {
    return className + " validation-error"
  } else {
    return className
  }
}
export const createErrorMessage = (errorKey, errorMessage) => {
  return {
    [errorKey]: {
      errorMessages: [errorMessage],
    },
  }
}
/* getUserErrorMessageFromAPI - converts server error message to client error format */
export const convertAPIError = (
  httpStatus: number,
  httpResponse: { error: { param: string; message: string } },
) => {
  if (httpStatus >= 400) {
    if (!!httpResponse.error && !!httpResponse.error.param) {
      let param: string
      switch (httpResponse.error.param) {
        case "exp_year":
        case "exp_month":
          param = "billing_preferences.card_expdate"
          break
        default:
          param = "networkError"
          break
      }

      return createErrorMessage(param, httpResponse.error.message)
    }

    return createErrorMessage(
      "networkError",
      "Please try again. If this persists, contact support.",
    )
  } else {
    return null
  }
}

/*
 * `getDefaultValue`
 * Retrieve existing or default value from account.billingPreferences object
 *
 */
export const getDefaultValue = (
  model: Account | Instrument,
  billingProp: string,
  defaultValue: string,
) => {
  return !!model && !!model[billingProp] ? model[billingProp] : defaultValue
}

const getExpMonth = (instrument: Instrument) => {
  return instrument.cardExpdate.month ? instrument.cardExpdate.month : ""
}

const getExpYear = (instrument: Instrument) => {
  return instrument.cardExpdate.year ? instrument.cardExpdate.year : ""
}

export const getDefaultCardExpDate = (instrument: Instrument) => {
  if (!instrument?.cardExpdate?.year || !instrument?.cardExpdate?.month) {
    return ""
  }

  return `${getExpMonth(instrument)}/${getExpYear(instrument)}`
}

export const isInstrumentUpdate = (instrument: Instrument) => {
  if (!instrument?.id) {
    return false
  }
  return instrument.id.startsWith("inst_") === true
}
