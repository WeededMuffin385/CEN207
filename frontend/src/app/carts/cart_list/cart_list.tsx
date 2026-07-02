import styles from './cart_list.module.css'
import {PackagePlus} from "lucide-react";
import {useCarts} from "../../../carts_provider/carts_hook.tsx";
import CartListItem from "./cart_list_item/cart_list_item.tsx";

type Props = {
    onCreateNewCart: () => void
}

export default function CartList(props: Props) {
    const {carts} = useCarts();

    return (
        <div className={styles.CartList}>
            <button className={styles.CreateCartButton} onClick={() => props.onCreateNewCart()}><PackagePlus />create new cart</button>

            {carts.map((cart) => (
                <CartListItem key={cart.id} cartId={cart.id} cartName={cart.name} />
            ))}
        </div>
    )
}