import styles from './create_cart_popup.module.css'
import {IoMdExit} from "react-icons/io";
import {LayersPlus} from "lucide-react";
import {useState} from "react";

type Props = {
    onReturnBack: () => void,
    onCreateCart: (cartName: string) => void,
}

export default function CreateCartPopup(props: Props) {
    const [cartName, setCartName] = useState("");

    return (
        <div className={styles.CreateCartPopup}>
            <div className={styles.CreateCartPopupInner}>
                <h2>Create a new cart</h2>

                <input className={styles.Input} placeholder="your cart name" value={cartName} onChange={(event) => setCartName(event.target.value)}/>

                <button onClick={() => props.onCreateCart(cartName)}>
                    <LayersPlus /> Create cart
                </button>

                <button onClick={() => props.onReturnBack()}>
                    <IoMdExit className={styles.Icon}/> Return back
                </button>
            </div>
        </div>
    )
}