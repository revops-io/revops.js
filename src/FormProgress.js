import React from 'react'

import './styles.css'

export class FormProgress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
    }
  }

  nextStep = () => {
    const { activeStep } = this.state
    const { steps } = this.props
    if (activeStep < steps.length - 1) {
      this.setState({ activeStep: activeStep + 1 })
      window.scrollTo(0, 0);
    } else {
      console.log("Form Submitted")
    }
  }

  lastStep = () => {
    const { activeStep } = this.state
    if (activeStep > 0) {
      this.setState({ activeStep: activeStep - 1 })
      window.scrollTo(0, 0);
    }
  }

  cancel = () => {
    return null
  }

  render() {
    const { companyName, steps, styles } = this.props
    const { activeStep } = this.state
    return (
      <div>
        <h1 className="ui center aligned header">{companyName}</h1>
        <div className="ui grid">
          <div className="thirteen wide column">
            <div className="ui raised very padded container segment">
              {steps.map((step, i) => {
                return (
                  activeStep === i && <step.component
                    key={i}
                    finalStep={i === steps.length - 1}
                    styles={styles}
                    onCancel={() => this.cancel()}
                    onLast={() => this.lastStep()}
                    onNext={() => this.nextStep()} />
                )
              })}
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
