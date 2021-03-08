import React, { ReactNode } from "react"
import { getErrorText } from "./FormHelpers"

interface Props {
  errors: Record<string, unknown>
  errorKey: string
  label: string
  errorMsg?: ReactNode
}

export default function ErrorMessage({
  errors,
  errorKey,
  label,
  errorMsg,
}: Props) {
  const error = getErrorText(label, errorKey, errors)
  return (
    <span className={`field-sub-text ${error ? "error" : ""}`}>
      {error ? errorMsg ?? error : ""}
    </span>
  )
}
