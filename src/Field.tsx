import React, { ReactNode } from "react"
import { getClassName } from "./FormHelpers"
import snakeCase from "lodash/snakeCase"
import ErrorMessage from "./ErrorMessage"

interface Props {
  id: string
  name: string
  label?: string
  showInlineError: boolean
  errors: Record<string, unknown>
  errorMsg?: ReactNode
}

export default function Field({
  id,
  name,
  errors,
  label,
  showInlineError,
  errorMsg,
}: Props) {
  const elementKey = snakeCase(name)
  return (
    <div
      className={getClassName(`${id}-container`, elementKey, errors)}
      id={id}>
      {label && (
        <label className="hidden" htmlFor={id}>
          {label}
        </label>
      )}
      <span className="field-space" />
      {showInlineError && (
        <ErrorMessage
          errorKey={elementKey}
          errorMsg={errorMsg}
          errors={errors}
          label={label ?? ""}
        />
      )}
    </div>
  )
}
