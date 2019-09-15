import {
  getErrorText,
  getClassName,
  createErrorMessage,
  convertAPIError,
} from './FormHelpers'

describe('Formhelper methods', () => {
  describe('getErrorText', () => {
    it('should generate the error text correctly', () => {
      const errTxt = getErrorText('Prefix:', 'someErrKey', {
        ['someErrKey']: {
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
      const className =  getClassName('some-class', 'someErrKey', {
        ['someErrKey']: {
          errorMessages: ['Error Text']
        }
      })
      expect(className).to.equal('some-class validation-error')
    })

    it('should return the correct className without an error', () => {
      const className =  getClassName('some-class', 'someErrKey', {
        ['notThisError']: {
          errorMessages: ['Error Text']
        }
      })
      expect(className).to.equal('some-class')
    })
  })

  describe('createErrorMessage', () => {
    it('should create a properly indexed error', () => {
      expect(
        createErrorMessage('err-key', 'error message')
      ).to.have.deep.property('err-key', {"errorMessages": ["error message"]});
    })
  })

  describe('convertAPIError', () => {
    it('should return the correct http error', () => {
      const error = convertAPIError(401, {
        error: {
          param: 'exp_year',
          message: 'error message',
        }
      })
      expect(error).to.have.deep.property('billingPreferences.cardExpdate', {"errorMessages": ["error message"]});
    })
    it('should return the correct http error', () => {
      const error = convertAPIError(400, false)
      expect(error).to.have.deep.property('networkError', {"errorMessages": ["Please try again. If this persists, contact support."]});
    })
      
  })
})


