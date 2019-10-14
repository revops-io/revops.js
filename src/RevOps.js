import React, { Component } from "react"
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'

export class RevOps extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

    /** Required Account object that owns the instrument */
    account: PropTypes.object,

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** boolean value that will make the RevOps component create account before authenticating */
    createAccount: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      email: "",
    }
  }

  getApiKey = async (account = false) => {
    const { publicKey, apiOptions = {} } = this.props

    // call with props unless calling with an arg
    account = account === false
      ? this.props.account
      : account

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
    const { createAccount, account } = this.props
    if (createAccount !== true) {
      this.getApiKey()
      this.setState({account: makeAccount({...account})})
    }
  }

  createAccount = async () => {
    const { publicKey, account } = this.props
    let options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicKey}`,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ ...this.state.account, email: this.state.email, account_id: account.accountId })
    };
    const accountCreationURL = `https://vault.revops.io/v1/accounts`

    let response = await fetch(accountCreationURL, options)
    let responseOK = response && response.ok
    if (responseOK) {
      let data = await response.json()
      this.getApiKey({ ...data, accountId: data.account_id })
      this.setState({account: makeAccount({...data})})
    }
  }

  render() {
    const { createAccount, children } = this.props
    const { account } = this.state

    return !!children !== false &&
      <div>
        {
          createAccount === true &&
          <React.Fragment>
            <label>
              Email
            <input
                type="text"
                name="email"
                onChange={
                  (e) => this.setState({
                    email: e.target.value,
                  })
                }
              />
            </label>
            <button onClick={this.createAccount}>Create Account</button>
          </React.Fragment>
        }
        {
          !!account && React.cloneElement(children, { ...this.props, ...this.state })
        }
      </div>
  }
}

export default RevOps