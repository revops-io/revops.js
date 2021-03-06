import React from 'react';

import PlaidForm from './PlaidForm'

jest.useFakeTimers();

describe('The PlaidForm Component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  });

  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      togglePlaidHandler: jest.fn(),
      publicKey: 'pk_test-1234',
      account: {
        id: "test",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }
  }

  it('PlaidForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
    expect(wrapper.find('TogglePlaid').length).to.equal(1)
    expect(wrapper.find('.network-error').length).to.equal(1)

  })

  it('should render a form when plaidMetadata is available', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.find('#plaid-form').length).to.equal(0)
    wrapper.instance().onPlaidSelect("token", {
      account: {
        name: "",
        subtype: "",
        mask: "",
      }
    })
    expect(wrapper.find('#plaid-form').length).to.equal(1)

  })

  it('should not render button group when saveRef is defined', () => {
    const mockProps = generateMockProps({ saveRef: {} })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)
    expect(wrapper.find('ButtonGroup').length).to.equal(0)
  })

  it('should call onError', () => {
    const mockProps = generateMockProps({ saveRef: {} })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    const error = { errors: {} }
    wrapper.instance().onError(error)
    expect(mockProps.onError.call.length).to.equal(1)
  })

  it('should submit correctly', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    wrapper.setState({
      errors: null,
      loading: null,
    })

    wrapper.instance().onSubmit()
    expect(wrapper.instance().state.errors).to.equal(false)
    expect(wrapper.instance().state.saving).to.equal(true)
    expect(mockProps.account.saveWithSecureForm.call.length).to.equal(1)
  })

  it('should should transition to the CC option', () => {
    const mockProps = generateMockProps({
      showCardLink: true,
      changePaymentMethod: jest.fn(),
    })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)
    const ccLink = wrapper.find('a.pay-by-cc-link')
    expect(ccLink.length).to.equal(1)
    ccLink.simulate('click')
    expect(mockProps.changePaymentMethod.call.length).to.equal(1)
  })

  it('Should get the default CreditCard link', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.find('.pay-by-cc-link').length).to.equal(1)
  })

  it('Should return the customized CreditCard link ', () => {
    const mockProps = generateMockProps({ creditCardLink: <p></p> })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    const link = wrapper.instance().getCreditCardLink()
    expect(link.type).to.equal('p')

    wrapper.setProps({ creditCardLink: "" })
    expect(wrapper.instance().getCreditCardLink()).to.equal("")
  })

  it('Should NOT return a CreditCard link ', () => {
    const mockProps = generateMockProps({ creditCardLink: null })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.instance().getCreditCardLink()).to.equal(null)

    wrapper.setProps({ creditCardLink: false })
    expect(wrapper.instance().getCreditCardLink()).to.equal(false)

    wrapper.setProps({ creditCardLink: undefined, showCardLink: false })
    expect(wrapper.instance().getCreditCardLink()).to.equal(null)

    wrapper.setProps({ showCardLink: false })
    expect(wrapper.instance().getCreditCardLink()).to.equal(null)
  })

  it('Should get the default ACH link', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.find('TogglePlaid').length).to.equal(1)
  })

  it('Should return the customized ACH link ', () => {
    const mockProps = generateMockProps({ achLink: <p></p> })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    const link = wrapper.instance().getACHLink()
    expect(link.type).to.equal('p')

    wrapper.setProps({ achLink: "" })
    expect(wrapper.instance().getACHLink()).to.equal("")
  })

  it('Should NOT return an ACH link ', () => {
    const mockProps = generateMockProps({ showACHLink: false })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.instance().getACHLink()).to.equal(null)

    wrapper.setProps({ achLink: false,  showACHLink: true })
    expect(wrapper.instance().getACHLink()).to.equal(false)

    wrapper.setProps({ achLink: null, showACHLink: true })
    expect(wrapper.instance().getACHLink()).to.equal(null)

    wrapper.setProps({ achLink: false,  showACHLink: true })
    expect(wrapper.instance().getACHLink()).to.equal(false)
  })

  it('Should return a custom label', () => {
    const mockProps = generateMockProps({ plaidLabel: <p className="custom-label"></p> })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.find('.custom-label').length).to.equal(1)
  })

  it('should not show a network error', () => {
    const mockProps = generateMockProps({ showNetworkError: false })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)
    expect(wrapper.find('.network-error').length).to.equal(0)
  })

  it('should remove the loading state when method changes', () => {
    const mockProps = generateMockProps({ method: "plaid", loadingState: <h1>Test</h1> })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(wrapper.state().loading).to.equal(true)
    wrapper.setProps({method: "ach"})
    expect(wrapper.state().loading).to.equal(false)
  })

  it('should set a timeout and remove it when method changes', () => {
    const mockProps = generateMockProps({ method: "plaid", loadingState: <h1>Test</h1> })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(setTimeout.mock.calls.length).to.equal(1);
    wrapper.setProps({method: "ach"})
    expect(clearTimeout.mock.calls.length).to.equal(1);
  })

  it('should not set a timeout', () => {
    const mockProps = generateMockProps({ method: "ach", loadingState: <h1>Test</h1> })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)

    expect(setTimeout.mock.calls.length).to.equal(0);
  })

})
