import {useContext} from "react";
import {CartsContext} from "./carts_context.tsx";

export function useCarts() {
    const context = useContext(CartsContext);

    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
}