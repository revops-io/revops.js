import _ from 'lodash'

const iframeOverrideProps = ['placeholder', 'color', 'errorColor', 'css', 'autoFocus']
const fieldOverrideProps = ['label', 'errorMsg', 'showInlineError']

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
    if(!!currentOverrideProps === true && !!currentOverrideProps.css === true){
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