import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { buttonStylesPrimary, buttonStylesSecondary, buttonStylesTertiary } from './SharedStyles'

export const ButtonGroup = ({ onNext, onLast, onCancel, finalStep, onSubmit, showAccept, hideNext, hidePrevious }) => {
  return (
    <div id="form-nav">
    { showAccept &&
      <button
        id="form-next-btn"
        className="ui right floated button"
        onClick={onNext}
        style={buttonStylesPrimary}
        >Accept
      </button>
    }
    { hideNext !== true && showAccept !== true &&
      <button
        id="form-next-btn"
        className="ui right floated button"
        onClick={onSubmit}
        style={buttonStylesPrimary}
        >{finalStep ? 'Submit' : 'Next'}
      </button>
    }
    { hidePrevious !== true &&
      <button
        id="form-prev-btn"
        className="ui right floated button"
        onClick={() => onLast()}
        style={buttonStylesSecondary}
        >Previous
      </button>
    }
    </div>
  )
}
