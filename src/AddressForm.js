import React, { Component } from 'react'
import PropTypes from 'prop-types'
import configure from './client/VaultConfig'


export class AddressForm extends Component {
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
    const { targetObj = 'shippingContact' } = this.props

    const form = VGSCollect.create(configure(this.props.env).vaultId, function (state) { });

    form.field('#first-name', {
      type: 'text',
      name: `${targetObj}.firstName`,
      placeholder: 'Joe',
      validations: ['required'],
      css: styles
    });

    form.field('#last-name', {
      type: 'text',
      name: `${targetObj}.lastName`,
      placeholder: 'Smith',
      validations: ['required'],
      css: styles,
    });

    form.field('#address', {
      type: 'text',
      name: `${targetObj}.address`,
      placeholder: '123 Broadway St.',
      validations: ['required'],
      css: styles,
    });

    form.field('#address2', {
      type: 'text',
      name: `${targetObj}.address2`,
      placeholder: 'P.O. Box 21231',
      css: styles,
    });

    form.field('#country', {
      type: 'dropdown',
      name: `${targetObj}.country`,
      placeholder: 'Select Country',
      validations: ['required'],
      options: [
        { value: 'USA', text: 'United States of America' },
        { value: 'Canada', text: 'Canada' },
        { value: 'Mexico', text: 'Mexico' },
      ],
      css: styles,
    });

    form.field('#city', {
      type: 'text',
      name: `${targetObj}.city`,
      placeholder: 'City',
      validations: ['required'],
      css: styles
    });

    form.field('#region', {
      type: 'text',
      name: `${targetObj}.firstName`,
      placeholder: 'Region',
      validations: ['required'],
      css: styles
    });

    form.field('#zip', {
      type: 'zip-code',
      name: `${targetObj}.firstName`,
      placeholder: '01234',
      validations: ['required'],
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
      <div id="button-group">
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
        <div id="contact-form">

          <div className="field">
            <label htmlFor="first-name">First Name</label>
            <span id="first-name" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="last-name">Last Name</label>
            <span id="last-name" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="address">Address</label>
            <span id="address" className="field-space"></span>
          </div>
          <div className="field">
            <label htmlFor="address22">Address 2</label>
            <span id="address2" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="country">Country</label>
            <span id="country" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="city">City</label>
            <span id="city" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="region">State/Region</label>
            <span id="region" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="zip">Zip Code</label>
            <span id="zip" className="field-space"></span>
          </div>

        </div>
        {this.buttonGrp()}
      </section>
    )
  }
}

export default AddressForm
