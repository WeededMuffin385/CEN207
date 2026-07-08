import styles from './cart_list.module.css'
import {PackagePlus} from "lucide-react";
import {useCarts} from "../../../providers/carts/carts_hook.tsx";
import CartListItem from "./cart_list_item/cart_list_item.tsx";
import {useMatch} from "react-router";

type Props = {
    onCreateCart: () => void
    onRemoveCart: (cartId: string) => void,
}

export default function CartList(props: Props) {
    const {carts} = useCarts();

    const match = useMatch("/carts/:cartId");
    const selectedCartId = match?.params.cartId;

    return (
        <div className={styles.CartList}>
            <button
                className={styles.CreateCartButton}
                onClick={() => props.onCreateCart()}
            >
                <PackagePlus/>create new cart
            </button>

            <div className={styles.CartListContainer}>
                {carts.map((cart) => (
                    <CartListItem
                        key={cart.id}
                        cartId={cart.id}
                        cartName={cart.name}
                        isActive={selectedCartId == cart.id}
                        onRemove={() => props.onRemoveCart(cart.id)}
                    />
                ))}
            </div>
        </div>
    )
}