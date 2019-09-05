import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { buttonStylesPrimary, buttonStylesSecondary, buttonStylesTertiary } from './SharedStyles'

export const ButtonGroup = ({ onNext, onLast, onCancel, finalStep, onSubmit, showAccept, hideOnNext, creditCardSubmit, achSubmit, }) => {
  // const { onLast, onCancel, finalStep } = this.props
  return (
    <div id="form-nav">
      <button
        id="form-cancel-btn"
        className="ui left floated button"
        onClick={() => onCancel()}
        style={buttonStylesTertiary}
        >Cancel
      </button>
    { showAccept &&
      <button
        id="form-next-btn"
        className="ui right floated button"
        onClick={onNext}
        style={buttonStylesPrimary}
        >Accept
      </button>
    }
    { hideOnNext !== true && showAccept !== true &&
      <button
        id="form-next-btn"
        className="ui right floated button"
        onClick={onSubmit}
        style={buttonStylesPrimary}
        >{finalStep ? 'Submit' : 'Next'}
      </button>
    }
    {/* If there are no previous steps, this button should not appear */}
      <button
        id="form-prev-btn"
        className="ui right floated button"
        onClick={() => onLast()}
        style={buttonStylesSecondary}
        >Previous
      </button>
    </div>
  )
}
