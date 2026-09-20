// Runs every chart on the page: re-draws it at its real size, takes its collection through the sink, and reads the viewer's
// zoom, pan and legend clicks.

import type { CollectionChange, ObserveSize, PluginEngineContext, Tooltips } from "ne-standard-ui";
import { drawChart } from "./chart-draw.ts";
import type { ChartColumn, ChartFormatting, ChartFrame } from "./chart-draw.ts";
import { applyGaugeValue } from "./chart-gauge.ts";
import { ModelAttribute, PointAttribute, RowsAttribute, SeriesAttribute, WindowAttribute, readModel } from "./chart-model.ts";
import type { ChartModel } from "./chart-model.ts";
import { applyChange, readRows } from "./chart-rows.ts";
import type { ChartRow } from "./chart-rows.ts";
import { valueOf } from "./chart-ticks.ts";
import { followWindow, panWindow, zoomWindow } from "./chart-window.ts";
import type { Span } from "./chart-window.ts";

const RootSelector = ".ui-chart";
const CanvasSelector = ".ui-chart__canvas";
const SeriesSelector = ".ui-chart__series";
const PointSelector = "[data-ui-chart-point]";
const PointClickEvent = "point-click";
const AreaSelector = ".ui-chart__area";
const RuleSelector = ".ui-chart__rule";
const RuleOnClass = "ui-chart__rule--on";
const WindowSelector = ".ui-chart__window";
const WindowChangeEvent = "window-change";
/** How long after the last notch of the wheel the window is sent; a drag sends its own on the release. */
const SettleDelay = 250;
/** How much of the window one notch of the wheel takes away, or gives back. */
const WheelStep = 1.2;
/** A press that moved this far was a drag, and the point under it is not what the viewer meant to press. */
const DragSlack = 3;
const LegendEntrySelector = ".ui-chart__legend-entry";
const LegendOffClass = "ui-chart__legend-entry--off";
const BackSeriesClass = "ui-chart__series--back";
const BarSelector = ".ui-chart__bar";
const HoveredBarSelector = ".ui-chart__bar:hover";
const FrontBarClass = "ui-chart__bar--front";

/** One chart as this engine holds it, with the attributes it was built from so a re-render is noticed. */
type ChartEntry = {
    readonly root: HTMLElement;
    readonly model: ChartModel;
    readonly rows: ChartRow[];
    readonly hidden: Set<string>;
    readonly modelText: string;
    rowsText: string;
    /** The stretch of the x axis the viewer moved to, or null for the whole of what the data reaches. */
    view: Span | null;
    /** What the last draw settled on, so a wheel and a drag are read against the picture they land on. */
    frame: ChartFrame | null;
    /** Whether the window stands at the far end of the data, which is what makes it follow a point arriving past it. */
    anchored: boolean;
    /** The box the chart was last drawn at, so a size that did not really change draws nothing. */
    width: number;
    height: number;
    /** What stops following the chart's size; kept so a chart the page let go of is let go of here too. */
    release: (() => void) | null;
};

/** The drag in hand: the chart, where the press started, and the window it started from. */
type Drag = {
    readonly root: HTMLElement;
    readonly clientX: number;
    readonly window: Span;
    moved: number;
};

export class ChartEngine {
    private readonly charts = new WeakMap<HTMLElement, ChartEntry>();
    private readonly formatting: ChartFormatting;
    private readonly tooltips: Tooltips;
    private readonly observeSize: ObserveSize;
    private readonly readPath: (item: unknown, path: string) => unknown;
    /** The chart whose shared tooltip is up, so it is taken down when the pointer goes elsewhere. */
    private shared: HTMLElement | null = null;
    private drag: Drag | null = null;
    /** Whether the press that just ended moved the window, which is what keeps a drag from reading as a click on a point. */
    private dragged = false;
    /** The wheel's own settling, per chart: the timer its window waits on before it is sent. */
    private readonly settling = new Map<HTMLElement, number>();

    public constructor(context: PluginEngineContext) {
        const root = context.root;

        this.formatting = { numbers: context.numbers, temporal: context.temporal, strings: context.strings };
        this.tooltips = context.tooltips;
        this.observeSize = context.observeSize;
        this.readPath = context.rows.readPath;

        for (const chart of root.querySelectorAll<HTMLElement>(RootSelector))
            this.adopt(chart);

        // The charts a navigation brings, and a chart the server rendered again: its model and its rows are attributes of the root.
        context.observeComponents(root, RootSelector, { childList: true, attributeFilter: [ModelAttribute, RowsAttribute] }, charts => {
            for (const chart of charts)
                this.onMutated(chart);
        });

        root.addEventListener("click", domEvent => this.onPress(domEvent), true);
        root.addEventListener("pointerover", domEvent => this.onLegendHover(domEvent), true);
        root.addEventListener("pointerout", domEvent => this.onLegendHover(domEvent), true);
        root.addEventListener("pointerover", domEvent => this.onBarHover(domEvent), true);
        root.addEventListener("pointerout", domEvent => this.onBarHover(domEvent), true);

        // Only a chart the author made zoomable answers the wheel and the drag, so a page still scrolls under the rest.
        root.addEventListener("wheel", domEvent => this.onWheel(domEvent), { capture: true, passive: false });
        root.addEventListener("pointerdown", domEvent => this.onDragStart(domEvent), true);
        root.addEventListener("dblclick", domEvent => this.onReset(domEvent), true);

        // One tooltip for every series at an x: the browser shows the words, the framework places them by the pointer. A chart
        // with no columns is left alone.
        root.addEventListener("pointermove", domEvent => this.onSharedTooltip(domEvent), true);
        root.addEventListener("pointerout", domEvent => this.onSharedTooltip(domEvent), true);
    }

    /** Takes a chart in hand: reads what the server said, draws it at its real size, and follows that size from then on. */
    private adopt(root: HTMLElement): void {
        const entry = this.resolve(root);

        if (entry === null)
            return;

        entry.release ??= this.observeSize(root, () => this.onResize(root));

        this.redraw(root);
    }

    /**
     * The chart's entry, built or rebuilt when the server sends a new model. Rows the sink has patched stay as they are — the
     * attribute reflects the first frame, not the page's current rows.
     */
    private resolve(root: HTMLElement): ChartEntry | null {
        const modelText = root.getAttribute(ModelAttribute) ?? "";
        const rowsText = root.getAttribute(RowsAttribute) ?? "";
        const existing = this.charts.get(root);

        if (existing !== undefined && existing.modelText === modelText) {
            if (existing.rowsText !== rowsText) {
                existing.rows.length = 0;
                existing.rows.push(...readRows(root));
                existing.rowsText = rowsText;
            }

            return existing;
        }

        const model = readModel(root);

        if (model === null)
            return null;

        const entry: ChartEntry = {
            root,
            model,
            rows: readRows(root),
            hidden: existing?.hidden ?? new Set<string>(),
            modelText,
            rowsText,
            view: existing?.view ?? null,
            anchored: existing?.anchored ?? true,
            frame: null,
            width: 0,
            height: 0,
            release: existing?.release ?? null
        };

        this.charts.set(root, entry);

        return entry;
    }

    private redraw(root: HTMLElement): void {
        const entry = this.charts.get(root);

        if (entry === undefined)
            return;

        const box = measure(root);

        entry.width = box.width;
        entry.height = box.height;
        entry.frame = drawChart(entry, this.formatting);
        // The canvas is new, and the pointer that stood on a bar of the old one has not moved to say so again.
        markBar(root, root.querySelector(HoveredBarSelector));
    }

    /**
     * A chart redraws only when its box actually changed — a draw sets the canvas's own viewBox, and an observer answering that
     * would loop. A chart the page let go of releases its observer too.
     */
    private onResize(root: HTMLElement): void {
        const entry = this.charts.get(root);

        if (entry === undefined)
            return;

        if (!root.isConnected) {
            entry.release?.();
            entry.release = null;
            this.charts.delete(root);
            return;
        }

        const box = measure(root);

        if (box.width === entry.width && box.height === entry.height)
            return;

        this.redraw(root);
    }

    /**
     * A chart under the observer: freshly brought by the page, or resent by the server. One already in hand whose model and rows
     * read the same is left alone, since a draw's own mutations loop back through this observer.
     */
    private onMutated(root: HTMLElement): void {
        const known = this.charts.get(root);

        if (known !== undefined && known.modelText === (root.getAttribute(ModelAttribute) ?? "") && known.rowsText === (root.getAttribute(RowsAttribute) ?? ""))
            return;

        this.adopt(root);
    }

    /** A collection change for a chart: the rows are patched and the chart redrawn, with no render of the page. */
    public applyChange(change: CollectionChange): void {
        if (!(change.component instanceof HTMLElement))
            return;

        const entry = this.resolve(change.component);

        if (entry === null)
            return;

        // The attribute stays as first-frame data; re-reading it would undo the patch. Only a fresh render from the server
        // writes a new one.
        applyChange(entry.rows, change.action, change.items, change.moves, entry.model, this.readPath);

        this.redraw(change.component);

        // A point arrived: a window at the far end follows it, diverging from what the controller holds. Settling coalesces a
        // burst of readings into one message.
        if (!entry.model.followLatest || entry.view === null || !entry.anchored || entry.frame === null)
            return;

        entry.view = followWindow(entry.view, entry.frame.whole.from, entry.frame.whole.to);
        this.redraw(change.component);
        this.settle(change.component);
    }

    /**
     * A window the server pushed: the attribute is written so a reload agrees with what is drawn, and the chart moves to it. A
     * value this page produced is already drawn, so it's not read again.
     */
    public applyWindow(target: Element, value: unknown, local: boolean): void {
        const root = target.closest<HTMLElement>(RootSelector);
        const entry = root === null ? undefined : this.charts.get(root);
        const wire = readWindowValue(value);

        if (wire === null)
            target.removeAttribute(WindowAttribute);
        else
            target.setAttribute(WindowAttribute, JSON.stringify(wire));

        if (root === null || entry === undefined || local)
            return;

        entry.view = wire === null ? null : { from: wire.from, to: wire.to };
        this.redraw(root);
        anchor(entry);
    }

    /** A gauge's arc is the stylesheet's own work; its reading is written here, in the page's culture and the page's words. */
    public applyGaugeValue(target: Element, value: unknown): void {
        applyGaugeValue(target, value, this.formatting);
    }

    /** The x the pointer names, marked with a line and named by one tooltip; the pointer leaving the plot takes both down. */
    private onSharedTooltip(domEvent: Event): void {
        if (!(domEvent instanceof PointerEvent) || !(domEvent.target instanceof Element))
            return;

        const root = domEvent.target.closest<HTMLElement>(RootSelector);
        const entry = root === null ? undefined : this.charts.get(root);
        const frame = entry?.frame ?? null;
        const inside = domEvent.type === "pointermove" && domEvent.target.closest(AreaSelector) !== null;

        if (root === null || entry === undefined || frame === null || frame.columns.length === 0 || !inside) {
            this.closeShared();
            return;
        }

        const canvas = root.querySelector<SVGSVGElement>(CanvasSelector);
        const rule = root.querySelector<SVGElement>(RuleSelector);

        if (canvas === null || rule === null)
            return;

        const column = nearestColumn(frame.columns, domEvent.clientX - canvas.getBoundingClientRect().left);

        rule.setAttribute("x", String(Math.round(column.at * 100) / 100));
        rule.classList.add(RuleOnClass);
        this.shared = root;
        this.tooltips.show(rule, column.text);
    }

    private closeShared(): void {
        if (this.shared === null)
            return;

        this.shared.querySelector<SVGElement>(RuleSelector)?.classList.remove(RuleOnClass);
        this.shared = null;
        this.tooltips.hide();
    }

    /** The chart the pointer is over, where it is one the viewer may move. */
    private zoomable(target: EventTarget | null): { root: HTMLElement; entry: ChartEntry; frame: ChartFrame } | null {
        if (!(target instanceof Element))
            return null;

        const root = target.closest<HTMLElement>(RootSelector);
        const entry = root === null ? undefined : this.charts.get(root);

        if (root === null || entry === undefined || !entry.model.zoomable || entry.frame === null)
            return null;

        return target.closest(AreaSelector) === null ? null : { root, entry, frame: entry.frame };
    }

    /** A notch of the wheel: the window narrows or widens about the value under the pointer, which stays where it is. */
    private onWheel(domEvent: Event): void {
        const found = this.zoomable(domEvent.target);

        if (found === null || !(domEvent instanceof WheelEvent) || domEvent.deltaY === 0)
            return;

        domEvent.preventDefault();

        const { entry, frame } = found;
        const at = valueOf(frame.x, share(domEvent.clientX, found.root, frame));
        const moved = zoomWindow(entry.view ?? frame.whole, at, domEvent.deltaY > 0 ? WheelStep : 1 / WheelStep, frame.whole.from, frame.whole.to);

        entry.view = narrowed(moved, frame.whole);
        this.redraw(found.root);
        anchor(entry);
        this.settle(found.root);
    }

    /**
     * The window the viewer settled on, sent as the chart's own value. A wheel waits a moment after each notch before sending;
     * a drag sends on release.
     */
    private settle(root: HTMLElement): void {
        const pending = this.settling.get(root);

        if (pending !== undefined)
            window.clearTimeout(pending);

        this.settling.set(root, window.setTimeout(() => this.send(root), SettleDelay));
    }

    private send(root: HTMLElement): void {
        const entry = this.charts.get(root);
        const target = root.querySelector<HTMLElement>(WindowSelector);

        this.settling.delete(root);

        if (entry === undefined || target === null)
            return;

        const text = entry.view === null ? "" : JSON.stringify({ from: entry.view.from, to: entry.view.to });

        if (text.length === 0)
            target.removeAttribute(WindowAttribute);
        else
            target.setAttribute(WindowAttribute, text);

        target.dispatchEvent(new Event("change", { bubbles: true }));
        root.dispatchEvent(new CustomEvent(WindowChangeEvent, { bubbles: true }));
    }

    /** A press on the plot takes the window in hand; what follows the pointer is the drag itself. */
    private onDragStart(domEvent: Event): void {
        // A new press: whatever the last one was, the click that follows this one is its own.
        this.dragged = false;

        const found = this.zoomable(domEvent.target);

        if (found === null || !(domEvent instanceof PointerEvent) || domEvent.button !== 0)
            return;

        this.drag = { root: found.root, clientX: domEvent.clientX, window: found.entry.view ?? found.frame.whole, moved: 0 };

        const move = (event: Event): void => this.onDragMove(event);
        const end = (): void => {
            window.removeEventListener("pointermove", move, true);
            window.removeEventListener("pointerup", end, true);
            window.removeEventListener("pointercancel", end, true);
            this.onDragEnd();
        };

        window.addEventListener("pointermove", move, true);
        window.addEventListener("pointerup", end, true);
        window.addEventListener("pointercancel", end, true);
    }

    private onDragMove(domEvent: Event): void {
        const drag = this.drag;
        const entry = drag === null ? undefined : this.charts.get(drag.root);

        if (drag === null || entry === undefined || entry.frame === null || !(domEvent instanceof PointerEvent))
            return;

        const width = entry.frame.plot.width;
        const span = drag.window.to - drag.window.from;
        const by = width > 0 ? ((drag.clientX - domEvent.clientX) / width) * span : 0;

        drag.moved = Math.max(drag.moved, Math.abs(domEvent.clientX - drag.clientX));
        entry.view = panWindow(drag.window, by, entry.frame.whole.from, entry.frame.whole.to);
        this.redraw(drag.root);
        anchor(entry);
    }

    private onDragEnd(): void {
        // A press that moved is a drag, and the click that follows it is not a press on the point underneath.
        this.dragged = this.drag !== null && this.drag.moved > DragSlack;

        if (this.dragged && this.drag !== null)
            this.send(this.drag.root);

        this.drag = null;
    }

    /** Two presses give the whole of the data back. */
    private onReset(domEvent: Event): void {
        const found = this.zoomable(domEvent.target);

        if (found === null)
            return;

        found.entry.view = null;
        found.entry.anchored = true;
        this.redraw(found.root);
        this.send(found.root);
    }

    /**
     * The legend reads like the plot: the series under the pointer stays forward, the rest go back until the pointer leaves.
     * The plot's own hover is the stylesheet's work; only the legend needs its key matched to a group here.
     */
    private onLegendHover(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const button = domEvent.target.closest<HTMLElement>(LegendEntrySelector);
        const root = domEvent.target.closest<HTMLElement>(RootSelector);

        if (root === null)
            return;

        const over = domEvent.type === "pointerover";
        const related = domEvent instanceof PointerEvent ? domEvent.relatedTarget : null;

        // Moving between an entry's own mark and its words leaves and enters it again; the series it names has not changed.
        if (!over && button !== null && related instanceof Node && button.contains(related))
            return;

        const key = over && button !== null ? button.getAttribute(SeriesAttribute) : null;

        for (const series of root.querySelectorAll<SVGElement>(SeriesSelector))
            series.classList.toggle(BackSeriesClass, key !== null && series.getAttribute(SeriesAttribute) !== key);
    }

    /**
     * The bar under the pointer comes forward; every other bar, including ones stacked in its column, goes back. Marked here
     * rather than left to :hover, so a redraw under a still pointer keeps it.
     */
    private onBarHover(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const root = domEvent.target.closest<HTMLElement>(RootSelector);

        if (root !== null)
            markBar(root, domEvent.type === "pointerover" ? domEvent.target.closest(BarSelector) : null);
    }

    /**
     * A press inside a chart: the legend's own press is handled here and never sent; a press on a point raises this package's
     * own event, naming which point and which series.
     */
    private onPress(domEvent: Event): void {
        if (domEvent.defaultPrevented || !(domEvent.target instanceof Element))
            return;

        if (this.onLegendPress(domEvent))
            return;

        // The press that ends a drag is the drag's, not the point's underneath it.
        if (this.dragged) {
            this.dragged = false;
            return;
        }

        const point = domEvent.target.closest<Element>(PointSelector);
        const root = point?.closest<HTMLElement>(RootSelector) ?? null;

        if (point === null || root === null)
            return;

        const series = point.closest<Element>(SeriesSelector)?.getAttribute(SeriesAttribute) ?? "";

        root.dispatchEvent(new CustomEvent(PointClickEvent, {
            bubbles: true,
            detail: { point: point.getAttribute(PointAttribute) ?? "", series }
        }));
    }

    /** A press on a legend entry hides its series, or brings it back; the range then follows what is left. */
    private onLegendPress(domEvent: Event): boolean {
        if (!(domEvent.target instanceof Element))
            return false;

        const button = domEvent.target.closest<HTMLElement>(LegendEntrySelector);
        const root = button?.closest<HTMLElement>(RootSelector) ?? null;
        const key = button?.getAttribute(SeriesAttribute) ?? null;

        if (button === null || root === null || key === null)
            return false;

        const entry = this.charts.get(root);

        if (entry === undefined)
            return false;

        domEvent.preventDefault();

        if (entry.hidden.has(key))
            entry.hidden.delete(key);
        else
            entry.hidden.add(key);

        const hidden = entry.hidden.has(key);

        button.setAttribute("aria-pressed", hidden ? "false" : "true");
        button.classList.toggle(LegendOffClass, hidden);

        this.redraw(root);

        return true;
    }
}

/** The window as the chart's value reads it: the two ends the engine wrote, or none at all. */
export function readChartWindow(element: Element): unknown {
    const text = element.getAttribute(WindowAttribute);

    if (text === null || text.length === 0)
        return null;

    return safeParse(text);
}

/** The two ends of a window as the server sent them, whether as an object or as its text. */
function readWindowValue(value: unknown): Span | null {
    const source = typeof value === "string" && value.length > 0 ? safeParse(value) : value;

    if (source === null || typeof source !== "object")
        return null;

    const from = (source as { from?: unknown }).from;
    const to = (source as { to?: unknown }).to;

    return typeof from === "number" && typeof to === "number" && to > from ? { from, to } : null;
}

function safeParse(text: string): unknown {
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}

/** The column nearest the pointer, which is the x the viewer means whether or not a point of it is under them. */
function nearestColumn(columns: readonly ChartColumn[], at: number): ChartColumn {
    let nearest = columns[0];

    for (const column of columns) {
        if (Math.abs(column.at - at) < Math.abs(nearest.at - at))
            nearest = column;
    }

    return nearest;
}

/**
 * Whether the window now stands at the far end of the data, as of the last draw. A window left there follows a point arriving
 * past it; one moved back stays put, so the viewer can read an older stretch while data keeps growing.
 */
function anchor(entry: ChartEntry): void {
    const whole = entry.frame?.whole ?? null;

    entry.anchored = entry.view === null || whole === null || entry.view.to >= whole.to - (whole.to - whole.from) * 1e-6;
}

/**
 * A window covering the whole of the data is no window at all: widening past the ends returns the chart's own range, so it
 * follows new data as before instead of sliding.
 */
function narrowed(view: Span, whole: Span): Span | null {
    const slack = (whole.to - whole.from) * 1e-6;

    return view.to - view.from >= whole.to - whole.from - slack ? null : view;
}

/** Where a pointer stands across the plot, from none of it to all of it. */
function share(clientX: number, root: HTMLElement, frame: ChartFrame): number {
    const canvas = root.querySelector<SVGSVGElement>(CanvasSelector);

    if (canvas === null || frame.plot.width <= 0)
        return 0.5;

    const box = canvas.getBoundingClientRect();

    return Math.min(Math.max((clientX - box.left - frame.plot.left) / frame.plot.width, 0), 1);
}

function measure(root: HTMLElement): { width: number; height: number } {
    const canvas = root.querySelector<SVGSVGElement>(CanvasSelector);

    if (canvas === null)
        return { width: 0, height: 0 };

    const box = canvas.getBoundingClientRect();

    return { width: Math.round(box.width), height: Math.round(box.height) };
}

/** Marks `bar` as the one being read and takes the mark off every other bar; no bar takes it off them all. */
function markBar(root: HTMLElement, bar: Element | null): void {
    for (const each of root.querySelectorAll<SVGElement>(BarSelector))
        each.classList.toggle(FrontBarClass, each === bar);
}

