import {useQuery} from "@tanstack/react-query";
import type {Product} from "./products.tsx";
import {getCardImage} from "../placeholders/placeholders.tsx";

export function useProductsByIds(productIds: string[]) {
    const ids = [...new Set(productIds)].sort();

    return useQuery({
        queryKey: ["products", { ids }],

        enabled: ids.length > 0,

        queryFn: async (): Promise<Product[]> => {
            const params = new URLSearchParams();

            for (const id of ids) {
                params.append("ids", id);
            }

            const response = await fetch(`/api/products?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.status}`);
            }

            const products = await response.json() as Product[];

            return products.map((product) => ({
                ...product,
                imageUrl: product.imageUrl || getCardImage(product.id),
            }));
        },
    });
}