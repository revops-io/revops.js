import React, { Component } from "react"
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'
import { getToken } from './actions/FormActions'

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
    /** Required Account object that owns the instrument */
    account: PropTypes.object,

    /** react components nested inside of this component */
    children: PropTypes.element,
  }

  async componentDidMount() {
    const { account } = this.props

    const token = await getToken(this.props)

    this.setState({ 
      accessToken: token, // set the access token for children
      account: makeAccount({ ...account }) // init account for children
    })

  }

  render() {
    const { children } = this.props

    return !!children !== false &&
      <div>
        {
          // pass the generated state to the children like props
          React.cloneElement(children, { ...this.props, ...this.state })
        }
      </div>
  }
}

export default RevOps