import styles from './slide.module.css'

import wildberries from '@/assets/references/wildberries.png'
import aliexpress from '@/assets/references/aliexpress.png'
import alibaba from '@/assets/references/alibaba.png'

export default function ReferencesPage() {
    return (
        <div className={`${styles.Slide} ${styles.ReferencesSlide}`}>
            <h1>References</h1>

            <div className={styles.References}>
                <div className={styles.Reference}>
                    <img src={wildberries}/>
                    <div className={styles.Title}>
                        <h2>Wildberries</h2>
                    </div>
                </div>

                <div className={styles.Reference}>
                    <img src={aliexpress}/>
                    <div className={styles.Title}>
                        <h2>Aliexpress</h2>
                    </div>
                </div>

                <div className={styles.Reference}>
                    <img src={alibaba}/>
                    <div className={styles.Title}>
                        <h2>Alibaba</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}