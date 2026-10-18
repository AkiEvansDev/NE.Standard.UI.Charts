// A share bar as the browser draws it: its parts one after another on whole pixels, a pixel apart, what they leave of the total as
// the empty track, and a legend that is a table of each part's value and share with the rest as its last row — a part the legend
// put aside taking none of the bar and none of the whole.

import assert from "node:assert/strict";
import test from "node:test";

import type { ChartModel } from "../src/chart-model.ts";
import { ChartAttributes, ChartClasses } from "../src/chart-names.ts";
import type { ChartRow } from "../src/chart-rows.ts";
import { readNumber } from "./framework-numbers.ts";
import { element, installStubDom, real } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

installStubDom();

const { drawChart } = await import("../src/chart-draw.ts");

type State = Parameters<typeof drawChart>[0];
type Formatting = Parameters<typeof drawChart>[1];

const formatting = {
    numbers: { parseInvariant: readNumber, readCulture: () => ({}), format: (value: number) => String(value) },
    temporal: { parse: () => null, readCulture: () => ({}) },
    colors: { count: () => 8, color: () => "red" },
    strings: { text: (key: string) => key, format: (key: string) => key, resolveText: (text: string) => text },
    names: { tooltip: "data-tooltip", eventBoundary: "data-boundary", buttonClass: "ui-button", ghostButtonClass: "ui-button--ghost", smallButtonClass: "ui-button--small" },
    focusReturn: () => null,
    escape: (text: string) => text
} as unknown as Formatting;

/** A share bar of 3 and 1 on a canvas laid out at 400 by 8, its total `total`, its legend a table under it. */
function bar(total: number | null): { state: State; root: StubElement; canvas: StubElement } {
    const root = element("div", ChartClasses.root);
    const canvas = element("svg", ChartClasses.canvas, {}, root);

    Object.assign(canvas, { getBoundingClientRect: () => ({ width: 400, height: 8 }) });

    if (total !== null)
        root.setAttribute(ChartAttributes.total, String(total));

    const x = { kind: "Category", min: null, max: null, format: null, grid: false, ticks: 5, translate: false, caption: null } as const;
    const y = { kind: "Linear", min: null, max: null, format: "N0", grid: false, ticks: 5, translate: false, caption: null } as const;
    const model: ChartModel = {
        kind: "share",
        x,
        y,
        series: [{ key: "west", caption: "West", valuePath: "Value", sizePath: null, color: null, stepped: null, smooth: null, markers: null }],
        xPath: "Name",
        seriesPath: null,
        valuePath: null,
        legend: "Bottom",
        tooltip: true,
        stepped: false,
        smooth: false,
        markers: false,
        stacked: false,
        sharedTooltip: false,
        zoomable: false,
        followLatest: false,
        horizontal: false,
        bare: false,
        donut: 0,
        legendValues: true,
        remainderCaption: null
    };
    const rows: ChartRow[] = [
        { key: "north", x: "North", values: [3], series: null, sizes: [] },
        { key: "south", x: "South", values: [1], series: null, sizes: [] }
    ];

    return { state: { root: real(root), model, rows, hidden: new Set(), view: null, follow: false, width: 0, height: 0, clip: null }, root, canvas };
}

/** Every element under `parent` of class `name`, in the order they stand: an SVG one's by its attribute, an HTML one's by its list. */
function find(parent: StubElement, name: string): StubElement[] {
    const found: StubElement[] = [];

    for (const child of parent.children) {
        if (child.getAttribute("class") === name || child.classList.contains(name))
            found.push(child);

        found.push(...find(child, name));
    }

    return found;
}

/** A drawn piece of the bar as where it starts and how wide it is. */
function span(piece: StubElement): [string | null, string | null] {
    return [piece.getAttribute("x"), piece.getAttribute("width")];
}

/** A legend row's words after its mark: its name, its value and its share. */
function words(row: StubElement): (string | null)[] {
    return row.children.slice(1).map(child => child.textContent);
}

test("a share bar's parts stand one after another a pixel apart, and what they leave of the total is the track", () => {
    const { state, canvas } = bar(8);

    drawChart(state, formatting);

    assert.deepEqual(find(canvas, ChartClasses.segment).map(span), [["0", "149"], ["150", "49"]]);
    assert.deepEqual(find(canvas, ChartClasses.rest).map(span), [["200", "200"]]);
    assert.equal(find(canvas, ChartClasses.segment)[0].getAttribute(ChartAttributes.point), "north");
    assert.equal(find(canvas, ChartClasses.segment)[0].getAttribute(ChartAttributes.series), "west");
});

test("with no total the parts fill the bar, the last reaching its end, and nothing is left", () => {
    const { state, canvas } = bar(null);

    drawChart(state, formatting);

    assert.deepEqual(find(canvas, ChartClasses.segment).map(span), [["0", "299"], ["300", "100"]]);
    assert.deepEqual(find(canvas, ChartClasses.rest), []);
});

test("a table legend writes each part's value and share, and the rest as its last row, no button", () => {
    const { state, root } = bar(8);

    drawChart(state, formatting);

    const legend = find(root, ChartClasses.legend)[0];
    const rows = legend.children;

    assert.equal(rows.length, 3);
    assert.deepEqual(words(rows[0]), ["North", "3", "0.375"]);
    assert.deepEqual(words(rows[1]), ["South", "1", "0.125"]);
    assert.ok(rows[2].classList.contains(ChartClasses.legendRest));
    assert.deepEqual(words(rows[2]), ["ui.chart.rest", "4", "0.5"]);
});

test("a part put aside takes none of the bar and none of the whole: the rest grows, and it keeps its value but no share", () => {
    const { state, root, canvas } = bar(8);

    drawChart(state, formatting);

    const before = find(root, ChartClasses.legend)[0].children;

    state.hidden.add("north");
    drawChart(state, formatting);

    const after = find(root, ChartClasses.legend)[0].children;

    assert.deepEqual(find(canvas, ChartClasses.segment).map(span), [["0", "49"]]);
    assert.deepEqual(find(canvas, ChartClasses.rest).map(span), [["50", "350"]]);
    assert.equal(after[0], before[0]);
    assert.equal(after[2], before[2]);
    assert.deepEqual(words(after[0]), ["North", "3"]);
    assert.deepEqual(words(after[2]), ["ui.chart.rest", "7", "0.875"]);
});

test("the rest leaves the legend once the parts reach the total, and the buttons stay", () => {
    const { state, root } = bar(8);

    drawChart(state, formatting);

    const before = find(root, ChartClasses.legend)[0].children;

    root.setAttribute(ChartAttributes.total, "2");
    drawChart(state, formatting);

    const after = find(root, ChartClasses.legend)[0].children;

    assert.deepEqual(after, before.slice(0, 2));
    assert.deepEqual(words(after[0]), ["North", "3", "0.75"]);
});
