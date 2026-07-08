import styles from '../popup.module.css'
import {Trash2} from "lucide-react";
import {IoMdExit} from "react-icons/io";

type Props = {
    onReturnBack: () => void,
    onRemoveCart: () => void,
}

export default function RemoveCartPopup(props: Props) {
    return (
        <div className={styles.Popup}>
            <div className={styles.PopupInner}>
                <h2>Are you sure you want to delete the cart?</h2>

                <button onClick={() => props.onRemoveCart()}>
                    <Trash2/> Remove cart
                </button>

                <button onClick={() => props.onReturnBack()}>
                    <IoMdExit className={styles.Icon}/> Return back
                </button>
            </div>
        </div>
    )
}