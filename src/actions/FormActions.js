import { logError, logWarning } from '../helpers/Logger'

export function submitForm (object, token, form, callbacks, apiOptions = {}, isUpdate){
  return object.saveWithSecureForm(token, form, callbacks, apiOptions, isUpdate)
}

export const getToken =  async function({
  account,
  accessToken,
  getToken,
  publicKey,
  apiOptions = {},
  isUpdate = false
}) {
  const { loggingLevel = '' } = apiOptions

  if (!!accessToken === true && isUpdate === false) {
    return accessToken
  }

  // if editing an instance, get a new token before request
  if (!!getToken !== false && typeof (getToken) === 'function') {
    try {
      // need to get a specific account token when updating an instance
      const token = await getToken(
        isUpdate === true && !!account.accountId === true
          ? account.accountId
          : '*'
      )
      return token
    } catch (error) {
      logError('getToken() token failed to get a token', loggingLevel)
      return false
    }
  } else {
    // if we do not have a way to get a token use the public key
    if (!!publicKey === true) {
      return publicKey
    }
  }

  logWarning('Unable to the authorize the request', loggingLevel)
}
