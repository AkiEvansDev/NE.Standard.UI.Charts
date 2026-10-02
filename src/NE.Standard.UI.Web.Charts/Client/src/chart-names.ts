// Every name the charts' client spells: what the renderers write, what the client writes for itself, and the framework's names
// `names` does not carry. ChartsNamesSyncTests holds each table to its C# spelling; a name is read from here, never written again.

/** The attributes the renderers write and the engine reads. */
export const ChartAttributes = {
    model: "data-ui-chart",
    rows: "data-ui-chart-rows",
    series: "data-ui-chart-series",
    window: "data-ui-chart-window",
    point: "data-ui-chart-point",
    /** On a sector: what its tooltip says, shown against the sector's own middle rather than the ring it is cut from. */
    sectorTooltip: "data-ui-chart-tooltip",
    gaugeFormat: "data-ui-gauge-format"
} as const;

/** The classes the renderers write, which the client draws again and reads. */
export const ChartClasses = {
    root: "ui-chart",
    area: "ui-chart__area",
    canvas: "ui-chart__canvas",
    window: "ui-chart__window",
    grid: "ui-chart__grid",
    gridLine: "ui-chart__grid-line",
    axes: "ui-chart__axes",
    axisLine: "ui-chart__axis-line",
    label: "ui-chart__label",
    caption: "ui-chart__caption",
    empty: "ui-chart__empty",
    plot: "ui-chart__plot",
    series: "ui-chart__series",
    line: "ui-chart__line",
    lineHit: "ui-chart__line-hit",
    bands: "ui-chart__bands",
    fill: "ui-chart__fill",
    point: "ui-chart__point",
    marker: "ui-chart__marker",
    bareMarker: "ui-chart__marker--bare",
    hit: "ui-chart__hit",
    bar: "ui-chart__bar",
    sector: "ui-chart__sector",
    sectorEdge: "ui-chart__sector-edge",
    sectorAnchor: "ui-chart__sector-anchor",
    centre: "ui-chart__centre",
    legend: "ui-chart__legend",
    legendEntry: "ui-chart__legend-entry",
    legendMark: "ui-chart__legend-mark",
    legendCaption: "ui-chart__legend-caption",
    gauge: "ui-gauge",
    gaugeNumber: "ui-gauge__number",
    gaugeUnit: "ui-gauge__unit"
} as const;

/**
 * The ids the browser gives the clips it draws, the page's id run finishing them: the server's first frame names its clip by the
 * core's part id (`ui-{id}-chart-clip`), so the two never meet.
 */
export const DrawnClipPrefix = "ui-chart-clip-drawn";

/** The custom properties the renderers write and the client writes again. */
export const ChartVariables = {
    seriesColor: "--ui-chart-series-color",
    arcStart: "--ui-arc-start",
    arcSweep: "--ui-arc-sweep",
    /** The reading as a number, on the gauge's root: what the stylesheet's arc is drawn from, and what a language switch writes again. */
    gaugeValue: "--ui-gauge-value"
} as const;

/** What the client alone writes, for the engine and the stylesheet. */
export const ClientNames = {
    rule: "ui-chart__rule",
    ruleOn: "ui-chart__rule--on",
    dragging: "ui-chart--dragging",
    backSeries: "ui-chart__series--back",
    frontBar: "ui-chart__bar--front",
    /** On a point, a bar or a sector whose press waits out the double press's window, until its command runs or is called off. */
    pendingPoint: "ui-chart__point--pending",
    legendOff: "ui-chart__legend-entry--off",
    /** On a chart whose start or end legend stands under the plot, the chart too narrow for the two side by side. */
    legendUnder: "ui-chart--legend-under"
} as const;

/** The kinds a chart is drawn as, by the model's `kind`. */
export const ChartKinds = {
    line: "line",
    area: "area",
    bar: "bar",
    pie: "pie",
    scatter: "scatter",
    radar: "radar"
} as const;

/** The events a chart raises, by the names `ChartEvents` hangs a command on. */
export const ChartEvents = {
    pointClick: "point-click",
    windowChange: "window-change"
} as const;

/** The sink, the value and the DOM operations the package registers, by the renderers' kinds. */
export const ChartOperations = {
    sink: "chart",
    window: "chart-window",
    gaugeValue: "chart-gauge-value"
} as const;

/** The words the client writes itself, by their `ChartsStrings` keys. */
export const ChartWords = {
    empty: "ui.chart.empty",
    label: "ui.chart.label",
    noReading: "ui.chart.no-reading",
    point: "ui.chart.point",
    sector: "ui.chart.sector",
    reading: "ui.chart.reading",
    list: "ui.chart.list"
} as const;

/** The framework's names the client writes that `names` does not carry, held by the test to the framework's own spelling. */
export const CoreNames = {
    ghostButtonClass: "ui-button--ghost",
    smallButtonClass: "ui-button--small",
    seriesColorCount: "--ui-color-series-count",
    seriesColorPrefix: "--ui-color-series-"
} as const;
