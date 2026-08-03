import styles from './slide.module.css'

import Architecture from '@/assets/architecture.drawio.svg?react'
import {useState} from "react";


export default function BackendShowcaseSlide() {
    const [activeElement, setActiveElement] = useState<string | null>(null)



    return (
        <div className={`${styles.Slide} ${styles.ArchitectureShowcaseSlide}`}>
            <h1>Engineering Behind the Experience</h1>

            <div
                className={styles.Architecture}
                onMouseLeave={() => setActiveElement(null)}
            >
                <Architecture
                    className={styles.ArchitectureSvg}
                    onMouseOver={(event) => {
                        const element = (event.target as SVGElement).closest<SVGElement>(
                            '[data-menu]',
                        )

                        setActiveElement(element?.dataset.menu ?? null)
                    }}
                />

                {activeElement === 'api' && (
                    <div className={styles.Menu}>
                        <strong>API Gateway</strong>
                        <button type="button">Documentation</button>
                        <button type="button">Metrics</button>
                    </div>
                )}
            </div>
        </div>
    )
}