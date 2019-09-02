import React, { Component } from 'react'

import './styles.css'

export default class Wrapper extends Component {

  buttonGrp = () => {
    const { onLast, onCancel, finalStep, onNext } = this.props
    return (
      <div>
        <button
          id="form-cancel-btn"
          className="ui left floated button secondary basic"
          onClick={() => onCancel()}>Cancel</button>
        <button
          id="form-next-btn"
          className="ui right floated button positive"
          onClick={() => onNext()}>{finalStep ? 'Submit' : 'Next'}</button>
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
        {this.props.children}
        {this.buttonGrp()}
      </section>
    )
  }
}

