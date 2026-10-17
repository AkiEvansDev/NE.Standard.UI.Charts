// A category axis that reads its names as phrase keys: each written in the page's words at every draw, as a caption is, so a
// language switch's redraw follows; a name no word answers, and every name of an axis without the flag, stays as written.

import assert from "node:assert/strict";
import test from "node:test";

import { categoryNames } from "../src/chart-model.ts";
import type { ChartAxis, ChartModel } from "../src/chart-model.ts";
import { ChartClasses } from "../src/chart-names.ts";
import type { ChartRow } from "../src/chart-rows.ts";
import { readNumber } from "./framework-numbers.ts";
import { element, installStubDom, real } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

installStubDom();

const { drawChart } = await import("../src/chart-draw.ts");

type State = Parameters<typeof drawChart>[0];
type Formatting = Parameters<typeof drawChart>[1];

const TooltipAttribute = "data-tooltip";

function axis(kind: ChartAxis["kind"], translate: boolean): ChartAxis {
    return { kind, min: null, max: null, format: null, grid: true, ticks: 5, translate, caption: null };
}

/** The framework's words as a draw asks for them: a point's words as `{series} — {x}: {y}`, an author's text looked up as a plain value. */
function formatting(words: Readonly<Record<string, string>>): Formatting {
    return {
        numbers: { parseInvariant: readNumber, readCulture: () => ({}), format: (value: number) => String(value) },
        temporal: { parse: () => null, readCulture: () => ({}) },
        colors: { count: () => 8, color: () => "red" },
        strings: {
            text: (key: string) => key,
            format: (_key: string, values: Readonly<Record<string, string>>) => `${values.series} — ${values.x}: ${values.y}`,
            resolveText: (text: string) => words[text] ?? text
        },
        names: { tooltip: TooltipAttribute },
        escape: (text: string) => text
    } as unknown as Formatting;
}

/** A bar chart of one series over three names, two of them keys, on a canvas laid out at 400 by 200. */
function chart(translate: boolean): { state: State; canvas: StubElement } {
    const root = element("div", ChartClasses.root);
    const canvas = element("svg", ChartClasses.canvas, {}, root);

    Object.assign(canvas, { getBoundingClientRect: () => ({ width: 400, height: 200 }) });

    const model: ChartModel = {
        kind: "bar",
        x: axis("Category", translate),
        y: axis("Linear", false),
        series: [{ key: "revenue", caption: "Revenue", valuePath: "Revenue", sizePath: null, color: null, stepped: null, smooth: null, markers: null }],
        xPath: "Name",
        seriesPath: null,
        valuePath: null,
        legend: "None",
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
        donut: 0
    };
    const rows: ChartRow[] = ["plan.starter", "plan.pro", "Legacy"].map((name, i) => ({ key: `r${i}`, x: name, values: [(i + 1) * 10], series: null, sizes: [] }));

    return { state: { root: real(root), model, rows, hidden: new Set(), view: null, follow: false, width: 0, height: 0, clip: null }, canvas };
}

function descendants(parent: StubElement): StubElement[] {
    return parent.children.flatMap(child => [child, ...descendants(child)]);
}

function labels(canvas: StubElement): string[] {
    return descendants(canvas).filter(node => node.getAttribute("class") === ChartClasses.label).map(node => node.textContent);
}

function tooltips(canvas: StubElement): string[] {
    return descendants(canvas).map(node => node.getAttribute(TooltipAttribute)).filter(words => words !== null);
}

const English = { "plan.starter": "Starter", "plan.pro": "Pro" };
const Chinese = { "plan.starter": "入门版", "plan.pro": "专业版" };

test("a translating axis's names are translated each on its own, and an axis without the flag leaves them as the rows hold them", () => {
    const translate = (text: string): string => (text === "plan.pro" ? "Pro" : text);

    assert.deepEqual(categoryNames(axis("Category", true), ["plan.pro", "Legacy"], translate), ["Pro", "Legacy"]);
    assert.deepEqual(categoryNames(axis("Category", false), ["plan.pro", "Legacy"], translate), ["plan.pro", "Legacy"]);
});

test("the axis's labels and a bar's tooltip name a place in the page's words, a name no word answers as written", () => {
    const { state, canvas } = chart(true);

    drawChart(state, formatting(English));

    assert.deepEqual(labels(canvas).filter(text => Number.isNaN(Number(text))), ["Starter", "Pro", "Legacy"]);
    assert.deepEqual(tooltips(canvas), ["Revenue — Starter: 10", "Revenue — Pro: 20", "Revenue — Legacy: 30"]);
});

test("a draw after a language switch writes the names in the new words", () => {
    const { state, canvas } = chart(true);

    drawChart(state, formatting(English));
    drawChart(state, formatting(Chinese));

    assert.deepEqual(labels(canvas).filter(text => Number.isNaN(Number(text))), ["入门版", "专业版", "Legacy"]);
    assert.equal(tooltips(canvas)[0], "Revenue — 入门版: 10");
});

test("an axis without the flag writes its names as the rows hold them, keys or not", () => {
    const { state, canvas } = chart(false);

    drawChart(state, formatting(English));

    assert.deepEqual(labels(canvas).filter(text => Number.isNaN(Number(text))), ["plan.starter", "plan.pro", "Legacy"]);
    assert.equal(tooltips(canvas)[0], "Revenue — plan.starter: 10");
});
