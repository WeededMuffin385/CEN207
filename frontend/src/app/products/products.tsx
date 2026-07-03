import styles from './products.module.css'
import ProductItem from "./product_item/product_item.tsx";

export default function Products() {
    return (
        <div className={styles.Products}>
            {Array.from({length: 48}, (_, index) => (
                <ProductItem key={index} id={"some_id"} name={"Some product name"} price={12345} rating={4.9} reviews={123456} />
            ))}
        </div>
    )
}