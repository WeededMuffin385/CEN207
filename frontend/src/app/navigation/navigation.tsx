import styles from './navigation.module.css'
import {LogIn, ShoppingCart, User} from "lucide-react"
import SearchComponent from "./search/search.tsx"
import {useNavigate} from "react-router";
import {useAuth} from "../../providers/auth/auth_hook.tsx";

export default function Navigation() {
    const {isLoading, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className={styles.Navigation}>
                <header>Loading...</header>
            </div>
        );
    }

    return (
        <div className={styles.Navigation}>
            <div className={styles.NavigationInner}>
                <h1 onClick={() => navigate("/products")}>Nightberries</h1>

                <SearchComponent/>

                {isAuthenticated ? (
                    <div className={styles.ButtonContainer} onClick={() => navigate("/profile")}>
                        <User className={styles.Icon}/>
                        <p>profile</p>
                    </div>
                ) : (
                    <div className={styles.ButtonContainer} onClick={() => navigate("/auth")}>
                        <LogIn className={styles.Icon}/>
                        <p>login</p>
                    </div>
                )}


                <div className={styles.ButtonContainer} onClick={() => navigate("/carts")}>
                    <ShoppingCart className={styles.Icon}/>
                    <p>carts</p>
                </div>
            </div>
        </div>
    )
}