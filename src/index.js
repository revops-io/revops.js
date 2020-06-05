import configure from './client/VaultConfig'

/* configureVault
 * @param env - string - options are local, staging, production.
 * @param onLoad - function - called when vault is loaded.
 */
export const configureVault = (
  apiOptions = {
    env: 'production',
  },
  onLoad
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

export { default as ErrorMessage } from './ErrorMessage'
export { default as Field } from './Field'
export { default as CreditCardForm } from './CreditCardForm'
export { default as AchForm } from './AchForm'
export { default as SignUp } from './SignUp'
export { default as RevOpsAuth } from './RevOpsAuth'
