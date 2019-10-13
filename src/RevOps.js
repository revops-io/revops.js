import React, { Component } from "react"
import PropTypes from 'prop-types'

export class RevOps extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

    /** Required Account object that owns the instrument */
    account: PropTypes.object,

    /** Optional API Options **/
    apiOptions: PropTypes.object,
  }

  static defaultProps = {
    targetModel: 'account',
  }

  getApiKey = async () => {
    const { publicKey, account, apiOptions } = this.props
    if (!!apiOptions.authorizationUrl !== false &&
      apiOptions.authorizationUrl.startsWith('http')) {
      let searchParams = new URLSearchParams({
        accountId: account.accountId,
      })
      let options = {
        method: apiOptions['method'] || 'GET',
        mode: apiOptions['mode'] || 'cors',
        headers: apiOptions['headers'] || {
          'Authorization': 'Bearer ' + publicKey,
          'X-RevOps-Sandbox': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      };

      let url = apiOptions.authorizationUrl + '?' + searchParams.toString()
      let response = await fetch(url, options)
      let responseOK = response && response.ok
      if (responseOK) {
        let data = await response.json()
        if (!!data.access_token === true) {
          // TODO: Set expiration of the token to re-auth if needed
          this.setState({ accessToken: data.access_token })
        }

        // if a call back is defined call it and pass back the result of the call
        if (!!apiOptions.callback !== false && typeof (apiOptions.callback) === 'function') {
          apiOptions.callback(data)
        }
      }
    }
  }

  componentDidMount() {
    this.getApiKey()
  }

  render() {
    const { children } = this.props

    return !!children !== false &&
      <div>
        {React.cloneElement(children, { ...this.props, ...this.state })}
      </div>
  }
}

export default RevOps