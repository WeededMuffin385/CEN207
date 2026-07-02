import {createContext} from "react";

export type CartItem = {
    productId: string,
    quantity: number,
}

export type Cart = {
    id: string,
    name: string,
    items: CartItem[],
}

export type CartsContextValue = {
    carts: Cart[],
    isLoading: boolean,

    currentCartId: string | null;
    currentCart: Cart | null;

    createCart: (cartName: string) => Promise<void>;
    selectCart: (cartId: string) => void;
    removeCart: (cartId: string) => Promise<void>;

    addItem: (cartId: string, item: CartItem) => Promise<void>;
    removeItem: (cartId: string, productId: string) => Promise<void>;
    updateQuantity: (
        cartId: string,
        productId: string,
        quantity: number
    ) => Promise<void>;
    clearCart: (cartId: string) => Promise<void>;
}

export const CartsContext = createContext<CartsContextValue | null>(null)