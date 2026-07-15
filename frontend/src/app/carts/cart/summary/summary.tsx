import styles from './summary.module.css'
import {MapPinned} from "lucide-react";
import AddressSelectionPopup from "./address_selection_popup/address_selection_popup.tsx";
import {useState} from "react";
import type {Cart} from "../../../../providers/carts/carts_context.tsx";
import type {Product} from "../../../../hooks/products.tsx";
import type {SelectedAddress} from "../../../../utils/location.tsx";
import CheckoutPopup from "./checkout_popup/checkout_popup.tsx";

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

    const shipping_fee_raw = 14999

    const item_subtotal = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(item_subtotal_raw / 100);

    const shipping_fee = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(shipping_fee_raw / 100);

    const subtotal = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format((item_subtotal_raw + shipping_fee_raw) / 100);

    const checkout = async () => {
        await fetch(`/api/carts/${cart.id}/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                latitude: selectedAddress?.latitude,
                longitude: selectedAddress?.longitude,
                address: selectedAddress?.address,
            }),
        })
    }

    console.log(`selected address: ${selectedAddress?.address}`)

    return (
        <div className={styles.Summary}>
            {isAddressSelectionPopupOpen && <AddressSelectionPopup
                onClose={() => setIsAddressSelectionPopupOpen(false)}
                setSelectedAddress={setSelectedAddress}
            />}

            {isCheckoutPopupOpen && <CheckoutPopup/>}

            <div className={styles.Header}>
                <button className={styles.SelectAddress} onClick={() => setIsAddressSelectionPopupOpen(true)}>
                    <MapPinned/> select address
                </button>
                <h2>Summary</h2>
                {selectedAddress !== null && <h3>{selectedAddress.address}</h3>}
            </div>

            <h3>Item subtotal: {item_subtotal}</h3>
            <h3 className={styles.Underline}>Item discount: 0.00</h3>

            <h3>Shipping fee: {shipping_fee}</h3>
            <h3 className={styles.Underline}>Shipping discount: 0.00</h3>

            <h3 className={styles.Underline}>Subtotal excluding taxes: {subtotal}</h3>

            <div className={styles.CheckOutButtonContainer}>
<<<<<<< HEAD
                <button className={styles.CheckOut} onClick={() => setIsCheckoutPopupOpen(true)}>Check out</button>
=======
                <button className={styles.CheckOut} onClick={checkout}>Check out</button>
>>>>>>> 0ef3302 ([BACKEND] Implemented checkout)
            </div>
        </div>
    );
}

