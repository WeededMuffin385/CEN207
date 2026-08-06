import styles from './slide.module.css'

import wildberries from '@/assets/references/wildberries.png'
import aliexpress from '@/assets/references/aliexpress.png'
import alibaba from '@/assets/references/alibaba.png'



const comparisonRows = [
    {
        capability: "Multiple independent carts",
        traditional: "Usually one active cart",
        nightberries: "Multiple separate carts",
    },
    {
        capability: "Collaborative shopping",
        traditional: "Rarely supported",
        nightberries: "Shareable carts",
    },
    {
        capability: "Authentication",
        traditional: "Platform-specific account",
        nightberries: "Google Accounts",
    },
    {
        capability: "Delivery selection",
        traditional: "Manual address entry",
        nightberries: "Google Maps integration",
    },
    {
        capability: "Checkout",
        traditional: "Fragmented flow",
        nightberries: "Unified checkout",
    },
    {
        capability: "Architecture",
        traditional: "Closed or legacy systems",
        nightberries: "Modern modular stack",
    },
];



export default function ComptetitiveLandscapePage() {
    return (
        <div className={`${styles.Slide} ${styles.CompetitiveLandscapeSlide}`}>
            <h1>Competitive Landscape</h1>

            <table>
                <thead>
                <tr>
                    <th>Capability</th>
                    <th>Traditional Marketplace</th>
                    <th>Nightberries</th>
                </tr>
                </thead>

                <tbody>
                {comparisonRows.map((row) => (
                    <tr key={row.capability}>
                        <td>{row.capability}</td>
                        <td>{row.traditional}</td>
                        <td>{row.nightberries}</td>
                    </tr>
                ))}
                </tbody>
            </table>

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