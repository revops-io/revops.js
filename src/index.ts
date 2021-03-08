import configure from "./client/VaultConfig"

/* configureVault
 * @param env - string - options are local, staging, production.
 * @param onLoad - function - called when vault is loaded.
 */
export const configureVault = (
  apiOptions = {
    env: "production",
  },
  onLoad,
) => {
  if (!window && !document) {
    throw new Error(
      "Illegal call. `configureVault` is being executed outside browser context.",
    )
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
export const configurePlaid = (env, onLoad, onSelect) => {
  if (!window && !document) {
    throw new Error(
      "Illegal call. `configurePlaid` is being executed outside browser context.",
    )
  }

  const plaid = document.createElement("script")
  plaid.src = configure(env).plaidUrl
  plaid.async = true
  plaid.onload = () => {
    const handleOnSuccess = (publicToken, metadata) => {
      onSelect?.(publicToken, metadata)
    }

    const plaidLink = window.Plaid.create({
      env: configure(env).plaidEnvironment,
      clientName: "RevOps.js",
      key: configure(env).plaidKey,
      product: ["auth"],
      selectAccount: true,
      onSuccess: handleOnSuccess,
      onExit: function (err) {
        // The user exited th Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
        }
      },
    })

    onLoad?.(plaidLink)
  }
  document.body.appendChild(plaid)
}
