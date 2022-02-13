const ENV_PRODUCTION = 'production'
const ENV_SANDBOX = 'sandbox'

const production = () => ({
  name: ENV_PRODUCTION,
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACvYkoDARh7Ajf3DhktqckgY.js',
  revopsBaseUrl: 'https://vault.revops.io',
  vaultId: 'tnt2w1xznia',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-production'
})

const sandbox = () => ({
  name: ENV_SANDBOX,
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACvYkoDARh7Ajf3DhktqckgY.js',
  revopsBaseUrl: 'https://vault.revops.io',
  vaultId: 'tnt2w1xznia',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-production'
})

const configurations = () => ({
  production: production(),
  sandbox: sandbox()
})

export const configure = (apiOptions = {
  env: ENV_PRODUCTION
}) => {
  const environments = configurations()
  let env = ENV_PRODUCTION
  if (!!apiOptions.env !== false) {
    if (!!environments[apiOptions.env] === false) {
      throw new Error('Unable to locate environment selected: ', env)
    }

    env = apiOptions.env
  }

  return {
    ...environments[env],
    ...apiOptions
  }
}

export default configure
