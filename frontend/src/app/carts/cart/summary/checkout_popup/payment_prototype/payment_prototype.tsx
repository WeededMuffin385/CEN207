import {useEffect, useMemo, useRef, useState, type FormEvent} from "react";
import {Check, Minus, Plus, Trash2, X} from "lucide-react";
import type {Cart} from "../../../../../../providers/carts/carts_context.tsx";
import {useCarts} from "../../../../../../providers/carts/carts_hook.tsx";
import type {Product} from "../../../../../../hooks/products.tsx";
import type {SelectedAddress} from "../../../../../../utils/location.tsx";
import styles from "./payment_prototype.module.css";
import {calculateOrderTotals, EXPRESS_SHIPPING_CENTS, getStandardShipping, STANDARD_SHIPPING_CENTS, type DeliveryMethod} from "../checkout_pricing.ts";

type Props = {cart: Cart; productsById: Map<string, Product>; selectedAddress: SelectedAddress | null; onClose: () => void};
type Payment = "mock-card" | "mock-wallet";
const money = (cents: number) => new Intl.NumberFormat("en-AU", {style: "currency", currency: "AUD"}).format(cents / 100);

export function PaymentPrototype({cart, productsById, selectedAddress, onClose}: Props) {
    const {updateQuantity, removeItem, clearCart} = useCarts();
    const dialogRef = useRef<HTMLElement>(null);
    const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
    const [payment, setPayment] = useState<Payment>("mock-card");
    const [billingSame, setBillingSame] = useState(true);
    const [promo, setPromo] = useState("");
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<{orderId: string; mocked: boolean} | null>(null);
    const [submitError, setSubmitError] = useState("");

    const subtotal = useMemo(() => cart.items.reduce((sum, item) => sum + (productsById.get(item.productId)?.price ?? 0) * item.quantity, 0), [cart.items, productsById]);
    const {shipping, tax, total} = calculateOrderTotals(subtotal, delivery, discount);

    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        const keydown = (event: KeyboardEvent) => { if (event.key === "Escape" && !isSubmitting) onClose(); };
        document.addEventListener("keydown", keydown);
        return () => {document.removeEventListener("keydown", keydown); previous?.focus();};
    }, [isSubmitting, onClose]);

    function applyPromo() {
        if (promo.trim().toUpperCase() === "WELCOME10") {setDiscount(Math.round(subtotal * .1)); setPromoMessage("WELCOME10 applied: 10% off items.");}
        else {setDiscount(0); setPromoMessage("That promo code is not valid. Try WELCOME10.");}
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting || cart.items.length === 0) return;
        const data = new FormData(event.currentTarget);
        if (!event.currentTarget.reportValidity()) return;
        setIsSubmitting(true); setSubmitError("");
        try {
            let orderId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
            let mocked = true;
            if (selectedAddress) {
                const response = await fetch(`/api/carts/${cart.id}/order`, {method: "POST", credentials: "include", headers: {"Content-Type": "application/json"}, body: JSON.stringify({latitude: selectedAddress.latitude, longitude: selectedAddress.longitude, address: selectedAddress.address})});
                if (response.ok) {const body = await response.json() as {order_id?: string; orderId?: string}; orderId = body.orderId ?? body.order_id ?? orderId; mocked = false;}
                else if (response.status !== 404 && response.status !== 501) throw new Error(`Order service returned ${response.status}.`);
            }
            await new Promise(resolve => window.setTimeout(resolve, 650));
            if (mocked) await clearCart(cart.id);
            setSuccess({orderId, mocked});
            void data;
        } catch (caught) {setSubmitError(caught instanceof Error ? caught.message : "The order could not be submitted. Please try again.");}
        finally {setIsSubmitting(false);}
    }

    if (success) return <section ref={dialogRef} tabIndex={-1} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="success-title"><div className={styles.success}><span><Check/></span><p>Order received</p><h2 id="success-title">Thanks for your order</h2><p>Reference {success.orderId}</p>{success.mocked && <p className={styles.notice}>Demonstration only — no real payment was processed and no live order was created.</p>}<button className={styles.primary} onClick={onClose}>Continue shopping</button></div></section>;

    return <section ref={dialogRef} tabIndex={-1} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <header><div><p>Secure checkout</p><h2 id="checkout-title">Complete your order</h2></div><button type="button" aria-label="Close checkout" onClick={onClose} disabled={isSubmitting}><X/></button></header>
        <form onSubmit={submit}><div className={styles.content}><div className={styles.formColumn}>
            <fieldset><legend>Contact information</legend><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required placeholder="0400 000 000"/></label></fieldset>
            <fieldset><legend>Shipping address</legend>{selectedAddress ? <p className={styles.selectedAddress}>{selectedAddress.address}</p> : <><div className={styles.row}><label>First name<input name="firstName" autoComplete="given-name" required/></label><label>Last name<input name="lastName" autoComplete="family-name" required/></label></div><label>Street address<input name="address" autoComplete="street-address" required/></label><div className={styles.row}><label>City<input name="city" autoComplete="address-level2" required/></label><label>Postcode<input name="postcode" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{4}" required/></label></div></>}</fieldset>
            <fieldset><legend>Delivery method</legend><label className={styles.choice}><input type="radio" name="delivery" checked={delivery === "standard"} onChange={() => setDelivery("standard")}/><span><strong>Standard delivery</strong><small>3–6 business days</small></span><b>{getStandardShipping(subtotal) === 0 ? "Free" : money(STANDARD_SHIPPING_CENTS)}</b></label><label className={styles.choice}><input type="radio" name="delivery" checked={delivery === "express"} onChange={() => setDelivery("express")}/><span><strong>Express delivery</strong><small>1–2 business days</small></span><b>{money(EXPRESS_SHIPPING_CENTS)}</b></label></fieldset>
            <fieldset><legend>Billing address</legend><label className={styles.checkbox}><input type="checkbox" checked={billingSame} onChange={event => setBillingSame(event.target.checked)}/> Same as shipping address</label>{!billingSame && <label>Billing street address<input name="billingAddress" autoComplete="billing street-address" required/></label>}</fieldset>
            <fieldset><legend>Payment method</legend><p className={styles.notice}>Payment methods are simulated. Do not enter real card details.</p><label className={styles.choice}><input type="radio" name="payment" checked={payment === "mock-card"} onChange={() => setPayment("mock-card")}/><span><strong>Demo card</strong><small>No card number required</small></span></label><label className={styles.choice}><input type="radio" name="payment" checked={payment === "mock-wallet"} onChange={() => setPayment("mock-wallet")}/><span><strong>Demo digital wallet</strong><small>Simulated authorization</small></span></label></fieldset>
        </div><aside className={styles.summary}><h3>Order review</h3><div className={styles.items}>{cart.items.map(item => {const product = productsById.get(item.productId); if (!product) return null; return <article key={item.productId}><img src={product.imageUrl} alt=""/><div><strong>{product.title}</strong><small>{money(product.price)} each</small><div className={styles.quantity}><button type="button" aria-label={`Decrease ${product.title} quantity`} onClick={() => void updateQuantity(cart.id, item.productId, item.quantity - 1)}><Minus/></button><input key={item.quantity} type="number" min="1" inputMode="numeric" aria-label={`${product.title} quantity`} defaultValue={item.quantity} onBlur={event => {const parsed = Number.parseInt(event.currentTarget.value, 10); const nextQuantity = Number.isFinite(parsed) ? Math.max(1, parsed) : item.quantity; event.currentTarget.value = String(nextQuantity); if (nextQuantity !== item.quantity) void updateQuantity(cart.id, item.productId, nextQuantity);}} onKeyDown={event => {if (event.key === "Enter") event.currentTarget.blur();}}/><button type="button" aria-label={`Increase ${product.title} quantity`} onClick={() => void updateQuantity(cart.id, item.productId, item.quantity + 1)}><Plus/></button><button type="button" aria-label={`Remove ${product.title}`} onClick={() => void removeItem(cart.id, item.productId)}><Trash2/></button></div></div><b>{money(product.price * item.quantity)}</b></article>})}</div>
            <div className={styles.promo}><label>Promo code<input value={promo} onChange={event => setPromo(event.target.value)} placeholder="WELCOME10"/></label><button type="button" onClick={applyPromo}>Apply</button></div><p className={styles.promoMessage} aria-live="polite">{promoMessage}</p>
            <dl><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>Shipping</dt><dd>{shipping ? money(shipping) : "Free"}</dd></div><div><dt>Estimated GST</dt><dd>{money(tax)}</dd></div>{discount > 0 && <div><dt>Discount</dt><dd>−{money(discount)}</dd></div>}<div className={styles.total}><dt>Total</dt><dd>{money(total)}</dd></div></dl>
            {cart.items.length === 0 && <p className={styles.error} role="alert">Your cart is empty. Add an item before checking out.</p>}{submitError && <p className={styles.error} role="alert">{submitError}</p>}<button className={styles.primary} type="submit" disabled={isSubmitting || cart.items.length === 0}>{isSubmitting ? "Placing order…" : `Place demo order · ${money(total)}`}</button><p className={styles.legal}>Submitting confirms this checkout demonstration. No real payment credentials are collected.</p>
        </aside></div></form>
    </section>;
}
