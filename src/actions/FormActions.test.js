import { submitForm, getToken } from './FormActions'

describe('submitForm', () => {
  const obj = {
    saveWithSecureForm: jest.fn(),
  }
  it('should call the saveWithSecureForm() on the object', () => {
    submitForm(obj, "token", {}, () => {})
    expect(obj.saveWithSecureForm.mock.calls.length).to.equal(1)
  })
})

describe('should use getToken() to get a token', () => {
  it('Should return the accessToken', async () => {
    const mockProps = {
      accessToken: "access-token",
      getToken: jest.fn(),
      publicKey: false,
    }
    const result = await getToken(mockProps)
    expect(result).to.equal(mockProps.accessToken)
    expect(mockProps.getToken.mock.calls.length).to.equal(0)
  })

  it('Should return the accessToken', async () => {
    const mockProps = {
      accessToken: false,
      getToken: jest.fn(),
      publicKey: false,
    }
    await getToken(mockProps)
    expect(mockProps.getToken.mock.calls.length).to.equal(0)
  })

  it('Should return the publicKey', async () => {
    const mockProps = {
      accessToken: false,
      getToken: false,
      publicKey: "public-key",
    }
    const result = await getToken(mockProps)
    expect(result).to.equal(mockProps.publicKey)
  })

  it('should warn when there is not way to get a token', async () => {
    console.warn = jest.fn()
    const mockProps = {
      accessToken: false,
      getToken: false,
      publicKey: false,
      apiOptions: {
        loggingLevel: "debug"
      }
    }
    const result = await getToken(mockProps)
    expect(result).to.equal(undefined)
    expect(console.warn.mock.calls.length).to.equal(1)
  })

  it('should print an error to the console.error', async () => {

    console.error = jest.fn()
    const mockProps = {
      accessToken: false,
      getToken: jest.fn(function() {
        throw new Error("Uh oh");
      }),
      publicKey: false,
      apiOptions: {
        loggingLevel: "debug"
      }
    }
    const result = await getToken(mockProps)
    expect(result).to.equal(false)
    expect(console.error.mock.calls.length).to.equal(1)
  })

})