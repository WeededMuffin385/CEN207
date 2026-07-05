import styles from './cart_list_item.module.css'
import {Trash2} from "lucide-react";
import {useNavigate} from "react-router";
import {useCarts} from "../../../../providers/carts/carts_hook.tsx";

type Props = {
    cartId: string,
    cartName: string,

    isActive: boolean,

    onRemove: () => void
}

export default function CartListItem(props: Props) {
    const navigate = useNavigate()
    const {selectCart} = useCarts()

    return (
        <div className={`${styles.CartListItem} ${props.isActive ? styles.Active : ""}`}>
            <h3 onClick={() => {
                selectCart(props.cartId)

                navigate(`/carts/${props.cartId}`)
            }}>{props.cartName}</h3>

            <button onClick={() => props.onRemove()}><Trash2/></button>
        </div>
    )
}