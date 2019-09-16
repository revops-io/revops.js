import React, { Component } from 'react'
import PropTypes from 'prop-types'
import configure from './client/VaultConfig'

export default class ContactInformation extends Component {
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

    script.src = configure(this.props.env).vaultCollectUrl
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const { accountModel } = this.props
    let form = VGSCollect.create(configure(this.props.env).vaultId, function (state) { });
    

    form.field("#customer-first-name .field-space", {
      type: "text",
      name: "billingContact.firstName",
      defaultValue: !!accountModel.billingContact.firstName === true
        ? accountModel.billingContact.firstName
        : "",
      placeholder: !!accountModel.billingContact.firstName === true
        ? accountModel.billingContact.firstName
        : "Pat",
      validations: ["required"],
      css: styles
    });

    form.field("#customer-last-name .field-space", {
      type: "text",
      name: "billingContact.lastName",
      defaultValue: !!accountModel.billingContact.lastName === true
        ? accountModel.billingContact.lastName
        : "",
      placeholder: "Smith",
      validations: ["required"],
      css: styles
    });

    form.field("#customer-email .field-space", {
      type: "text",
      name: "billingContact.email",
      defaultValue: !!accountModel.billingContact.email === true
        ? accountModel.billingContact.email
        : "",
      placeholder: "patsmith@example.com",
      validations: ["required"],
      css: styles
    });

    form.field("#customer-phone .field-space", {
      type: "text",
      name: "billingContact.phone",
      defaultValue: !!accountModel.billingContact.phone === true
        ? accountModel.billingContact.phone
        : "",
      placeholder: "800-555-5555",
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
      <div id="form-nav">
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
          <div id="customer-first-name" className="field">
            <label>First Name</label>
            <span className="field-space"></span>
          </div>
          <div id="customer-last-name" className="field">
            <label>Last Name</label>
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
