import React from 'react';

import PaymentMethod from './PaymentMethod'

describe('The ContactInformation Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onCancel: jest.fn(),
      onLast: jest.fn(),
      onNext: jest.fn(),
      ...props,
    }}
  it('PaymentMethod should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PaymentMethod  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('button').length).to.equal(2)
  })

  it('PaymentMethod should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PaymentMethod  {...mockProps} />)

    wrapper.find('.ui.dropdown').simulate('change', {target: {value: 'CC'}})
    expect( wrapper.find('CreditCardForm').length).to.equal(1)
  })
})