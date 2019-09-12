const getProduction = () => ({
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

const getStaging = () => ({
  name: 'staging',
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACvYkoDARh7Ajf3DhktqckgY.js',
  revopsBaseUrl: 'https://vault.revops.io',
  plaidUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  plaidEnvironment: 'development',
  plaidKey: 'c648203cbd9ce4b7ea39f26c61f115',
  vaultId: 'tnttz8hit8p',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-staging',
})

const getLocal = () => ({
  name: "local",
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACkcn4HYv7o2XoRa7idWwVEX.js',
  revopsBaseUrl: 'https://vault.revops.io',
  plaidUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  plaidEnvironment: 'sandbox',
  plaidKey: 'c648203cbd9ce4b7ea39f26c61f115',
  vaultId: 'tnt6ryfiprp',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-local',
})

const getConfigurations = () => ({
  "production": getProduction(),
  "staging": getStaging(),
  "localhost": getLocal(),
})

const selectConfiguration = () => {

  // For testing
  if(!!document !== true || !!document.domain !== true) {
    return getConfigurations['localhost']
  }

  if(document.domain.endsWith('staging.bill.sh')) {
    return getConfigurations['staging']
  } else if (document.domain.endsWith('localhost')) {
    return getConfigurations['localhost']
  }

  return getConfigurations['production']
}

const getConfig = selectConfiguration

export default getConfig;
