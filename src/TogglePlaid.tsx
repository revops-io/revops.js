import React, { CSSProperties } from "react"
import { linkStyling as defaultLinlStyling } from "./SharedStyles"

interface Props {
  linkStyling: CSSProperties
  togglePlaidHandler: () => void
  plaidSelected?: boolean
}

export default function TogglePlaid({
  linkStyling = defaultLinlStyling,
  plaidSelected,
  togglePlaidHandler,
}: Props) {
  return (
    <a className="manual-link" onClick={togglePlaidHandler} style={linkStyling}>
      {plaidSelected
        ? "or manually enter bank account details"
        : "or connect your bank instantly with Plaid"}
    </a>
  )
}
