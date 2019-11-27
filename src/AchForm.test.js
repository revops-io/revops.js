import React from 'react';

import AchForm from './AchForm'

describe('The AchForm Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      publicKey: 'pk_test-1234',
      account: {
        id: "test",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
      },
      instrument: {
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }
  }

  it('AchForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
  })

  it('should not render button group when saveRef is defined', () => {
    const mockProps = generateMockProps({ saveRef: {} })
    const wrapper = shallow(<AchForm  {...mockProps} />)
    expect(wrapper.find('ButtonGroup').length).to.equal(0)
  })

  it('should should transition to the CC option', () => {
    const mockProps = generateMockProps({
      showCardLink: true,
      changePaymentMethod: jest.fn(),
    })
    const wrapper = shallow(<AchForm  {...mockProps} />)
    const ccLink = wrapper.find('a.pay-by-cc-link')
    expect(ccLink.length).to.equal(1)
    ccLink.simulate('click')
    expect(mockProps.changePaymentMethod.call.length).to.equal(1)
  })

  it('should submit correctly', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    wrapper.setState({
      errors: null,
      loading: null,
      status: null,
      response: null,
    })

    wrapper.instance().onSubmit()
    expect(wrapper.instance().state.errors).to.equal(false)
    expect(wrapper.instance().state.saving).to.equal(true)
    expect(wrapper.instance().state.status).to.equal(false)
    expect(wrapper.instance().state.response).to.equal(false)
  })
})
