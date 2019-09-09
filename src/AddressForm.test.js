import React from 'react';

import AddressForm from './AddressForm'

describe('The AddressForm Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      accountModel: {
        id: "test",
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }}
  it('AddressForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AddressForm  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('button').length).to.equal(3)
  })

  it('calls onlast() when "Previous" clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AddressForm  {...mockProps} />)

    wrapper.find('#form-prev-btn').simulate('click')
    expect(mockProps.onLast.call.length).to.equal(1)
  })

  it('submits form when "Next" is clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AddressForm  {...mockProps} />)

    wrapper.instance().onSubmit = jest.fn()
    wrapper.instance().form.submit = jest.fn()
    wrapper.find('#form-next-btn').simulate('click')

    expect(wrapper.instance().onSubmit.call.length).to.equal(1)
    expect(mockProps.onNext.call.length).to.equal(1)
    expect(wrapper.instance().onSubmit.call.length).to.equal(1)
    expect(mockProps.accountModel.saveWithSecureForm.call.length).to.equal(1)
    expect(mockProps.onNext.call.length).to.equal(1)
  })
})
