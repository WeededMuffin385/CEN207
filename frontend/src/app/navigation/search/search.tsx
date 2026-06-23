import styles from './search.module.css';
import {X, Search as SearchIcon} from "lucide-react";
import {useState} from "react";

export default function Search() {
    const [value, setValue] = useState("");

    return (
        <div className={styles.Search}>
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className={styles.Input}
            />

            {value.length !== 0 && (
                <>
                    <X onClick={() => setValue("")} className={styles.Icon}/>
                    <SearchIcon className={`${styles.Icon} ${styles.SearchIcon}`} />
                </>
            )}
        </div>
    )
}