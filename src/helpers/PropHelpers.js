import _ from 'lodash'

const iframeOverrideProps = ['placeholder', 'color', 'errorColor', 'css', 'showCardIcon']
const fieldOverrideProps = ['label']

export const overrideCollectProps = (
  propName, 
  overrideProps, 
  inputStyles = {},
  alsoAcceptProps = []
) => {

  let fieldProps = overrideProps[propName]

  // specific css should merge over inputStyles
  if(!!fieldProps.css === true){
    fieldProps = {
      ...fieldProps,
      css: {
        ...inputStyles,
        ...fieldProps.css,
      }
    }
  }

  return _.pick(fieldProps, iframeOverrideProps.concat(alsoAcceptProps))
}

export const overrideFieldProps = (
  propName, 
  overrideProps, 
  alsoAcceptProps = []
) => {
  return _.pick(
    overrideProps[propName], 
    fieldOverrideProps.concat(alsoAcceptProps)
  )
}

export class PropertyHelper {
  constructor(overrideProps = {}, inputStyles = {}){
    this.overrideProps = overrideProps
    this.inputStyles = inputStyles
  }

  overrideCollectProps = (
    propName, 
    alsoAcceptProps = []
  ) => {
    
    let currentOverrideProps = this.overrideProps[propName]

    // specific css should merge over inputStyles
    if(!!currentOverrideProps.css === true){
      currentOverrideProps = {
        ...currentOverrideProps,
        css: {
          ...this.inputStyles,
          ...currentOverrideProps.css,
        }
      }
    }

    return _.pick(  // only permit certain keys
      currentOverrideProps, 
      iframeOverrideProps.concat(alsoAcceptProps)
    )
  }

  overrideFieldProps = (
    propName, 
    alsoAcceptProps = []
  ) => {
    return _.pick( // only permit certain keys
      this.overrideProps[propName], 
      fieldOverrideProps.concat(alsoAcceptProps)
    )
  }
}