import "./styles.css"

const styleDependencies = [
  "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css",
  "https://use.fontawesome.com/releases/v5.7.2/css/all.css",
]

const jsDependencies = [
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js",
]

const addStylesheet = (url) => {
  const link = document.createElement("link")
  link.href = url
  link.rel = "stylesheet"
  link.crossorigin = "anonymous"
  document.body.appendChild(link);
}

const addJS = (url, onload = () => {}) => {
  const script = document.createElement("script")

  script.src = url
  script.async = true
  script.onload = () => {
    onload()
  }
  document.body.appendChild(script);
}



export { default as StandardTerms } from './StandardTerms'
export { default as CreditCardForm } from './CreditCardForm'
export { default as SignupForm } from './SignupForm'
export { default as StepNavigation } from './StepNavigation'
export { default as PayAsYouGoForm } from './PayAsYouGoForm'
export { default as ContactInformation } from './ContactInformation'
export { default as FormProgress } from './FormProgress'
export { default as PaymentMethod } from './PaymentMethod'
export { default as PaymentPortal } from './PaymentPortal'

styleDependencies.forEach(stylesheet => addStylesheet(stylesheet))
jsDependencies.forEach(js => addJS(js))
