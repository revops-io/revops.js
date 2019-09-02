import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

import './styles.css'

const defaultStyles = {
  border: 'none',
  background: 'rgba(215, 224, 235, 0.18);',
  height: '40px',
  lineHeight: 'normal',
  padding: '0 10px',
  color: 'white',
  fontSize: '12px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  letterSpacing: '.7px',
  '&::placeholder': {
    color: 'white',
    fontSize: '12px',
    opacity: '.5',
  },
};

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

    script.src = REVOPS_VAULT_COLLECT
    script.async = true
    script.onload = () => {
      this.initialize()
    }
    document.body.appendChild(script);
  }

  initialize = () => {
    const styles = this.props.styles === undefined ? defaultStyles : this.props.styles

    const form = VGSCollect.create(REVOPS_VAULT_ID, function (state) { });
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
