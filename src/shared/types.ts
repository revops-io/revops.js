import { CSSProperties, ReactNode, RefObject } from "react"
import { Instrument } from "../models"

export interface PaymentProps {
  /** Required RevOps API Public Key **/
  publicKey: string

  /** Account object allows preconfigured account options to be set */
  account: Account

  method: PaymentMethods

  /** A callable function to fire when form is complete */
  onComplete?: (response: unknown) => void

  /** A callable function to fire when last event occurs */
  onLast: () => void

  /** A callable function to fire when an error occurs on the form. */
  onError?: (params: { message: string; code: string }) => void

  /** A callable function to fire when an validation error occurs on the form. */
  onValidationError?: (errors: unknown[]) => void

  /** Toggle for showing/hiding plaid info */
  togglePlaidHandler: () => void

  /** A boolean to hide the plaid toggler, it defaults to hidden. */
  hideTogglePlaid: boolean

  /** A boolean to show/hide change to credit card link. */
  showCardLink: boolean

  /** `inputStyles` for input fields. `&:focus` state can also be styled. */
  inputStyles: CSSProperties

  /** Styles for your primary CTA button. */
  buttonStylesPrimary: CSSProperties

  /** Styles for your secondary CTA button.
   ** Eg. Previous, Cancel buttons. */
  buttonStylesSecondary: CSSProperties

  /** Styles for your text links. */
  linkStyling: CSSProperties

  /** CSS in JS styling for the parent html element */
  sectionStyle: CSSProperties

  /** Deprecated property for controlling the style of the parent component */
  cardWidth: Record<string, unknown> //TODO: figure out what this is

  /** Color of error text, a valid color name or hex. */
  errorColor: string

  /** Internal Use-only: Change payment method swaps current payment method state */
  changePaymentMethod: () => void

  /** Optional reference to allow your own save buttons */
  saveRef: RefObject<HTMLElement>

  /** Optional API Options **/
  apiOptions: { env: string; loggingLevel?: string } //TODO: figure out what this is

  /**
   * a token that grants permission to interact with the RevOps API
   * takes the place of the public key when performing secure operations
   */
  accessToken: string

  children?: ReactNode

  /** model for of a revops payment instrument */
  instrument: Instrument

  /** callback function that is called before every call requiring authorization */
  getToken: (accountId: string) => { access_token: string }

  /** tells the component to create an account with the instrument */
  createAccount: boolean

  /**
   * overrideProps is an object where keys names are ids of the particular
   * element in the DOM. `<div id="bank-name" > = "bank-name": {}`.
   * Only allowed properties are allowed, see documentation for details.
   */
  overrideProps?: {
    css: CSSProperties
    placeholder: string
    color: string
    errorColor: string
    showCardLink: boolean // some fields only
    label: string
  }

  /** determines if validation errors should be shown */
  showInlineError: boolean

  /** A callable function to fire when the PaymentMethod initializes all fields */
  onLoad?: () => void

  /** user defined loading element */
  loadingState?: ReactNode

  /** internal system flag to indicate that the system is loading an Instrument to update */
  isUpdate: boolean

  /** User defined header used for the ACH  payment method */
  achLabel: ReactNode

  /** Customized link that switches to the credit card payment method */
  creditCardLink: ReactNode

  /** Customized link that switches to the Plaid payment method */
  plaidLink: ReactNode

  /** optional prop to disable the network errors */
  showNetworkError: boolean
}

export enum PaymentMethods {
  METHOD_ACH = "ach",
  METHOD_CARD = "credit-card",
  METHOD_PLAID = "plaid",
}
