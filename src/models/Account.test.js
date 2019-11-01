import { Account } from './Account'
import { BillingContact } from './BillingContact'
import { BillingPreferences } from './BillingPreferences'
import { ShippingContact } from './ShippingContact'
jest.mock('uuid/v4', () => () => '00000000-0000-0000-0000-000000000000')

describe('Account Model', () => {
  const propTests = [
    {
      props: {
        name: 'Testing',
        id: 'a-long-uuid',
        accountId: 'my-account',
        billingContact: new BillingContact({
          dateCreated: '2019-09-15T10:35:08-07:00',
          dateUpdated: '2019-09-15T10:35:08-07:00',
          id: 'fb758310-f7b7-43d2-96eb-aaaee251d581'
        }),
        billingPreferences: new BillingPreferences({
          bankAccountHolderName: '',
          bankAccountHolderType: '',
          bankAccountNumber: '',
          bankCountry: '',
          bankName: '',
          bankRoutingNumber: '',
          cardCvv: '',
          cardExpdate: '',
          cardName: '',
          cardNumber: '',
          cardToken: '',
          dateCreated: '2019-09-15T10:35:08-07:00',
          dateUpdated: '2019-09-15T10:35:08-07:00',
          id: '9ad03e08-7143-44e0-a75c-586c05987562',
          paymentMethod: '',
          plaidLinkPublicToken: ''
        }),
        dateCreated: '2019-09-15T10:35:08-07:00',
        dateUpdated: '2019-09-15T10:35:08-07:00',
        shippingContact: new ShippingContact({
          dateCreated: '2019-09-15T10:35:08-07:00',
          dateUpdated: '2019-09-15T10:35:08-07:00',
          id: '9ad03e08-7143-44e0-a75c-586c05987569'
        })
      },
      expectedProps: {
        accountId: 'my-account',
        billingContact: {
          dateCreated: '2019-09-15T10:35:08-07:00',
          dateUpdated: '2019-09-15T10:35:08-07:00',
          id: 'fb758310-f7b7-43d2-96eb-aaaee251d581'
        },
        billingPreferences: {
          bankAccountHolderName: '',
          bankAccountHolderType: '',
          bankAccountNumber: '',
          bankCountry: '',
          bankName: '',
          bankRoutingNumber: '',
          cardCvv: '',
          cardExpdate: '',
          cardName: '',
          cardNumber: '',
          cardToken: '',
          dateCreated: '2019-09-15T10:35:08-07:00',
          dateUpdated: '2019-09-15T10:35:08-07:00',
          id: '',
          paymentMethod: '',
          plaidLinkPublicToken: ''
        },
        dateCreated: '2019-09-15T10:35:08-07:00',
        dateUpdated: '2019-09-15T10:35:08-07:00',
        id: 'a-long-uuid',
        name: 'Testing',
        shippingContact: {
          dateCreated: '2019-09-15T10:35:08-07:00',
          dateUpdated: '2019-09-15T10:35:08-07:00',
          id: '9ad03e08-7143-44e0-a75c-586c05987569'
        }
      }
    }
  ]

  propTests.map(test => {
    const account = new Account(test.props)
    Object.keys(test.expectedProps).map(prop => {
      it(`AccountModel should generate a valid account property: account.${prop} match`, () => {
        let expectedProps = test.expectedProps[prop]
        if (typeof (expectedProps) === 'object') {
          expectedProps = new Object(test.expectedProps[prop])
          Object.entries(([key, value]) => {
            expect(account[prop][key]).to.equal(value)
          })
        } else {
          expect(account[prop]).to.equal(test.expectedProps[prop])
        }
      })
    }
    )
  })

  it('AccountModel should generate uuid on new objects', () => {
    const account = new Account()
    expect(account.id).to.equal('00000000-0000-0000-0000-000000000000')
    expect(account.billingContact.id).to.equal('00000000-0000-0000-0000-000000000000')
    expect(account.shippingContact.id).to.equal('00000000-0000-0000-0000-000000000000')
  })

  it('AccountModel should use existing ids on partial objects', () => {
    const account = new Account({
      id: '10000000-0000-0000-0000-000000000000',
      billingPreferences: {
        id: '20000000-0000-0000-0000-000000000000'
      },
      billingContact: {
        id: '30000000-0000-0000-0000-000000000000'
      },
      shippingContact: {
        id: '40000000-0000-0000-0000-000000000000'
      }
    })
    expect(account.id).to.equal('10000000-0000-0000-0000-000000000000')
    expect(account.billingPreferences.id).to.equal('20000000-0000-0000-0000-000000000000')
    expect(account.billingContact.id).to.equal('30000000-0000-0000-0000-000000000000')
    expect(account.shippingContact.id).to.equal('40000000-0000-0000-0000-000000000000')
  })

  it('AccountModel should saveWithSecureForm calls form.submit', () => {
    const account = new Account()
    const apiKey = 'pk_wonderful-security'
    const form = {
      submit: jest.fn()
    }

    account.saveWithSecureForm(apiKey, form, {}, {})
    expect(form.submit.mock.calls.length).to.equal(1)
  })

  it('AccountModel should raise Error w/ saveWithSecureForm with bad apiKey', () => {
    const account = new Account()
    const apiKey = ''
    const form = {
      submit: jest.fn()
    }
    expect(() => {
      account.saveWithSecureForm(apiKey, form, {}, { loggingLevel: '' })
    }).to.throw(Error)
    expect(form.submit.mock.calls.length).to.equal(0)
  })
})
