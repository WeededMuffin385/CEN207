import styles from './slide.module.css'

export default function TitlePage() {
    return (
        <div className={`${styles.Slide} ${styles.TitlePage}`}>
            <div className={styles.Hero}>
                <h1>Nightberries</h1>
                <h2>Ideas are easy. Working systems are not.</h2>
                <h3>A functional ecommerce platform built with Rust, React, TypeScript and PostgreSQL.</h3>
                <h3>Working prototype · Modern architecture · Google integrations</h3>
            </div>

            <h3 className={styles.Info}>OneStop Investor Pitch</h3>

            <h3 className={styles.Credits}>
                <span className={styles.Name}>Sah Amran Santa</span>
                <span className={styles.Name}>Rouwen Rivaldo Sung</span>
                <span className={styles.Name}>Kenryo Varian Rikki</span>
                <span className={`${styles.Name} ${styles.TheOnlyRealAuthor}`}>Mikhail Zagoruiko</span>
                <span className={styles.Name}>Lenh Quoc Huy Tran</span>
                <span className={styles.Name}>Ayusha Manandhar</span>
                <span className={styles.Name}>Abdurasulov Khadyatillo</span>
            </h3>
        </div>
    )
}