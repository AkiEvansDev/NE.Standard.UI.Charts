// What a draw hands the engine: the canvas it drew on and the line a shared tooltip is read against, so a pointer's every move over
// the plot reads them off the frame rather than searching the chart for them.

import assert from "node:assert/strict";
import test from "node:test";

import type { ChartModel } from "../src/chart-model.ts";
import { ChartClasses, ClientNames } from "../src/chart-names.ts";
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
    strings: { text: (key: string) => key, format: (key: string) => key },
    names: { tooltip: "data-tooltip" },
    escape: (text: string) => text
} as unknown as Formatting;

/** A line chart of one series on a canvas laid out at 400 by 200, sharing one tooltip across the plot or not. */
function chart(sharedTooltip: boolean): { state: State; canvas: StubElement } {
    const root = element("div", ChartClasses.root);
    const canvas = element("svg", ChartClasses.canvas, {}, root);

    Object.assign(canvas, { getBoundingClientRect: () => ({ width: 400, height: 200 }) });

    const axis = { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null } as const;
    const model: ChartModel = {
        kind: "line",
        x: axis,
        y: axis,
        series: [{ key: "value", caption: "value", valuePath: "Value", sizePath: null, color: null, stepped: null, smooth: null, markers: null }],
        xPath: "Time",
        seriesPath: null,
        valuePath: null,
        legend: "None",
        tooltip: true,
        stepped: false,
        smooth: false,
        markers: false,
        stacked: false,
        sharedTooltip,
        zoomable: false,
        followLatest: false,
        horizontal: false,
        bare: false,
        donut: 0
    };
    const rows: ChartRow[] = [1, 2, 3].map(x => ({ key: `r${x}`, x: String(x), values: [x * 10], series: null, sizes: [] }));

    return { state: { root: real(root), model, rows, hidden: new Set(), view: null, follow: false, width: 0, height: 0, clip: null }, canvas };
}

test("a frame carries the canvas it was drawn on and the line its shared tooltip is read against", () => {
    const { state, canvas } = chart(true);
    const frame = drawChart(state, formatting);

    assert.ok(frame !== null);
    assert.equal(frame.canvas, canvas);
    assert.ok(frame.rule !== null);
    assert.equal(frame.rule, canvas.children.find(child => child.getAttribute("class") === ClientNames.rule));
});

test("a chart that names its points one at a time draws no such line, and its frame holds none", () => {
    const { state } = chart(false);
    const frame = drawChart(state, formatting);

    assert.ok(frame !== null);
    assert.equal(frame.rule, null);
});
