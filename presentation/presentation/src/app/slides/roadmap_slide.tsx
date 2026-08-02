import styles from './slide.module.css'

import Highcharts from "highcharts/highcharts-gantt";
import { HighchartsReact } from "highcharts-react-official";

const options: Highcharts.Options = {
    chart: {
        backgroundColor: "transparent",

        style: {
            fontFamily: "inherit",
        },

        spacing: [20, 20, 20, 20],
    },

    credits: {
        enabled: false,
    },

    navigator: {
        enabled: false,
    },

    scrollbar: {
        enabled: false,
    },

    rangeSelector: {
        enabled: false,
    },

    xAxis: {
        currentDateIndicator: {
            label: {
                format: "%d.%m.%Y",
                style: {
                    fontFamily: "inherit",
                    fontSize: "16px",
                },
            },
        },

        labels: {
            style: {
                fontFamily: "inherit",
                fontSize: "18px",
            },
        },

        grid: {
            enabled: true,
        },
    },

    yAxis: {
        type: "treegrid",
        uniqueNames: true,

        title: {
            text: undefined,
        },

        labels: {
            style: {
                fontFamily: "inherit",
                fontSize: "20px",
            },
        },

        grid: {
            enabled: true,
        },
    },

    tooltip: {
        useHTML: true,

        style: {
            fontFamily: "inherit",
            fontSize: "18px",
        },

        formatter() {
            const options =
                this.options as Highcharts.GanttPointOptionsObject;

            const start =
                typeof options.start === "number"
                    ? Highcharts.dateFormat("%d.%m.%Y", options.start)
                    : "Нет даты";

            const end =
                typeof options.end === "number"
                    ? Highcharts.dateFormat("%d.%m.%Y", options.end)
                    : start;

            return `
                <strong>${options.name ?? "Без названия"}</strong><br>
                ${options.milestone ? start : `${start} – ${end}`}
            `;
        },
    },

    plotOptions: {
        gantt: {
            borderRadius: 8,
            borderWidth: 0,

            dataLabels: {
                enabled: true,
                format: "{point.name}",

                style: {
                    fontFamily: "inherit",
                    fontSize: "16px",
                    fontWeight: "600",
                    textOutline: "none",
                },
            },
        },
    },

    series: [
        {
            type: "gantt",
            name: "Product roadmap",

            data: [
                {
                    id: "research",
                    name: "Research",
                    start: Date.UTC(2026, 0, 1),
                    end: Date.UTC(2026, 1, 15),

                    completed: {
                        amount: 1,
                    },
                },
                {
                    id: "design",
                    name: "UX/UI Design",
                    start: Date.UTC(2026, 1, 1),
                    end: Date.UTC(2026, 2, 15),
                    dependency: "research",

                    completed: {
                        amount: 0.8,
                    },
                },
                {
                    id: "mvp",
                    name: "MVP Development",
                    start: Date.UTC(2026, 2, 1),
                    end: Date.UTC(2026, 5, 30),
                    dependency: "design",

                    completed: {
                        amount: 0.55,
                    },
                },
                {
                    id: "testing",
                    name: "Testing",
                    start: Date.UTC(2026, 5, 1),
                    end: Date.UTC(2026, 7, 15),
                    dependency: "mvp",

                    completed: {
                        amount: 0.2,
                    },
                },
                {
                    id: "beta",
                    name: "Beta release",
                    start: Date.UTC(2026, 7, 15),
                    milestone: true,
                    dependency: "testing",
                },
                {
                    id: "release",
                    name: "Public release",
                    start: Date.UTC(2026, 9, 1),
                    milestone: true,
                    dependency: "beta",
                },
            ],
        },
    ],
};

export default function RoadmapPage() {
    return (
        <div className={`${styles.Slide} ${styles.RoadmapSlide}`}>
            <div className={styles.Chart}>

                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType="ganttChart"
                    options={options}
                    containerProps={{
                        style: {
                            width: "100%",
                            height: "100%",
                        },
                    }}
                />
            </div>
        </div>
    )
}