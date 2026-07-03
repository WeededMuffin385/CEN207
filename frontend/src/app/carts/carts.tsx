import styles from './carts.module.css'
import CartList from "./cart_list/cart_list.tsx";
import CreateCartPopup from "./cart_list/create_cart_popup/create_cart_popup.tsx";
import {useState} from "react";
import {useCarts} from "../../carts_provider/carts_hook.tsx";
import {Route, Routes} from "react-router";
import Cart from "./cart/cart.tsx";
import CartPlaceholder from "./cart/cart_placeholder.tsx";

export default function Carts() {
    const {createCart} = useCarts();

    const [isCreateCartPopupOpen, setIsCreateCartPopupOpen] = useState(false)

    return (
        <div className={styles.Carts}>
            <CartList onCreateNewCart={() => setIsCreateCartPopupOpen(true)}/>

            {isCreateCartPopupOpen && <CreateCartPopup
                onReturnBack={() => setIsCreateCartPopupOpen(false)}
                onCreateCart={(cartName) => createCart(cartName)}
            />}

            <Routes>
                <Route index element={<CartPlaceholder/>}/>
                <Route path=":cartId" element={<Cart/>}/>
            </Routes>
        </div>
    )
}