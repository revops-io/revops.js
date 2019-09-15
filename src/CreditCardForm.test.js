import React from 'react';

import CreditCardForm from './CreditCardForm'


describe('The CreditCardForm Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      account: {
        id: "test",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }}
  it('CreditCardForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />
    )
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
    expect(wrapper.find('#cc-form').length).to.equal(1)
    expect(wrapper.find('#cc-holder').length).to.equal(1)
    expect(wrapper.find('#cc-exp').length).to.equal(1)
    expect(wrapper.find('#cc-cvc').length).to.equal(1)
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
    const mockProps = generateMockProps({})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)

    wrapper.setState({
      errors: null,
      loading: null,
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
