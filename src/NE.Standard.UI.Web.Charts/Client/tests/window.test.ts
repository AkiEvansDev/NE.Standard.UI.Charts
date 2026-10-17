import assert from "node:assert/strict";
import test from "node:test";

import type { ChartModel } from "../src/chart-model.ts";
import { ChartClasses } from "../src/chart-names.ts";
import type { ChartPoint } from "../src/chart-path.ts";
import type { ChartRow } from "../src/chart-rows.ts";
import { resolveRange } from "../src/chart-ticks.ts";
import { clampWindow, followWindow, panWindow, windowExtent, zoomWindow } from "../src/chart-window.ts";
import { readNumber } from "./framework-numbers.ts";
import { element, installStubDom, real } from "./stub-dom.ts";

installStubDom();

const { drawChart } = await import("../src/chart-draw.ts");

type State = Parameters<typeof drawChart>[0];
type Formatting = Parameters<typeof drawChart>[1];

function point(key: string, x: number, y: number | null): ChartPoint {
    return { key, x, y, size: null };
}

test("a window is no wider than the whole and no narrower than a fraction of it", () => {
    assert.deepEqual(clampWindow({ from: -20, to: 200 }, 0, 100), { from: 0, to: 100 });
    // A window with no width is no window: it falls back to the whole rather than to a singularity.
    assert.deepEqual(clampWindow({ from: 50, to: 50 }, 0, 100), { from: 0, to: 100 });
    assert.deepEqual(clampWindow({ from: 10, to: 10.05 }, 0, 100), { from: 10, to: 10.2 });
});

test("a window pushed past an end is slid back rather than stretched", () => {
    assert.deepEqual(clampWindow({ from: 90, to: 130 }, 0, 100), { from: 60, to: 100 });
    assert.deepEqual(clampWindow({ from: -30, to: 10 }, 0, 100), { from: 0, to: 40 });
});

test("a wheel zooms about the value under the pointer, which stays where it was", () => {
    const narrowed = zoomWindow({ from: 0, to: 100 }, 25, 0.5, 0, 100);

    assert.deepEqual(narrowed, { from: 12.5, to: 62.5 });
    // The value under the pointer sits at the same share of the narrower window.
    assert.equal((25 - narrowed.from) / (narrowed.to - narrowed.from), 0.25);
    assert.deepEqual(zoomWindow(narrowed, 25, 2, 0, 100), { from: 0, to: 100 });
});

test("a drag moves the window along, and following keeps it on the far end", () => {
    assert.deepEqual(panWindow({ from: 20, to: 40 }, 10, 0, 100), { from: 30, to: 50 });
    assert.deepEqual(panWindow({ from: 20, to: 40 }, -40, 0, 100), { from: 0, to: 20 });
    assert.deepEqual(followWindow({ from: 20, to: 40 }, 0, 120), { from: 100, to: 120 });
});

test("the extent inside a window takes in the point either side of it", () => {
    const points = [point("a", 0, 10), point("b", 10, 50), point("c", 20, 90), point("d", 30, 20)];

    assert.deepEqual(windowExtent([points], null), { min: 10, max: 90 });
    assert.deepEqual(windowExtent([points], { from: 9, to: 11 }), { min: 10, max: 90 });
    assert.deepEqual(windowExtent([points], { from: 29, to: 31 }), { min: 20, max: 90 });
});

test("a row with no value counts for nothing in the extent", () => {
    assert.deepEqual(windowExtent([[point("a", 0, null), point("b", 1, 5)]], null), { min: 5, max: 5 });
});

test("following keeps the width it was given past a whole narrower than it, and the data growing into it has it back", () => {
    const hour = 3_600_000;
    const kept = followWindow({ from: 0, to: hour }, 0, 1_000);

    assert.deepEqual(kept, { from: 1_000 - hour, to: 1_000 });
    // What a draw shows of it is the whole, until the data reaches the width.
    assert.deepEqual(clampWindow(kept, 0, 1_000), { from: 0, to: 1_000 });
    assert.deepEqual(followWindow(kept, 0, 2 * hour), { from: hour, to: 2 * hour });
});

const Hour = 3_600_000;
const Now = Date.UTC(2026, 9, 15, 12);

/** A live chart of one series over a clock, following its newest point, as far as a draw reads it before it measures the canvas. */
function followingChart(rows: ChartRow[]): State {
    const root = element("div", ChartClasses.root);
    const canvas = element("svg", ChartClasses.canvas, {}, root);

    // A canvas the page has not laid out yet: the draw settles the window, then keeps the server's frame.
    Object.assign(canvas, { getBoundingClientRect: () => ({ width: 0, height: 0 }) });

    const axis = { min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null };
    const model: ChartModel = {
        kind: "line",
        x: { kind: "Time", ...axis },
        y: { kind: "Linear", ...axis },
        series: [{ key: "value", caption: "value", valuePath: "Value", sizePath: null, color: null, stepped: null, smooth: null, markers: null }],
        xPath: "Time",
        seriesPath: null,
        valuePath: null,
        legend: "None",
        tooltip: true,
        stepped: false,
        smooth: false,
        markers: true,
        stacked: false,
        sharedTooltip: false,
        zoomable: true,
        followLatest: true,
        horizontal: false,
        bare: false,
        donut: 0
    };

    return { root: real(root), model, rows, hidden: new Set(), view: { from: Now - Hour, to: Now }, follow: true, width: 0, height: 0, clip: null };
}

const formatting = {
    numbers: { parseInvariant: readNumber, readCulture: () => ({}) },
    temporal: { parse: () => null, readCulture: () => ({}) },
    colors: { count: () => 8, color: () => "red" },
    strings: { text: (key: string) => key, format: (key: string) => key }
} as unknown as Formatting;

test("a point's arrival over no data leaves the window where it stood, not on the empty chart's stand-in second in 1970", () => {
    const state = followingChart([]);

    drawChart(state, formatting);

    assert.deepEqual(state.view, { from: Now - Hour, to: Now });
    assert.equal(state.follow, false);
});

test("a window followed over less data than it covers keeps its width, ending at the newest point rather than the axis's rounded end", () => {
    const rows = Array.from({ length: 11 }, (_, i) => ({ key: `r${i}`, x: String(Now - 9 * 60_000 + i * 60_000 + 7_000), values: [i], series: null, sizes: [] }));
    const state = followingChart(rows);
    const newest = Now + 60_000 + 7_000;

    drawChart(state, formatting);

    assert.ok(resolveRange(state.model.x, Now - 9 * 60_000 + 7_000, newest, 0).max > newest);
    assert.deepEqual(state.view, { from: newest - Hour, to: newest });
});

test("a change that brought no point past a followed window leaves it where it stood, short of the axis's rounded end", () => {
    const rows = Array.from({ length: 11 }, (_, i) => ({ key: `r${i}`, x: String(Now - 10 * 60_000 + i * 60_000 - 37_000), values: [i], series: null, sizes: [] }));
    const state = followingChart(rows);
    const view = { from: Now - Hour - 30_000, to: Now - 30_000 };

    state.view = view;
    drawChart(state, formatting);

    assert.ok(resolveRange(state.model.x, Now - 10 * 60_000 - 37_000, Now - 37_000, 0).max > view.to);
    assert.deepEqual(state.view, view);
    assert.equal(state.follow, false);
});
