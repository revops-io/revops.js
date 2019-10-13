import React, { Component, Fragment } from "react"
import PropTypes from 'prop-types'

export class InstrumentAPI extends Component {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: PropTypes.string.isRequired,

    /** Required Account object that owns the instrument */
    account: PropTypes.object,

    /** Optional API Options **/
    apiOptions: PropTypes.object,
  }

  static defaultProps = {
    targetModel: 'instruments',
  }

  getApiKey = async () => {
    const { publicKey, account, apiOptions } = this.props
    if (!!apiOptions.authorizationUrl !== false &&
      apiOptions.authorizationUrl.startsWith('http')) {
      let searchParams = new URLSearchParams({
        accountId: account.accountId,
      })
      let options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          // 'Authorization': 'Bearer ' + publicKey,
          'X-RevOps-Sandbox': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Auth-User-Id': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5qVTVNelkzUmtWR05UYzFNekUyTlRsRU5FVTVSRUk1TWpWRk5rVkVPVEUzT1RrNU5EZzNRUSJ9.eyJodHRwczovL2F1dGgucmV2b3BzLmlvIjp7Im9yZ2FuaXphdGlvbklkIjoicmV2b3BzLWlvIiwib3JnYW5pemF0aW9uX2lkIjoicmV2b3BzLWlvIiwicm9sZXMiOlsicmVwb3J0aW5nIiwic2FsZXMtcmVwIiwiZmluYW5jZSIsImRlYWwtZGVzay1tYW5hZ2VyIiwiZ2VuZXJhbC11c2VyIiwic2FsZXMtbWFuYWdlciIsImFkbWluIiwiZGV2Il0sImlkIjoiYTAwZTFhYzgtY2RmYy00OGNmLTk1NGItNjBhNDBiMGFiNTZmIiwiZW1haWwiOiJjYmVybnNAcmV2b3BzLmlvIn0sImdpdmVuX25hbWUiOiJDaHJpcyIsImZhbWlseV9uYW1lIjoiQmVybnMiLCJuaWNrbmFtZSI6ImNiZXJucyIsIm5hbWUiOiJDaHJpcyBCZXJucyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUF1RTdtQkJWSXk1VG43c2dBa2tyU1ZFVlFic1poUmNENUVzNlVwd0l4bzkiLCJsb2NhbGUiOiJlbiIsInVwZGF0ZWRfYXQiOiIyMDE5LTEwLTEzVDAxOjI0OjE4Ljk1OVoiLCJlbWFpbCI6ImNiZXJuc0ByZXZvcHMuaW8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hdXRoLnJldm9wcy5pby8iLCJzdWIiOiJnb29nbGUtYXBwc3xjYmVybnNAcmV2b3BzLmlvIiwiYXVkIjoidXl0MFJCTllJanFyd041SnpLRDJRMkIwSlliNW1LcTQiLCJpYXQiOjE1NzA5Mjk4NTksImV4cCI6MTU3MTEwMjY1OSwiYXRfaGFzaCI6IlNld3lPenVjdzk1ZXZ0amZlWnJfTGciLCJub25jZSI6ImV5SnlaV1JwY21WamRGOTFjbWtpT2lKb2RIUndjem92TDNKbGRtOXdjeTFwYnk1eVpYWnZjSE11Ykc5allXdzZNekF3TUM5a1lYTm9ZbTloY21RaWZRPT0ifQ.QBbLvlTftSWHgJs0VAFBnGNoBo0COVkULcB8mBFeOeogKMPowbS53pNxYx8EVyNSOj6aWlQoH9KzyZfGQta_RivbXvCtIyCCy7nbVKo08ixolZzTvD-5kOc2lIk4wqESA4D2ipzGbjKHpIk7maO-GLv1c6DC8MfOdPMrp7KphI10d_-G5tOlGTrGMcBUPPz8Na-UoU0Y9nukx-x5vxa5Su68-4y6_cklfxX349JMHLh_2egpy6oG2JX0lDwcZkr2vJbw0XBIvGoTqhIQe2y-ZdFFGmOJAipBj1CEDAQ-uxy7BI6TTmF3PTgsHpB0ZFbpiCegcbtLCJPQXFdrQKbCWA'
        },
      };

      let url = apiOptions.authorizationUrl + '?' + searchParams.toString()
      let response = await fetch(url, options)
      let responseOK = response && response.ok
      if (responseOK) {
        let data = await response.json()
        // do something with data
        if (!!data.access_token === true) {
          // TODO: Set expiration of the token to re-auth if needed
          this.setState({ accessToken: data.access_token })
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
        {React.cloneElement(children, {...this.props, ...this.state})}
      </div>
  }
}

export default InstrumentAPI