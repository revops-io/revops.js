import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  CreditCardForm,
  StepNavigation,
  StandardTerms,
} from './index'

export default class PayAsYouGoForm extends Component {
  state = {
    method: null,
    agreeToTerms: false,
    activeStep: 0,
  }
  static propTypes = {
    onSubmit: PropTypes.func,
    styles: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.method !== this.state.method) {
      $('#step-1').transition()

    }
  }

  getActiveStep = () => {
    return this.state.activeStep;
  }

  render() {
    return (
      <div className="ui">
        {this.state.method === null &&
          <div id="step-1" className="ui placeholder segment">
            <div className="ui two column stackable center aligned grid">
              <div className="ui vertical divider">Or</div>
              <div className="middle aligned row">
                <div className="column">
                  <div className="ui icon header">
                    <i className="credit card icon"></i>
                    Pay-as-you-go
                  </div>
                  <div className="ui primary button" onClick={() => this.setState({method: 'payg', activeStep: 1})}>
                    Signup
                  </div>
                </div>
                <div className="column">
                  <div className="ui icon header">
                    <i className="world icon" />
                    Enterprise
                  </div>
                  <div className="ui primary button" onClick={() => this.setState({method: 'enterprise'})}>>
                    Talk to Sales
                  </div>
                </div>
              </div>
            </div>
          </div>
        }


        <div className="ui one column fluid grid">
          <div className="column">
            {this.state.method === 'payg' &&
              <div className="stretched row">
                <StepNavigation
                  activeStep={this.getActiveStep()}
                  setStep={(id) => {
                    this.setState({activeStep: id})
                  }}
                />
              </div>
            }

            {this.state.activeStep === 1 &&
              <div className="ui segment">
                <h2 className="ui center aligned icon header">
                  <i className="circular icon file  "></i>
                  Terms & Conditions
                </h2>
                <div className="ui piled segment padded" style={{
                  height: '40vh',
                  overflowY: 'scroll',
                }}>
                  <StandardTerms />
                </div>
                <button className="fluid ui button" onClick={()=> {
                  this.setState({ agreeToTerms: true, activeStep: 2, })
                }}>Agree to Standard Terms</button>

              </div>
            }

            {this.state.activeStep === 2 &&
              <div>
                <div className="ui segment">
                  <h2 className="ui center aligned icon header">
                    <i className="circular icon credit card"></i>
                    Connect a Recharge Card
                  </h2>
                </div>

                <CreditCardForm
                  className="payg" {...this.props}
                  onComplete={() => {
                    this.setState({activeStep: 3})
                  }}
                />
              </div>
            }

            {this.state.activeStep === 3 &&
              <div>
                <div className="ui segment">
                  <h2 className="ui center aligned icon header">
                    <i className="circular icon dollar sign"></i>
                    Set your Recharge Preferences
                  </h2>
                  <div className="ui two column centered grid">
                    <div className="column">
                      <div className="ui huge form">
                        <div className="sixteen wide field">
                          <label>When your balance falls below</label>
                          <select className="ui search dropdown">
                            <option value="10.00">$10.00</option>
                            <option value="20.00">$20.00</option>
                            <option value="30.00">$30.00</option>
                          </select>
                        </div>
                        <div className="sixteen wide field">
                          <label>Recharge the balance to:</label>
                          <select className="ui search dropdown">
                            <option value="50.00">$50.00</option>
                            <option value="80.00">$80.00</option>
                            <option value="100.00">$100.00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="column row">
                    <button className="fluid ui button" onClick={()=> {
                      this.setState({ agreeToTerms: true, activeStep: 2, })
                    }}>Get Started</button>
                    </div>

                  </div>
                </div>
              </div>
            }



            {this.state.method === 'enterprise' &&
              <div className="enterprise">
                <h1>Enterprise</h1>
              </div>
            }

          </div>
        </div>
      </div>
    )
  }
}
