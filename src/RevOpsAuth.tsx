import React, { Component, ReactNode } from "react"
import { makeAccount } from "./actions/AccountActions"
import { getToken } from "./actions/FormActions"

interface Props {
  account: Account
  children: ReactNode
}

interface State {
  account: Account
  accessToken: string
}

export default class RevOpsAuth extends Component<Props, State> {
  async componentDidMount() {
    const { account } = this.props

    const token = await getToken(this.props)

    this.setState({
      accessToken: token, // set the access token for children
      account: makeAccount({ ...account }), // init account for children
    })
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props
    if (!!prevProps.account && !!account && prevProps.account !== account) {
      this.updateAccount(account)
    }
  }

  updateAccount(account) {
    this.setAccount(account)
  }

  setAccount = account => {
    this.setState({
      account: makeAccount({
        ...account,
      }),
    })
  }

  render() {
    const { children } = this.props

    return (
      !!children && (
        <div>
          {
            // pass the generated state to the children like props
            [].concat(children).map((children, i) => {
              return React.cloneElement(children, {
                ...this.props,
                ...this.state,
                key: i,
              })
            })
          }
        </div>
      )
    )
  }
}
