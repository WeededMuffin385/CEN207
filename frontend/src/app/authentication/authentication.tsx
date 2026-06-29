import styles from './authentication.module.css'
import {FcGoogle} from "react-icons/fc";
import {IoMdExit} from "react-icons/io";
import {useNavigate} from "react-router";

export default function Authentication() {
    const navigate = useNavigate();

    return (
        <div className={styles.Authentication}>
            <div className={styles.AuthenticationInner}>
                <h2>Sign in or create your account</h2>

                <button><FcGoogle className={styles.Icon}/>Sign in with Google</button>

                <button onClick={() => navigate("/")}><IoMdExit className={styles.Icon}/> Return back</button>
            </div>
        </div>
    )
}