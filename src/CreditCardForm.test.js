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
      showACHLink: true,
      account: {
        id: "test",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }
  }
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
    expect(wrapper.find('.network-error').length).to.equal(1)
  })

  it('should not render button group when saveRef is defined', () => {
    const mockProps = generateMockProps({ saveRef: {} })
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
    expect(wrapper.instance().state.saving).to.equal(true)
    expect(wrapper.instance().state.status).to.equal(false)
    expect(wrapper.instance().state.response).to.equal(false)
    expect(mockProps.account.saveWithSecureForm.call.length).to.equal(1)
  })

  it('Should get the default link', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)

    expect(wrapper.find('.pay-by-ach-link').length).to.equal(1)
  })


  it('Should return the customized link ', () => {
    const mockProps = generateMockProps({ achLink: <p></p> })
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)

    const link = wrapper.instance().getACHLink()
    expect(link.type).to.equal('p')

    wrapper.setProps({ achLink: "" })
    expect(wrapper.instance().getACHLink()).to.equal("")
  })

  it('Should NOT return an ACH link ', () => {
    const mockProps = generateMockProps({ showACHLink: false})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)

    expect(wrapper.instance().getACHLink()).to.equal(null)
    
    wrapper.setProps({ achLink: <p></p>, showACHLink: false })
    expect(wrapper.instance().getACHLink()).to.equal(null)

    wrapper.setProps({ achLink: false, showACHLink: true })
    expect(wrapper.instance().getACHLink()).to.equal(false)

    wrapper.setProps({ achLink: null, showACHLink: true })
    expect(wrapper.instance().getACHLink()).to.equal(null)

  })

  it('Should return a custom label', () => {
    const mockProps = generateMockProps({ creditCardLabel: <p className="custom-label"></p> })
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)

    expect(wrapper.find('.custom-label').length).to.equal(1)
  })

  it('should not show a network error', () => {
    const mockProps = generateMockProps({ showNetworkError: false })
    const wrapper = shallow(<CreditCardForm  {...mockProps} />)
    expect(wrapper.find('.network-error').length).to.equal(0)
  })

})
