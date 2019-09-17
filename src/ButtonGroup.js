import React from 'react'
import PropTypes from 'prop-types'
import * as SharedStyles from './SharedStyles'

export const ButtonGroup = ({
  loading = false,
  onNext,
  onLast,
  finalStep,
  onSubmit,
  showAccept,
  hideNext,
  hidePrevious = true,
}) => {
  return (
    <div id="button-group">
    { showAccept &&
      <button
        id="form-next-btn"
        className="btn-primary"
        onClick={onNext}
        >Accept
      </button>
    }
    { hideNext !== true && showAccept !== true &&
      <button
        id="form-next-btn"
        className="btn-primary"
        onClick={onSubmit}
        >
        {loading === false ?
          (finalStep ?
            'Save'
            :
            'Next'
          ) : null
        }
        {loading === true ?
          (finalStep ?
            'Creating...'
            :
            'Loading...'
          ) : null
        }
      </button>
    }
    { hidePrevious !== true &&
      <button
        id="form-prev-btn"
        className="btn-secondary"
        onClick={() => onLast()}
        >Previous
      </button>
    }
    </div>
  )
}

ButtonGroup.propTypes = {
  loading: PropTypes.bool,
  onNext: PropTypes.func,
  onLast: PropTypes.func,
  finalStep: PropTypes.bool,
  onSubmit: PropTypes.func,
  showAccept: PropTypes.bool,
  hideNext: PropTypes.bool,
  hidePrevious: PropTypes.bool,

  /** Styles for your primary CTA button. */
  // buttonStylesPrimary: PropTypes.object,

  /** Styles for your secondary CTA button.
  ** Eg. Previous, Cancel buttons. */
  // buttonStylesSecondary: PropTypes.object,

}

export default ButtonGroup
