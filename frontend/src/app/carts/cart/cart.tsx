import styles from './cart.module.css'
import Summary from './summary/summary.tsx'
import {useCarts} from "../../../providers/carts/carts_hook.tsx";
import {useParams} from "react-router";
import CartList from "./cart_list/cart_list.tsx";

export default function Cart() {
    const {carts} = useCarts()
    const {cartId} = useParams()

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cartId) {
        return (
            <div className={styles.Cart}>
                Cart id is missing
            </div>
        )
    }

    if (!cart) {
        return (
            <div className={styles.Cart}>
                Cart not found
            </div>
        )
    }

    return (
        <div className={styles.Cart}>
            <h2>{cart.name}</h2>

            <div className={styles.CartInner}>
                <CartList/>
                <Summary/>
            </div>
        </div>
    )
}