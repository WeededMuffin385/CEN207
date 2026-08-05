import styles from './slide.module.css'


import Highcharts from "highcharts";
import "highcharts/highcharts-3d";
import {HighchartsReact} from "highcharts-react-official";
import {useEffect, useRef} from "react";



type BudgetItem = readonly [name: string, value: number];

const budgetData: BudgetItem[] = [
    ["Programming", 135_000],
    ["Infrastructure", 85_000],
    ["Marketing", 55_000],
    ["Other", 35_000],
];

const total = budgetData.reduce(
    (sum, [, value]) => sum + value,
    0,
);


const options: Highcharts.Options = {
    credits: {
        enabled: false
    },

    tooltip: {
        headerFormat: '<span style="font-size: var(--font-size-5); font-weight: 700">{point.key}</span><br/><br/>',
        pointFormat: '<span style="font-size: var(--font-size-5)">${point.y:,.0f}</span>',
    },

    chart: {
        type: "pie",
        backgroundColor: "transparent",

        style: {
            fontFamily: "inherit",
            fontSize: "24px",
        },

        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
        },
    },

    title: {
        text: "Budget for 1.0 release",
        style: {
            fontFamily: "inherit",
            fontSize: "var(--font-size-6)",
            fontWeight: "700",
            color: "yellow",
        }
    },

    subtitle: {
        text: `Total: $${Highcharts.numberFormat(total, 0)}`,
        style: {
            fontFamily: "inherit",
            fontSize: "var(--font-size-5)",
            fontWeight: "700",
            color: "yellow",
        },
    },

    plotOptions: {
        pie: {
            depth: 35,
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
                enabled: true,
                format: "{point.name}: ${point.y:,.0f}",

                style: {
                    fontFamily: "inherit",
                    fontSize: "var(--font-size-5)",
                    fontWeight: "700",
                    textOutline: "none",
                    color: "yellow",
                },
            },
        },
    },

    series: [
        {
            type: "pie",
            data: budgetData,
        },
    ],
};


export default function BudgetPage() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;

        if (!wrapper) {
            throw new Error("Chart wrapper was not mounted");
        }

        const resizeChart = () => {
            const chart = chartRef.current?.chart;

            if (!chart) {
                return;
            }

            chart.setSize(
                wrapper.clientWidth,
                wrapper.clientHeight,
                false,
            );
        };

        const observer = new ResizeObserver(resizeChart);

        observer.observe(wrapper);
        resizeChart();

        return () => {
            observer.disconnect();
        };
    }, []);


    return (
        <div className={`${styles.Slide} ${styles.BudgetSlide}`}>
            <h1>Budget</h1>

            <div ref={wrapperRef} className={styles.Chart}>

                <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
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