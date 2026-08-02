import styles from './slide.module.css'

import Highcharts from "highcharts/highcharts-gantt";
import { HighchartsReact } from "highcharts-react-official";

type PlotLineOptionsWithValue = Highcharts.PlotLineOptions & {
    value: number;
};

const data: Highcharts.GanttPointOptionsObject[] = [
    {
        id: "research-research",
        name: "Research",
        y: 0,
        start: Date.parse("2026-06-01"),
        end: Date.parse("2026-06-21"),
        color: "#6C63FF",
    },
    {
        id: "research-mvp",
        name: "MVP Development",
        y: 0,
        start: Date.parse("2026-06-22"),
        end: Date.parse("2026-07-19"),
        dependency: "research-research",
        color: "#00B8A9",
    },
    {
        id: "research-learn",
        name: "Learn",
        y: 0,
        start: Date.parse("2026-07-20"),
        end: Date.parse("2026-08-16"),
        dependency: "research-mvp",
        color: "#FFB020",
    },

    // Iteration 1
    {
        id: "iteration-1-build",
        name: "Build",
        y: 1,
        start: Date.parse("2026-08-17"),
        end: Date.parse("2026-09-03"),
        dependency: "research-learn",
        color: "#6C63FF",
    },
    {
        id: "iteration-1-test",
        name: "Test",
        y: 1,
        start: Date.parse("2026-09-04"),
        end: Date.parse("2026-09-13"),
        dependency: "iteration-1-build",
        color: "#00B8A9",
    },
    {
        id: "iteration-1-learn",
        name: "Learn",
        y: 1,
        start: Date.parse("2026-09-14"),
        end: Date.parse("2026-09-23"),
        dependency: "iteration-1-test",
        color: "#FFB020",
    },

    // Iteration 2
    {
        id: "iteration-2-build",
        name: "Build",
        y: 2,
        start: Date.parse("2026-09-24"),
        end: Date.parse("2026-10-10"),
        dependency: "iteration-1-learn",
        color: "#6C63FF",
    },
    {
        id: "iteration-2-test",
        name: "Test",
        y: 2,
        start: Date.parse("2026-10-11"),
        end: Date.parse("2026-10-20"),
        dependency: "iteration-2-build",
        color: "#00B8A9",
    },
    {
        id: "iteration-2-learn",
        name: "Learn",
        y: 2,
        start: Date.parse("2026-10-21"),
        end: Date.parse("2026-10-30"),
        dependency: "iteration-2-test",
        color: "#FFB020",
    },

    // Iteration 3
    {
        id: "iteration-3-build",
        name: "Build",
        y: 3,
        start: Date.parse("2026-10-31"),
        end: Date.parse("2026-11-09"),
        dependency: "iteration-2-learn",
        color: "#6C63FF",
    },
    {
        id: "iteration-3-test",
        name: "Test",
        y: 3,
        start: Date.parse("2026-11-10"),
        end: Date.parse("2026-11-19"),
        dependency: "iteration-3-build",
        color: "#00B8A9",
    },
    {
        id: "iteration-3-learn",
        name: "Learn",
        y: 3,
        start: Date.parse("2026-11-20"),
        end: Date.parse("2026-11-29"),
        dependency: "iteration-3-test",
        color: "#FFB020",
    },

    // Post-launch
    {
        id: "post-launch-monitor",
        name: "Monitor",
        y: 4,
        start: Date.parse("2026-11-30"),
        end: Date.parse("2026-12-13"),
        dependency: "iteration-3-learn",
        color: "#6C63FF",
    },
    {
        id: "post-launch-support",
        name: "Support",
        y: 4,
        start: Date.parse("2026-12-14"),
        end: Date.parse("2026-12-27"),
        dependency: "post-launch-monitor",
        color: "#00B8A9",
    },
    {
        id: "post-launch-improve",
        name: "Improve",
        y: 4,
        start: Date.parse("2026-12-28"),
        end: Date.parse("2027-01-17"),
        dependency: "post-launch-support",
        color: "#FFB020",
    },
];

const options: Highcharts.Options = {
    chart: {
        backgroundColor: "transparent",

        style: {
            fontFamily: "inherit",
        },

        spacing: [32, 32, 32, 32],

        events: {
            render() {
                const label = this.container.getElementsByClassName(
                    styles.CurrentDateLabel,
                )[0];

                const foreignObject = label?.closest("foreignObject");
                const parent = foreignObject?.parentNode;

                if (foreignObject && parent) {
                    parent.appendChild(foreignObject);
                }
            },
        },
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

    xAxis: [
        {
            currentDateIndicator: {
                width: 2,
                color: "#00ffff4f",
                zIndex: 128,

                label: {
                    useHTML: true,

                    formatter(this: Highcharts.PlotLineOrBand): string {
                        const options =
                            this.options as PlotLineOptionsWithValue;

                        return `
                        <span class="${styles.CurrentDateLabel}">
                            ${Highcharts.dateFormat(
                            "%d.%m.%Y",
                            options.value,
                        )}
                        </span>
                    `;
                    },
                },
            },

            labels: {
                style: {
                    fontFamily: "inherit",
                    fontSize: "var(--font-size-4)",
                },
            },

            grid: {
                enabled: true,
            },
        },

        {
            linkedTo: 0,
            opposite: true,

            labels: {
                style: {
                    fontFamily: "inherit",
                    fontSize: "var(--font-size-4)",
                    fontWeight: "700",
                },
            },

            grid: {
                enabled: true,
            },
        },
    ],

    yAxis: {
        type: "category",

        categories: [
            "Research",
            "Iteration 1 (Closed testing)",
            "Iteration 2 (Open testing)",
            "Public release",
            "Long term support",
        ],

        reversed: true,
        staticScale: 96,

        title: {
            text: undefined,
        },

        labels: {
            style: {
                fontFamily: "inherit",
                fontSize: "var(--font-size-3)",
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
            fontSize: "var(--font-size-3)",
        },

        formatter() {
            const options =
                this.options as Highcharts.GanttPointOptionsObject;

            const start =
                typeof options.start === "number"
                    ? Highcharts.dateFormat("%d.%m.%Y", options.start)
                    : "No date";

            const end =
                typeof options.end === "number"
                    ? Highcharts.dateFormat("%d.%m.%Y", options.end)
                    : start;

            return `
                <strong>${options.name ?? "No name"}</strong><br>
                ${options.milestone ? start : `${start} – ${end}`}
            `;
        },
    },

    plotOptions: {
        gantt: {
            pointWidth: 64,
            borderRadius: 8,
            borderWidth: 0,

            dataLabels: {
                enabled: true,
                format: "{point.name}",



                style: {
                    fontFamily: "inherit",
                    fontSize: "var(--font-size-1)",
                    fontWeight: "700",
                    textOutline: "none",
                },
            },
        },
    },

    series: [
        {
            type: "gantt",
            name: "Product roadmap",

            data,
        },
    ],
};

export default function RoadmapPage() {
    return (
        <div className={`${styles.Slide} ${styles.RoadmapSlide}`}>
            <h1>Production Timeline</h1>
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