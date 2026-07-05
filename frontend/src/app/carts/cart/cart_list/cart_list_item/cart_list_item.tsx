import styles from './cart_list_item.module.css'
import type {Product} from "../../../../../hooks/products.tsx";
import placeholder from '../../../../products/product_item/placeholder_dark.png'
import {Minus, Plus, ShoppingCart, Trash2} from "lucide-react";
import {useCarts} from "../../../../../providers/carts/carts_hook.tsx";


type Props = {
    quantity: number,
    product: Product,
}

export default function CartItem(props: Props) {
    const {currentCartId, updateQuantity} = useCarts();
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
        <div className={styles.CartItem}>
            <img src={placeholder} alt={""}/>


            <div className={styles.Controls}>
                <h3>{props.product.title}</h3>
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

                    <span>{quantity}</span>

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
                <button><Trash2/></button>
            </div>
        </div>
    )
}