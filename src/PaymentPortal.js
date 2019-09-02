import React from 'react'

import {
  CreditCardForm,
  StandardTerms,
  ContactInformation,
  FormProgress,
  PaymentMethod,
  SignupForm,
  AddressForm,
  Wrapper
} from './index'

const CustomMessage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Thank You!</h1>
      <h2>MemSQL</h2>
      <a href="example.com">See your deal</a>
    </div>
  )
}

const steps = [
  {
    title: 'Contact Info',
    description: 'Review standard terms',
    component: (props) => (
      <ContactInformation {...props}>Hello</ContactInformation>
    ),
  },
  {
    title: 'Terms',
    description: 'Review standard terms',
    component: StandardTerms,
  },
  {
    title: 'Address Info',
    description: 'Address',
    component: (props) => <AddressForm {...props} />,
  },
  {
    title: 'Payment Info',
    description: 'Choose payment method',
    component: PaymentMethod,
  },
  {
    title: 'Sign Up',
    description: 'Review standard terms',
    component: SignupForm,
  },
  {
    title: 'Card Info',
    description: 'Review standard terms',
    component: CreditCardForm,
  },
  {
    title: 'All Set',
    description: 'Address',
    component: (props) =>
      (<Wrapper {...props} >
        <CustomMessage />
      </Wrapper>),
  },
]

export const PaymentPortal = ({ ...props }) => {
  return <FormProgress
    accountId={"hello-fresh"}
    steps={steps}
    {...props} />

}

export default PaymentPortal
