import React from 'react'

import { makeAccount } from './actions/AccountActions'

export class FormProgress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
    }
  }

  componentDidMount() {
    this.fetchAccount()
  }

  fetchAccount() {
    const { account } = this.props
    var accountId = document.cookie.replace(/(?:(?:^|.*;\s*)ro_account_id\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    let accountProps = { ...account }
    if(!!accountId !== false) {
      accountProps = {
        id: accountId,
        ...account
      }
    }

    // accounts are keyed by email
    const accountModel = makeAccount({
      ...accountProps,
    })
    if(accountId === false && !!accountModel.id !== false) {
      document.cookie = `ro_account_id=${accountModel.id}`
    }

    this.setState({ accountModel })
  }

  nextStep = (status, response) => {
    const { activeStep } = this.state
    const { steps } = this.props

    if (activeStep < steps.length - 1) {
      this.setState({ activeStep: activeStep + 1 })
      window.scrollTo(0, 0);
    } else {
      this.setState({ complete: true })
    }
  }

  lastStep = (status = {}) => {
    const { activeStep } = this.state
    if (activeStep > 0) {
      this.setState({ activeStep: activeStep - 1 })
      window.scrollTo(0, 0);
    }
    this.setState({ success: null, error: null })
  }

  onError = (errors) => {
    console.log(errors)
    this.setState({ error: true })
  }

  cancel = () => {
    return null
  }

  render() {
    const { companyName, steps, logo } = this.props
    const { activeStep, accountModel } = this.state
    return (
      <div>
        { logo ?
          <img src={ logo } alt={ companyName } width="165" className="logo"/>
          :
          <h1 className="ui center aligned header">{ companyName }</h1>
        }
        <div className="ui grid">
          <div className="sixteen wide column">
            <div className="ui raised very padded container segment">
              {steps.map((step, i) => {
                return (activeStep === i &&
                  <div id="form-module" key={i}>
                    <h1>{step.title}</h1>
                    <step.component
                      firstStep={i === 0}
                      finalStep={ i === steps.length - 1}
                      accountModel={accountModel}
                      onCancel={this.cancel}
                      onError={this.onError}
                      onLast={this.lastStep}
                      onNext={this.nextStep}
                      {...this.props} />
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default FormProgress
