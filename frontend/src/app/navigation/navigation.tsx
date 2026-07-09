import styles from './navigation.module.css'
import {LogIn, Moon, ShoppingCart, Sun, User} from "lucide-react"
import SearchComponent from "./search/search.tsx"
import {useNavigate} from "react-router";
import {useAuth} from "../../providers/auth/auth_hook.tsx";
import {useEffect, useState} from "react";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
}

export default function Navigation() {
    const {isLoading, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

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

                <button
                    type="button"
                    className={styles.ButtonContainer}
                    onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                >
                    {theme === "dark" ? <Sun className={styles.Icon}/> : <Moon className={styles.Icon}/>}
                    <p>{theme}</p>
                </button>

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
