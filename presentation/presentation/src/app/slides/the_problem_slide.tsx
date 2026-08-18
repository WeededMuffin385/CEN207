import styles from './slide.module.css'

export default function TheProblemSlide() {
    return (
        <div className={`${styles.Slide} ${styles.TheProblemSlide}`}>
            <h1>The Problem</h1>

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
            <ul className="solution__features">
                <li>
                    <strong>Continuous product discovery.</strong>
                </li>

                <li>
                    <strong>Multiple shared carts. </strong>
                </li>

                <li>
                    <strong>Google-powered services. </strong>
                </li>

                <li>
                    <strong>Unified checkout. </strong>
                </li>
            </ul>
        </div>
    )
}