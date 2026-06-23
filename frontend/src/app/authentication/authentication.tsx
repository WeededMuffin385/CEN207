import styles from './authentication.module.css'

export default function Authentication() {
    return (
        <div className={styles.Authentication}>
            <div className={styles.AuthenticationInner}>
                <h2>Sign in or create your account</h2>

                <button>Sign in with Google</button>
            </div>
        </div>
    )
}