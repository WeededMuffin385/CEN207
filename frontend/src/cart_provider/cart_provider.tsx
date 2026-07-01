import {useEffect, useState} from "react";
import {CartContext, type CartItem} from "./cart_context.tsx";

export function CartProvider({children}: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadCart() {
            try {
                const response = await fetch("/api/cart", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to load cart")
                }

                const data = await response.json()

                setItems(data.items)
            } finally {
                setIsLoading(false)
            }
        }

        loadCart()
    }, [])

    function addItem(newItem: CartItem) {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.productId === newItem.productId)

            if (!existingItem) {
                return [...currentItems, newItem]
            }

            return currentItems.map((item) => {
                if (item.productId !== newItem.productId) {
                    return item
                }

                return  {
                    ...item,
                    quantity: item.quantity + newItem.quantity
                }
            })
        })
    }

    function removeItem(productId: string) {
        setItems((currentItems) =>
            currentItems.filter((item) => item.productId !== productId)
        );
    }

    function updateQuantity(productId: string, quantity: number) {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) => {
                if (item.productId !== productId) {
                    return item;
                }

                return {
                    ...item,
                    quantity,
                };
            })
        );
    }

    function clearCart() {
        setItems([]);
    }

    return (
        <CartContext.Provider value={{
            isLoading,
            items,

            addItem,
            removeItem,
            updateQuantity,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}