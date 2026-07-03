import styles from './product_item.module.css'
import {Banknote, Star, Tag} from "lucide-react";

type Props = {
    id: string,
    name: string,
    price: number,
    rating: number,
    reviews: number,
}

export default function ProductItem(props: Props) {
    const price = new Intl.NumberFormat("en-AU").format(props.price);
    const rating = new Intl.NumberFormat("en-AU").format(props.rating);
    const reviews = new Intl.NumberFormat("en-AU").format(props.reviews);

    console.log(price)

    return (
        <div className={styles.ProductItem}>
            <img alt="image"/>


            <div className={styles.Info}>
                <Banknote color="#c061cb"/>
                <span>{price} AU$</span>
            </div>

            <div className={styles.Info}>
                <Star color="#f8e45c"/>
                <span>{rating}</span>
                <span className={styles.Reviews}>· {reviews} reviews</span>
            </div>

            <div className={styles.Info}>
                <Tag color="#1c71d8"/>
                <h2>{props.name}</h2>
            </div>
        </div>
    )
}