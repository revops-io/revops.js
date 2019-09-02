import React from 'react'

import {
  CreditCardForm,
  StandardTerms,
  ContactInformation,
  FormProgress,
  PaymentMethod,
  SignupForm,
} from 'revops-js'


const steps = [
  {
    title: 'Payment Info',
    description: 'Choose payment method',
    component: PaymentMethod,
  },
  {
    title: 'Contact Info',
    description: 'Review standard terms',
    component: ContactInformation,
  },
  {
    title: 'Sign Up',
    description: 'Review standard terms',
    component: SignupForm,
  },
  {
    title: 'Terms',
    description: 'Review standard terms',
    component: StandardTerms,
  },
  {
    title: 'Card Info',
    description: 'Review standard terms',
    component: CreditCardForm,
  },
]

export const PaymentPortal = ({ ...props }) => {
  return <FormProgress steps={steps} {...props} />

}

export default PaymentPortal
