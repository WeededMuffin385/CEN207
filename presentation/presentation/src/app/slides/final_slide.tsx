import styles from './slide.module.css'

export default function FinalSlide() {
    return (
        <div className={`${styles.Slide} ${styles.FinalSlide}`}>
            <h2>
                The future of ecommerce is not just imagined.
                <br />
                It is already being built.
            </h2>
            <h1>
                Invest in what <span className={styles.Shimmer}>really</span> works.
            </h1>
            <h2>Join Nightberries. Be part of what comes next.</h2>
        </div>
    )
}