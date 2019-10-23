import React from 'react';

import RevOpsAuth from './RevOpsAuth'


describe('RevOpsAuth', () => {
  const generateMockProps = (props) => {
    return {
      account: {
        id: "test-id",
        accountId: "tester-id",
      },
      getToken: jest.fn(),
      ...props,
    }
  }

  it('RevOpsAuth should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(
      <RevOpsAuth  {...mockProps} >
        <span></span>
      </RevOpsAuth>
    )
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('div').length).to.equal(1)
  })

  it('RevOpsAuth should call getToken()', () => {
    const mockProps = generateMockProps({})
    shallow(<RevOpsAuth  {...mockProps} ><span></span></RevOpsAuth>)
    
    expect(mockProps.getToken.mock.calls.length).to.equal(1)
    expect(mockProps.getToken.mock.calls[0][0]).to.equal(mockProps.account.accountId)
  })
})