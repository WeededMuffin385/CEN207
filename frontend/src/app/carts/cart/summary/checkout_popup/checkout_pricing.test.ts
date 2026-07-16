import {describe, expect, it} from "vitest";
import {calculateOrderTotals, EXPRESS_SHIPPING_CENTS, FREE_STANDARD_SHIPPING_THRESHOLD_CENTS, getStandardShipping, STANDARD_SHIPPING_CENTS} from "./checkout_pricing.ts";

describe("checkout shipping pricing", () => {
    it("uses the standard shipping fee below the free-shipping threshold", () => {
        expect(getStandardShipping(FREE_STANDARD_SHIPPING_THRESHOLD_CENTS - 1)).toBe(STANDARD_SHIPPING_CENTS);
    });

    it("provides free standard shipping at and above the threshold", () => {
        expect(getStandardShipping(FREE_STANDARD_SHIPPING_THRESHOLD_CENTS)).toBe(0);
        expect(getStandardShipping(FREE_STANDARD_SHIPPING_THRESHOLD_CENTS + 1)).toBe(0);
    });

    it("calculates the same complete standard-delivery estimate used by summary and checkout", () => {
        expect(calculateOrderTotals(5000)).toEqual({subtotal: 5000, shipping: 999, tax: 500, discount: 0, total: 6499});
    });

    it("recalculates totals for express delivery and discounts", () => {
        expect(calculateOrderTotals(10000, "express", 1000)).toEqual({subtotal: 10000, shipping: EXPRESS_SHIPPING_CENTS, tax: 1000, discount: 1000, total: 12499});
    });
});
