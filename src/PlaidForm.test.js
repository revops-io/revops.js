import React from 'react';

import PlaidForm from './PlaidForm'

describe('The PlaidForm Component', () => {
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
    expect(wrapper.instance().state.loading).to.equal(true)
    expect(mockProps.account.saveWithSecureForm.call.length).to.equal(1)
  })

  it('should should transition to the CC option', () => {
    const mockProps = generateMockProps({
      showCardLink: true,
      changePaymentMethod: jest.fn(),
    })
    const wrapper = shallow(<PlaidForm  {...mockProps} />)
    const ccLink = wrapper.find('a.pay-by-link')
    expect(ccLink.length).to.equal(1)
    ccLink.simulate('click')
    expect(mockProps.changePaymentMethod.call.length).to.equal(1)
  })
})
