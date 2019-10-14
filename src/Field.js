import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  modelTypes
} from './models'

import {
  getClassName,
} from './FormHelpers'
import { ErrorMessage } from './index'

import _ from 'lodash'

export class Field extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    objectAddress: PropTypes.string,
    defaultValue: PropTypes.any,
    showInlineError: PropTypes.bool,
    errors: PropTypes.any,
    children: PropTypes.element,
    secureRef: PropTypes.any,
  }

  getSecurePath() {
    return `${this.props.id} .field-space`
  }

  getElementContainer() {
    return `${this.props.id}-container`
  }

  getElementKey = () => {
    return `${_.snakeCase(this.props.name)}`
  }

  render () {
    return (
      <div id={this.props.id} className={
        getClassName(
          this.getElementContainer(),
          this.getElementKey(),
          this.props.errors
        )
      }>
        {!!this.props.label !== false &&
          <label
            htmlFor={this.props.id}
            className="hidden">{this.props.label}</label>
        }
        <span className="field-space"></span>
        {this.props.showInlineError === true &&
          <ErrorMessage
            label={this.props.label}
            errorKey={this.getElementKey()}
            errors={this.props.errors} />
        }
      </div>
    )
  }
}


export default Field
