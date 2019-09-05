import React, { Component } from 'react'

export default class Wrapper extends Component {

  buttonGrp = () => {
    const { onLast, onCancel, firstStep, finalStep, onNext } = this.props
    return (
      <div id="form-nav">
        {!firstStep && <button
          id="form-cancel-btn"
          className="ui left floated button secondary basic"
          onClick={() => onCancel()}>Cancel</button>}
        <button
          id="form-next-btn"
          className="ui right floated button positive"
          onClick={() => onNext()}>{finalStep ? 'Submit' : 'Next'}</button>
        {!firstStep && <button
          id="form-prev-btn"
          className="ui right floated button positive basic"
          onClick={() => onLast()}>Previous</button>}
      </div>
    )
  }

  render() {
    const { showNav } = this.props
    return (
      <section>
        {this.props.children}
        {showNav && this.buttonGrp()}
      </section>
    )
  }
}
