type PopupProps = {
    close: () => void
}

export function ReactTsPopup({ close }: PopupProps) {
    return (
        <div>
            <h2>React and TypeScript</h2>
            <p>
                A modern frontend foundation designed for speed, consistency and rapid product development.
                React enables responsive user experiences, while TypeScript reduces errors as the platform grows.
            </p>
            <strong>
                Faster iteration. Fewer defects. A better experience at every scale.
            </strong>
        </div>
    )
}

export function RustTokioPopup({ close }: PopupProps) {
    return (
        <div>
            <h2>Rust, Tokio and Axum</h2>
            <p>
                A modern backend foundation designed for speed, reliability and efficient scaling.
                It helps us serve more users with fewer resources while reducing the risk of
                critical software failures.
            </p>
            <strong>
                Technology available today, designed for the demands of tomorrow.
            </strong>
        </div>
    )
}

export function PostgresPopup({ close }: PopupProps) {
    return (
        <div>
            <h2>PostgreSQL and Declarative Schema Management</h2>
            <p>
                PostgreSQL provides a reliable foundation for business-critical data,
                while a declarative schema approach keeps the database aligned with
                the product as it evolves.
            </p>
            <strong>
                Safer changes. Fewer inconsistencies. A data model built to grow.
            </strong>
        </div>
    )
}