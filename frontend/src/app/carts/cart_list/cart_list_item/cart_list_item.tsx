import styles from './cart_list_item.module.css'
import {Trash2} from "lucide-react";

type Props = {
    cartName: string
}

export default function CartListItem(props: Props) {
    return (
        <div className={styles.CartListItem}>
            <h2>{props.cartName}</h2>

            <button><Trash2 /></button>
        </div>
    )
}