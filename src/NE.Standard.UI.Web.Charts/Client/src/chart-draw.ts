// Drawing a chart at the size it really got: text doesn't scale with a viewBox, so once the browser knows the box, the canvas
// is rebuilt here — grid, axes, and each series' path and marks.

import { bandWidth, barOf, barSlots } from "./chart-bars.ts";
import { PlainRadius, bubbleRadius, pointReach } from "./chart-bubbles.ts";
import type { ChartAxis, ChartModel } from "./chart-model.ts";
import { momentDate } from "./chart-moment.ts";
import { syncLegend } from "./chart-legend.ts";
import type { LegendEntry } from "./chart-legend.ts";
import { ChartAttributes, ChartClasses, ChartKinds, ChartVariables, ChartWords, ClientNames, CoreNames } from "./chart-names.ts";
import { areaPath, coord, linePath, lineSegments } from "./chart-path.ts";
import { sectorsOf, spotAt } from "./chart-pie.ts";
import type { Sector, Spot } from "./chart-pie.ts";
import { radarEdges, radarOutline, radarRadius, radarReach, radarSpokes, spokeAnchor, spokeAngle } from "./chart-radar.ts";
import type { ChartPoint, Segment } from "./chart-path.ts";
import { buildData } from "./chart-rows.ts";
import type { ChartData, ChartRow, ChartSeriesData } from "./chart-rows.ts";
import { stackSeries } from "./chart-stack.ts";
import { clampWindow, followWindow, windowExtent } from "./chart-window.ts";
import type { Span } from "./chart-window.ts";
import { defaultFormat, plotBottom, plotDown, plotRight, plotX, plotY, resolveRange, step, ticks, within } from "./chart-ticks.ts";
import type { Plot, Scale } from "./chart-ticks.ts";
import type { ClientStrings, DomNames, DomRegistry, NumberCulturePack, NumberFormatting, Popups, TemporalCulturePack, TemporalFormatting } from "ne-standard-ui";

const SvgNamespace = "http://www.w3.org/2000/svg";

/** The air around the plot: a line of labels under it, a line more for a caption, and a hair of room at the far edges. */
const PlotInset = 12;
const TickHeight = 22;
const CaptionHeight = 16;
const LabelGap = 8;
/** A label's own line, which is what tells whether the one beside the plot has room for the next. */
const LabelHeight = 16;
/** How many colours the theme's categorical run holds, where the page does not say. */
const DefaultSeriesColors = 8;
const CentreSelector = `:scope > .${ChartClasses.area} > .${ChartClasses.centre}`;

/** What a draw takes from the framework: how a value and a word are written, and the attribute names it writes as the framework does. */
export type ChartFormatting = {
    readonly numbers: NumberFormatting;
    readonly temporal: TemporalFormatting;
    readonly strings: ClientStrings;
    readonly names: DomNames;
    readonly focusReturn: Popups["focusReturn"];
    readonly ensureId: DomRegistry["ensureId"];
};

/** What one chart holds between draws: what the server said, the rows as they now stand, and the series the viewer put away. */
export type ChartState = {
    readonly root: HTMLElement;
    readonly model: ChartModel;
    readonly rows: ChartRow[];
    readonly hidden: Set<string>;
    /** The stretch of the x axis the viewer moved to, or null for the whole of what the data reaches. */
    view: Span | null;
    /** Whether a point arrived while the window stood at the far end: the next draw slides it along before drawing, and clears this. */
    follow: boolean;
    /** The box the canvas was last measured at by a draw, once the legend beside it was in step. */
    width: number;
    height: number;
    /** The id this chart's clip goes by, taken from the page's run of ids the first time the plot is cut. */
    clip: string | null;
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

/** One x as a shared tooltip reads it: its place on the band axis and what every drawn series says there, written when first read. */
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
    const canvas = state.root.querySelector<SVGSVGElement>(`.${ChartClasses.canvas}`);

    if (canvas === null)
        return null;

    const model = state.model;
    const data = buildData(state.rows, model, formatting.temporal.parse);
    const visible = data.series.filter(series => !state.hidden.has(series.series.key));

    // The stack is of the series actually drawn: one the legend put aside leaves it rather than holding a gap in it.
    if (model.stacked)
        stackSeries(visible);

    // The window is the x axis this draw uses. It moves only when a point arrived while it stood at the far end: it slides along
    // before this draw, so the frame is drawn once, where it ends up.
    const whole = resolveRange(model.x, data.xMin, data.xMax, data.categories.length);

    if (state.follow && state.view !== null)
        state.view = followWindow(state.view, whole.min, whole.max);

    state.follow = false;

    const window = state.view === null ? null : clampWindow(state.view, whole.min, whole.max);
    const extent = windowExtent(visible.map(series => series.drawn), window);
    const x = window === null ? whole : { ...whole, min: window.from, max: window.to };
    // A radar's baseline is its centre, so zero is part of its range as it is of a bar's.
    const y = resolveRange(model.y, extent.min, extent.max, 0, model.kind === ChartKinds.area || model.kind === ChartKinds.bar || model.kind === ChartKinds.radar);
    const numbers = formatting.numbers.readCulture(state.root);
    const dates = formatting.temporal.readCulture(state.root);
    const formats: ChartFormats = {
        x: model.x.format ?? defaultFormat(model.x.kind, step(model.x.kind, x.min, x.max, model.x.ticks)),
        y: model.y.format ?? defaultFormat(model.y.kind, step(model.y.kind, y.min, y.max, model.y.ticks))
    };

    const colors = readSeriesColorCount(state.root);
    // A pie's legend names its sectors rather than its series.
    const entries = model.kind === ChartKinds.pie
        ? sectorEntries(model, data, formats, numbers, dates, formatting, colors)
        : data.series.map(entry => ({ key: entry.series.key, caption: entry.series.caption, color: colorOf(entry, colors) }));

    // The legend first: its entries move the plot's box, and a box measured before them would stretch the old frame into the new.
    if (model.legend !== "None")
        syncLegend(state.root, entries, state.hidden, formatting.names, formatting.focusReturn);

    labelCanvas(canvas, entries, formatting);

    const box = canvas.getBoundingClientRect();
    const width = Math.round(box.width);
    const height = Math.round(box.height);

    state.width = width;
    state.height = height;

    if (width < 2 || height < 2)
        return null;

    canvas.setAttribute("viewBox", `0 0 ${coord(width)} ${coord(height)}`);

    // Drawn off the page and put in place in one step, or every appended element would be a mutation for every observer.
    const drawing = document.createElementNS(SvgNamespace, "svg");

    // A turn shared out has no axes to lay out, and no labels to measure: the sectors are the whole drawing.
    if (model.kind === ChartKinds.pie) {
        drawPie(drawing, state, data, width, height, formats, numbers, dates, formatting, colors);
        canvas.replaceChildren(...drawing.childNodes);

        return null;
    }

    // Spokes round a centre rather than two axes along a box: the rings stand for the y axis, and nothing zooms or shares a tooltip.
    if (model.kind === ChartKinds.radar) {
        drawRadar(drawing, canvas, state, data, visible, y, width, height, formats, numbers, dates, formatting, colors);
        canvas.replaceChildren(...drawing.childNodes);

        return null;
    }

    // A chart with nothing around it has no ticks to write and no gutters to leave: the plot is the box, less a hair of air.
    if (model.bare) {
        const bare = { left: 2, top: 2, width: width - 4, height: height - 4 };

        drawSeries(drawing, state, visible, bare, x, y, data.categories, formats, numbers, dates, formatting, colors);
        canvas.replaceChildren(...drawing.childNodes);

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

    drawGrid(drawing, model, plot, x, y, xLabels, yLabels);
    drawAxes(drawing, model, plot, x, y, xLabels, yLabels, width, height);
    drawSeries(drawing, state, visible, plot, x, y, data.categories, formats, numbers, dates, formatting, colors, { min: data.sizeMin, max: data.sizeMax });

    if (state.rows.length === 0)
        drawEmpty(drawing, plot, formatting);

    const columns = model.sharedTooltip
        ? buildColumns(model, visible, plot, x, data.categories, formats, numbers, dates, formatting)
        : [];

    if (columns.length > 0)
        drawRule(drawing, plot, model.horizontal);

    canvas.replaceChildren(...drawing.childNodes);

    return { plot, x, whole: { from: whole.min, to: whole.max }, columns };
}

/** A pie's legend: an entry per sector rather than per series, named by the row's x as the x axis writes it, coloured by its place. */
function sectorEntries(
    model: ChartModel,
    data: ChartData,
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    colors: number
): LegendEntry[] {
    const points = data.series.length > 0 ? data.series[0].points : [];

    return points.map((point, index) => ({
        key: point.key,
        caption: formatValue(model.x, formats.x, point.x, data.categories, numbers, dates, formatting),
        color: seriesColorVar(index, colors)
    }));
}

/** What the canvas is announced as, as the server wrote it: the entries the legend names, or the chart's own word where there are none. */
function labelCanvas(canvas: SVGSVGElement, entries: readonly LegendEntry[], formatting: ChartFormatting): void {
    const label = entries.length > 0 ? wordList(entries.map(entry => entry.caption), formatting.strings) : formatting.strings.text(ChartWords.label);

    if (canvas.getAttribute("aria-label") !== label)
        canvas.setAttribute("aria-label", label);
}

/** Captions as one list, each joined on by the package's word (`ui.chart.list`), so a language writes its own separator. */
export function wordList(captions: readonly string[], strings: ClientStrings): string {
    let list = captions.length > 0 ? captions[0] : "";

    for (let i = 1; i < captions.length; i++)
        list = strings.format(ChartWords.list, { list, next: captions[i] });

    return list;
}

/** The turn shared out between the first series' points; a sector the legend hid takes no angle, and colours stay where they were. */
function drawPie(
    canvas: SVGSVGElement,
    state: ChartState,
    data: ChartData,
    width: number,
    height: number,
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    colors: number
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
    const group = append(canvas, "g", ChartClasses.plot);

    for (let i = 0; i < shown.length; i++) {
        if (sectors[i].sweep <= 0 || radius <= 0)
            continue;

        const point = shown[i].point;
        const shape = append(group, "g", ChartClasses.series);

        shape.setAttribute(ChartAttributes.series, point.key);
        shape.style.setProperty(ChartVariables.seriesColor, seriesColorVar(shown[i].index, colors));

        // A ring from the hole to the rim, which the stylesheet cuts to the sector's own angles (the contract's mixins/arc.less).
        const sector = append(shape, "circle", ChartClasses.sector);

        sector.setAttribute("cx", coord(centre.x));
        sector.setAttribute("cy", coord(centre.y));
        sector.setAttribute("r", coord((radius + inner) / 2));
        sector.setAttribute("stroke-width", coord(radius - inner));
        sector.style.setProperty(ChartVariables.arcStart, degrees(sectors[i].start));
        sector.style.setProperty(ChartVariables.arcSweep, degrees(sectors[i].sweep));
        sector.setAttribute(ChartAttributes.point, point.key);
        // The group is named by its row, so the sector itself says which series a press on it belongs to.
        sector.setAttribute(ChartAttributes.series, data.series[0].series.key);

        if (!model.tooltip)
            continue;

        const label = formatValue(model.x, formats.x, point.x, data.categories, numbers, dates, formatting);
        const value = formatValue(model.y, formats.y, point.y ?? 0, data.categories, numbers, dates, formatting);
        // The tooltip stands against the middle of the sector's own arc: the ring's box is the whole turn's, whatever the cut.
        const middle = spotAt(centre, (radius + inner) / 2, sectors[i].start + sectors[i].sweep / 2);
        const mark = append(shape, "circle", ChartClasses.sectorAnchor);

        sector.setAttribute(ChartAttributes.sectorTooltip, formatting.strings.format(ChartWords.sector, { label, value }));
        mark.setAttribute("cx", coord(middle.x));
        mark.setAttribute("cy", coord(middle.y));
        mark.setAttribute("r", "1");
    }

    drawSectorEdges(group, sectors, centre, radius, inner);

    // The words over the hole are the framework's to write; the drawing gives them the square the hole holds to wrap in.
    const words = state.root.querySelector<HTMLElement>(CentreSelector);
    const room = `${coord(Math.max(inner, 0) * Math.SQRT2)}px`;

    if (words !== null && words.style.maxWidth !== room)
        words.style.maxWidth = room;

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
        const line = append(group, "line", ChartClasses.sectorEdge);

        line.setAttribute("x1", coord(from.x));
        line.setAttribute("y1", coord(from.y));
        line.setAttribute("x2", coord(to.x));
        line.setAttribute("y2", coord(to.y));
    }
}

/** The radar: spokes, rings and each kept series' filled outline; a hidden series keeps its spokes, so the shape the rest make doesn't turn. */
function drawRadar(
    drawing: SVGSVGElement,
    canvas: SVGSVGElement,
    state: ChartState,
    data: ChartData,
    visible: readonly ChartSeriesData[],
    y: Scale,
    width: number,
    height: number,
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    colors: number
): void {
    const model = state.model;
    const spokes = radarSpokes(data.series.map(entry => entry.drawn));
    const names = spokes.map(spoke => formatValue(model.x, formats.x, spoke, data.categories, numbers, dates, formatting));
    // Measured on the live canvas before it is cleared: a detached text has no length.
    const measure = measurer(canvas);
    const widest = names.reduce((longest, name) => Math.max(longest, measure.width(name)), 0);

    measure.release();

    const centre = { x: width / 2, y: height / 2 };
    const radius = radarRadius(width, height, widest + LabelGap + PlotInset, LabelHeight + LabelGap + PlotInset);
    const rings = state.rows.length > 0 || model.y.min !== null || model.y.max !== null ? ticks(model.y.kind, y, model.y.ticks) : [];

    if (spokes.length > 0 && radius > 0)
        drawRadarFrame(drawing, model, names, rings.map(value => ({ value, text: formatValue(model.y, formats.y, value, [], numbers, dates, formatting) })), y, centre, radius);

    const group = append(drawing, "g", ChartClasses.plot);
    // Every band under every series' outline and marks: a later series' band laid over an earlier one would take its corners from
    // the pointer.
    const bands = append(group, "g", ChartClasses.bands);

    for (const entry of visible)
        drawRadarSeries(group, bands, model, entry, spokes, y, centre, radius, data.categories, formats, numbers, dates, formatting, colors);

    if (state.rows.length === 0)
        drawEmpty(drawing, { left: 0, top: 0, width, height }, formatting);
}

/** What the series are read against: rings, rim, spokes and their names, where the axes ask for them. */
function drawRadarFrame(
    canvas: SVGSVGElement,
    model: ChartModel,
    names: readonly string[],
    rings: readonly { readonly value: number; readonly text: string }[],
    y: Scale,
    centre: Spot,
    radius: number
): void {
    const count = names.length;

    if (model.y.grid) {
        const grid = append(canvas, "g", ChartClasses.grid);

        for (const ring of rings) {
            const reach = radarReach(y, ring.value, radius);

            if (reach > 0 && reach < radius)
                radarRing(grid, ChartClasses.gridLine, count, centre, reach);
        }
    }

    const axes = append(canvas, "g", ChartClasses.axes);

    radarRing(axes, ChartClasses.axisLine, count, centre, radius);

    for (let i = 0; i < count; i++) {
        const angle = spokeAngle(i, count);
        const tip = spotAt(centre, radius, angle);
        const name = spotAt(centre, radius + LabelGap, angle);

        if (model.x.grid)
            line(axes, ChartClasses.axisLine, centre.x, centre.y, tip.x, tip.y);

        text(axes, ChartClasses.label, names[i], name.x, spokeNameBaseline(angle, name.y), spokeAnchor(angle));
    }

    // A ring's value beside the top spoke, just inside the ring; one that would sit on the one written before it is left out.
    let last = Number.NaN;

    for (const ring of rings) {
        const reach = radarReach(y, ring.value, radius);

        if (reach <= 0 || (Number.isFinite(last) && Math.abs(reach - last) < LabelHeight))
            continue;

        last = reach;
        text(axes, ChartClasses.label, ring.text, centre.x + LabelGap, centre.y - reach + 12, "start");
    }
}

/** One ring: the shape through every spoke at the same reach, drawn as its sides. */
function radarRing(parent: SVGElement, className: string, count: number, centre: Spot, reach: number): void {
    const spots: Spot[] = [];

    for (let i = 0; i < count; i++)
        spots.push(spotAt(centre, reach, spokeAngle(i, count)));

    segmentGroup(parent, className, radarEdges(spots));
}

/** Where a spoke's name sits for its tip: above one at the top of the turn, under one at the bottom, level beside the rest. */
function spokeNameBaseline(angle: number, y: number): number {
    const down = Math.sin(angle);

    return down < -0.3 ? y : down > 0.3 ? y + 12 : y + 4;
}

/** One series closed into a shape over the spokes, its outline at the centre on a spoke it has no value on. */
function drawRadarSeries(
    group: SVGElement,
    bands: SVGElement,
    model: ChartModel,
    entry: ChartSeriesData,
    spokes: readonly number[],
    y: Scale,
    centre: Spot,
    radius: number,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    colors: number
): void {
    const markers = entry.series.markers ?? model.markers;
    const byPlace = new Map<number, ChartPoint>();

    for (const point of entry.drawn) {
        if (!byPlace.has(point.x))
            byPlace.set(point.x, point);
    }

    const points = spokes.map(spoke => byPlace.get(spoke) ?? null);
    const spots = points.map((point, i) => spotAt(centre, radarReach(y, point?.y ?? null, radius), spokeAngle(i, spokes.length)));
    const shape = append(group, "g", ChartClasses.series);
    const color = colorOf(entry, colors);

    shape.setAttribute(ChartAttributes.series, entry.series.key);
    shape.style.setProperty(ChartVariables.seriesColor, color);
    // The band stays a path: its edge lies under the outline, and it is four-fifths transparent.
    drawBand(bands, entry.series.key, color, radarOutline(spots));
    segmentGroup(shape, ChartClasses.line, radarEdges(spots));

    // As on a line: a chart that draws no marks still needs something for a tooltip to anchor on.
    if (!markers && !model.tooltip)
        return;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        if (point === null || point.y === null)
            continue;

        const tooltip = model.tooltip ? tooltipText(model, entry, point.x, point.y, categories, formats, numbers, dates, formatting) : null;

        drawPointMark(shape, point.key, spots[i].x, spots[i].y, markers ? PlainRadius - 1 : PlainRadius + 1, markers, tooltip, formatting.names);
    }
}

/** One series' band, in the layer of bands under every series: keyed and coloured as its series is, so it is read as one with it. */
function drawBand(bands: SVGElement, key: string, color: string, outline: string): void {
    const fill = append(bands, "path", ChartClasses.fill);

    fill.setAttribute(ChartAttributes.series, key);
    fill.style.setProperty(ChartVariables.seriesColor, color);
    fill.setAttribute("d", outline);
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

    element.setAttribute("class", ChartClasses.label);
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

/** Where a place on the band axis lands, across the plot or down it when bars lie on their side. */
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

    const group = append(canvas, "g", ChartClasses.grid);

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
        line(group, ChartClasses.gridLine, at, plot.top, at, plotBottom(plot));
    else
        line(group, ChartClasses.gridLine, plot.left, at, plotRight(plot), at);
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
    const group = append(canvas, "g", ChartClasses.axes);

    line(group, ChartClasses.axisLine, plot.left, plotBottom(plot), plotRight(plot), plotBottom(plot));
    line(group, ChartClasses.axisLine, plot.left, plot.top, plot.left, plotBottom(plot));

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
        text(group, ChartClasses.label, label.text, at, plotBottom(plot) + 16, "middle");
    }

    // The labels beside the plot run upward, so one is dropped when it would sit on the one drawn before it, whichever way that is.
    let last = Number.NaN;

    for (const label of beside) {
        const at = model.horizontal ? bandCoord(model, plot, x, label.value) : valueCoord(model, plot, y, label.value);

        if (Number.isFinite(last) && Math.abs(at - last) < LabelHeight)
            continue;

        last = at;
        text(group, ChartClasses.label, label.text, plot.left - LabelGap, at + 4, "end");
    }

    const bottomCaption = bottomAxis(model).caption;
    const leftCaption = leftAxis(model).caption;

    if (bottomCaption !== null)
        text(group, ChartClasses.caption, bottomCaption, plot.left + plot.width / 2, height - 2, "middle");

    if (leftCaption !== null) {
        // Reading up the axis, which is how the caption beside a plot is read; the rotation is about the point it is placed at.
        const middle = plot.top + plot.height / 2;
        const caption = text(group, ChartClasses.caption, leftCaption, 10, middle, "middle");

        caption.setAttribute("transform", `rotate(-90 10 ${coord(middle)})`);
    }
}

/**
 * The frame the plot is cut at, so a line out of a narrowed window isn't drawn over the axes. The id is this chart's alone: its
 * component id is shared by every copy down a list, and `url(#id)` takes the first element of that id in the document.
 */
export function clipPlot(canvas: SVGSVGElement, group: SVGElement, state: ChartState, plot: Plot, formatting: ChartFormatting): void {
    const clip = append(canvas, "clipPath", "");

    // "drawn" after the prefix keeps it apart from the server's first frame, whose ids go on with the component id's digits.
    if (state.clip === null)
        state.clip = formatting.ensureId(clip, `${ChartClasses.clipPrefix}drawn`);
    else
        clip.setAttribute("id", state.clip);

    const shape = append(clip, "rect", "");

    shape.setAttribute("x", coord(plot.left));
    shape.setAttribute("y", coord(plot.top));
    shape.setAttribute("width", coord(plot.width));
    shape.setAttribute("height", coord(plot.height));

    group.setAttribute("clip-path", `url(#${state.clip})`);
}

/**
 * The series the viewer kept, bands in one layer under them all; stacks and bars count only these, so a hidden series leaves
 * no step and no gap.
 */
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
    colors: number,
    sizes: { readonly min: number; readonly max: number } = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
): void {
    const group = append(canvas, "g", ChartClasses.plot);
    const model = state.model;

    if (state.view !== null)
        clipPlot(canvas, group, state, plot, formatting);

    // Every band under every series' line and marks: a later series' band laid over an earlier one would take its points from the
    // pointer.
    const bands = model.kind === ChartKinds.area ? append(group, "g", ChartClasses.bands) : null;

    // Bars share the band one x owns; a line and an area own the whole width and need none of this.
    const band = model.kind === ChartKinds.bar
        ? bandWidth(model.horizontal ? plot.height : plot.width, barSlots(series.map(entry => entry.drawn), x))
        : 0;

    for (let index = 0; index < series.length; index++) {
        const entry = series[index];
        const stepped = entry.series.stepped ?? model.stepped;
        const smooth = entry.series.smooth ?? model.smooth;
        const markers = entry.series.markers ?? model.markers;
        const shape = append(group, "g", ChartClasses.series);
        const color = colorOf(entry, colors);

        shape.setAttribute(ChartAttributes.series, entry.series.key);
        shape.style.setProperty(ChartVariables.seriesColor, color);

        if (model.kind === ChartKinds.bar) {
            drawBars(shape, entry, index, series.length, plot, x, y, band, categories, formats, numbers, dates, formatting, model);
            continue;
        }

        // A cloud of points: no line at all, and a third value may size each of them.
        if (model.kind === ChartKinds.scatter) {
            for (let i = 0; i < entry.drawn.length; i++)
                drawMarker(shape, entry, i, plot, x, y, bubbleRadius(entry.drawn[i].size, sizes.min, sizes.max), true, categories, formats, numbers, dates, formatting, model);

            continue;
        }

        if (bands !== null)
            drawBand(bands, entry.series.key, color, areaPath(entry.drawn, x, y, plot, stepped, smooth));

        segmentGroup(shape, ChartClasses.line, lineSegments(entry.drawn, x, y, plot, stepped, smooth));

        // The same line unpainted and wide, for a pointer a thin stroke cannot hold; never painted, it stays one path.
        const reach = append(shape, "path", ChartClasses.lineHit);

        reach.setAttribute("d", linePath(entry.drawn, x, y, plot, stepped, smooth));

        // A chart drawing no marks keeps one unpainted for a tooltip to anchor on; the stylesheet shows it under the pointer.
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

    const tooltip = !model.tooltip || model.sharedTooltip
        ? null
        : tooltipText(model, entry, point.x, rawValue(entry, index), categories, formats, numbers, dates, formatting);

    drawPointMark(shape, point.key, plotX(plot, x, point.x), plotY(plot, y, point.y), radius, painted, tooltip, formatting.names);
}

/** A point's two circles where it stands: the mark, and the fixed-size one the pointer answers, carrying the tooltip. */
function drawPointMark(shape: SVGElement, key: string, x: number, y: number, radius: number, painted: boolean, tooltip: string | null, names: DomNames): void {
    const at = { x: coord(x), y: coord(y) };
    const group = append(shape, "g", ChartClasses.point);

    group.setAttribute(ChartAttributes.point, key);

    const marker = append(group, "circle", painted ? ChartClasses.marker : `${ChartClasses.marker} ${ChartClasses.bareMarker}`);

    marker.setAttribute("cx", at.x);
    marker.setAttribute("cy", at.y);
    marker.setAttribute("r", coord(radius));

    // A separate, fixed-size hit target: a marker that grows under the pointer would slip from under it, and a mark of three is
    // hard to find.
    const hit = append(group, "circle", ChartClasses.hit);

    hit.setAttribute("cx", at.x);
    hit.setAttribute("cy", at.y);
    hit.setAttribute("r", coord(pointReach(radius)));

    if (tooltip !== null)
        hit.setAttribute(names.tooltip, tooltip);
}

/** A bar per point, from what it stands on — its place in a stack, or zero — to the value, in its own place across the band. */
function drawBars(
    shape: SVGElement,
    entry: ChartSeriesData,
    index: number,
    count: number,
    plot: Plot,
    x: Scale,
    y: Scale,
    band: number,
    categories: readonly string[],
    formats: ChartFormats,
    numbers: NumberCulturePack,
    dates: TemporalCulturePack,
    formatting: ChartFormatting,
    model: ChartModel
): void {
    const sideways = model.horizontal;

    for (let i = 0; i < entry.drawn.length; i++) {
        const point = entry.drawn[i];

        if (point.y === null)
            continue;

        const bar = barOf(bandCoord(model, plot, x, point.x), band, index, count, model.stacked);
        const reading = valueCoord(model, plot, y, point.y);
        const stands = valueCoord(model, plot, y, within(y, point.base ?? 0));
        const near = Math.min(reading, stands);
        // A value of zero still draws a hair, so the bar is there to point at.
        const length = Math.max(1, Math.abs(reading - stands));
        const rectangle = append(shape, "rect", ChartClasses.bar);

        rectangle.setAttribute("x", coord(sideways ? near : bar.start));
        rectangle.setAttribute("y", coord(sideways ? bar.start : near));
        rectangle.setAttribute("width", coord(sideways ? length : bar.thickness));
        rectangle.setAttribute("height", coord(sideways ? bar.thickness : length));
        rectangle.setAttribute(ChartAttributes.point, point.key);

        if (!model.tooltip || model.sharedTooltip)
            continue;

        rectangle.setAttribute(
            formatting.names.tooltip,
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

    return formatting.strings.format(ChartWords.point, { series: series.series.caption, x: left, y: right });
}

/** A chart with no rows keeps its frame and says there is nothing in it. */
function drawEmpty(canvas: SVGSVGElement, plot: Plot, formatting: ChartFormatting): void {
    const word = formatting.strings.text(ChartWords.empty);

    if (word.length === 0)
        return;

    text(canvas, ChartClasses.empty, word, plot.left + plot.width / 2, plot.top + plot.height / 2, "middle");
}

/** Every x the drawn series hold inside the window; a column's words are written when the pointer first reaches it, not on every draw. */
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
    // What each series holds at every x in view, the first value a series has there as the tooltip has always read it.
    const byPlace = new Map<number, (number | null)[]>();

    for (let index = 0; index < series.length; index++) {
        for (const point of series[index].points) {
            if (point.y === null || point.x < x.min || point.x > x.max)
                continue;

            let values = byPlace.get(point.x);

            if (values === undefined) {
                values = new Array<number | null>(series.length).fill(null);
                byPlace.set(point.x, values);
            }

            values[index] ??= point.y;
        }
    }

    const places = [...byPlace.keys()].sort((left, right) => left - right);

    return places.map(place => {
        const values = byPlace.get(place) ?? [];
        let text: string | null = null;

        return {
            at: bandCoord(model, plot, x, place),
            get text(): string {
                if (text !== null)
                    return text;

                const lines = [formatValue(model.x, formats.x, place, categories, numbers, dates, formatting)];

                for (let index = 0; index < series.length; index++) {
                    const value = values[index];

                    if (value === null || value === undefined)
                        continue;

                    const reading = formatValue(model.y, formats.y, value, categories, numbers, dates, formatting);

                    lines.push(formatting.strings.format(ChartWords.reading, { series: series[index].series.caption, value: reading }));
                }

                text = lines.join("\n");

                return text;
            }
        };
    });
}

/** The line a shared tooltip is read against, which the engine moves and shows. */
function drawRule(canvas: SVGSVGElement, plot: Plot, horizontal: boolean): void {
    const rule = append(canvas, "rect", ClientNames.rule);

    rule.setAttribute("x", horizontal ? coord(plot.left) : "0");
    rule.setAttribute("y", horizontal ? "0" : coord(plot.top));
    rule.setAttribute("width", horizontal ? coord(plot.width) : "1");
    rule.setAttribute("height", horizontal ? "1" : coord(plot.height));
}

/** The colour of a series: the one the author gave, or its place in the theme's categorical run, cycled by the run's length. */
function colorOf(series: ChartSeriesData, colors: number): string {
    if (series.series.color !== null && series.series.color.length > 0)
        return series.series.color;

    return seriesColorVar(series.index, colors);
}

/** The theme's categorical colour at a place in the run, cycled by the run's length — the same rule `ThemeColorRenderer.SeriesColorCss` writes. */
function seriesColorVar(index: number, colors: number): string {
    return `var(${CoreNames.seriesColorPrefix}${(index % colors) + 1})`;
}

function readSeriesColorCount(root: Element): number {
    const value = Number(getComputedStyle(root).getPropertyValue(CoreNames.seriesColorCount));

    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : DefaultSeriesColors;
}

function append(parent: Element, tag: string, className: string): SVGElement {
    const element = document.createElementNS(SvgNamespace, tag);

    element.setAttribute("class", className);
    parent.appendChild(element);

    return element;
}

/** A line as `<line>` pieces under one group, since Chrome antialiases a path as a staircase (`lineSegments`). */
function segmentGroup(parent: Element, className: string, segments: readonly Segment[]): void {
    const group = append(parent, "g", className);

    for (const segment of segments) {
        const element = document.createElementNS(SvgNamespace, "line");

        element.setAttribute("x1", coord(segment.x1));
        element.setAttribute("y1", coord(segment.y1));
        element.setAttribute("x2", coord(segment.x2));
        element.setAttribute("y2", coord(segment.y2));
        group.appendChild(element);
    }
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
