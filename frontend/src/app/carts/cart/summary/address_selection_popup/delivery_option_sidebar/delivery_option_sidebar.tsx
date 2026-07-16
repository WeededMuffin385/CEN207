import {MapPin, X} from "lucide-react";
import type {SelectedAddress} from "../../../../../../utils/location.tsx";
import styles from "./delivery_option_sidebar.module.css";

type Props = { onCancel: () => void; onConfirm: () => void; selectedAddress: SelectedAddress | null };

export default function DeliveryOptionSidebar({onCancel, onConfirm, selectedAddress}: Props) {
    return <aside className={styles.DeliveryOptionSidebar} aria-labelledby="address-picker-title">
        <div className={styles.Header}>
            <div><p>Delivery location</p><h2 id="address-picker-title">Choose an address</h2></div>
            <button type="button" aria-label="Cancel address changes" onClick={onCancel}><X/></button>
        </div>
        <p className={styles.Help}>Search above the map or tap a location. Your saved address will not change until you
            confirm.</p>
        <div className={styles.AddressCard}><MapPin/>
            <div>
                <span>Selected address</span><strong>{selectedAddress?.address || "Move the pin or search for an address"}</strong>{selectedAddress &&
                <small>{selectedAddress.latitude.toFixed(5)}, {selectedAddress.longitude.toFixed(5)}</small>}</div>
        </div>
        <div className={styles.Actions}>
            <button type="button" className={styles.Cancel} onClick={onCancel}>Cancel</button>
            <button type="button" className={styles.Deliver} disabled={!selectedAddress?.address}
                    onClick={onConfirm}>Use this address
            </button>
        </div>
    </aside>;
}
