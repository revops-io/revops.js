import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { buttonStylesPrimary, buttonStylesSecondary, buttonStylesTertiary } from './SharedStyles'

export const ButtonGroup = ({
  loading = false,
  onNext,
  onLast,
  onCancel,
  finalStep,
  onSubmit,
  showAccept,
  hideNext,
  hidePrevious,
}) => {
  return (
    <div id="form-nav">
    { showAccept &&
      <button
        id="form-next-btn"
        className="ui right floated button big"
        onClick={onNext}
        style={buttonStylesPrimary}
        >Accept
      </button>
    }
    { hideNext !== true && showAccept !== true &&
      <button
        id="form-next-btn"
        className="ui right floated button big"
        onClick={onSubmit}
        style={buttonStylesPrimary}
        >
        {loading === false ?
          (finalStep ?
            'Submit'
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
        className="ui right floated button big"
        onClick={() => onLast()}
        style={buttonStylesSecondary}
        >Previous
      </button>
    }
    </div>
  )
}
