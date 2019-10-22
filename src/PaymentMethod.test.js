import React from 'react';

import PaymentMethod, { PaymentMethods } from './PaymentMethod'

describe('The PaymentMethod Component', () => {
  const generateMockProps = (props) => {
    return {
      id: "test123",
      onLast: jest.fn(),
      onNext: jest.fn(),
      publicKey: 'pk_test-1234',
      methods: [
        PaymentMethods.METHOD_CARD,
        PaymentMethods.METHOD_ACH,
        PaymentMethods.METHOD_PLAID,
      ],
      defaultMethod: PaymentMethods.METHOD_ACH,
      instrument: {},
      account: {
        id: "test",
        billingPreferences: {},
        saveWithSecureForm: jest.fn(),
      },
      ...props,
    }
  }

  it('PaymentMethod should render without crashing', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PaymentMethod  {...mockProps} />)
    wrapper.setState({ method: false })

    expect(wrapper.length).to.equal(1)
    expect(wrapper.find('section').length).to.equal(1)
    expect(wrapper.find('ButtonGroup').length).to.equal(1)
  })

  it('should not load buttonGroup if method !== false', () => {
    const mockProps = generateMockProps({})
    const wrapper = shallow(<PaymentMethod  {...mockProps} />)

    wrapper.setState({ method: true })
    expect(wrapper.find('ButtonGroup').length).to.equal(0)
  })

  describe('ACH Section', () => {
    it('PaymentMethod should render without an ACHForm', () => {
      const mockProps = generateMockProps({})
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      wrapper.setState({ method: PaymentMethods.METHOD_ACH })
      expect(wrapper.find('AchForm').length).to.equal(1)
    })

    it('isACHEnabled should return true', () => {
      const mockProps = generateMockProps({
        methods: [
          PaymentMethods.METHOD_ACH,
        ],
        defaultMethod: PaymentMethods.METHOD_ACH,
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      expect(wrapper.instance().isACHEnabled()).to.equal(true)
    })

    it('isACHEnabled should return false', () => {
      const mockProps = generateMockProps({
        methods: [
          PaymentMethods.METHOD_CARD,
        ],
        defaultMethod: PaymentMethods.METHOD_CARD,
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      expect(wrapper.instance().isACHEnabled()).to.equal(false)
    })
  })

  describe('CC Section', () => {
    it('PaymentMethod should render without a CreditCardForm', () => {
      const mockProps = generateMockProps({})
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      wrapper.setState({ method: PaymentMethods.METHOD_CARD })
      expect(wrapper.find('CreditCardForm').length).to.equal(1)
    })

    it('isCardEnabled should return true', () => {
      const mockProps = generateMockProps({
        methods: [
          PaymentMethods.METHOD_CARD,
        ],
        defaultMethod: PaymentMethods.METHOD_CARD,
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      expect(wrapper.instance().isCardEnabled()).to.equal(true)
    })

    it('isCardEnabled should return false', () => {
      const mockProps = generateMockProps({
        methods: [
          PaymentMethods.METHOD_ACH,
        ],
        defaultMethod: PaymentMethods.METHOD_ACH,
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      expect(wrapper.instance().isCardEnabled()).to.equal(false)
    })
  })

  describe('Plaid Section', () => {
    it('PaymentMethod should render without a PlaidForm', () => {
      const mockProps = generateMockProps({})
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      wrapper.setState({ method: PaymentMethods.METHOD_PLAID })
      expect(wrapper.find('PlaidForm').length).to.equal(1)
    })

    it('isPlaidEnabled should return true', () => {
      const mockProps = generateMockProps({
        methods: [
          PaymentMethods.METHOD_PLAID,
        ],
        defaultMethod: PaymentMethods.METHOD_PLAID,
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      expect(wrapper.instance().isPlaidEnabled()).to.equal(true)
    })

    it('isPlaidEnabled should return false', () => {
      const mockProps = generateMockProps({
        methods: [
          PaymentMethods.METHOD_CARD,
        ],
        defaultMethod: PaymentMethods.METHOD_CARD,
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      expect(wrapper.instance().isPlaidEnabled()).to.equal(false)
    })
  })

  describe('payment methods should change correctly', () => {

    it('should change to CC method', () => {
      const mockProps = generateMockProps({})
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      wrapper.setState({ method: PaymentMethods.METHOD_ACH })
      wrapper.instance().changePaymentMethodCC()
      expect(wrapper.instance().state.method).to.equal(PaymentMethods.METHOD_CARD)

    })
    it('should change to ACH method', () => {
      const mockProps = generateMockProps({})
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)

      wrapper.setState({ method: PaymentMethods.METHOD_CARD })
      wrapper.instance().changePaymentMethodACH()
      expect(wrapper.instance().state.method).to.equal(PaymentMethods.METHOD_ACH)

    })
  })

  describe('account props should change correctly', () => {

    it('should change to account.email and account.account_id', () => {
      const mockProps = generateMockProps({
        account: {
          account_id: 'new-acct1',
          email: 'new-email@company.api',
        }
      })
      const wrapper = shallow(<PaymentMethod  {...mockProps} />)
      expect(wrapper.instance().state.accountModel.email).to.equal('new-email@company.api')
      expect(wrapper.instance().state.accountModel.accountId).to.equal('new-acct1')

      wrapper.setProps({
        account: {
          account_id: 'existing-acct',
          email: 'existing-email@company.api',
        }
      })
      expect(wrapper.instance().state.accountModel.email).to.equal('existing-email@company.api')
      expect(wrapper.instance().state.accountModel.accountId).to.equal('existing-acct')
    })
  })
})
