import {createContext} from "react";

export type CartItem = {
    productId: string,
    quantity: number,
}


export type CartContextValue = {
    items: CartItem[],
    isLoading: boolean,

    addItem: (item: CartItem) => void,
    removeItem: (productionId: string) => void,
    updateQuantity: (
        productIdL: string,
        quantity: number,
    ) => void,
    clearCart: () => void,
}

export const CartContext = createContext<CartContextValue | null>(null)