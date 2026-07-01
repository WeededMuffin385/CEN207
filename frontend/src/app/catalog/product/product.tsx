import styles from './product.module.css'
import {useParams} from "react-router";

export default function Product() {
    const {productId} = useParams();

    if (!productId) {
        throw new Error("productId is missing");
    }

    return (
        <div className={styles.Product}>
            <h1>Product page</h1>
            <p>Product ID: {productId}</p>
        </div>
    )
}