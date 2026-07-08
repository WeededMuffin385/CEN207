import styles from './catalog.module.css'
import Banner from "../Banner/Banner.tsx";
import Navigation from "../navigation/navigation.tsx"

export default function Catalog() {
    return (
        <div className={styles.Catalog}>
            <Navigation/>
            <Banner/>
            <section className={styles.items}>
                <h2>Awesome Deals</h2>
                <div className={styles.items_grid}>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item1/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>4K QLED Smart TV 65"</div>
                            <div className={styles.price}>$699 <span className={styles.srp}>$999</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item2/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Wireless Noise Cancelling Headphones</div>
                            <div className={styles.price}>$89 <span className={styles.srp}>$149</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item3/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Stainless Steel Air Fryer 8L</div>
                            <div className={styles.price}>$129 <span className={styles.srp}>$199</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item4/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Ergonomic Office Chair</div>
                            <div className={styles.price}>$159 <span className={styles.srp}>$249</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item5/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Portable Bluetooth Speaker</div>
                            <div className={styles.price}>$39 <span className={styles.srp}>$59</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item6/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Cordless Stick Vacuum Cleaner</div>
                            <div className={styles.price}>$179 <span className={styles.srp}>$299</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item7/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Electric Standing Desk</div>
                            <div className={styles.price}>$249 <span className={styles.srp}>$399</span></div>
                        </div>
                    </div>
                    <div className={styles.item_card}>
                        <img src="https://picsum.photos/seed/item8/300/200" alt="item"/>
                        <div className={styles.item_info}>
                            <div className={styles.name}>Smart Home Security Camera</div>
                            <div className={styles.price}>$49 <span className={styles.srp}>$79</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}