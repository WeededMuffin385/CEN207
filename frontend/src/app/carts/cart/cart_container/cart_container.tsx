import styles from './cart_container.module.css'
import CartContainerItem from "./cart_container_item/cart_container_item.tsx";
import type {Product} from "../../../../hooks/products.tsx";
import type {Cart} from "../../../../providers/carts/carts_context.tsx";

type Props = {
    cart: Cart,
    productsById: Map<string, Product>,
}

export default function CartContainer({cart, productsById}: Props) {

    return (
        <div className={styles.CartContainer}>
            {cart.items.map((item) => {
                const product = productsById.get(item.productId);

                if (!product) {
                    return (
                        <div key={item.productId}>
                            Product not found: {item.productId}
                        </div>
                    )
                }

                return <CartContainerItem key={item.productId} quantity={item.quantity} product={product}/>
            })}
        </div>
    )
}