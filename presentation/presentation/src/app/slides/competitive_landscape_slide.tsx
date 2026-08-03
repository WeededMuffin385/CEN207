import styles from './slide.module.css'

import wildberries from '@/assets/references/wildberries.png'
import aliexpress from '@/assets/references/aliexpress.png'
import alibaba from '@/assets/references/alibaba.png'



const comparisonRows = [
    {
        capability: "Multiple independent carts",
        traditional: "Usually one active cart",
        oneStop: "Multiple separate carts",
    },
    {
        capability: "Collaborative shopping",
        traditional: "Rarely supported",
        oneStop: "Shareable carts",
    },
    {
        capability: "Authentication",
        traditional: "Platform-specific account",
        oneStop: "Google Accounts",
    },
    {
        capability: "Delivery selection",
        traditional: "Manual address entry",
        oneStop: "Google Maps integration",
    },
    {
        capability: "Checkout",
        traditional: "Fragmented flow",
        oneStop: "Unified checkout",
    },
    {
        capability: "Architecture",
        traditional: "Closed or legacy systems",
        oneStop: "Modern modular stack",
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
                    <th>OneStop</th>
                </tr>
                </thead>

                <tbody>
                {comparisonRows.map((row) => (
                    <tr key={row.capability}>
                        <td>{row.capability}</td>
                        <td>{row.traditional}</td>
                        <td>{row.oneStop}</td>
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