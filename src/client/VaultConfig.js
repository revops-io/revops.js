const production = () => ({
  name: 'production',
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACvYkoDARh7Ajf3DhktqckgY.js',
  revopsBaseUrl: 'https://vault.revops.io',
  plaidUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  plaidEnvironment: 'development', // production when we are ready
  plaidKey: 'c648203cbd9ce4b7ea39f26c61f115',
  vaultId: 'tnt2w1xznia',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-production',
})


const configurations = () => ({
  "production": production(),
})

export const configure = (env = false) => {
  let environments = configurations()
  if (env !== false) {
    if (!!environments[env] === false) {
      throw new Error("Unable to locate environment selected: ", env)
    }

    return environments[env]
  }

  return environments['production']
}

export default configure
