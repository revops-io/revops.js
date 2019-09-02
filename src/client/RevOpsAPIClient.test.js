import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import RevOpsAPIClient from './RevOpsAPIClient'

var mockAxios = new MockAdapter(axios)

describe('RevOpsAPIClient', () => {
  afterEach(() => {
    mockAxios.reset()
  })

  it('initializes a RevOpsAPIClient with sandbox url', () => {
    const urls_to_test = [
      {
        param: false,
        expected: 'https://tnt6ryfiprp.SANDBOX.verygoodproxy.com',
      },
      {
        param: '',
        expected: 'https://tnt6ryfiprp.SANDBOX.verygoodproxy.com',
      },
      {
        param: 'https://localhost:5050',
        expected: 'https://localhost:5050',
      },
    ]
    urls_to_test.map(({param, expected}) => {
      let client = new RevOpsAPIClient(param)
      expect(client.url).to.equal(expected)
    })
  })

  it('creates structured URL', () => {
    const urls_to_test = [
      {
        param: '/',
        expected: 'https://localhost:5050/',
      },
      {
        param: '',
        expected: 'https://localhost:5050',
      },
      {
        param: '/test',
        expected: 'https://localhost:5050/test',
      },
      {
        param: '/test/',
        expected: 'https://localhost:5050/test/',
      },
      {
        param: 'https://localhost:5050/test/',
        expected: 'https://localhost:5050/test/',
      },
    ]

    urls_to_test.map(({param, expected}) => {
      let client = new RevOpsAPIClient('https://localhost:5050')
      expect(client.createURL(param)).to.equal(expected)
    })

  })

  it('initiates a GET request and cancels it', async () => {
    mockAxios.onAny('/').reply(200, {})

    let client = new RevOpsAPIClient()
    let configuration = {
      onCancel: sinon.spy(),
      onSuccess: sinon.spy(),
      onError: sinon.spy(),
    }
    const { request, source } = client.get('/', configuration)

    // Send Cancelation Request
    await source.cancel('cancel get request')

    // Assert cancelation was called
    await request.then(() => {
      expect(configuration.onCancel.called).to.equal(true)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(false)
    })

  })

  it('initiates a GET request and error occurs', async () => {
    mockAxios.onAny('/').networkError()

    let client = new RevOpsAPIClient()
    let configuration = {
      onCancel: sinon.spy(),
      onSuccess: sinon.spy(),
      onError: sinon.spy(),
    }
    const { request, source } = await client.get('/', configuration)

    // Assert error was called
    request.then(() => {
      expect(configuration.onCancel.called).to.equal(false)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(true)
    })
    // Assert onError was called

  })
})
