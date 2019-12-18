import React from 'react';

import AchForm from './AchForm'

jest.useFakeTimers();

describe('The AchForm Component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  });

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
      hideTogglePlaid: false,
      showCardLink: true,
      instrument: {
        saveWithSecureForm: jest.fn(),
      },
      togglePlaidHandler: jest.fn(),
      ...props,
    }
  }

  it('AchForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
    expect(wrapper.find('.ach-label').length).to.equal(1)
    expect(wrapper.find('.network-error').length).to.equal(1)
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

  it('Should get the default CreditCard link', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.find('.pay-by-cc-link').length).to.equal(1)
  })

  it('Should return the customized CreditCard link ', () => {
    const mockProps = generateMockProps({ creditCardLink: <p></p> })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    const link = wrapper.instance().getCreditCardLink()
    expect(link.type).to.equal('p')

    wrapper.setProps({ creditCardLink: "" })
    expect(wrapper.instance().getCreditCardLink()).to.equal("")
  })

  it('Should NOT return a CreditCard link ', () => {
    const mockProps = generateMockProps({ showCardLink: false })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.instance().getCreditCardLink()).to.equal(null)

    wrapper.setProps({ creditCardLink: <p></p>, showCardLink: false})
    expect(wrapper.instance().getCreditCardLink()).to.equal(null)

    wrapper.setProps({ creditCardLink: false, showCardLink: true })
    expect(wrapper.instance().getCreditCardLink()).to.equal(false)

    wrapper.setProps({ creditCardLink: null, showCardLink: true })
    expect(wrapper.instance().getCreditCardLink()).to.equal(null)

  })

  it('Should get the default Plaid link', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.find('TogglePlaid').length).to.equal(1)
  })

  it('Should return the customized Plaid link ', () => {
    const mockProps = generateMockProps({ plaidLink: <p></p> })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    const link = wrapper.instance().getPlaidLink()
    expect(link.type).to.equal('p')

    wrapper.setProps({ plaidLink: "" })
    expect(wrapper.instance().getPlaidLink()).to.equal("")
  })

  it('Should NOT return a Plaid link ', () => {
    const mockProps = generateMockProps({ hideTogglePlaid: true })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.instance().getPlaidLink()).to.equal(null)

    wrapper.setProps({ plaidLink: <p></p>, hideTogglePlaid: true  })
    expect(wrapper.instance().getPlaidLink()).to.equal(null)

    wrapper.setProps({ plaidLink: null, hideTogglePlaid: false })
    expect(wrapper.instance().getPlaidLink()).to.equal(null)

    wrapper.setProps({ plaidLink: false, hideTogglePlaid: false })
    expect(wrapper.instance().getPlaidLink()).to.equal(false)
  })

  it('Should return a custom label', () => {
    const mockProps = generateMockProps({ achLabel: <p className="custom-label"></p> })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.find('.custom-label').length).to.equal(1)
  })

  it('should not show a network error', () => {
    const mockProps = generateMockProps({ showNetworkError: false })
    const wrapper = shallow(<AchForm  {...mockProps} />)
    expect(wrapper.find('.network-error').length).to.equal(0)
  })
  
  it('should remove the loading state when method changes', () => {
    const mockProps = generateMockProps({ method: "ach", loadingState: <h1>Test</h1> })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.state().loading).to.equal(true)
    wrapper.setProps({method: "plaid"})
    expect(wrapper.state().loading).to.equal(false)
  })

  it('should set a timeout and remove it when method changes', () => {
    const mockProps = generateMockProps({ method: "ach", loadingState: <h1>Test</h1> })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(setTimeout.mock.calls.length).to.equal(1);
    wrapper.setProps({method: "plaid"})
    expect(clearTimeout.mock.calls.length).to.equal(1);
  })

  it('should not set a timeout', () => {
    const mockProps = generateMockProps({ method: "plaid", loadingState: <h1>Test</h1> })
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(setTimeout.mock.calls.length).to.equal(0);
  })

})
