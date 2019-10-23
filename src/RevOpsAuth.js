import React, { Component } from "react"
import PropTypes from 'prop-types'

import { makeAccount } from './actions/AccountActions'
import { getToken } from './actions/FormActions'

export class RevOpsAuth extends Component {
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

export default RevOpsAuth