import styles from './cart.module.css'
import {useParams} from "react-router";
import {useCarts} from "../../../carts_provider/carts_hook.tsx";

export default function Cart(){
    const {carts} = useCarts()
    const {cartId} = useParams()

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cartId) {
        return <div>Cart id is missing</div>;
    }

    if (!cart) {
        return <div>Cart not found</div>;
    }

    return (
        <div className={styles.Cart}>
            <h2>{cart.name}</h2>
        </div>
    )
}