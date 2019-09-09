const production = {
  name: 'production',
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACvYkoDARh7Ajf3DhktqckgY.js',
  revopsBaseUrl: 'https://vault.revops.io',
  plaidUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  plaidEnvironment: 'development', // production when we are ready
  plaidKey: 'c648203cbd9ce4b7ea39f26c61f115',
  vaultId: 'tnt2w1xznia',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-production',
}

const staging = {
  name: 'staging',
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACvYkoDARh7Ajf3DhktqckgY.js',
  revopsBaseUrl: 'https://vault.revops.io',
  plaidUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  plaidEnvironment: 'development',
  plaidKey: 'c648203cbd9ce4b7ea39f26c61f115',
  vaultId: 'tnttz8hit8p',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-staging',
}

const local = {
  name: "local",
  vaultCollectUrl: 'https://js.verygoodvault.com/vgs-collect/1/ACkcn4HYv7o2XoRa7idWwVEX.js',
  revopsBaseUrl: 'https://vault.revops.io',
  plaidUrl: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  plaidEnvironment: 'sandbox',
  plaidKey: 'c648203cbd9ce4b7ea39f26c61f115',
  vaultId: 'tnt6ryfiprp',
  baseUrl: `https://${document.location.host}`,
  serviceName: 'revops-js-local',
}

const configurations = {
  "production": production,
  "staging": staging,
  "localhost": local
}

const selectConfiguration = () => {

  // For testing
  if(!!document !== true || !!document.domain !== true) {
    return configurations['localhost']
  }

  if(document.domain.endsWith('staging.bill.sh')) {
    return configurations['staging']
  } else if (document.domain.endsWith('localhost')) {
    return configurations['localhost']
  }

  return configurations['production']
}

const config = selectConfiguration()

export default config
