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

    /** `inputStyles` for input fields. `&:focus` state can also be styled. */
    inputStyles?: object,

    /** Styles for your primary CTA button. */
    buttonStylesPrimary?: object,

    /** Styles for your secondary CTA button.
    ** Eg. Previous, Cancel buttons. */
    buttonStylesSecondary?: object,

    /** Styles for your text links. */
    linkStyling?: object,

    /** How wide you want the content area of `<PaymentMethod />`. */
    cardWidth?: number,

    /** An enumerated list of supported payment method types
     * that the developer can enable for their customers.
     */
    methods?: ReadonlyArray<PaymentMethods>,

    /** Default payment method property */
    defaultMethod?: PaymentMethods,

    /** A callable function to fire when an error occurs on the form. */
    onError?: PropTypes.func,

    /** Toggle for showing/hiding plaid info */
    togglePlaidHandler?: () => void,

    /** Optional reference to allow your own save buttons */
    saveRef?: RefObject,

    /** Account object allows preconfigured account options to be set */
    account?: object,
  }
}

declare class PaymentMethod extends React.Component<PaymentMethodProps, any> {}
