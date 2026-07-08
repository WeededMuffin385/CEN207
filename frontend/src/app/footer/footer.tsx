import styles from './footer.module.css'


export default function Footer() {
    return (
        <footer className={styles.footer}>
                <div className={styles.col}>
                    <h3>About</h3>
                    <a href="#">About Berries</a>
                    <a href="#">Careers</a>
                    <a href="#">Investor Centre</a>
                </div>
                <div className={styles.col}>
                    <h3>Help</h3>
                    <a href="#">Contact Us</a>
                    <a href="#">Returns</a>
                    <a href="#">FAQs</a>
                </div>
                <div className={styles.col}>
                    <h3>Shop</h3>
                    <a href="#">EOFY Sale</a>
                    <a href="#">Clearance</a>
                    <a href="#">New Arrivals</a>
                </div>
                <div className={styles.col}>
                    <h3>Follow Us</h3>
                    <a href="#">Facebook</a>
                    <a href="#">Instagram</a>
                    <a href="#">TikTok</a>
                </div>
                <div className={styles.bottom}>
                    @NightBerries. Made for learning purposes hehe.
                </div>
            </footer>
    )
}