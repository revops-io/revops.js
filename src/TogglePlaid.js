import React from 'react'
import PropTypes from 'prop-types'
import * as SharedStyles from './SharedStyles'

export const TogglePlaid = ({
  linkStyling = SharedStyles.linkStyling,
  togglePlaidHandler,
  plaidSelected = false,
}) => (
  <a className="manual-link" style={linkStyling} onClick={() => togglePlaidHandler()}>
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
  togglePlaidHandler: PropTypes.func.isRequired,
}

export default TogglePlaid
