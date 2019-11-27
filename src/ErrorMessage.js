import React from 'react'
import PropTypes from 'prop-types'

import { getErrorText } from './FormHelpers'

export const ErrorMessage = ({
  errors,
  errorKey,
  label,
  errorMsg,
}) => {
  const error = getErrorText(label, errorKey, errors)
  return (
    <span className={`field-sub-text ${!!error === true ? "error" : ""}`} >
      {!!error === true ? errorMsg || error : ""}
    </span>
  )
}

ErrorMessage.propTypes = {
  label: PropTypes.string,
  errorKey: PropTypes.string.isRequired,
  errors: PropTypes.any,
  errorMsg: PropTypes.node,
}

export default ErrorMessage
