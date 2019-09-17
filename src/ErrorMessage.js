import React from 'react'
import PropTypes from 'prop-types'

import { getErrorText } from './FormHelpers'

export const ErrorMessage = ({
  errors,
  errorKey,
  label,
  component = 'span'
}) => (
  <span>{getErrorText(label, errorKey, errors)}</span>
)

ErrorMessage.propTypes = {
  label: PropTypes.string,
  errorKey: PropTypes.string.isRequired,
  errors: PropTypes.any,
  component: PropTypes.string,
}

export default ErrorMessage
