import styles from './summary.module.css'
import {MapPinned} from "lucide-react";
import AddressSelectionPopup from "./address_selection_popup/address_selection_popup.tsx";
import {useState} from "react";
import type {Cart} from "../../../../providers/carts/carts_context.tsx";
import type {Product} from "../../../../hooks/products.tsx";
import type {SelectedAddress} from "../../../../utils/location.tsx";
import CheckoutPopup from "./checkout_popup/checkout_popup.tsx";
import {calculateOrderTotals} from "./checkout_popup/checkout_pricing.ts";

type Props = {
    cart: Cart,
    productsById: Map<string, Product>,
}

export default function Summary({cart, productsById}: Props) {
    const [isAddressSelectionPopupOpen, setIsAddressSelectionPopupOpen] = useState(false)
    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false)

    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null)

    const item_subtotal_raw = cart.items.reduce((sum, item) => {
        const product = productsById.get(item.productId);

        if (!product) {
            throw Error("Product not found")
        }

        return sum + item.quantity * product.price
    }, 0);

    const estimatedTotals = calculateOrderTotals(item_subtotal_raw)

    const item_subtotal = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(item_subtotal_raw / 100);

    const shipping_fee = estimatedTotals.shipping === 0 ? "Free" : new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(estimatedTotals.shipping / 100);

    const estimated_total = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(estimatedTotals.total / 100);

    return (
        <div className={styles.Summary}>
            {isAddressSelectionPopupOpen && <AddressSelectionPopup
                onCancel={() => setIsAddressSelectionPopupOpen(false)}
                confirmedAddress={selectedAddress}
                onConfirm={(address) => {setSelectedAddress(address); setIsAddressSelectionPopupOpen(false)}}
            />}

            {isCheckoutPopupOpen && <CheckoutPopup cart={cart} productsById={productsById} selectedAddress={selectedAddress} onClose={() => setIsCheckoutPopupOpen(false)}/>}

            <div className={styles.Header}>
                <h2>Summary</h2>
            </div>

            <button className={styles.SelectAddress} onClick={() => setIsAddressSelectionPopupOpen(true)}>
                <MapPinned/><span><small>Delivery address</small><strong>{selectedAddress?.address || "Select an address"}</strong></span><b>{selectedAddress ? "Change" : "Select"}</b>
            </button>

            <dl className={styles.PriceSummary}>
                <div><dt>Item subtotal</dt><dd>AU$ {item_subtotal}</dd></div>
                <div><dt>Estimated standard shipping</dt><dd>{shipping_fee === "Free" ? shipping_fee : `AU$ ${shipping_fee}`}</dd></div>
                <div className={styles.EstimatedTotal}><dt>Estimated total</dt><dd>AU$ {estimated_total}</dd></div>
            </dl>
            <p className={styles.EstimateNote}>Based on standard delivery and estimated GST. Delivery choices and discounts are finalized at checkout.</p>

            <div className={styles.CheckOutButtonContainer}>
                <button className={styles.CheckOut} disabled={cart.items.length === 0} onClick={() => setIsCheckoutPopupOpen(true)}>Check out</button>
            </div>
        </div>
    );
}
