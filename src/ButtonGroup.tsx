import React, { CSSProperties } from "react"
import * as SharedStyles from "./SharedStyles"

interface Props {
  loading?: boolean
  onNext?: () => void
  onLast: () => void
  finalStep?: boolean
  onSubmit: () => void
  showAccept?: boolean
  hideNext?: boolean
  hidePrevious?: boolean
  buttonStylesPrimary: CSSProperties
  buttonStylesSecondary: CSSProperties
}

export default function ButtonGroup({
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
}: Props) {
  return (
    <div id="button-group">
      {showAccept && (
        <button
          className="btn-primary"
          id="form-next-btn"
          onClick={onNext}
          style={buttonStylesPrimary}>
          Accept
        </button>
      )}
      {hideNext !== true && showAccept !== true && (
        <button
          className="btn-primary"
          id="form-next-btn"
          onClick={onSubmit}
          style={buttonStylesPrimary}>
          {loading === false ? (finalStep ? "Save" : "Next") : null}
          {loading === true ? (finalStep ? "Creating..." : "Loading...") : null}
        </button>
      )}
      {hidePrevious !== true && (
        <button
          className="btn-secondary"
          id="form-prev-btn"
          onClick={onLast}
          style={buttonStylesSecondary}>
          Previous
        </button>
      )}
    </div>
  )
}
