import React from 'react'

import {
  CreditCardForm,
  StandardTerms,
  ContactInformation,
  FormProgress,
  PaymentMethod,
  SignupForm,
  AddressForm,
  // SignUp,
  Wrapper
} from './index'

import { SignUp } from './SignUp'

const CustomThankYouMessage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Thank You!</h1>
      <h2>MemSQL</h2>
      <a href="example.com">See your deal</a>
    </div>
  )
}

const CustomWelcomeMessage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome</h1>
      <p>Thank you for choosing MemSQL</p>
    </div>
  )
}

const steps = [
  {
    title: 'Sign Up for Services',
    component: SignUp
  },
  {
    title: 'Terms',
    component: StandardTerms,
  },
  {
    title: 'Payment Info',
    component: PaymentMethod,
  },
  {
    title: '',
    component: (props) =>
      (<Wrapper showNav={false} {...props} >
        <CustomThankYouMessage />
      </Wrapper>),
  },
]

export const PaymentPortal = ({ ...props }) => {
  return (
    <FormProgress
      steps={steps}
      {...props} />
  )
}

export default PaymentPortal
