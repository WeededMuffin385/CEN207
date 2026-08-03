import styles from './app.module.css'
import TitlePage from "./slides/title_slide.tsx";
import ComptetitiveLandscapePage from "./slides/competitive_landscape_slide.tsx";
import Slide from "./slides/slide.tsx";
import RoadmapPage from "./slides/roadmap_slide.tsx";
import BudgetPage from "./slides/budget_slide.tsx";
import FrontendShowcaseSlide from "./slides/frontend_showcase_slide.tsx";
import ArchitectureShowcaseSlide from "./slides/architecture_showcase_slide.tsx";
import TheProblemSlide from "./slides/the_problem_slide.tsx";

export default function App() {
    return (
        <div className={styles.App}>
            <TitlePage />
            <TheProblemSlide />
            <ComptetitiveLandscapePage />
            <ArchitectureShowcaseSlide />
            <FrontendShowcaseSlide />
            <RoadmapPage />
            <BudgetPage />



            <Slide />
        </div>
    )
}
