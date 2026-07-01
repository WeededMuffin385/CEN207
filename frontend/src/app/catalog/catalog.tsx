import styles from './catalog.module.css'

import Navigation from "../navigation/navigation.tsx"

export default function Catalog() {
    return (
        <div className={styles.Catalog}>
            <Navigation />
            <h1>Hello World!</h1>
        </div>
    )
}