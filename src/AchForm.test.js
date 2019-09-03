import React from 'react';

import AchForm from './AchForm'

describe('The AddressForm Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onCancel: jest.fn(),
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      ...props,
    }}
  it('AchForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('button').length).to.equal(3)
  })
  it('calls onCancel() when clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    wrapper.find('#form-cancel-btn').simulate('click')
    expect(mockProps.onCancel.call.length).to.equal(1)
  })

  it('calls onlast() when "Previous" clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    wrapper.find('#form-prev-btn').simulate('click')
    expect(mockProps.onLast.call.length).to.equal(1)
  })

  it('submits form when "Next" is clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<AchForm  {...mockProps} />)

    wrapper.instance().onSubmit = jest.fn()
    wrapper.instance().form.submit = jest.fn()
    wrapper.find('#form-next-btn').simulate('click')

    expect(wrapper.instance().onSubmit.call.length).to.equal(1)
    expect(wrapper.instance().form.submit.call.length).to.equal(1)
    expect(mockProps.onNext.call.length).to.equal(1)
  })
})