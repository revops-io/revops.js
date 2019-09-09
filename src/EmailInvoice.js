import React, { Component } from 'react'
import PropTypes from 'prop-types'
import config from './client/VaultConfig'


const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height:  "40px",
  padding: "0 16px"
};

export default class EmailInvoice extends Component {
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

    script.src = config.vaultCollectUrl
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }


  initialize = () => {
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    const form = VGSCollect.create(config.vaultId, function (state) { });
    form.field("#customer-name .field-space", {
      type: "text",
      name: "name",
      placeholder: "Pat Smalley",
      validations: ["required"],
      css: styles
    });
    form.field("#customer-email .field-space", {
      type: "text",
      name: "email",
      placeholder: "patsmalley@company.com",
      validations: ["required"],
      css: styles
    });
    form.field("#customer-phone .field-space", {
      type: "text",
      name: "phone",
      placeholder: "(800)-555-5555",
      validations: ["required"],
      css: styles
    });

    this.form = form

  }

  onSubmit = () => {
    const { form } = this
    const { onNext, accountModel, onError, onComplete = false } = this.props

    accountModel.saveWithSecureForm(
      form,
      {
        onError,
        onComplete,
        onNext
      })
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
          <div id="customer-name" className="field">
            <label>Name</label>
            <span className="field-space"></span>
          </div>

          <div id="customer-email" className="field">
            <label >Email</label>
            <span className="field-space"></span>
          </div>

          <div id="customer-phone" className="field">
            <label>Phone</label>
            <span className="field-space"></span>
          </div>

        </form>
        {this.buttonGrp()}
      </section>
    )
  }
}
