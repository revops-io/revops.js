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
