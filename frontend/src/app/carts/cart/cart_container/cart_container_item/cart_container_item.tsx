import styles from './cart_container_item.module.css'
import type {Product} from "../../../../../hooks/products.tsx";
import {Minus, Plus, ShoppingCart, Trash2} from "lucide-react";
import {useCarts} from "../../../../../providers/carts/carts_hook.tsx";
import {Link} from "react-router";


type Props = {
    quantity: number,
    product: Product,
}

export default function CartContainerItem(props: Props) {
    const {currentCartId, updateQuantity, removeItem} = useCarts();
    const productId = props.product.id
    const quantity = props.quantity

    if (currentCartId === null) {
        return (
            <button disabled>
                <ShoppingCart/>
                No cart selected
            </button>
        );
    }

    const price = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(props.product.price / 100);

    return (
        <div className={styles.CartContainerItem}>
            <Link className={styles.ProductImageLink} to={`/products/${productId}`}>
                <img src={props.product.imageUrl} alt={props.product.title}/>
            </Link>


            <div className={styles.Controls}>
                <h3><Link to={`/products/${productId}`}>{props.product.title}</Link></h3>
                <p>AU$ {price}/ea</p>
                <div className={styles.QuantityControl}>
                    <button
                        onClick={() => {
                            updateQuantity(
                                currentCartId,
                                productId,
                                quantity - 1
                            );
                        }}
                    ><Minus/></button>

                    <input
                        key={quantity}
                        type="number"
                        min="1"
                        inputMode="numeric"
                        aria-label={`${props.product.title} quantity`}
                        defaultValue={quantity}
                        onBlur={(event) => {
                            const parsed = Number.parseInt(event.currentTarget.value, 10);
                            const nextQuantity = Number.isFinite(parsed) ? Math.max(1, parsed) : quantity;
                            event.currentTarget.value = String(nextQuantity);
                            if (nextQuantity !== quantity) void updateQuantity(currentCartId, productId, nextQuantity);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") event.currentTarget.blur();
                        }}
                    />

                    <button
                        onClick={() => {
                            updateQuantity(
                                currentCartId,
                                productId,
                                quantity + 1
                            );
                        }}
                    ><Plus/></button>
                </div>
                <button aria-label={`Remove ${props.product.title}`} onClick={() => void removeItem(currentCartId, productId)}><Trash2/></button>
            </div>
        </div>
    )
}
