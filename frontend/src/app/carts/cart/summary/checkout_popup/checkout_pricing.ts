export const STANDARD_SHIPPING_CENTS = 999;
export const EXPRESS_SHIPPING_CENTS = 2499;
export const FREE_STANDARD_SHIPPING_THRESHOLD_CENTS = 10000;
export const GST_RATE = 0.1;

export type DeliveryMethod = "standard" | "express";

export type OrderTotals = {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
};

export function getStandardShipping(subtotalCents: number): number {
    return subtotalCents >= FREE_STANDARD_SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
}

export function calculateOrderTotals(subtotal: number, delivery: DeliveryMethod = "standard", discount = 0): OrderTotals {
    const shipping = delivery === "express" ? EXPRESS_SHIPPING_CENTS : getStandardShipping(subtotal);
    const tax = Math.round(subtotal * GST_RATE);
    const normalizedDiscount = Math.max(0, discount);

    return {
        subtotal,
        shipping,
        tax,
        discount: normalizedDiscount,
        total: Math.max(0, subtotal + shipping + tax - normalizedDiscount),
    };
}
