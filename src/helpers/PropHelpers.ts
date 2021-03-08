import pick from "lodash/pick"
import { CSSProperties } from "react"

const iframeOverrideProps = [
  "placeholder",
  "color",
  "errorColor",
  "css",
  "autoFocus",
]
const fieldOverrideProps = ["label", "errorMsg", "showInlineError"]

export class PropertyHelper {
  private readonly overrideProps: Record<string, { css: CSSProperties }> = {}
  private readonly inputStyles: CSSProperties = {}
  constructor(overrideProps = {}, inputStyles = {}) {
    this.overrideProps = overrideProps
    this.inputStyles = inputStyles
  }

  overrideCollectProps = (propName, alsoAcceptProps = []) => {
    let currentOverrideProps = this.overrideProps[propName]

    // specific css should merge over inputStyles
    if (!!currentOverrideProps && !!currentOverrideProps.css) {
      currentOverrideProps = {
        ...currentOverrideProps,
        css: {
          ...this.inputStyles,
          ...currentOverrideProps.css,
        },
      }
    }

    return pick(
      // only permit certain keys
      currentOverrideProps,
      iframeOverrideProps.concat(alsoAcceptProps),
    )
  }

  overrideFieldProps = (propName, alsoAcceptProps = []) => {
    return pick(
      // only permit certain keys
      this.overrideProps[propName],
      fieldOverrideProps.concat(alsoAcceptProps),
    )
  }
}
