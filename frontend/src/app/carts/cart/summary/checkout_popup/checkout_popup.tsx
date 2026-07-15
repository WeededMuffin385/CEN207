import styles from './checkout_popup.module.css'
import {PaymentPrototype} from "./payment_prototype/payment_prototype.tsx";

export default function CheckoutPopup() {
    return (
        <div className={styles.CheckoutPopup}>
            <div className={styles.CheckoutPopupInner}>
                <h2>Check Out</h2>

                <PaymentPrototype />
            </div>
        </div>
    )
}