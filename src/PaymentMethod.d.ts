import * as React, RefObject from "react";


enum PaymentMethods {
  METHOD_ACH = 'ach',
  METHOD_CARD = 'card',
  METHOD_PLAID = 'plaid',
}

export interface PaymentMethodProps {
  static propTypes = {
    /** Required RevOps API Public Key **/
    publicKey: string,

    /** PaymentMethod can have custom styles,
     ** these styles are passed onto children components */
    styles?: object,

    /** An enumerated list of supported payment method types
     * that the developer can enable for their customers.
     */
    methods: ReadonlyArray<PaymentMethods>,

    /** Default payment method property */
    defaultMethod: PaymentMethods,

    /** A callable function to fire when an error occurs on the form. */
    onError: PropTypes.func,

    /** Toggle for showing/hiding plaid info */
    togglePlaidHandler: () => void,

    /** Optional reference to allow your own save buttons */
    saveRef: RefObject,
  }
}

declare class PaymentMethod extends React.Component<PaymentMethodProps, any> {}
