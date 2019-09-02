import React from 'react';

import Wrapper from './Wrapper'


describe('', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onCancel: jest.fn(),
      onLast: jest.fn(),
      onNext: jest.fn(),
      onError: jest.fn(),
      ...props,
    }}
  it('Wrapper should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<Wrapper  {...mockProps} />
    )
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('button').length).to.equal(3)
  })

  it('calls onCancel() when clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<Wrapper  {...mockProps} />)

    wrapper.find('#form-cancel-btn').simulate('click')
    expect(mockProps.onCancel.call.length).to.equal(1)
  })

  it('calls onlast() when "Previous" clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<Wrapper  {...mockProps} />)

    wrapper.find('#form-prev-btn').simulate('click')
    expect(mockProps.onLast.call.length).to.equal(1)
  })

  it('submits form when "Next" is clicked', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<Wrapper  {...mockProps} />)

    wrapper.find('#form-next-btn').simulate('click')
    expect(mockProps.onNext.call.length).to.equal(1)
  })
})