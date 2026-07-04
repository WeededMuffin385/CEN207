import styles from './products.module.css'
import ProductItem from "./product_item/product_item.tsx";
import {useProducts} from "../../hooks/products.tsx";
import {useEffect, useMemo, useRef} from "react";

export default function Products() {
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useProducts();

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const products = useMemo(() => {
        return data?.pages.flatMap((page) => page) ?? [];
    }, [data]);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (element === null) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            {
                root: null,
                rootMargin: "400px",
                threshold: 0,
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return (
            <div className={styles.Products}>
                <h2>Loading in progress</h2>
            </div>
        )
    }

    if (isError) {
        throw error
    }

    return (
        <div className={styles.Products}>
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    rating={product.rating}
                    reviews={product.reviews}
                    imageUrl={product.imageUrl}
                />
            ))}

            <div ref={loadMoreRef} className={styles.LoadMoreTrigger}>
                {isFetchingNextPage && <h2>Loading more products...</h2>}
            </div>
        </div>
    );
}