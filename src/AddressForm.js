import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  REVOPS_VAULT_COLLECT,
  REVOPS_VAULT_ID,
} from './client/VaultConfig'

import './styles.css'

const defaultStyles = {
  background: "#FFFFFF",
  border: "1px solid #CED7E6",
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  padding: "0 16px"
};

export class AddressForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: 0,
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
    // Create VGS Collect field for the first name
    form.field('#cc-first-name', {
      type: 'text',
      name: 'shipping_first_name',
      placeholder: 'Joe',
      validations: ['required'],
      css: styles
    });
    // Create VGS Collect field for the last name
    form.field('#cc-last-name', {
      type: 'text',
      name: 'shipping_last_name',
      placeholder: 'Business',
      validations: ['required'],
      css: styles,
    });
    // Create VGS Collect field for an address
    form.field('#cc-address', {
      type: 'text',
      name: 'shipping_address',
      placeholder: 'Address',
      validations: ['required'],
      css: styles,
    });
    // Create VGS Collect field for country
    form.field('#cc-country', {
      type: 'dropdown',
      name: 'shipping_country',
      placeholder: 'Select Country',
      validations: ['required'],
      options: [
        { value: 'USA', text: 'United States of America' },
        { value: 'Canada', text: 'Canada' },
        { value: 'Mexico', text: 'Mexico' },
      ],
      css: styles,
    });
    // Create VGS Collect field for the city
    form.field('#cc-city', {
      type: 'text',
      name: 'shipping_city',
      placeholder: 'City',
      validations: ['required'],
      css: styles
    });
    // Create VGS Collect field for the region
    form.field('#cc-region', {
      type: 'text',
      name: 'shipping_region',
      placeholder: 'Region',
      validations: ['required'],
      css: styles
    });
    // Create VGS Collect field for zip code
    form.field('#cc-zip', {
      type: 'zip-code',
      name: 'shipping_zip',
      placeholder: 'Zip Code',
      validations: ['required'],
      css: styles
    });

    this.form = form

  }

  handleError = (errors) => this.setState({
    errors
  })

  onSubmit = () => {
    const { form, handleError } = this
    const { onNext } = this.props

    form.submit(
      "/post",
      {
        headers: {
          "x-custom-header": "Oh yes. I am a custom header"
        }
      },
      function (status, data) {
        onNext(status)
      },
      function (errors) {
        onNext(errors)
        handleError(errors)
      }
    )

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

          <div className="field">
            <label htmlFor="cc-first-name">First Name</label>
            <span id="cc-first-name" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="cc-last-name">Last Name</label>
            <span id="cc-last-name" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="cc-address">Address</label>
            <span id="cc-address" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="cc-country">Country</label>
            <span id="cc-country" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="cc-city">City</label>
            <span id="cc-city" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="cc-region">Region</label>
            <span id="cc-region" className="field-space"></span>
          </div>

          <div className="field">
            <label htmlFor="cc-zip">Zip Code</label>
            <span id="cc-zip" className="field-space"></span>
          </div>
          
        </form>
        {this.buttonGrp()}
      </section>
    )
  }
}

export default AddressForm