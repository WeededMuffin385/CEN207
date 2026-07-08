import { useInfiniteQuery } from "@tanstack/react-query";

export type Product = {
    id: string,

    title: string,
    description: string,

    price: number,
    currency: string,

    rating: number,
    reviews: number,

    createdAt: string,

    imageUrl: string,
}

type ProductsCursor = {
    createdAt: string;
    productId: string;
};

const PRODUCTS_LIMIT = 24;

export function useProducts() {
    return useInfiniteQuery({
        queryKey: ["products"],

        initialPageParam: null as ProductsCursor | null,

        queryFn: async ({ pageParam }): Promise<Product[]> => {
            const params = new URLSearchParams();

            params.set("limit", String(PRODUCTS_LIMIT));

            if (pageParam !== null) {
                params.set("product_id", pageParam.productId);
                params.set("created_at", pageParam.createdAt);
            }

            const response = await fetch(`/api/products?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.status}`);
            }

            return response.json() as Promise<Product[]>;
        },

        getNextPageParam: (lastPage): ProductsCursor | undefined => {
            if (lastPage.length < PRODUCTS_LIMIT) {
                return undefined;
            }

            const lastProduct = lastPage[lastPage.length - 1];

            return {
                productId: lastProduct.id,
                createdAt: lastProduct.createdAt,
            };
        },
    });
}