import React from 'react';

import CreditCardForm from './CreditCardForm'


describe('', () => {
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
  it('CreditCardForm should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<CreditCardForm  {...mockProps} />
    )
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
  })
})
