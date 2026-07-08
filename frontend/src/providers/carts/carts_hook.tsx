import {useContext, useMemo} from "react";
import {type CartItem, CartsContext} from "./carts_context.tsx";

export function useCarts() {
    const context = useContext(CartsContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}


export function useCurrentCartItem(productId: string): CartItem | null {
    const { currentCart } = useCarts();

    return useMemo(() => {
        if (currentCart === null) {
            return null;
        }

        return (
            currentCart.items.find((item) => item.productId === productId) ??
            null
        );
    }, [currentCart, productId]);
}

export function useCurrentCartProductQuantity(productId: string): number {
    const cartItem = useCurrentCartItem(productId);

    return cartItem?.quantity ?? 0;
}