import RevOpsAPIClient from './RevOpsAPIClient'

const superagent = jest.mock('superagent')

describe('RevOpsAPIClient', () => {
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
        expected: 'https://localhost:5050/',
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

  it('initiates a GET request to RevOpsAPIClient', () => {
    let client = new RevOpsAPIClient()
    client.get()
    expect(superagent.called.length).to.equal(0)
  })
})
