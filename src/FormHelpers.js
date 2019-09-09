/* FormHelpers - lightweight helper methods for rendering information
 */

/* getErrorText - reveals error messages when errors are return */
export const getErrorText = (prefix, errorKey, errors) => {
  if (!!errors === true && !!errors[errorKey] === true) {
    return prefix + ' ' + errors[errorKey]['errorMessages'][0]
  } else {
    return ''
  }
}

/* getClassName - reveals correct className when an error occurs */
export const getClassName = (className, errorKey, errors) => {
  if (!!errors === true && !!errors[errorKey] === true) {
    return className + ' validation-error'
  } else {
    return className
  }
}
export const createErrorMessage = (errorKey, errorMessage) => {
  return {
    [errorKey]: {
      'errorMessages' : [errorMessage]
    }
  }
}
/* getUserErrorMessageFromAPI - converts server error message to client error format */
export const convertAPIError = (httpStatus, httpResponse) => {
  if (httpStatus !== false && httpStatus >= 400) {
    if (!!httpResponse.error !== false && !!httpResponse.error.param !== false) {
      let param = ''
      switch(httpResponse.error.param) {
        case 'exp_year':
        case 'exp_month':
          param = 'billingPreferences.cardExpdate'
          break
        default:
          param = 'networkError'
          break
      }

      return createErrorMessage(
        param,
        httpResponse.error.message,
      )
    }

    return createErrorMessage(
      'networkError',
      'Please try again. If this persists, contact support.'
    )
  } else {
    return null
  }
}