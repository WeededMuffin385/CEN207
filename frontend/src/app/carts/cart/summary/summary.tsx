import styles from './summary.module.css'
import {MapPinned} from "lucide-react";

export default function Summary() {
    return (
        <div className={styles.Summary}>
            <div className={styles.Header}>
                <button className={styles.SelectAddress}><MapPinned/> select address</button>
                <h2>Summary</h2>
            </div>


            <h3>Item subtotal: </h3>
            <h3 className={styles.Underline}>Item discount: </h3>

            <h3>Shipping fee: </h3>
            <h3 className={styles.Underline}>Shipping discount: </h3>

            <h3 className={styles.Underline}>Subtotal excluding taxes: </h3>

            <div className={styles.CheckOutButtonContainer}>
                <button className={styles.CheckOut}>Check out</button>
            </div>
        </div>
    );
}

