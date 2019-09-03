import React from 'react';

import ContactInformation from './ContactInformation'

describe('The ContactInformation Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onCancel: jest.fn(),
      onLast: jest.fn(),
      onNext: jest.fn(),
      accountModel: {
        id: "test",
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }}
  it('ContactInformation should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<ContactInformation  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('button').length).to.equal(3)
  })
  it('calls onCancel() when clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<ContactInformation  {...mockProps} />)

    wrapper.find('#form-cancel-btn').simulate('click')
    expect(mockProps.onCancel.call.length).to.equal(1)
  })

  it('calls onlast() when "Previous" clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<ContactInformation  {...mockProps} />)

    wrapper.find('#form-prev-btn').simulate('click')
    expect(mockProps.onLast.call.length).to.equal(1)
  })

  it('submits form when "Next" is clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<ContactInformation  {...mockProps} />)

    wrapper.instance().onSubmit = jest.fn()
    wrapper.find('#form-next-btn').simulate('click')

    expect(wrapper.instance().onSubmit.call.length).to.equal(1)
    expect(mockProps.accountModel.saveWithSecureForm.call.length).to.equal(1)
    expect(mockProps.onNext.call.length).to.equal(1)
  })
})