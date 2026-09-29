// The chart as the server wrote it on the root; axes carry only the author's fixed ends, so a later point can widen the range.

import { ChartAttributes } from "./chart-names.ts";

export type AxisKind = "Linear" | "Time" | "Category" | "Logarithmic";
type LegendPlacement = "None" | "Top" | "Bottom" | "Start" | "End";

export type ChartAxis = {
    readonly kind: AxisKind;
    readonly min: number | null;
    readonly max: number | null;
    readonly format: string | null;
    readonly grid: boolean;
    readonly ticks: number;
    readonly caption: string | null;
};

export type ChartSeries = {
    readonly key: string;
    readonly caption: string;
    readonly valuePath: string | null;
    readonly sizePath: string | null;
    readonly color: string | null;
    readonly stepped: boolean | null;
    readonly smooth: boolean | null;
    readonly markers: boolean | null;
};

export type ChartModel = {
    readonly kind: string;
    readonly x: ChartAxis;
    readonly y: ChartAxis;
    readonly series: readonly ChartSeries[];
    readonly xPath: string | null;
    readonly seriesPath: string | null;
    readonly valuePath: string | null;
    readonly legend: LegendPlacement;
    readonly tooltip: boolean;
    readonly stepped: boolean;
    readonly smooth: boolean;
    readonly markers: boolean;
    readonly stacked: boolean;
    /** Whether one tooltip names every series at the x under the pointer, rather than one naming the point under it. */
    readonly sharedTooltip: boolean;
    /** Whether the viewer may zoom and pan along the x axis; a pie, a radar and a bare chart never do. */
    readonly zoomable: boolean;
    /** Whether a window narrower than the data stays on the far end as the data grows past it. */
    readonly followLatest: boolean;
    /** Whether the bars lie on their side: the values run across the box and one band per x runs down it. */
    readonly horizontal: boolean;
    /** Whether the chart is drawn with nothing around it: no grid, no axes, the plot the whole box. */
    readonly bare: boolean;
    /** How much of a pie's radius the hole in the middle takes; its words are an element of their own the framework writes. */
    readonly donut: number;
};

/** A series as the server writes it: its caption as the author wrote it, or null where it has none. */
type WrittenSeries = Omit<ChartSeries, "caption"> & { readonly caption: string | null };

/** The model as the server writes it: every caption as the author wrote it, for the page to translate. */
export type WrittenModel = Omit<ChartModel, "series"> & { readonly series: readonly WrittenSeries[] };

/** The model off a chart's root; null when the attribute is missing or does not parse, which leaves the server's frame alone. */
export function readModel(root: Element): WrittenModel | null {
    const text = root.getAttribute(ChartAttributes.model);

    if (text === null || text.length === 0)
        return null;

    try {
        return JSON.parse(text) as WrittenModel;
    }
    catch {
        return null;
    }
}

/** The model in the page's words: each caption the author wrote translated as a plain value is, a series with none named by its key. */
export function translateModel(model: WrittenModel, translate: (text: string) => string): ChartModel {
    const axis = (written: ChartAxis): ChartAxis => (written.caption === null ? written : { ...written, caption: translate(written.caption) });

    return {
        ...model,
        x: axis(model.x),
        y: axis(model.y),
        series: model.series.map(series => ({ ...series, caption: series.caption === null ? series.key : translate(series.caption) }))
    };
}

/** Whether a row is one point of the series it names, rather than an x with a value per series. */
export function isLongForm(model: ChartModel): boolean {
    return model.seriesPath !== null && model.seriesPath.length > 0;
}
