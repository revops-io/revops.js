import configure from './client/VaultConfig'

/* configureVault
 * @param env - string - options are local, staging, production.
 * @param onLoad - function - called when vault is loaded.
 */
export const configureVault = (
  apiOptions = {
    env: 'production',
  },
  onLoad: false,
) => {
  if (!!window !== true && !!document !== true) {
    throw new Error("Illegal call. `configureVault` is being executed outside browser context.")
  }

  const script = document.createElement("script")
  script.src = configure(apiOptions).vaultCollectUrl
  script.async = true
  script.onload = onLoad

  document.body.appendChild(script)
}

/* configurePlaid
 * @param env - string - options are local, staging, production.
 * @param onLoad - function(plaidLink) - called when plaid is loaded.
 * @param onSelect - function(publicToken, metadata) - called when account is selected.
 */
export const configurePlaid = (
  env = false,
  onLoad = false,
  onSelect = false,
) => {

  if (!!window !== true && !!document !== true) {
    throw new Error("Illegal call. `configurePlaid` is being executed outside browser context.")
  }

  const plaid = document.createElement("script")
  plaid.src = configure(env).plaidUrl
  plaid.async = true
  plaid.onload = () => {
    const handleOnSuccess = (publicToken, metadata) => {
      onSelect(publicToken, metadata)
    }

    const plaidLink = window.Plaid.create({
      env: configure(env).plaidEnvironment,
      clientName: 'RevOps.js',
      key: configure(env).plaidKey,
      product: ['auth'],
      selectAccount: true,
      onSuccess: handleOnSuccess,
      onExit: function(err, metadata) {
        // The user exited th Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
        }
      },
    })

    onLoad(plaidLink)
  }
  document.body.appendChild(plaid);
}

export { default as ErrorMessage } from './ErrorMessage'
export { default as Field } from './Field'
export { default as TogglePlaid } from './TogglePlaid'
export { default as StandardTerms } from './StandardTerms'
export { default as CreditCardForm } from './CreditCardForm'
export { default as SignupForm } from './SignupForm'
export { default as StepNavigation } from './StepNavigation'
export { default as PayAsYouGoForm } from './PayAsYouGoForm'
export { default as ContactInformation } from './ContactInformation'
export { default as FormProgress } from './FormProgress'
export { default as PaymentMethod } from './PaymentMethod'
export { default as PaymentPortal } from './PaymentPortal'
export { default as PlaidForm } from './PlaidForm'
export { default as AchForm } from './AchForm'
export { default as EmailInvoice } from './EmailInvoice'
export { default as StripeForm } from './StripeForm'
export { default as AddressForm } from './AddressForm'
export { default as Wrapper } from './Wrapper'
export { default as SignUp } from './SignUp'
export { default as RevOps } from './RevOps'
