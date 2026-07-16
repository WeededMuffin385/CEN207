import {lazy, Suspense, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {Minus, Plus, ShoppingCart, Star, Trash2, Truck} from "lucide-react";
import {useProduct, useProductsByIds} from "../../../hooks/products_by_ids.tsx";
import {useCarts, useCurrentCartItem} from "../../../providers/carts/carts_hook.tsx";
import styles from "./product.module.css";

const Product3DViewer = lazy(() => import("./product_3d_viewer.tsx"));
const money = (value: number, currency = "AUD") => new Intl.NumberFormat("en-AU", {style: "currency", currency: currency || "AUD"}).format(value / 100);

export default function Product() {
    const {productId} = useParams();
    const navigate = useNavigate();
    const {product, isLoading, isError, error} = useProduct(productId);
    const {currentCartId, addItem, updateQuantity, removeItem} = useCarts();
    const cartItem = useCurrentCartItem(productId ?? "");
    const [variant, setVariant] = useState("Standard");
    const [status, setStatus] = useState("");
    const {data: related = []} = useProductsByIds([]);

    if (isLoading) return <main className={styles.State} aria-live="polite">Loading product…</main>;
    if (isError) return <main className={styles.State}><h1>We couldn't load this product</h1><p>{error.message}</p><Link to="/products">Return to products</Link></main>;
    if (!product) return <main className={styles.State}><h1>Product not found</h1><p>The product may have moved or is no longer available.</p><Link to="/products">Browse products</Link></main>;

    async function addToCart(buyNow = false) {
        if (!currentCartId || !product) return;
        setStatus("Adding…");
        try {
            await addItem(currentCartId, {productId: product.id, quantity: 1});
            setStatus(`${product.title} (${variant}) added to cart.`);
            if (buyNow) navigate(`/carts/${currentCartId}`);
        } catch (caught) {
            setStatus(caught instanceof Error ? caught.message : "Could not add this item.");
        }
    }

    function commitQuantity(value: string) {
        if (!currentCartId || !product || !cartItem) return 1;
        const parsed = Number.parseInt(value, 10);
        const nextQuantity = Number.isFinite(parsed) ? Math.max(1, parsed) : cartItem.quantity;
        if (nextQuantity !== cartItem.quantity) void updateQuantity(currentCartId, product.id, nextQuantity);
        return nextQuantity;
    }

    return <main className={styles.Product}>
        <Link className={styles.Back} to="/products">← All products</Link>
        <div className={styles.Hero}>
            <div className={styles.Media}><img src={product.imageUrl} alt={product.title}/><button className={styles.Thumbnail} aria-label={`View ${product.title} image`}><img src={product.imageUrl} alt=""/></button></div>
            <div className={styles.Details}>
                <p className={styles.Rating}><Star size={18}/> {product.rating.toFixed(1)} · {product.reviews} reviews</p>
                <h1>{product.title}</h1><p className={styles.Price}>{money(product.price, product.currency)}</p>
                <p className={styles.Description}>{product.description}</p><p className={styles.Stock}>In stock and ready to ship</p>
                <fieldset><legend>Configuration</legend><div className={styles.Options}>{["Standard", "Premium", "Gift-ready"].map(option => <button type="button" aria-pressed={variant === option} key={option} onClick={() => setVariant(option)}>{option}</button>)}</div></fieldset>
                {cartItem ? <div className={styles.PurchaseRow}>
                    <div className={styles.Quantity} aria-label="Quantity in cart"><button aria-label="Decrease cart quantity" onClick={() => void updateQuantity(currentCartId!, product.id, cartItem.quantity - 1)}><Minus/></button><input key={cartItem.quantity} aria-label="Cart quantity" type="number" min="1" inputMode="numeric" defaultValue={cartItem.quantity} onBlur={event => {event.currentTarget.value = String(commitQuantity(event.currentTarget.value));}} onKeyDown={event => {if (event.key === "Enter") event.currentTarget.blur();}}/><button aria-label="Increase cart quantity" onClick={() => void updateQuantity(currentCartId!, product.id, cartItem.quantity + 1)}><Plus/></button></div>
                    <button className={styles.Remove} aria-label={`Remove ${product.title} from cart`} onClick={() => void removeItem(currentCartId!, product.id)}><Trash2/> Remove</button>
                </div> : <button className={styles.Primary} disabled={!currentCartId} onClick={() => void addToCart()}><ShoppingCart/> Add to cart</button>}
                <button className={styles.Secondary} disabled={!currentCartId} onClick={() => cartItem ? navigate(`/carts/${currentCartId}`) : void addToCart(true)}>Buy now</button>
                {!currentCartId && <p className={styles.Warning}>Create or select a cart before adding products.</p>}<p className={styles.Status} aria-live="polite">{status}</p>
                <div className={styles.Delivery}><Truck/><div><strong>Tracked delivery</strong><span>Delivery options and final cost are confirmed at checkout.</span></div></div>
            </div>
        </div>
        <Suspense fallback={<div className={styles.ViewerFallback}>Loading interactive preview…</div>}><Product3DViewer productId={product.id} posterUrl={product.imageUrl} alt={`Interactive preview of ${product.title}`}/></Suspense>
        <section className={styles.InfoGrid}><article><h2>Product features</h2><ul><li>Designed for dependable everyday use</li><li>Quality materials and considered finish</li><li>Backed by responsive customer support</li></ul></article><article><h2>Specifications</h2><dl><div><dt>Product ID</dt><dd>{product.id}</dd></div><div><dt>Configuration</dt><dd>{variant}</dd></div><div><dt>Availability</dt><dd>In stock</dd></div></dl></article></section>
        {related.length > 0 && <section><h2>You may also like</h2></section>}
    </main>;
}
