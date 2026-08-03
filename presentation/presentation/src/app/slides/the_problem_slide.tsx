import styles from './slide.module.css'

export default function TheProblemSlide() {
    return (
        <div className={`${styles.Slide} ${styles.TheProblemSlide}`}>
            <h1>The Problem</h1>
            <p>
                Ecommerce platforms are powerful, but fragmented.
            </p>

            <ul className="problem__list">
                <li>Sellers rely on multiple disconnected tools.</li>
                <li>Customers face complex and inconsistent shopping flows.</li>
                <li>Existing platforms are difficult to customise and extend.</li>
                <li>Integrations often increase technical complexity.</li>
            </ul>

            <p>
                Ecommerce should feel like one system, not a collection of services.
            </p>


            <div className={styles.Space} />

            <h1>Our Solution</h1>
            <p>
                Nightberries combines product discovery, collaborative carts,
                authentication, delivery selection and checkout in a single
                ecommerce platform.
            </p>

            <ul className="solution__features">
                <li>
                    <strong>Product discovery. </strong>
                    <span>
                        Explore an continuously expanding catalogue through a fast,
                        responsive interface.
                    </span>
                </li>

                <li>
                    <strong>Multiple shared carts. </strong>
                    <span>
                        Create, manage and share independent carts for collaborative
                        shopping.
                    </span>
                </li>

                <li>
                    <strong>Google-powered services. </strong>
                    <span>
                        Sign in with Google and select delivery locations through
                        Google Maps.
                     </span>
                </li>

                <li>
                    <strong>Unified checkout. </strong>
                    <span>
                        Complete delivery, payment and order review in one focused flow.
                    </span>
                </li>
            </ul>
        </div>
    )
}