import React from 'react';

import FormProgress from './FormProgress'

const mockSteps = [
  {
    title: 'Contact Info',
    description: 'Review standard terms',
    component: jest.fn(),
  },
  {
    title: 'Sign Up',
    description: 'Review standard terms',
    component:jest.fn(),
  },
  {
    title: 'Terms',
    description: 'Review standard terms',
    component: jest.fn(),
  }
]


describe('', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      steps: mockSteps,
    }}
  it('FormProgress should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<FormProgress  {...mockProps} />)
    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('.ui.grid').length).to.equal(1)
  })

  it('Lower step bound', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<FormProgress  {...mockProps} />)
    window.scrollTo = jest.fn()

    expect(wrapper.instance().state.activeStep).to.equal(0)
    wrapper.instance().nextStep()
    expect(wrapper.instance().state.activeStep).to.equal(1)
    wrapper.instance().lastStep()
    expect(wrapper.instance().state.activeStep).to.equal(0)
    wrapper.instance().lastStep()
    expect(wrapper.instance().state.activeStep).to.equal(0)
  })

  it('Upper step bound', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<FormProgress  {...mockProps} />)
    window.scrollTo = jest.fn()

    expect(wrapper.instance().state.activeStep).to.equal(0)
    wrapper.instance().nextStep()
    wrapper.instance().nextStep()
    expect(wrapper.instance().state.activeStep).to.equal(2)
    wrapper.instance().nextStep()
    expect(wrapper.instance().state.activeStep).to.equal(2)
  })
})