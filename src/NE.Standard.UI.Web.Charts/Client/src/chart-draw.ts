// Drawing a chart at the size it really got: text doesn't scale with a viewBox, so once the browser knows the box, the canvas
// is rebuilt here — grid, axes, and each series' path and marks.

import { bandWidth, barOf, barSlots } from "./chart-bars.ts";
import { PlainRadius, bubbleRadius, pointReach } from "./chart-bubbles.ts";
import { PointAttribute, SeriesAttribute } from "./chart-model.ts";
import type { ChartAxis, ChartModel } from "./chart-model.ts";
import { momentDate } from "./chart-moment.ts";
import { areaPath, coord, linePath } from "./chart-path.ts";
import { sectorsOf, spotAt } from "./chart-pie.ts";
import type { Sector, Spot } from "./chart-pie.ts";
import type { ChartPoint } from "./chart-path.ts";
import { buildData } from "./chart-rows.ts";
import type { ChartData, ChartRow, ChartSeriesData } from "./chart-rows.ts";
import { baselineOf, stackSeries } from "./chart-stack.ts";
import { clampWindow, windowExtent } from "./chart-window.ts";
import type { Span } from "./chart-window.ts";
import { defaultFormat, plotBottom, plotDown, plotRight, plotX, plotY, resolveRange, step, ticks } from "./chart-ticks.ts";
import type { Plot, Scale } from "./chart-ticks.ts";
import type { ClientStrings, NumberCulturePack, NumberFormatting, TemporalCulturePack, TemporalFormatting } from "ne-standard-ui";

const SvgNamespace = "http://www.w3.org/2000/svg";
const AreaKind = "area";
const BarKind = "bar";
const PieKind = "pie";
const ScatterKind = "scatter";
const TooltipAttribute = "data-ui-tooltip";
const PointClass = "ui-chart__point";
const MarkerClass = "ui-chart__marker";
const BareMarkerClass = "ui-chart__marker--bare";
const HitClass = "ui-chart__hit";
const RuleClass = "ui-chart__rule";
const EmptyKey = "ui.chart.empty";

/** The air around the plot: a line of labels under it, a line more for a caption, and a hair of room at the far edges. */
const PlotInset = 12;
const TickHeight = 22;
const CaptionHeight = 16;
const LabelGap = 8;
/** A label's own line, which is what tells whether the one beside the plot has room for the next. */
const LabelHeight = 16;
/** How many colours the theme's categorical run holds, where the page does not say. */
const DefaultSeriesColors = 8;

export type ChartFormatting = {
    readonly numbers: NumberFormatting;
    readonly temporal: TemporalFormatting;
    readonly strings: ClientStrings;
};

/** What one chart holds between draws: what the server said, the rows as they now stand, and the series the viewer put away. */
export type ChartState = {
    readonly root: HTMLElement;
    readonly model: ChartModel;
    readonly rows: ChartRow[];
    readonly hidden: Set<string>;
    /** The stretch of the x axis the viewer moved to, or null for the whole of what the data reaches. */
    view: Span | null;
};

/** What a draw settled on, so a wheel and a drag can be read against the picture they land on. */
export type ChartFrame = {
    readonly plot: Plot;
    readonly x: Scale;
    /** The whole of what the data reaches, which is what a window is clamped inside. */
    readonly whole: Span;
    /** Every x the drawn series hold, with what one tooltip says there; empty where the chart names its points one at a time. */
    readonly columns: readonly ChartColumn[];
};

/** One x as a shared tooltip reads it: where it stands across the plot, and what every series drawn says there. */
export type ChartColumn = {
    readonly at: number;
    readonly text: string;
};

/** One mark of an axis: where it stands, the words under it, and how wide they are in this chart's own type. */
type ChartTickLabel = {
    readonly value: number;
    readonly text: string;
    readonly width: number;
};

/** How a value is written on each axis, settled once per draw so a tick and a tooltip read the same. */
type ChartFormats = {
    readonly x: string | null;
    readonly y: string | null;
};

/** Draws the chart over its own canvas; a chart the page has not laid out yet keeps the frame the server drew. */
export function drawChart(state: ChartState, formatting: ChartFormatting): ChartFrame | null {
    const canvas = state.root.querySelector<SVGSVGElement>(".ui-chart__canvas");

    if (canvas === null)
        return null;

    const box = canvas.getBoundingClientRect();
    const width = Math.round(box.width);
    const height = Math.round(box.height);

    if (width < 2 || height < 2)
        return null;

    const model = state.model;
    const data = buildData(state.rows, model, formatting.temporal.parse);
    const visible = data.series.filter(series => !state.hidden.has(series.series.key));

    // The stack is of the series actually drawn: one the legend put aside leaves it rather than holding a gap in it.
    if (model.stacked)
        stackSeries(visible);

    // The window is the x axis this draw uses; a draw never moves it itself — following the latest happens when a point
    // arrives, not when drawing.
    const whole = resolveRange(model.x, data.xMin, data.xMax, data.categories.length);
    const window = state.view === null ? null : clampWindow(state.view, whole.min, whole.max);
    const extent = windowExtent(visible.map(series => series.drawn), window);
    const x = window === null ? whole : { ...whole, min: window.from, max: window.to };
    const y = resolveRange(model.y, extent.min, extent.max, 0, model.kind === AreaKind || model.kind === BarKind);
    const numbers = formatting.numbers.readCulture(state.root);
    const dates = formatting.temporal.readCulture(state.root);
    const formats: ChartFormats = {
        x: model.x.format ?? defaultFormat(model.x.kind, step(model.x.kind, x.min, x.max, model.x.ticks)),
        y: model.y.format ?? defaultFormat(model.y.kind, step(model.y.kind, y.min, y.max, model.y.ticks))
    };

    canvas.setAttribute("viewBox", `0 0 ${coord(width)} ${coord(height)}`);

    // A turn shared out has no axes to lay out, and no labels to measure: the sectors are the whole drawing.
    if (model.kind === PieKind) {
        clear(canvas);
        drawPie(canvas, state, data, width, height, formats, numbers, dates, formatting);

        return null;
    }

    // A chart with nothing around it has no ticks to write and no gutters to leave: the plot is the box, less a hair of air.
    if (model.bare) {
        const bare = { left: 2, top: 2, width: width - 4, height: height - 4 };

        clear(canvas);
        drawSeries(canvas, state, data.series, bare, x, y, data.categories, formats, numbers, dates, formatting);

        return { plot: bare, x, whole: { from: whole.min, to: whole.max }, columns: [] };
    }

    // Measured before the canvas is cleared: a detached text has no length, and the plot's left edge is the widest label's own width.
    const measure = measurer(canvas);
    const hasRows = state.rows.length > 0;
    const xLabels = labelsOf(model.x, formats.x, x, data.categories, numbers, dates, formatting, measure.width, hasRows);
    const yLabels = labelsOf(model.y, formats.y, y, data.categories, numbers, dates, formatting, measure.width, hasRows);
    // The labels beside the plot are what its left edge has to make room for: the values, or the bands where the chart lies on
    // its side.
    const beside = model.horizontal ? xLabels : yLabels;
    const widest = beside.reduce((longest, label) => Math.max(longest, label.width), 0);

    measure.release();

    const plot = resolvePlot(model, width, height, widest);

    clear(canvas);

    drawGrid(canvas, model, plot, x, y, xLabels, yLabels);
    drawAxes(canvas, model, plot, x, y, xLabels, yLabels, width, height);
    drawSeries(canvas, state, data.series, plot, x, y, data.categories, formats, numbers, dates, formatting, { min: data.sizeMin, max: data.sizeMax });

    if (state.rows.length === 0)
        drawEmpty(canvas, plot, formatting);

    const columns = model.sharedTooltip
        ? buildColumns(model, visible, plot, x, data.categories, formats, numbers, dates, formatting)
        : [];

    if (columns.length > 0)
        drawRule(canvas, plot);

    return { plot, x, whole: { from: whole.min, to: whole.max }, columns };
}

/**
 * Every x the drawn series hold, with what one shared tooltip says there. Composed once per draw, so the pointer only has to
 * find the nearest.
 */
function buildColumns(
    model: ChartModel,
    series: readonly ChartSeriesData[],
    plot: Plot,
    x: Scale,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting
): ChartColumn[] {
    const places: number[] = [];
    const seen = new Set<number>();

    for (const entry of series) {
        for (const point of entry.points) {
            if (point.y !== null && !seen.has(point.x)) {
                seen.add(point.x);
                places.push(point.x);
            }
        }
    }

    places.sort((left, right) => left - right);

    return places.map(place => {
        const lines = [formatValue(model.x, formats.x, place, categories, numbers, dates, formatting)];

        for (const entry of series) {
            const point = entry.points.find(candidate => candidate.x === place && candidate.y !== null);

            if (point !== undefined)
                lines.push(`${entry.series.caption}: ${formatValue(model.y, formats.y, point.y as number, categories, numbers, dates, formatting)}`);
        }

        return { at: plotX(plot, x, place), text: lines.join("\n") };
    });
}

/** The line a shared tooltip is read against: one x, marked while the pointer names it. The engine is what moves and shows it. */
function drawRule(canvas: SVGSVGElement, plot: Plot): void {
    const rule = append(canvas, "rect", RuleClass);

    rule.setAttribute("x", "0");
    rule.setAttribute("y", coord(plot.top));
    rule.setAttribute("width", "1");
    rule.setAttribute("height", coord(plot.height));
}

function clear(canvas: SVGSVGElement): void {
    while (canvas.firstChild !== null)
        canvas.removeChild(canvas.firstChild);
}

/**
 * The turn shared out: one sector per point of the first series, the biggest circle the box holds, with a donut's words in its
 * hole. A sector the legend hid takes no angle, so the rest spread over the whole turn; colours stay where they were.
 */
function drawPie(
    canvas: SVGSVGElement,
    state: ChartState,
    data: ChartData,
    width: number,
    height: number,
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting
): void {
    const model = state.model;
    const points = data.series.length > 0 ? data.series[0].points : [];
    const shown: { point: ChartPoint; index: number }[] = [];

    for (let i = 0; i < points.length; i++) {
        if (!state.hidden.has(points[i].key))
            shown.push({ point: points[i], index: i });
    }

    const sectors = sectorsOf(shown.map(entry => entry.point.y));
    const centre = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) / 2 - PlotInset;
    const inner = radius * model.donut;
    const group = append(canvas, "g", "ui-chart__plot");
    const colors = readSeriesColorCount(state.root);

    for (let i = 0; i < shown.length; i++) {
        if (sectors[i].sweep <= 0 || radius <= 0)
            continue;

        const point = shown[i].point;
        const shape = append(group, "g", "ui-chart__series");

        shape.setAttribute(SeriesAttribute, point.key);
        shape.style.setProperty("--ui-chart-series-color", seriesColorVar(shown[i].index, colors));

        // A ring from the hole to the rim, which the stylesheet cuts to the sector's own angles (the contract's mixins/arc.less).
        const sector = append(shape, "circle", "ui-chart__sector");

        sector.setAttribute("cx", coord(centre.x));
        sector.setAttribute("cy", coord(centre.y));
        sector.setAttribute("r", coord((radius + inner) / 2));
        sector.setAttribute("stroke-width", coord(radius - inner));
        sector.style.setProperty("--ui-arc-start", degrees(sectors[i].start));
        sector.style.setProperty("--ui-arc-sweep", degrees(sectors[i].sweep));
        sector.setAttribute(PointAttribute, point.key);

        if (!model.tooltip)
            continue;

        const label = formatValue(model.x, formats.x, point.x, data.categories, numbers, dates, formatting);
        const value = formatValue(model.y, formats.y, point.y ?? 0, data.categories, numbers, dates, formatting);

        sector.setAttribute(TooltipAttribute, `${label} — ${value}`);
    }

    drawSectorEdges(group, sectors, centre, radius, inner);

    if (inner > 0 && model.centreCaption !== null)
        text(canvas, "ui-chart__centre", model.centreCaption, centre.x, centre.y + 4, "middle");

    if (points.length === 0)
        drawEmpty(canvas, { left: 0, top: 0, width, height }, formatting);
}

/** An angle as the stylesheet writes one. */
function degrees(radians: number): string {
    return `${coord((radians * 180) / Math.PI)}deg`;
}

/** The line at the start of every sector that has a neighbour, from the hole to the rim; a sector alone on the turn has none. */
function drawSectorEdges(group: SVGElement, sectors: readonly Sector[], centre: Spot, radius: number, inner: number): void {
    const drawn = sectors.filter(sector => sector.sweep > 0);

    if (drawn.length < 2 || radius <= 0)
        return;

    for (const sector of drawn) {
        const from = spotAt(centre, inner, sector.start);
        const to = spotAt(centre, radius, sector.start);
        const line = append(group, "line", "ui-chart__sector-edge");

        line.setAttribute("x1", coord(from.x));
        line.setAttribute("y1", coord(from.y));
        line.setAttribute("x2", coord(to.x));
        line.setAttribute("y2", coord(to.y));
    }
}

/** The marks of one axis, each already written in the page's culture and measured in its type. */
function labelsOf(
    axis: ChartAxis,
    format: string | null,
    scale: Scale,
    categories: readonly string[],
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    width: (text: string) => number,
    hasRows: boolean
): ChartTickLabel[] {
    // With no rows, an axis the author left open has no range worth marking — a clock would print a moment nobody asked about.
    if (!hasRows && axis.min === null && axis.max === null)
        return [];

    return ticks(axis.kind, scale, axis.ticks).map(value => {
        const text = formatValue(axis, format, value, categories, numbers, dates, formatting);

        return { value, text, width: width(text) };
    });
}

/** A value as its axis writes it: a name, a moment under its pattern, or a number under its format. */
function formatValue(
    axis: ChartAxis,
    format: string | null,
    value: number,
    categories: readonly string[],
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting
): string {
    if (axis.kind === "Category") {
        const index = Math.round(value);

        return index >= 0 && index < categories.length ? categories[index] : "";
    }

    return axis.kind === "Time"
        ? formatting.temporal.format(momentDate(value), format, dates)
        : formatting.numbers.format(value, format, numbers);
}

/** How wide a label is in this chart's own type; one hidden text does the measuring for all of them. */
function measurer(canvas: SVGSVGElement): { width: (text: string) => number; release: () => void } {
    const element = document.createElementNS(SvgNamespace, "text");

    element.setAttribute("class", "ui-chart__label");
    element.setAttribute("visibility", "hidden");
    canvas.appendChild(element);

    return {
        width: text => {
            element.textContent = text;

            return element.getComputedTextLength();
        },
        release: () => element.remove()
    };
}

/** The plot's box: the widest label's own width on the left, a line of labels under the bottom, and a line for each caption. */
function resolvePlot(model: ChartModel, width: number, height: number, widest: number): Plot {
    const left = widest + LabelGap * 2 + (leftAxis(model).caption === null ? 0 : CaptionHeight);
    const bottom = TickHeight + (bottomAxis(model).caption === null ? 0 : CaptionHeight);

    return {
        left,
        top: PlotInset,
        width: Math.max(1, width - left - PlotInset),
        height: Math.max(1, height - bottom - PlotInset)
    };
}

/** The axis written down the left of the plot: the values, or the bands where the chart lies on its side. */
function leftAxis(model: ChartModel): ChartAxis {
    return model.horizontal ? model.x : model.y;
}

/** The axis written under the plot: the bands, or the values where the chart lies on its side. */
function bottomAxis(model: ChartModel): ChartAxis {
    return model.horizontal ? model.y : model.x;
}

/**
 * Where a place on the band axis lands: across the plot, or down it when the chart lies on its side. Only bars draw this way;
 * a line uses `chart-path.ts`.
 */
function bandCoord(model: ChartModel, plot: Plot, band: Scale, value: number): number {
    return model.horizontal ? plotDown(plot, band, value) : plotX(plot, band, value);
}

/** Where a value lands: up the plot, or across it where the chart lies on its side. */
function valueCoord(model: ChartModel, plot: Plot, value: Scale, reading: number): number {
    return model.horizontal ? plotX(plot, value, reading) : plotY(plot, value, reading);
}

function drawGrid(
    canvas: SVGSVGElement,
    model: ChartModel,
    plot: Plot,
    x: Scale,
    y: Scale,
    xLabels: readonly ChartTickLabel[],
    yLabels: readonly ChartTickLabel[]
): void {
    if (!model.x.grid && !model.y.grid)
        return;

    const group = append(canvas, "g", "ui-chart__grid");

    if (model.y.grid) {
        for (const label of yLabels)
            gridLine(group, plot, valueCoord(model, plot, y, label.value), model.horizontal);
    }

    if (!model.x.grid)
        return;

    for (const label of xLabels)
        gridLine(group, plot, bandCoord(model, plot, x, label.value), !model.horizontal);
}

/** One line across the plot at a mark: down the box for a mark on the axis under it, across for one beside it. */
function gridLine(group: SVGElement, plot: Plot, at: number, down: boolean): void {
    if (down)
        line(group, "ui-chart__grid-line", at, plot.top, at, plotBottom(plot));
    else
        line(group, "ui-chart__grid-line", plot.left, at, plotRight(plot), at);
}

function drawAxes(
    canvas: SVGSVGElement,
    model: ChartModel,
    plot: Plot,
    x: Scale,
    y: Scale,
    xLabels: readonly ChartTickLabel[],
    yLabels: readonly ChartTickLabel[],
    width: number,
    height: number
): void {
    const group = append(canvas, "g", "ui-chart__axes");

    line(group, "ui-chart__axis-line", plot.left, plotBottom(plot), plotRight(plot), plotBottom(plot));
    line(group, "ui-chart__axis-line", plot.left, plot.top, plot.left, plotBottom(plot));

    const under = model.horizontal ? yLabels : xLabels;
    const beside = model.horizontal ? xLabels : yLabels;
    // A label that would run into the one before it is dropped: the marks stay where they are, and only some of them are named.
    let occupied = Number.NEGATIVE_INFINITY;

    for (const label of under) {
        const half = label.width / 2;
        const along = model.horizontal ? valueCoord(model, plot, y, label.value) : bandCoord(model, plot, x, label.value);
        // A label at either end is kept inside the frame rather than hanging off it; its mark stays where it is.
        const at = Math.min(Math.max(along, half), width - half);

        if (at - half < occupied)
            continue;

        occupied = at + half + LabelGap;
        text(group, "ui-chart__label", label.text, at, plotBottom(plot) + 16, "middle");
    }

    // The labels beside the plot run upward, so one is dropped when it would sit on the one drawn before it, whichever way that is.
    let last = Number.NaN;

    for (const label of beside) {
        const at = model.horizontal ? bandCoord(model, plot, x, label.value) : valueCoord(model, plot, y, label.value);

        if (Number.isFinite(last) && Math.abs(at - last) < LabelHeight)
            continue;

        last = at;
        text(group, "ui-chart__label", label.text, plot.left - LabelGap, at + 4, "end");
    }

    const bottomCaption = bottomAxis(model).caption;
    const leftCaption = leftAxis(model).caption;

    if (bottomCaption !== null)
        text(group, "ui-chart__caption", bottomCaption, plot.left + plot.width / 2, height - 2, "middle");

    if (leftCaption !== null) {
        // Reading up the axis, which is how the caption beside a plot is read; the rotation is about the point it is placed at.
        const middle = plot.top + plot.height / 2;
        const caption = text(group, "ui-chart__caption", leftCaption, 10, middle, "middle");

        caption.setAttribute("transform", `rotate(-90 10 ${coord(middle)})`);
    }
}

/**
 * The frame the plot is cut at, so a line running out of a narrowed window isn't drawn over the axes. The id is the chart's
 * own, so two charts on one page don't share a clip.
 */
function clipPlot(canvas: SVGSVGElement, group: SVGElement, root: HTMLElement, plot: Plot): void {
    const id = `ui-chart-clip-${root.getAttribute("data-ui-id") ?? "0"}`;
    const clip = append(canvas, "clipPath", "");

    clip.setAttribute("id", id);

    const shape = append(clip, "rect", "");

    shape.setAttribute("x", coord(plot.left));
    shape.setAttribute("y", coord(plot.top));
    shape.setAttribute("width", coord(plot.width));
    shape.setAttribute("height", coord(plot.height));

    group.setAttribute("clip-path", `url(#${id})`);
}

function drawSeries(
    canvas: SVGSVGElement,
    state: ChartState,
    series: readonly ChartSeriesData[],
    plot: Plot,
    x: Scale,
    y: Scale,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    sizes: { readonly min: number; readonly max: number } = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
): void {
    const group = append(canvas, "g", "ui-chart__plot");
    const colors = readSeriesColorCount(state.root);
    const model = state.model;

    if (state.view !== null)
        clipPlot(canvas, group, state.root, plot);
    // Bars share the band one x owns; a line and an area own the whole width and need none of this.
    const band = model.kind === BarKind
        ? bandWidth(model.horizontal ? plot.height : plot.width, barSlots(series.map(entry => entry.drawn)))
        : 0;
    const zero = valueCoord(model, plot, y, Math.min(Math.max(0, y.min), y.max));

    for (let index = 0; index < series.length; index++) {
        const entry = series[index];

        // A series the legend put aside is not drawn at all; its colour lives on the legend's own entry.
        if (state.hidden.has(entry.series.key))
            continue;

        const stepped = entry.series.stepped ?? model.stepped;
        const smooth = entry.series.smooth ?? model.smooth;
        const markers = entry.series.markers ?? model.markers;
        const shape = append(group, "g", "ui-chart__series");
        // What this series stands on: the series under it in a stack, or the axis's own zero.
        const baseline = model.stacked && index > 0 ? series[index - 1].drawn : null;

        shape.setAttribute(SeriesAttribute, entry.series.key);
        shape.style.setProperty("--ui-chart-series-color", colorOf(entry, colors));

        if (model.kind === BarKind) {
            drawBars(shape, entry, index, series.length, baseline, plot, x, y, band, zero, categories, formats, numbers, dates, formatting, model);
            continue;
        }

        // A cloud of points: no line at all, and a third value may size each of them.
        if (model.kind === ScatterKind) {
            for (let i = 0; i < entry.drawn.length; i++)
                drawMarker(shape, entry, i, plot, x, y, bubbleRadius(entry.drawn[i].size, sizes.min, sizes.max), true, categories, formats, numbers, dates, formatting, model);

            continue;
        }

        if (model.kind === AreaKind) {
            const fill = append(shape, "path", "ui-chart__fill");

            fill.setAttribute("d", areaPath(entry.drawn, baseline, x, y, plot, stepped, smooth));
        }

        const drawn = linePath(entry.drawn, x, y, plot, stepped, smooth);
        const path = append(shape, "path", "ui-chart__line");

        path.setAttribute("d", drawn);

        // The same line again, unpainted and wide: a two-pixel stroke is too thin for the pointer to hold.
        const reach = append(shape, "path", "ui-chart__line-hit");

        reach.setAttribute("d", drawn);

        // A chart that draws no marks still needs something for a tooltip to anchor on: the mark is there, unpainted, and the
        // stylesheet shows it under the pointer.
        if (!markers && !model.tooltip)
            continue;

        for (let i = 0; i < entry.drawn.length; i++)
            drawMarker(shape, entry, i, plot, x, y, markers ? PlainRadius - 1 : PlainRadius + 1, markers, categories, formats, numbers, dates, formatting, model);
    }
}

/**
 * One point: the mark the chart draws — unpainted where the chart draws none — and, over it, the circle the pointer actually
 * answers.
 */
function drawMarker(
    shape: SVGElement,
    entry: ChartSeriesData,
    index: number,
    plot: Plot,
    x: Scale,
    y: Scale,
    radius: number,
    painted: boolean,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    model: ChartModel
): void {
    const point = entry.drawn[index];

    if (point.y === null)
        return;

    const at = { x: coord(plotX(plot, x, point.x)), y: coord(plotY(plot, y, point.y)) };
    const group = append(shape, "g", PointClass);

    group.setAttribute(PointAttribute, point.key);

    const marker = append(group, "circle", painted ? MarkerClass : `${MarkerClass} ${BareMarkerClass}`);

    marker.setAttribute("cx", at.x);
    marker.setAttribute("cy", at.y);
    marker.setAttribute("r", coord(radius));

    // A separate, fixed-size hit target: a marker that grows under the pointer would slip from under it, and a mark of three is
    // hard to find.
    const hit = append(group, "circle", HitClass);

    hit.setAttribute("cx", at.x);
    hit.setAttribute("cy", at.y);
    hit.setAttribute("r", coord(pointReach(radius)));

    if (!model.tooltip || model.sharedTooltip)
        return;

    hit.setAttribute(
        TooltipAttribute,
        tooltipText(model, entry, point.x, rawValue(entry, index), categories, formats, numbers, dates, formatting)
    );
}

/** A bar per point, from the baseline to the value, in its own place across the band. */
function drawBars(
    shape: SVGElement,
    entry: ChartSeriesData,
    index: number,
    count: number,
    baseline: readonly ChartPoint[] | null,
    plot: Plot,
    x: Scale,
    y: Scale,
    band: number,
    zero: number,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    model: ChartModel
): void {
    const sideways = model.horizontal;
    // Once per series, not once per bar: the series below is read by x for every bar of this one.
    const below = baseline === null ? null : baselineOf(baseline);

    for (let i = 0; i < entry.drawn.length; i++) {
        const point = entry.drawn[i];

        if (point.y === null)
            continue;

        const bar = barOf(bandCoord(model, plot, x, point.x), band, index, count, model.stacked);
        const reading = valueCoord(model, plot, y, point.y);
        const stands = below === null ? zero : valueCoord(model, plot, y, below.get(point.x) ?? 0);
        const near = Math.min(reading, stands);
        // A value of zero still draws a hair, so the bar is there to point at.
        const length = Math.max(1, Math.abs(reading - stands));
        const rectangle = append(shape, "rect", "ui-chart__bar");

        rectangle.setAttribute("x", coord(sideways ? near : bar.start));
        rectangle.setAttribute("y", coord(sideways ? bar.start : near));
        rectangle.setAttribute("width", coord(sideways ? length : bar.thickness));
        rectangle.setAttribute("height", coord(sideways ? bar.thickness : length));
        rectangle.setAttribute(PointAttribute, point.key);

        if (!model.tooltip || model.sharedTooltip)
            continue;

        rectangle.setAttribute(
            TooltipAttribute,
            tooltipText(model, entry, point.x, rawValue(entry, i), categories, formats, numbers, dates, formatting)
        );
    }
}

/** The value the series itself holds there, which is what a tooltip says even where the drawing stacks. */
function rawValue(entry: ChartSeriesData, index: number): number {
    return (index < entry.points.length ? entry.points[index].y : null) ?? 0;
}

/** What a point says on hover: its series, its x and its value, each written as its own axis writes it. */
function tooltipText(
    model: ChartModel,
    series: ChartSeriesData,
    x: number,
    value: number,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting
): string {
    const left = formatValue(model.x, formats.x, x, categories, numbers, dates, formatting);
    const right = formatValue(model.y, formats.y, value, categories, numbers, dates, formatting);

    return `${series.series.caption} — ${left}: ${right}`;
}

/** A chart with no rows keeps its frame and says there is nothing in it. */
function drawEmpty(canvas: SVGSVGElement, plot: Plot, formatting: ChartFormatting): void {
    const word = formatting.strings.text(EmptyKey);

    if (word.length === 0)
        return;

    text(canvas, "ui-chart__empty", word, plot.left + plot.width / 2, plot.top + plot.height / 2, "middle");
}

/** The colour of a series: the one the author gave, or its place in the theme's categorical run, cycled by the run's length. */
function colorOf(series: ChartSeriesData, colors: number): string {
    if (series.series.color !== null && series.series.color.length > 0)
        return series.series.color;

    return seriesColorVar(series.index, colors);
}

/** The theme's categorical colour at a place in the run, cycled by the run's length — the same rule `ThemeColorRenderer.SeriesColorCss` writes. */
function seriesColorVar(index: number, colors: number): string {
    return `var(--ui-color-series-${(index % colors) + 1})`;
}

function readSeriesColorCount(root: Element): number {
    const value = Number(getComputedStyle(root).getPropertyValue("--ui-color-series-count"));

    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : DefaultSeriesColors;
}

function append(parent: Element, tag: string, className: string): SVGElement {
    const element = document.createElementNS(SvgNamespace, tag);

    element.setAttribute("class", className);
    parent.appendChild(element);

    return element;
}

function line(parent: Element, className: string, x1: number, y1: number, x2: number, y2: number): void {
    const element = append(parent, "line", className);

    element.setAttribute("x1", coord(x1));
    element.setAttribute("y1", coord(y1));
    element.setAttribute("x2", coord(x2));
    element.setAttribute("y2", coord(y2));
}

function text(parent: Element, className: string, value: string, x: number, y: number, anchor: string): SVGElement {
    const element = append(parent, "text", className);

    element.setAttribute("x", coord(x));
    element.setAttribute("y", coord(y));
    element.setAttribute("text-anchor", anchor);
    element.textContent = value;

    return element;
}
