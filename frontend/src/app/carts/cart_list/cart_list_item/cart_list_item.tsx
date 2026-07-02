import styles from './cart_list_item.module.css'
import {Trash2} from "lucide-react";
import {useMatch, useNavigate} from "react-router";

type Props = {
    cartId: string,
    cartName: string,
}

export default function CartListItem(props: Props) {
    const navigate = useNavigate()

    const match = useMatch("/carts/:cartId");
    const cartId = match?.params.cartId;

    const isActive = cartId === props.cartId

    return (
        <div className={`${styles.CartListItem} ${isActive ? styles.Active : ""}`}>
            <h2 onClick={() => navigate(`/carts/${props.cartId}`)}>{props.cartName}</h2>

            <button><Trash2/></button>
        </div>
    )
}