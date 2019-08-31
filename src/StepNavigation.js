import React from 'react'

const steps = [
  {
    id: 1,
    icon: 'file  icon',
    title: 'Terms',
    description: 'Review standard terms',
  },
  {
    id: 2,
    icon: 'payment icon',
    title: 'Connect Card',
    description: 'Connect a Recharge Card',
  },
  {
    id: 3,
    icon: 'dollar sign icon',
    title: 'Set Balance',
    description: 'Set your Recharge Preferences',
  }
]

export const StepNavigation = ({
  activeStep = 1,
  setStep = () => {}
}) => {
  return (
    <div className="ui steps fluid">
      {steps.map(step => (
        <div onClick={() => setStep(step.id)} className={activeStep === step.id? "active step" : "step"}>
          <i className={step.icon}></i>
          <div className="content">
            <div className="title">{step.title}</div>
            <div className="description">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StepNavigation
