import styles from './carts.module.css'
import CartList from "./cart_list/cart_list.tsx";
import CreateCartPopup from "./cart_list/popup/create_cart_popup/create_cart_popup.tsx";
import {useState} from "react";
import {useCarts} from "../../providers/carts/carts_hook.tsx";
import {Route, Routes} from "react-router";
import Cart from "./cart/cart.tsx";
import CartPlaceholder from "./cart/cart_container/cart_container_placeholder.tsx";
import RemoveCartPopup from "./cart_list/popup/remove_cart_popup/remove_cart_popup.tsx";

export default function Carts() {
    const {createCart, removeCart} = useCarts();

    const [isCreateCartPopupOpen, setIsCreateCartPopupOpen] = useState(false)
    const [isRemoveCartPopupOpen, setIsRemoveCartPopupOpen] = useState<string | null>(null)

    return (
        <div className={styles.Carts}>
            <CartList
                onCreateCart={() => setIsCreateCartPopupOpen(true)}
                onRemoveCart={(cartId) => setIsRemoveCartPopupOpen(cartId)}
            />

            {isCreateCartPopupOpen && <CreateCartPopup
                onReturnBack={() => setIsCreateCartPopupOpen(false)}
                onCreateCart={(cartName) => {
                    createCart(cartName)
                    setIsCreateCartPopupOpen(false)
                }}
            />}

            {isRemoveCartPopupOpen !== null && <RemoveCartPopup
                onReturnBack={() => setIsRemoveCartPopupOpen(null)}
                onRemoveCart={() => {
                    removeCart(isRemoveCartPopupOpen)
                    setIsRemoveCartPopupOpen(null)
                }}
            />}

            <Routes>
                <Route index element={<CartPlaceholder/>}/>
                <Route path=":cartId" element={<Cart/>}/>
            </Routes>
        </div>
    )
}