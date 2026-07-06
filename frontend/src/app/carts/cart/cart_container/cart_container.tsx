import styles from './cart_container.module.css'
import {useCarts} from "../../../../providers/carts/carts_hook.tsx";
import {useParams} from "react-router";
import {useProductsByIds} from "../../../../hooks/products_by_ids.tsx";
import CartContainerItem from "./cart_container_item/cart_container_item.tsx";

export default function CartContainer() {
    const {carts} = useCarts()
    const {cartId} = useParams()

    const cart = carts.find((cart) => cart.id === cartId);
    const productIds = cart?.items.map((item) => item.productId) ?? [];

    const {
        data: products = [],
        isLoading: isProductsLoading,
        error: productsError,
    } = useProductsByIds(productIds);

    const productsById = new Map(
        products.map((product) => [product.id, product])
    );

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

    if (isProductsLoading) {
        return (
            <div className={styles.Cart}>
                Loading cart products...
            </div>
        );
    }

    if (productsError) {
        return (
            <div className={styles.Cart}>
                Failed to load cart products
            </div>
        );
    }

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