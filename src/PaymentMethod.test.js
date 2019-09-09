import React from 'react';

import PaymentMethod from './PaymentMethod'

describe('The PaymentMethod Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      ...props,
    }}
  it('PaymentMethod should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PaymentMethod  {...mockProps} />)
    wrapper.setState({ method: false })

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
  })

  it('PaymentMethod should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PaymentMethod  {...mockProps} />)
    wrapper.setState({ method: 'ACH' })
    expect( wrapper.find('AchForm').length).to.equal(1)
    wrapper.setState({ method: 'CC' })
    expect( wrapper.find('CreditCardForm').length).to.equal(1)
  })
})
