import React from 'react'

import { makeAccount } from './actions/AccountActions'

import { acceptForm } from './helpers/FormValidation'

import './styles.css'

export class FormProgress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
    }
  }

  componentDidMount() {
    const accountModel = makeAccount({})
    this.setState({ accountModel })
  }

  nextStep = (status = { alwaysAccept: true }, response = {}) => {
    const { activeStep, accountModel } = this.state
    const { steps } = this.props

    console.log('Should accept = ' + acceptForm(status))

    // validate form
    if (acceptForm(status)) {
      // if we can accept the submission merge the incoming with the current model
      this.setState({
        error: false,
        success: true,
        accountModel: { ...accountModel, ...response },
      })
    } else {
      this.setState({ error: true, success: false })
    }

    // Combine this logic with above when not testing
    if (activeStep < steps.length - 1) {
      this.setState({ activeStep: activeStep + 1 })
      window.scrollTo(0, 0);
    } else {
      this.setState({ complete: true })
      // send the data to RevOps
      console.log("Form Submitted")
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
    const { companyName, steps, styles } = this.props
    const { activeStep, accountModel } = this.state
    return (
      <div>
        <h1 className="ui center aligned header">{companyName}</h1>
        <div className="ui grid">
          <div className="thirteen wide column">
            <div className="ui raised very padded container segment">
              {steps.map((step, i) => {
                return (activeStep === i &&
                  <div key={i}>
                    <h1>{step.title}</h1>
                    <step.component
                      finalStep={i === steps.length - 1}
                      accountModel={accountModel}
                      styles={styles}
                      onCancel={this.cancel}
                      onError={this.onError}
                      onLast={this.lastStep}
                      onNext={this.nextStep} />
                  </div>
                )
              })}
              <div>
                {this.state.success && <div>Success</div>}
                {this.state.error && <div>Error</div>}
              </div>
            </div>
          </div>
          <div className="three wide column">
            <div className="ui vertical menu floated left">
              {
                steps.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className={`link item ${i === activeStep ? 'active' : i <= activeStep ? '' : 'disabled'}`}
                      onClick={() => {
                        if (i <= activeStep) {
                          this.setState({ activeStep: i })
                        }
                      }}>
                      {item.title}
                    </div>
                  )
                })
              }
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default FormProgress
