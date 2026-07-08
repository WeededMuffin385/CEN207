import styles from './cart.module.css'
import Summary from './summary/summary.tsx'
import {useCarts} from "../../../providers/carts/carts_hook.tsx";
import {useParams} from "react-router";
import CartContainer from "./cart_container/cart_container.tsx";
import {useProductsByIds} from "../../../hooks/products_by_ids.tsx";

export default function Cart() {
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
        <div className={styles.Cart}>
            <h2>{cart.name}</h2>

            <div className={styles.CartInner}>
                <CartContainer
                    cart={cart}
                    productsById={productsById}
                />
                <Summary
                    cart={cart}
                    productsById={productsById}
                />
            </div>
        </div>
    )
}