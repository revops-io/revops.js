import React from 'react';

import CreditCardForm from './CreditCardForm'


describe('The CreditCardForm Component', () => {
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
      finishedLoading: jest.fn(),
      ...props,
    }}
  it('CreditCardForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />
    )
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
    expect(wrapper.find('#card-form').length).to.equal(1)
    expect(wrapper.find('#card-name').length).to.equal(1)
    expect(wrapper.find('#card-expdate').length).to.equal(1)
    expect(wrapper.find('#card-cvc').length).to.equal(1)
  })

  it('should not render button group when saveRef is defined', () => {
    const mockProps = generateMockProps({saveRef: {}})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)
    expect(wrapper.find('ButtonGroup').length).to.equal(0)
  })

  it('should should transition to the ACH option', () => {
    const mockProps = generateMockProps({
      showACHLink: true,
      changePaymentMethod: jest.fn(),
    })
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)
    const achLink = wrapper.find('a.pay-by-ach-link')
    expect(achLink.length).to.equal(1)
    achLink.simulate('click')
    expect(mockProps.changePaymentMethod.call.length).to.equal(1)
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
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)
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
    expect(wrapper.instance().state.errors).to.equal(false)
    expect(wrapper.instance().state.loading).to.equal(true)
    expect(wrapper.instance().state.status).to.equal(false)
    expect(wrapper.instance().state.response).to.equal(false)
    expect(mockProps.account.saveWithSecureForm.call.length).to.equal(1)
  })
})
