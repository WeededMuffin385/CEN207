import styles from './navigation.module.css'
import {ShoppingCart, User} from "lucide-react"
import SearchComponent from "./search/search.tsx"
import {useNavigate} from "react-router";

export default function Navigation() {
    const navigate = useNavigate();

    return (
        <div className={styles.Navigation}>
            <div className={styles.NavigationInner}>

                <h1>Nightberries</h1>

                <SearchComponent/>

                <div className={styles.ButtonContainer} onClick={() => navigate("/auth")}>
                    <User className={styles.Icon}/>
                    <p>login</p>
                </div>

                <div className={styles.ButtonContainer}>
                    <ShoppingCart className={styles.Icon}/>
                    <p>cart</p>
                </div>
            </div>
        </div>
    )
}