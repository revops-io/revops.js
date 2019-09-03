import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height:  "40px",
  padding: "0 16px"
};

export default class AchForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: false,
    }
    this.form = {};
  }

  static propTypes = {
    styles: PropTypes.object,
    onComplete: PropTypes.func,
    onNext: PropTypes.func,
    onCancel: PropTypes.func,
    onLast: PropTypes.func,
    onError: PropTypes.func,
  }

  componentDidMount() {
    const script = document.createElement("script")

    script.src = "https://js.verygoodvault.com/vgs-collect/1/ACkcn4HYv7o2XoRa7idWwVEX.js"
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    const form = VGSCollect.create("tnt6ryfiprp", function (state) { });
    form.field("#bank-name .field-space", {
      type: "text",
      name: "name",
      placeholder: "Chase Bank",
      validations: ["required"],
      css: styles
    });

    form.field("#bank-acct-number .field-space", {
      type: "text",
      name: "email",
      placeholder: "XXXXXXXXXXXXX",
      validations: ["required"],
      css: styles
    });

    form.field("#bank-routing-number .field-space", {
      type: "text",
      name: "phone",
      placeholder: "XXXXXXXXXX",
      validations: ["required"],
      css: styles
    });

    this.form = form

  }

  handleError = (errors) => this.setState({
    errors
  })

  onSubmit = () => {
    const { form} = this
    const { onNext, accountModel, onError } = this.props
  
    onNext({}, {...accountModel, 'contact-form': true })

    form.submit('/post', {
      serializer: 'deep',
      serialization: 'formData',
      data: accountModel,
      mapDotToObject: 'merge',
      },
       (status, response) => {
        onNext(status, response)
      }, 
      (errors) => {
        onError(errors)
      });
  }

  buttonGrp = () => {
    const { onLast, onCancel, finalStep } = this.props
    return (
      <div>
        <button
          id="form-cancel-btn"
          className="ui left floated button secondary basic"
          onClick={() => onCancel()}>Cancel</button>
        <button
          id="form-next-btn"
          className="ui right floated button positive"
          onClick={this.onSubmit}>{finalStep ? 'Submit' : 'Next'}</button>
        <button
          id="form-prev-btn"
          className="ui right floated button positive basic"
          onClick={() => onLast()}>Previous</button>
      </div>
    )
  }

  render() {
    return (
      <section>
        <form id="contact-form" className="ui form">
          <div id="bank-name" className="field">
            <label>Bank Name</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-routing-number" className="field">
            <label >Routing Number</label>
            <span className="field-space"></span>
          </div>

          <div id="bank-acct-number" className="field">
            <label>Account Number</label>
            <span className="field-space"></span>
          </div>

        </form>
        {this.buttonGrp()}
      </section>
    )
  }
}
