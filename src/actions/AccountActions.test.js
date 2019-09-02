import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

var mockAxios = new MockAdapter(axios)

/* Include all actions to test under `actions` namespace */
import * as actions from './AccountActions'

import uuid from 'uuid/v4'
jest.mock('uuid/v4')
jest.mock('../client')

describe('AccountActions', () => {
  beforeEach(() => {
    uuid.mockImplementation(() => 'test-uuid')
    mockAxios.onPost('/accounts').reply(200, {})
  })

  afterEach(() => {
    uuid.mockClear()
    mockAxios.reset()
  })

  it('creates a new revops account', async () => {
    mockAxios.onPost('/accounts').reply(200, {})

    let onError = sinon.spy()
    let onSuccess = sinon.spy()
    let onCancel = sinon.spy()

    let account = await actions.createAccount({
        billingContact: {
          name: 'hello'
        }
      },
      onSuccess,
      onError,
      onCancel,
    )
    expect(account.id).to.equal('test-uuid')
    expect(account.billingContact.id).to.equal('test-uuid')
    expect(account.billingContact.name).to.equal('hello')
    expect(onSuccess.called).to.equal(true)
    expect(onCancel.called).to.equal(true)
    expect(onError.called).to.equal(true)
  })

  it('creates a new revops account w/ custom externalId', () => {

    ['external-123', '', null, false].map(
      (externalId) => {
        let account = actions.createAccount({
          externalId: externalId
        })
        expect(account.id).to.equal('test-uuid')
        expect(account.externalId).to.equal(externalId)
    })
  })
})
