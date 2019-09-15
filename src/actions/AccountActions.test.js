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

  it('makeAccount w/ custom accountId', () => {
    ['accountId-123', '', null, false].map(
      (accountId) => {
        let account = actions.makeAccount({
          id: 'test-uuid',
          accountId: accountId,
        })
        expect(account.id).to.equal('test-uuid')
        expect(account.accountId).to.equal(accountId)
    })
  })
})
