
export const submitForm = (object, token, form, callbacks) => {
  object.saveWithSecureForm(token, form, callbacks)
}

export const getToken = async ({
  account, 
  accessToken, 
  getToken, 
  publicKey,
  apiOptions, 
}) => {

  if(!!accessToken === true){
    return accessToken
  }

  // if we have a method to get the token, use it for the token
  if (!!getToken !== false && typeof (getToken) === 'function') {
    try {
      const token = await getToken(account.accountId)
      return token
    } catch(error) {
      if(apiOptions.env == 'sandbox'){
        console.error("getToken() token failed to get a token" + error)
      }
    }
  }

  // if we do not have a way to get a token use the public key
  if(!!publicKey === true){
    return publicKey
  }

  // print the error to the console if we are using a sandbox
  if(apiOptions.env == 'sandbox'){
    console.warn("Unable to the authorize the request")
  }

}
