import {useEffect, useMemo, useState} from "react";
import {type Cart, CartsContext, type CartItem} from "./carts_context.tsx";

export function CartsProvider({ children }: { children: React.ReactNode }) {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [currentCartId, setCurrentCartId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCarts() {
            try {
                const response = await fetch("/api/carts", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to load carts");
                }

                const data: { carts: Cart[]; currentCartId?: string | null } =
                    await response.json();

                setCarts(data.carts);

                setCurrentCartId(
                    data.currentCartId ?? data.carts[0]?.id ?? null
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadCarts();
    }, []);

    const currentCart = useMemo(() => {
        if (currentCartId === null) {
            return null;
        }

        return carts.find((cart) => cart.id === currentCartId) ?? null;
    }, [carts, currentCartId]);

    function selectCart(cartId: string) {
        const cartExists = carts.some((cart) => cart.id === cartId);

        if (!cartExists) {
            throw new Error(`Cart with id ${cartId} does not exist`);
        }

        setCurrentCartId(cartId);
    }

    async function createCart(cartName: string) {
        const response = await fetch("/api/carts", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cartName
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create cart");
        }

        const data: { cart: Cart } = await response.json();

        setCarts((currentCarts) => [...currentCarts, data.cart]);
        setCurrentCartId(data.cart.id);
    }

    async function removeCart(cartId: string) {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to remove cart");
        }

        setCarts((currentCarts) =>
            currentCarts.filter((cart) => cart.id !== cartId)
        );

        setCurrentCartId((currentId) => {
            if (currentId !== cartId) {
                return currentId;
            }

            const nextCart = carts.find((cart) => cart.id !== cartId);

            return nextCart?.id ?? null;
        });
    }

    async function addItem(cartId: string, newItem: CartItem) {
        const response = await fetch(`/api/carts/${cartId}/items`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newItem),
        });

        if (!response.ok) {
            throw new Error("Failed to add item to cart");
        }

        setCarts((currentCarts) =>
            currentCarts.map((cart) => {
                if (cart.id !== cartId) {
                    return cart;
                }

                const existingItem = cart.items.find(
                    (item) => item.productId === newItem.productId
                );

                if (!existingItem) {
                    return {
                        ...cart,
                        items: [...cart.items, newItem],
                    };
                }

                return {
                    ...cart,
                    items: cart.items.map((item) => {
                        if (item.productId !== newItem.productId) {
                            return item;
                        }

                        return {
                            ...item,
                            quantity: item.quantity + newItem.quantity,
                        };
                    }),
                };
            })
        );
    }

    async function removeItem(cartId: string, productId: string) {
        const response = await fetch(
            `/api/carts/${cartId}/items/${productId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to remove item from cart");
        }

        setCarts((currentCarts) =>
            currentCarts.map((cart) => {
                if (cart.id !== cartId) {
                    return cart;
                }

                return {
                    ...cart,
                    items: cart.items.filter((item) => item.productId !== productId),
                };
            })
        );
    }

    async function updateQuantity(
        cartId: string,
        productId: string,
        quantity: number
    ) {
        if (quantity < 1) {
            await removeItem(cartId, productId);
            return;
        }

        const response = await fetch(
            `/api/carts/${cartId}/items/${productId}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update cart item quantity");
        }

        setCarts((currentCarts) =>
            currentCarts.map((cart) => {
                if (cart.id !== cartId) {
                    return cart;
                }

                return {
                    ...cart,
                    items: cart.items.map((item) => {
                        if (item.productId !== productId) {
                            return item;
                        }

                        return {
                            ...item,
                            quantity,
                        };
                    }),
                };
            })
        );
    }

    async function clearCart(cartId: string) {
        const response = await fetch(`/api/carts/${cartId}/items`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to clear cart");
        }

        setCarts((currentCarts) =>
            currentCarts.map((cart) => {
                if (cart.id !== cartId) {
                    return cart;
                }

                return {
                    ...cart,
                    items: [],
                };
            })
        );
    }

    return (
        <CartsContext.Provider
            value={{
                carts,
                currentCartId,
                currentCart,
                isLoading,

                createCart,
                selectCart,
                removeCart,

                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartsContext.Provider>
    );
}