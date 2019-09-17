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
  buttonStylesPrimary = SharedStyles.buttonStylesPrimary,
  buttonStylesSecondary = SharedStyles.buttonStylesSecondary,
}) => {
  return (
    <div id="button-group">
    { showAccept &&
      <button
        id="form-next-btn"
        className="ui right floated button big btn-primary"
        onClick={onNext}
        style={buttonStylesPrimary}
        >Accept
      </button>
    }
    { hideNext !== true && showAccept !== true &&
      <button
        id="form-next-btn"
        className="ui right floated button big btn-primary"
        onClick={onSubmit}
        style={buttonStylesPrimary}
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
        className="ui right floated button big btn-secondary"
        onClick={() => onLast()}
        style={buttonStylesSecondary}
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
  buttonStylesPrimary: PropTypes.object,

  /** Styles for your secondary CTA button.
  ** Eg. Previous, Cancel buttons. */
  buttonStylesSecondary: PropTypes.object,

}

export default ButtonGroup
