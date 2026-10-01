// The legend kept in step with the data by key, so what the pointer and the keyboard hold on an entry outlives a redraw.

import type { DomNames, Popups } from "ne-standard-ui";
import type { ChartModel } from "./chart-model.ts";
import { ChartAttributes, ChartClasses, ChartVariables, ClientNames, CoreNames } from "./chart-names.ts";

/** The least a plot keeps beside a start or end legend: with less, the legend stands under it as a bottom one does (a phone's width). */
const SidePlotFloor = 256;

/** One entry of the legend: the key it hides and shows by, what it says, and the colour its mark takes. */
export type LegendEntry = {
    readonly key: string;
    readonly caption: string;
    readonly color: string;
};

/**
 * The chart's legend in step with `entries`, by key. An entry that stays keeps its button, written again in place, so a press, a
 * hover or the keyboard on it is never lost to a redraw; one the viewer put aside stays aside. The keyboard on an entry that went
 * moves to the entry now standing in its place, and where the whole legend went to the chart by the framework's return — never to the
 * page's body.
 */
export function syncLegend(root: HTMLElement, entries: readonly LegendEntry[], hidden: ReadonlySet<string>, names: DomNames, focusReturn: Popups["focusReturn"]): void {
    let legend = legendOf(root);
    const buttons = legend === null ? [] : [...legend.children];
    const held = buttons.find(button => button === document.activeElement) ?? null;

    if (entries.length === 0) {
        legend?.remove();

        if (held !== null)
            focusReturn(root)?.focus({ preventScroll: true });

        return;
    }

    if (legend === null) {
        legend = document.createElement("div");
        legend.className = ChartClasses.legend;
        legend.setAttribute(names.eventBoundary, "");
        root.append(legend);
    }

    const kept = keepButtons(buttons, entries);
    let next = legend.firstElementChild;

    for (const entry of entries) {
        const button = kept.get(entry.key);
        const off = hidden.has(entry.key);

        // A key the entries name twice gets a button of its own the second time.
        kept.delete(entry.key);

        if (button === undefined) {
            legend.insertBefore(legendButton(entry, off, names), next);
            continue;
        }

        writeLegendButton(button, entry, off);

        if (button === next)
            next = button.nextElementSibling;
        else
            legend.insertBefore(button, next);
    }

    if (held === null || held === document.activeElement)
        return;

    // The entry held went — or a reorder moved it, which drops the focus as a removal does.
    const target = held.isConnected ? held : legend.children[Math.min(buttons.indexOf(held), legend.children.length - 1)];

    if (target instanceof HTMLElement)
        target.focus({ preventScroll: true });
}

/** The chart's own legend, never one of a chart drawn inside it. */
function legendOf(root: HTMLElement): Element | null {
    for (const child of root.children) {
        if (child.classList.contains(ChartClasses.legend))
            return child;
    }

    return null;
}

/** The buttons that stay, by key — the first of each key the entries still name; every other one leaves the legend. */
function keepButtons(buttons: readonly Element[], entries: readonly LegendEntry[]): Map<string, Element> {
    const wanted = new Set(entries.map(entry => entry.key));
    const kept = new Map<string, Element>();

    for (const button of buttons) {
        const key = button.getAttribute(ChartAttributes.series);

        if (key !== null && wanted.has(key) && !kept.has(key))
            kept.set(key, button);
        else
            button.remove();
    }

    return kept;
}

/** One entry as the server writes it: a small ghost button, pressed until the viewer puts its series aside. */
function legendButton(entry: LegendEntry, hidden: boolean, names: DomNames): HTMLButtonElement {
    const button = document.createElement("button");
    const mark = document.createElement("span");
    const caption = document.createElement("span");

    button.className = `${ChartClasses.legendEntry} ${names.buttonClass} ${CoreNames.ghostButtonClass} ${CoreNames.smallButtonClass}`;
    button.type = "button";
    button.setAttribute(ChartAttributes.series, entry.key);
    button.setAttribute("aria-pressed", hidden ? "false" : "true");
    button.classList.toggle(ClientNames.legendOff, hidden);
    button.style.setProperty(ChartVariables.seriesColor, entry.color);
    mark.className = ChartClasses.legendMark;
    caption.className = ChartClasses.legendCaption;
    caption.textContent = entry.caption;
    button.append(mark, caption);

    return button;
}

/** Writes an entry into the button that already names its key: its words, its colour and whether it is put aside, each where it differs. */
function writeLegendButton(button: Element, entry: LegendEntry, hidden: boolean): void {
    const caption = button.querySelector(`.${ChartClasses.legendCaption}`);
    const pressed = hidden ? "false" : "true";

    if (caption !== null && caption.textContent !== entry.caption)
        caption.textContent = entry.caption;

    if (button instanceof HTMLElement && button.style.getPropertyValue(ChartVariables.seriesColor) !== entry.color)
        button.style.setProperty(ChartVariables.seriesColor, entry.color);

    if (button.getAttribute("aria-pressed") !== pressed)
        button.setAttribute("aria-pressed", pressed);

    if (button.classList.contains(ClientNames.legendOff) !== hidden)
        button.classList.toggle(ClientNames.legendOff, hidden);
}

/**
 * A start or end legend beside the plot while the chart has room for both, under it (`ui-chart--legend-under`) where it has not.
 * Its width is its widest entry's, which reads the same beside the plot and under it, so the choice never flips on its own redraw.
 */
export function placeSideLegend(root: HTMLElement, placement: ChartModel["legend"]): void {
    const legend = legendOf(root);
    const width = root.clientWidth;

    // A chart with no box yet (hidden) decides once it has one.
    if (width === 0)
        return;

    let under = false;

    if (legend !== null && (placement === "Start" || placement === "End")) {
        const style = getComputedStyle(legend);
        const widest = Math.max(0, ...[...legend.children].map(entry => entry instanceof HTMLElement ? entry.offsetWidth : 0));
        const legendWidth = widest + (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);

        under = legendFallsUnder(width, legendWidth, Number.parseFloat(getComputedStyle(root).columnGap) || 0);
    }

    if (root.classList.contains(ClientNames.legendUnder) !== under)
        root.classList.toggle(ClientNames.legendUnder, under);
}

/** Whether a side legend falls under the plot: the chart's width less the legend's and the gap between them leaves the plot too narrow. */
export function legendFallsUnder(chartWidth: number, legendWidth: number, gap: number): boolean {
    return chartWidth - legendWidth - gap < SidePlotFloor;
}
