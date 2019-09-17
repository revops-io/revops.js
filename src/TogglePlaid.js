import React from 'react'
import PropTypes from 'prop-types'

export const TogglePlaid = ({
  linkStyling,
  toggleHandler,
  plaidSelected = false,
}) => (
  <a className="manual-link" style={linkStyling} onClick={() => toggleHandler()}>
    {
      plaidSelected === true ?
        'or manually enter bank account details'
        :
        'or connect your bank instantly with Plaid'
    }
  </a>
)

TogglePlaid.propTypes = {
  linkStyling: PropTypes.object,
  toggleHandler: PropTypes.func.isRequired,
}

export default TogglePlaid
