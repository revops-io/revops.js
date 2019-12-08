import React from 'react';

import { _SignUp } from './SignUp'


describe('The SignUp Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      publicKey: 'pk_test-1234',
      account: {
        id: "test",
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }}
  it('SignUp should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<_SignUp  {...mockProps} />
    )
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('#signup-form').length).to.equal(1)
    expect(wrapper.find('#signup-email').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
    expect(wrapper.find('.network-error').length).to.equal(1)
  })

  it('should not render button group when saveRef is defined', () => {
    const mockProps = generateMockProps({saveRef: {}})
    const wrapper = shallow(<_SignUp  {...mockProps} />)
    expect(wrapper.find('ButtonGroup').length).to.equal(0)
  })


  it('should submit correctly', () => {
    const mockProps = generateMockProps({
      account: {
        id: "submit-test",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
        email: 'slujibu@cool.api'
      },
    })
    const wrapper = shallow(<_SignUp  {...mockProps} />)
    wrapper.setProps({
      account: {
        id: "submit-test-2",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
        email: 'slujibu2@cool.api'
      },
      instrument: {
        saveWithSecureForm: jest.fn(),
      }
    })
    wrapper.setState({
      errors: null,
      loading: false,
      status: null,
      response: null,
    })
    
    wrapper.instance().onSubmit()
    expect(wrapper.instance().state.account.email).to.equal('slujibu2@cool.api')
    expect(wrapper.instance().state.errors).to.equal(false)
    expect(wrapper.instance().state.loading).to.equal(true)
    expect(wrapper.instance().state.status).to.equal(false)
    expect(wrapper.instance().state.response).to.equal(false)
    expect(mockProps.account.saveWithSecureForm.call.length).to.equal(1)
  })

  it('should not show a network error', () => {
    const mockProps = generateMockProps({ showNetworkError: false })
    const wrapper = shallow(<_SignUp  {...mockProps} />)
    expect(wrapper.find('.network-error').length).to.equal(0)
  })
})
