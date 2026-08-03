import styles from './slide.module.css'
import multi_cart_system from '@/assets/videos/multi_cart_system.mp4'
import infinite_scroll from '@/assets/videos/infinite_scroll.mp4'
import google_maps_integration from '@/assets/videos/google_maps_integration.mp4'
import google_accounts_integration from '@/assets/videos/google_accounts_integration.mp4'
import day_and_night_themes from '@/assets/videos/day_and_night_themes.mp4'
import clean_checkout_process from '@/assets/videos/clean_checkout_process.mp4'

export default function FrontendShowcaseSlide() {
    return (
        <div className={`${styles.Slide} ${styles.FrontendShowcaseSlide}`}>
            <h1>Frontend Showcase</h1>
            <div className={styles.Line}>
                <div className={styles.Element}>
                    <video
                        src={multi_cart_system}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className={styles.Definition}>
                        <h2>
                            Multiple independent carts
                        </h2>
                        <p>
                            Create and share multiple carts for collaborative shopping.
                        </p>
                    </div>
                </div>
                <div className={styles.Element}>
                    <video
                        src={infinite_scroll}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className={styles.Definition}>
                        <h2>
                            Infinite product list
                        </h2>
                        <p>
                            Continuous product discovery without manual page navigation.
                        </p>
                    </div>
                </div>
                <div className={styles.Element}>
                    <video
                        src={day_and_night_themes}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className={styles.Definition}>
                        <h2>
                            Day and night themes
                        </h2>
                        <p>
                            Adaptive interface designed for accessibility and user preference.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.Line}>
                <div className={styles.Element}>
                    <video
                        src={google_accounts_integration}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className={styles.Definition}>
                        <h2>
                            Google Accounts integration
                        </h2>
                        <p>
                            Secure authentication through an existing Google identity.
                        </p>
                    </div>
                </div>
                <div className={styles.Element}>
                    <video
                        src={google_maps_integration}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className={styles.Definition}>
                        <h2>
                            Google Maps integration
                        </h2>
                        <p>
                            Visual address selection and delivery location confirmation.
                        </p>
                    </div>
                </div>
                <div className={styles.Element}>
                    <video
                        src={clean_checkout_process}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className={styles.Definition}>
                        <h2>
                            Clean checkout process
                        </h2>
                        <p>
                            A focused checkout flow covering delivery, payment and order review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}