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
        expected: 'https://vault.revops.io',
      },
      {
        param: '',
        expected: 'https://vault.revops.io',
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
    mockAxios.onGet('/').reply(200, {})

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
    await request.then((result) => {
      expect(result.message).to.equal('cancel get request')
      expect(configuration.onCancel.called).to.equal(true)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(false)
    })

  })

  it('initiates a GET request and error occurs', async () => {
    mockAxios.onGet('https://vault.revops.io/').networkError()

    let client = new RevOpsAPIClient()
    let configuration = {
      onCancel: sinon.spy(),
      onSuccess: sinon.spy(),
      onError: sinon.spy(),
    }
    const { request, source } = await client.get('/', configuration)

    // Assert error was called
    request.then((error) => {
      expect(error.message).to.equal('Network Error')
      expect(configuration.onCancel.called).to.equal(false)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(true)
    })
  })

  it('initiates a POST request and error occurs', async () => {
    mockAxios.onPost('https://vault.revops.io/').networkError()

    let client = new RevOpsAPIClient()
    let configuration = {
      onCancel: sinon.spy(),
      onSuccess: sinon.spy(),
      onError: sinon.spy(),
    }
    const { request, source } = await client.post('/', {}, configuration)

    // Assert error was called
    request.then((error) => {
      expect(error.message).to.equal('Network Error')
      expect(configuration.onCancel.called).to.equal(false)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(true)
    })
  })

  it('initiates a POST request and cancel occurs', async () => {
    mockAxios.onPost('https://vault.revops.io/').reply(201, {})

    let client = new RevOpsAPIClient()
    let configuration = {
      onCancel: sinon.spy(),
      onSuccess: sinon.spy(),
      onError: sinon.spy(),
    }
    const { request, source } = client.post('/', {}, configuration)

    // Send Cancelation Request
    await source.cancel('cancel post request')

    // Assert cancelation was called
    await request.then((result) => {
      expect(result.message).to.equal('cancel post request')
      expect(configuration.onCancel.called).to.equal(true)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(false)
    })
  })

  it('initiates a PUT request and cancel occurs', async () => {
    mockAxios.onPut('https://vault.revops.io/').reply(201, {})

    let client = new RevOpsAPIClient()
    let configuration = {
      onCancel: sinon.spy(),
      onSuccess: sinon.spy(),
      onError: sinon.spy(),
    }
    const { request, source } = client.put('/', {}, configuration)

    // Send Cancelation Request
    await source.cancel('cancel put request')

    // Assert cancelation was called
    await request.then((result) => {
      expect(result.message).to.equal('cancel put request')
      expect(configuration.onCancel.called).to.equal(true)
      expect(configuration.onSuccess.called).to.equal(false)
      expect(configuration.onError.called).to.equal(false)
    })
  })
})
