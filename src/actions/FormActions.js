import { logError, logWarning } from '../helpers/Logger'

export const submitForm = (object, token, form, callbacks, apiOptions = {}) => {
  object.saveWithSecureForm(token, form, callbacks, apiOptions)
}

export const getToken = async ({
  account, 
  accessToken, 
  getToken, 
  publicKey,
  apiOptions = {}, 
}) => {
  const { loggingLevel = "" } = apiOptions

  if(!!accessToken === true){
    return accessToken
  }

  // if we have a method to get the token, use it for the token
  if (!!getToken !== false && typeof (getToken) === 'function') {
    try {
      const token = await getToken(account.accountId)
      return token
    } catch(error) {
      logError("getToken() token failed to get a token", loggingLevel )
      return false
    }
  } else {
    // if we do not have a way to get a token use the public key
    if(!!publicKey === true){
      return publicKey
    }
  }

  logWarning("Unable to the authorize the request", loggingLevel)
}
