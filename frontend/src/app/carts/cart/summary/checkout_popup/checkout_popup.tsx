import type {Cart} from "../../../../../providers/carts/carts_context.tsx";
import type {Product} from "../../../../../hooks/products.tsx";
import type {SelectedAddress} from "../../../../../utils/location.tsx";
import {PaymentPrototype} from "./payment_prototype/payment_prototype.tsx";
import styles from "./checkout_popup.module.css";

type Props = {cart: Cart; productsById: Map<string, Product>; selectedAddress: SelectedAddress | null; onClose: () => void};
export default function CheckoutPopup(props: Props) {
    return <div className={styles.CheckoutPopup} onMouseDown={event => {if (event.target === event.currentTarget) props.onClose();}}><PaymentPrototype {...props}/></div>;
}
