import styles from './product_item.module.css'
import {Banknote, Minus, Plus, ShoppingCart, Star, Tag} from "lucide-react";
import {useCarts, useCurrentCartItem} from "../../../providers/carts/carts_hook.tsx";
import type {CartItem} from "../../../providers/carts/carts_context.tsx";
import {Link} from "react-router";

type Props = {
    id: string,

    title: string,
    price: number,

    rating: number,
    reviews: number,

    imageUrl: string,
}

export default function ProductItem(props: Props) {
    const cartItem = useCurrentCartItem(props.id);

    const price = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(props.price / 100);

    const rating = new Intl.NumberFormat("en-AU", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(props.rating);

    const reviews = new Intl.NumberFormat("en-AU").format(props.reviews);

    return (
        <div className={styles.ProductItem}>
            <Link to={`/products/${props.id}`}><img src={props.imageUrl} alt={props.title}/></Link>

            <div className={styles.Info}>
                <Banknote className={styles.PriceIcon}/>
                <span>AU$ {price}</span>
            </div>

            <div className={styles.Info}>
                <Star className={styles.RatingIcon}/>
                <span>{rating}</span>
                <span className={styles.Reviews}>· {reviews} reviews</span>
            </div>

            <div className={styles.Info}>
                <Tag className={styles.TagIcon}/>
                <h2><Link to={`/products/${props.id}`}>{props.title}</Link></h2>
            </div>

            <ProductCartButton
                productId={props.id}
                cartItem={cartItem}
            />
        </div>
    )
}


function ProductCartButton({
                               productId,
                               cartItem,
                           }: {
    productId: string;
    cartItem: CartItem | null;
}) {
    const {currentCartId, addItem, updateQuantity} = useCarts();

    if (currentCartId === null) {
        return (
            <button disabled>
                <ShoppingCart/>
                No cart selected
            </button>
        );
    }

    if (cartItem === null) {
        return (
            <button
                onClick={() => {
                    addItem(currentCartId, {
                        productId,
                        quantity: 1,
                    });
                }}
            >
                <ShoppingCart/>
                Tomorrow
            </button>
        );
    }

    return (
        <div className={styles.QuantityControl}>
            <button
                onClick={() => {
                    updateQuantity(
                        currentCartId,
                        productId,
                        cartItem.quantity - 1
                    );
                }}
            ><Minus/></button>

            <span>{cartItem.quantity}</span>

            <button
                onClick={() => {
                    updateQuantity(
                        currentCartId,
                        productId,
                        cartItem.quantity + 1
                    );
                }}
            ><Plus/></button>
        </div>
    );
}
