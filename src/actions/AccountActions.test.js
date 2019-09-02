import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
var mockAxios = new MockAdapter(axios)

/* Include all actions to test under `actions` namespace */
import * as actions from './AccountActions'

import uuid from 'uuid/v4'
jest.mock('uuid/v4')

describe('AccountActions', () => {
  beforeEach(() => {
    uuid.mockClear()
    mockAxios.reset()
    uuid.mockImplementation(() => 'test-uuid')
  })

  it('makeAccount', () => {

    let onError = sinon.spy()
    let onSuccess = sinon.spy()
    let onCancel = sinon.spy()

    let account = actions.makeAccount({
        billingContact: {
          name: 'hello'
        }
      }
    )

    mockAxios.onAny(`https://vault.revops.io/accounts/${account.id}`).reply(200, {})

    let { request, source }  = actions.createAccount(account,
      onSuccess,
      onError,
      onCancel,
    )

    request.then((response) => {
      expect(onSuccess.called).to.equal(true)
      expect(onCancel.called).to.equal(false)
      expect(onError.called).to.equal(false)
    })
  })

  it('makeAccount w/ custom externalId', () => {
    ['external-123', '', null, false].map(
      (externalId) => {
        let account = actions.makeAccount({
          externalId: externalId
        })
        expect(account.id).to.equal('test-uuid')
        expect(account.externalId).to.equal(externalId)
    })
  })
})
