import {
  getErrorText,
  getClassName,
  createErrorMessage,
  convertAPIError,
  isInstrumentUpdate
} from './FormHelpers'

import { Instrument } from './models'

describe('Formhelper methods', () => {
  describe('getErrorText', () => {
    it('should generate the error text correctly', () => {
      const errTxt = getErrorText('Prefix:', 'someErrKey', {
        someErrKey: {
          errorMessages: ['Error Text']
        }
      })
      expect(errTxt).to.equal('Prefix: Error Text')
    })

    it('should return an empty string when errors is undefined', () => {
      const errTxt = getErrorText('Prefix:', 'someErrKey', undefined)
      expect(errTxt).to.equal('')
    })
  })

  describe('getClassName', () => {
    it('should return the correct className with an error', () => {
      const className = getClassName('some-class', 'someErrKey', {
        someErrKey: {
          errorMessages: ['Error Text']
        }
      })
      expect(className).to.equal('field some-class validation-error')
    })

    it('should return the correct className without an error', () => {
      const className = getClassName('some-class', 'someErrKey', {
        notThisError: {
          errorMessages: ['Error Text']
        }
      })
      expect(className).to.equal('field some-class')
    })
  })

  describe('createErrorMessage', () => {
    it('should create a properly indexed error', () => {
      expect(
        createErrorMessage('err-key', 'error message')
      ).to.have.deep.property('err-key', { errorMessages: ['error message'] })
    })
  })

  describe('convertAPIError', () => {
    it('should return the correct http error', () => {
      const error = convertAPIError(401, {
        error: {
          param: 'exp_year',
          message: 'error message'
        }
      })
      expect(error).to.have.deep.property(
        'billing_preferences.card_expdate',
        {
          errorMessages: ['error message']
        })
    })
    it('should return the correct http error', () => {
      const error = convertAPIError(400, false)
      expect(error).to.have.deep.property(
        'networkError',
        {
          errorMessages: ['Please try again. If this persists, contact support.']
        })
    })
  })
})

describe('isInstrumentUpdate', () => {
  it('should NOT be an update', () => {
    expect(isInstrumentUpdate()).to.equal(false)
    expect(isInstrumentUpdate({})).to.equal(false)
    expect(isInstrumentUpdate({ id: 'cust_123' })).to.equal(false)
    expect(isInstrumentUpdate('')).to.equal(false)
  })

  it('should be an update', () => {
    expect(
      isInstrumentUpdate({ id: 'inst_123123' }))
      .to.equal(true)
    expect(
      isInstrumentUpdate(new Instrument({ id: 'inst_123123' })))
      .to.equal(true)
  })
})
