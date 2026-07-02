import styles from './carts.module.css'
import CartDisplay from "./cart_display/cart_display.tsx";
import CartList from "./cart_list/cart_list.tsx";
import CreateCartPopup from "./cart_list/create_cart_popup/create_cart_popup.tsx";
import {useState} from "react";
import {useCarts} from "../../carts_provider/carts_hook.tsx";

export default function Carts() {
    const {createCart} = useCarts();

    const [isCreateCartPopupOpen, setIsCreateCartPopupOpen] = useState(false)

    return (
        <div className={styles.Carts}>
            <CartList onCreateNewCart={() => setIsCreateCartPopupOpen(true)}/>
            <CartDisplay />
            {isCreateCartPopupOpen && <CreateCartPopup onReturnBack={() => setIsCreateCartPopupOpen(false)} onCreateCart={(cartName) => createCart(cartName)}/>}
        </div>
    )
}