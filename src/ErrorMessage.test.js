import React from 'react';

import { ErrorMessage } from './ErrorMessage'


describe('ErrorMessage', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      errorKey: "",
      ...props
    }
  }

  it('ErrorMessage should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<ErrorMessage  {...mockProps} />)

    expect(wrapper.length).to.equal(1)
    expect(wrapper.hasClass('field-sub-text')).to.equal(true)
  })

  it('Should show the default validation message', () => {
    const mockProps = generateMockProps({
      errors: {
        name: {
          errorMessages: ["World"]
        }
      },
      label: "Hello",
      errorKey: "name",
    })
    const wrapper = shallow(<ErrorMessage  {...mockProps} />)
    expect(wrapper.length).to.equal(1)
    expect(wrapper.hasClass('error')).to.equal(true)
    expect(wrapper.text()).to.equal("Hello World")
  })

  it('Should show the custom errorMsg', () => {
    const mockProps = generateMockProps({
      errors: {
        name: {
          errorMessages: [""]
        }
      },
      label: "",
      errorKey: "name",
      errorMsg: "Hello World"
    })
    const wrapper = shallow(<ErrorMessage  {...mockProps} />)
    expect(wrapper.length).to.equal(1)
    expect(wrapper.hasClass('error')).to.equal(true)
    expect(wrapper.text()).to.equal("Hello World")
  })

})