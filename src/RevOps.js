import React, { Component } from "react"
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'

const loader = () => (
  <div className="loader">
    <style>
      {`
      .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }`}
    </style>
  </div>
)

export class RevOps extends Component {
  static propTypes = {
    /**  RevOps API Public Key is required for creating accounts **/
    publicKey: PropTypes.string,

    /** Required Account object that owns the instrument */
    account: PropTypes.object,

    /** Optional API Options **/
    apiOptions: PropTypes.object,

    /** boolean value that will make the RevOps component create account before authenticating */
    createAccount: PropTypes.bool,

    /** react components nested inside of this component */
    children: PropTypes.element,

    /** getToken (accountId) => { access_token } callback function that is called before every call requiring authorization */
    getToken: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      email: props.email,
      account: props.account,
    }
  }

  async componentDidMount() {
    const { createAccount, account, getToken, publicKey } = this.props
    // when creating, wait to get token until we have an account
    if (createAccount !== true) {
      if (!!getToken !== false && typeof (getToken) === 'function') {
        getToken(account.accountId)
          .then(accessToken => this.setState({ accessToken }))
          .catch(error => console.error(error))
      }
      this.setState({ account: makeAccount({ ...account }) })
    }
    // create an account automatically create an account if we have enough information
    // if (createAccount === true && !!account.email === true) {
    //   this.createAccount()
    // }
    if (createAccount === true && publicKey === false) {
      console.warn("Your public key is required for creating accounts.")
    }
  }

  // componentDidUpdate(prevProps) {
  //   const { account } = this.props
  //   if (prevProps.account !== account) {
  //     this.setState({ account: makeAccount({ ...account }) })
  //   }
  // }

  // Use the public key to create the account
  // then use the account returned to call getToken and send the token info down stream
  createAccount = async () => {
    const { publicKey, account, apiOptions } = this.props
    const accountCreationURL = `https://vault.revops.io/v1/accounts`

    let options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicKey}`,
        'Content-Type': 'application/json;charset=UTF-8',
        'X-RevOps-Sandbox': 'true',
      },
      body: JSON.stringify({ ...this.state.account, email: this.state.email, account_id: account.accountId })
    };

    let response = await fetch(accountCreationURL, options)
    let responseOK = response && response.ok
    if (responseOK) {
      let data = await response.json()
      this.setState({
        account: makeAccount({ ...data }),
        loading: false,
        error: false,
      })
      if (!!apiOptions.getToken !== false && typeof (apiOptions.getToken) === 'function') {
        apiOptions.getToken(data.account_id)
          .then(accessToken => this.setState({ accessToken }))
          .catch(error => console.error('Unable to get token', error))
      }
    } else {
      console.log('Unable to create account account')
      this.setState({
        account: false,
        loading: false,
        error: {} // TODO: Match error format
      })
    }
  }

  render() {
    const { createAccount, children } = this.props
    const { loading } = this.state

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
          !!loading === false && React.cloneElement(children, { ...this.props, ...this.state })
        }
      </div>
  }
}

export default RevOps