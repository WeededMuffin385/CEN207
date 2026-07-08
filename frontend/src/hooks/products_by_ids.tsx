/*
import {useQuery} from "@tanstack/react-query";
import type {Product} from "./products.tsx";

export function useProductsByIds(productIds: string[]) {
    const ids = [...new Set(productIds)].sort();

    return useQuery({
        queryKey: ["products", {ids}],

        enabled: ids.length > 0,

        queryFn: async (): Promise<Product[]> => {
            const params = new URLSearchParams();

            params.set("ids", ids.join(","));

            const response = await fetch(`/api/products?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.status}`);
            }

            return response.json() as Promise<Product[]>;
        },
    });
}*/





import { useQuery } from "@tanstack/react-query";
import type { Product } from "./products.tsx";

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

            return response.json() as Promise<Product[]>;
        },
    });
}