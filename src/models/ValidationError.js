import PropTypes from 'prop-types'

class ValidationError {

}

ValidationError.propTypes = PropTypes.objectOf(
    PropTypes.shape({
      isDirty: PropTypes.bool,
      isFocused: PropTypes.bool,
      errorMessages: PropTypes.array,
      isValid: PropTypes.bool,
      name: PropTypes.string,
    }),
    // ...
  )
