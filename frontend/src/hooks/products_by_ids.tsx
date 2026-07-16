import {useQuery} from "@tanstack/react-query";
import type {Product} from "./products.tsx";
import {getCardImage} from "../placeholders/placeholders.tsx";

export function useProductsByIds(productIds: string[]) {
    const ids = [...new Set(productIds)].sort();

    return useQuery({
        queryKey: ["products", { ids }],

        enabled: ids.length > 0,

        // Keep the cart and checkout mounted while an item mutation changes
        // the ID query key and the reduced product set is being refreshed.
        placeholderData: (previousProducts) => previousProducts,

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

export function useProduct(productId: string | undefined) {
    const query = useProductsByIds(productId ? [productId] : []);

    return {
        ...query,
        product: query.data?.find((product) => product.id === productId),
    };
}
