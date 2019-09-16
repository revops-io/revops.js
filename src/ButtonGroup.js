import React from 'react'
import PropTypes from 'prop-types'
import { buttonStylesPrimary, buttonStylesSecondary } from './SharedStyles'

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
    <div id="form-nav">
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
  loading: PropTypes.boolean,
  onNext: PropTypes.func,
  onLast: PropTypes.func,
  finalStep: PropTypes.func,
  onSubmit: PropTypes.func,
  showAccept: PropTypes.boolean,
  hideNext: PropTypes.boolean,
  hidePrevious: PropTypes.boolean,
}

export default ButtonGroup
