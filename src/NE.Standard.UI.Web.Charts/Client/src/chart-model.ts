// The chart as the server wrote it on the root: what to draw, how to read a row, and how a tick is written. Axes carry only the
// author's fixed ends; the range follows the rows this page holds, so a later point can widen it.

export const ModelAttribute = "data-ui-chart";
export const RowsAttribute = "data-ui-chart-rows";
export const SeriesAttribute = "data-ui-chart-series";
export const WindowAttribute = "data-ui-chart-window";
export const PointAttribute = "data-ui-chart-point";

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
    /** Whether the viewer may zoom and pan along the x axis; a chart of sectors and a bare one never do. */
    readonly zoomable: boolean;
    /** Whether a window narrower than the data stays on the far end as the data grows past it. */
    readonly followLatest: boolean;
    /** Whether the bars lie on their side: the values run across the box and one band per x runs down it. */
    readonly horizontal: boolean;
    /** Whether the chart is drawn with nothing around it: no grid, no axes, the plot the whole box. */
    readonly bare: boolean;
    /** How much of a pie's radius the hole in the middle takes. */
    readonly donut: number;
    /** The words in the middle of a donut, already translated. */
    readonly centreCaption: string | null;
};

/** The model off a chart's root; null when the attribute is missing or does not parse, which leaves the server's frame alone. */
export function readModel(root: Element): ChartModel | null {
    const text = root.getAttribute(ModelAttribute);

    if (text === null || text.length === 0)
        return null;

    try {
        return JSON.parse(text) as ChartModel;
    }
    catch {
        return null;
    }
}

/** Whether a row is one point of the series it names, rather than an x with a value per series. */
export function isLongForm(model: ChartModel): boolean {
    return model.seriesPath !== null && model.seriesPath.length > 0;
}
