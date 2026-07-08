import styles from './summary.module.css'
import {MapPinned} from "lucide-react";
import AddressSelectionPopup from "./address_selection_popup/address_selection_popup.tsx";
import {useState} from "react";

export default function Summary() {

    const [isAddressSelectionPopupOpen, setIsAddressSelectionPopupOpen] = useState(false)

    return (
        <div className={styles.Summary}>
            {isAddressSelectionPopupOpen && <AddressSelectionPopup
                onClose={() => setIsAddressSelectionPopupOpen(false)}
            />}

            <div className={styles.Header}>
                <button className={styles.SelectAddress} onClick={() => setIsAddressSelectionPopupOpen(true)}><MapPinned/> select address</button>
                <h2>Summary</h2>
            </div>

            <h3>Item subtotal: {}</h3>
            <h3 className={styles.Underline}>Item discount: 0.00</h3>

            <h3>Shipping fee: {}</h3>
            <h3 className={styles.Underline}>Shipping discount: 0.00</h3>

            <h3 className={styles.Underline}>Subtotal excluding taxes: {}</h3>

            <div className={styles.CheckOutButtonContainer}>
                <button className={styles.CheckOut}>Check out</button>
            </div>
        </div>
    );
}

