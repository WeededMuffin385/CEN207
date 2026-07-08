import styles from './delivery_option_sidebar.module.css'
import {useState} from "react";
import {CircleX} from "lucide-react";
import type {SelectedAddress} from "../../../../../../utils/location.tsx";

type DeliveryOption = "pickup_point" | "courier_delivery";

type Props = {
    onClose: () => void,
    selectedAddress: SelectedAddress | null,
    setSelectedAddress: (selectedAddress: SelectedAddress) => void,
}

export default function DeliveryOptionSidebar(props: Props) {
    const [selectedOption, setSelectedOption] = useState<DeliveryOption>("pickup_point");

    return (
        <div className={styles.DeliveryOptionSidebar}>
            <button
                className={styles.Close}
                onClick={() => props.onClose()}
            >
                <CircleX/>
                close
            </button>

            <h2>Select a delivery option</h2>

            <div className={styles.Option}>
                <button
                    className={selectedOption === "pickup_point" ? styles.Active : ""}
                    onClick={() => setSelectedOption("pickup_point")}
                >
                    Pickup point
                </button>

                <button
                    className={selectedOption === "courier_delivery" ? styles.Active : ""}
                    onClick={() => setSelectedOption("courier_delivery")}
                >
                    Courier delivery
                </button>
            </div>

            {selectedOption === "pickup_point" && <>

            </>}

            {selectedOption === "courier_delivery" && <>
                <h3>
                    latitude: {props.selectedAddress?.lat}
                </h3>

                <h3>
                    longitude: {props.selectedAddress?.lng}
                </h3>

                <h3>
                    address: {props.selectedAddress?.address}
                </h3>

                <button
                    className={styles.Deliver}
                    onClick={() => {
                        if (props.selectedAddress === null) {
                            throw Error("Address is not selected")
                        }

                        props.setSelectedAddress(props.selectedAddress)
                        props.onClose()
                    }}
                >Deliver here
                </button>
            </>}
        </div>
    )
}