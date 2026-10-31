// Stacked bar chart zero omission (#259), translating series names, and hiding empty series from the legend and spoken label (#260).

import assert from "node:assert/strict";
import test from "node:test";

import type { ChartAxis, ChartModel } from "../src/chart-model.ts";
import { ChartAttributes, ChartClasses, ChartVariables, ChartWords } from "../src/chart-names.ts";
import type { ChartRow } from "../src/chart-rows.ts";
import { readNumber } from "./framework-numbers.ts";
import { element, installStubDom, real } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

installStubDom();

const { drawChart } = await import("../src/chart-draw.ts");

type State = Parameters<typeof drawChart>[0];
type Formatting = Parameters<typeof drawChart>[1];

const TooltipAttribute = "data-tooltip";

function axis(kind: ChartAxis["kind"]): ChartAxis {
    return { kind, min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null };
}

function formatting(words: Readonly<Record<string, string>> = {}): Formatting {
    return {
        numbers: { parseInvariant: readNumber, readCulture: () => ({}), format: (value: number) => String(value) },
        temporal: { parse: () => null, readCulture: () => ({}) },
        colors: { count: () => 8, color: (index: number) => `color-${index}` },
        strings: {
            text: (key: string) => (key === ChartWords.chart ? "Chart" : key),
            format: (key: string, values: Readonly<Record<string, string>>) => {
                if (key === ChartWords.list)
                    return `${values.list}, ${values.next}`;

                if (key === ChartWords.reading)
                    return `${values.series}: ${values.value}`;

                return `${values.series} — ${values.x}: ${values.y}`;
            },
            resolveText: (text: string) => words[text] ?? text
        },
        names: {
            tooltip: TooltipAttribute,
            eventBoundary: "data-event-boundary",
            buttonClass: "btn",
            ghostButtonClass: "btn-ghost",
            smallButtonClass: "btn-sm"
        },
        focusReturn: () => null,
        escape: (text: string) => text
    } as unknown as Formatting;
}

function baseModel(overrides: Partial<ChartModel>): ChartModel {
    return {
        kind: "bar",
        x: axis("Category"),
        y: axis("Linear"),
        series: [],
        xPath: "Name",
        seriesPath: null,
        translateSeriesNames: false,
        valuePath: null,
        legend: "Bottom",
        hideEmptySeries: false,
        tooltip: true,
        stepped: false,
        smooth: false,
        markers: false,
        stacked: false,
        sharedTooltip: false,
        zoomable: false,
        followLatest: false,
        orientation: "Vertical",
        bare: false,
        donut: 0,
        legendValues: false,
        remainderCaption: null,
        ...overrides
    };
}

function makeChart(model: ChartModel, rows: ChartRow[]): { state: State; root: StubElement; canvas: StubElement } {
    const root = element("div", ChartClasses.root);
    const area = element("div", ChartClasses.area, {}, root);
    const canvas = element("svg", ChartClasses.canvas, {}, area);

    Object.assign(canvas, { getBoundingClientRect: () => ({ width: 400, height: 200 }) });

    return {
        state: { root: real(root), model, rows, hidden: new Set(), view: null, follow: false, width: 0, height: 0, clip: null },
        root,
        canvas
    };
}

function descendants(parent: StubElement): StubElement[] {
    return parent.children.flatMap(child => [child, ...descendants(child)]);
}

function find(parent: StubElement, name: string): StubElement[] {
    return descendants(parent).filter(node => node.getAttribute("class") === name || node.classList.contains(name));
}

function bars(canvas: StubElement): StubElement[] {
    return find(canvas, ChartClasses.bar);
}

function legendButtons(root: StubElement): StubElement[] {
    return find(root, ChartClasses.legendEntry);
}

test("stacked bar chart skips zero-valued rect bars while unstacked bar chart keeps 1px zero hairlines", () => {
    const series = [
        { key: "open", caption: "Open", valuePath: "Open", sizePath: null, color: null, stepped: null, smooth: null, markers: null },
        { key: "closed", caption: "Closed", valuePath: "Closed", sizePath: null, color: null, stepped: null, smooth: null, markers: null }
    ];
    const rows: ChartRow[] = [
        { key: "r1", x: "Mon", values: [10, 0], series: null, sizes: [] },
        { key: "r2", x: "Tue", values: [0, 20], series: null, sizes: [] },
        { key: "r3", x: "Wed", values: [0, 0], series: null, sizes: [] }
    ];

    const stacked = makeChart(baseModel({ series, stacked: true }), rows);

    drawChart(stacked.state, formatting());

    assert.equal(bars(stacked.canvas).length, 2);
    assert.deepEqual(bars(stacked.canvas).map(bar => bar.getAttribute(TooltipAttribute)), ["Open — Mon: 10", "Closed — Tue: 20"]);

    const unstacked = makeChart(baseModel({ series, stacked: false }), rows);

    drawChart(unstacked.state, formatting());

    assert.equal(bars(unstacked.canvas).length, 6);
});

test("stacked bar chart shared tooltip omits zero series lines and drops all-zero columns while unstacked and area keep them", () => {
    const series = [
        { key: "open", caption: "Open", valuePath: "Open", sizePath: null, color: null, stepped: null, smooth: null, markers: null },
        { key: "closed", caption: "Closed", valuePath: "Closed", sizePath: null, color: null, stepped: null, smooth: null, markers: null }
    ];
    const rows: ChartRow[] = [
        { key: "r1", x: "Mon", values: [10, 0], series: null, sizes: [] },
        { key: "r2", x: "Tue", values: [0, 20], series: null, sizes: [] },
        { key: "r3", x: "Wed", values: [0, 0], series: null, sizes: [] }
    ];

    const stackedBar = makeChart(baseModel({ series, stacked: true, sharedTooltip: true }), rows);
    const barFrame = drawChart(stackedBar.state, formatting());

    assert.ok(barFrame !== null);
    assert.deepEqual(barFrame.columns.map(column => column.text), ["Mon\nOpen: 10", "Tue\nClosed: 20"]);

    const stackedArea = makeChart(baseModel({ kind: "area", series, stacked: true, sharedTooltip: true }), rows);
    const areaFrame = drawChart(stackedArea.state, formatting());

    assert.ok(areaFrame !== null);
    assert.equal(areaFrame.columns.length, 3);
    assert.equal(areaFrame.columns[0].text, "Mon\nOpen: 10\nClosed: 0");
});

test("translateSeriesNames translates data-discovered series captions at every draw while preserving raw series keys", () => {
    const model = baseModel({
        kind: "line",
        seriesPath: "Status",
        translateSeriesNames: true,
        valuePath: "Count"
    });
    const rows: ChartRow[] = [
        { key: "r1", x: "Mon", values: [4], series: "status.open", sizes: [] },
        { key: "r2", x: "Mon", values: [2], series: "Custom", sizes: [] }
    ];
    const { state, root, canvas } = makeChart(model, rows);

    drawChart(state, formatting({ "status.open": "Open tickets" }));

    const buttons = legendButtons(root);

    assert.deepEqual(buttons.map(button => button.getAttribute(ChartAttributes.series)), ["status.open", "Custom"]);
    assert.deepEqual(buttons.map(button => find(button, ChartClasses.legendCaption)[0]?.textContent), ["Open tickets", "Custom"]);
    assert.equal(canvas.getAttribute("aria-label"), "Open tickets, Custom");

    // A redraw after a language switch re-translates dynamically discovered series too.
    drawChart(state, formatting({ "status.open": "Открытые заявки" }));

    assert.equal(find(buttons[0], ChartClasses.legendCaption)[0]?.textContent, "Открытые заявки");
    assert.equal(canvas.getAttribute("aria-label"), "Открытые заявки, Custom");
});

test("hideEmptySeries omits series with no readings from legend and aria-label while preserving colour slots and keeping zero readings", () => {
    const series = [
        { key: "emptyLeading", caption: "Leading", valuePath: "Leading", sizePath: null, color: null, stepped: null, smooth: null, markers: null },
        { key: "active", caption: "Active", valuePath: "Active", sizePath: null, color: null, stepped: null, smooth: null, markers: null },
        { key: "zero", caption: "Zero", valuePath: "Zero", sizePath: null, color: null, stepped: null, smooth: null, markers: null }
    ];
    const rows: ChartRow[] = [
        { key: "r1", x: "Mon", values: [null, 12, null], series: null, sizes: [] }
    ];
    const { state, root, canvas } = makeChart(baseModel({ kind: "line", series, hideEmptySeries: true }), rows);

    drawChart(state, formatting());

    let buttons = legendButtons(root);

    assert.deepEqual(buttons.map(button => button.getAttribute(ChartAttributes.series)), ["active"]);
    assert.equal(buttons[0].style.getPropertyValue(ChartVariables.seriesColor), "color-1");
    assert.equal(canvas.getAttribute("aria-label"), "Active");

    // A reading of zero is a placed point, not an empty series.
    state.rows.push({ key: "r2", x: "Tue", values: [null, 14, 0], series: null, sizes: [] });
    drawChart(state, formatting());

    buttons = legendButtons(root);
    assert.deepEqual(buttons.map(button => button.getAttribute(ChartAttributes.series)), ["active", "zero"]);
    assert.equal(buttons[1].style.getPropertyValue(ChartVariables.seriesColor), "color-2");
    assert.equal(canvas.getAttribute("aria-label"), "Active, Zero");

    // When all series have no readings, the legend leaves the DOM and the canvas speaks the chart's fallback word.
    state.rows.length = 0;
    drawChart(state, formatting());

    assert.equal(legendButtons(root).length, 0);
    assert.equal(find(root, ChartClasses.legend).length, 0);
    assert.equal(canvas.getAttribute("aria-label"), "Chart");
});
