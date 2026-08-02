import styles from './app.module.css'
import TitlePage from "./slides/title_slide.tsx";
import ReferencesPage from "./slides/references_slide.tsx";
import Slide from "./slides/slide.tsx";
import RoadmapPage from "./slides/roadmap_slide.tsx";
import BudgetPage from "./slides/budget_slide.tsx";

export default function App() {
    return (
        <div className={styles.App}>
            <TitlePage />
            <Slide />
            <Slide />
            <ReferencesPage />
            <Slide />
            <RoadmapPage />
            <Slide />
            <BudgetPage />
            <Slide />
        </div>
    )
}
