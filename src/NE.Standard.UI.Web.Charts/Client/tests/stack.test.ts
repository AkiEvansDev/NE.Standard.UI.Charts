import assert from "node:assert/strict";
import test from "node:test";

import { bandWidth, barOf, barSlots } from "../src/chart-bars.ts";
import type { ChartAxis, ChartSeries } from "../src/chart-model.ts";
import { areaPath } from "../src/chart-path.ts";
import type { ChartPoint } from "../src/chart-path.ts";
import type { ChartSeriesData } from "../src/chart-rows.ts";
import { stackSeries, valueAt } from "../src/chart-stack.ts";
import { resolveRange } from "../src/chart-ticks.ts";

const plot = { left: 0, top: 0, width: 100, height: 100 };
const scale = { min: 0, max: 10, logarithmic: false };

function axis(values: Partial<ChartAxis>): ChartAxis {
    return { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption: null, ...values };
}

function seriesData(key: string, points: ChartPoint[], index: number): ChartSeriesData {
    const series: ChartSeries = { key, caption: key, valuePath: null, sizePath: null, color: null, stepped: null, smooth: null, markers: null };

    return { series, index, points, drawn: points };
}

function point(x: number, y: number | null): ChartPoint {
    return { key: `p${x}`, x, y };
}

test("a stack draws every series from the running total at its x, and its own points stay for the tooltip", () => {
    const first = seriesData("a", [point(0, 1), point(5, 2)], 0);
    const second = seriesData("b", [point(0, 3), point(5, 4)], 1);

    stackSeries([first, second]);

    assert.deepEqual(first.drawn, [{ key: "p0", x: 0, y: 1 }, { key: "p5", x: 5, y: 2 }]);
    assert.deepEqual(second.drawn, [{ key: "p0", x: 0, y: 4 }, { key: "p5", x: 5, y: 6 }]);
    assert.deepEqual(second.points, [{ key: "p0", x: 0, y: 3 }, { key: "p5", x: 5, y: 4 }]);
});

test("a point the row had no value for adds nothing to the stack and stays missing", () => {
    const first = seriesData("a", [point(0, 1), point(5, null)], 0);
    const second = seriesData("b", [point(0, 2), point(5, 2)], 1);

    stackSeries([first, second]);

    assert.deepEqual(first.drawn, [{ key: "p0", x: 0, y: 1 }, { key: "p5", x: 5, y: null }]);
    assert.deepEqual(second.drawn, [{ key: "p0", x: 0, y: 3 }, { key: "p5", x: 5, y: 2 }]);
});

test("what the series below holds at an x is zero where it holds nothing", () => {
    assert.equal(valueAt([point(0, 4), point(5, 6)], 5), 6);
    assert.equal(valueAt([point(0, 4)], 5), 0);
    assert.equal(valueAt([point(5, null)], 5), 0);
});

test("a range a bar stands in reaches zero, unless the author fixed that end", () => {
    assert.deepEqual(resolveRange(axis({}), 12, 47, 0, true), { min: 0, max: 50, logarithmic: false });
    assert.deepEqual(resolveRange(axis({ min: 10 }), 12, 47, 0, true), { min: 10, max: 50, logarithmic: false });
    assert.deepEqual(resolveRange(axis({}), -8, -2, 0, true), { min: -8, max: 0, logarithmic: false });
});

test("a band is a share of the plot, and a bar its own place in the band", () => {
    assert.equal(bandWidth(plot.width, 4), 25);
    assert.equal(barSlots([[point(0, 1), point(5, 1)], [point(0, 2), point(9, 2)]]), 3);

    assert.deepEqual(barOf(50, 25, 0, 2, false), { start: 41, thickness: 9 });
    assert.deepEqual(barOf(50, 25, 1, 2, false), { start: 50, thickness: 9 });
    assert.deepEqual(barOf(50, 25, 1, 2, true), { start: 41, thickness: 18 });
});

test("an area closes on the axis's zero, and on the series below it in a stack", () => {
    const points = [point(0, 0), point(5, 5), point(10, 10)];
    const baseline = [point(0, 2), point(5, 2), point(10, 2)];

    assert.equal(areaPath(points, null, scale, scale, plot, false, false), "M0 100 L50 50 L100 0 L100 100 L0 100 Z");
    assert.equal(areaPath(points, baseline, scale, scale, plot, false, false), "M0 100 L50 50 L100 0 L100 80 L50 80 L0 80 Z");
});

test("an area breaks where its line does, and each stretch closes on its own", () => {
    const points = [point(0, 0), point(2, 2), point(4, null), point(6, 6), point(8, 8)];

    assert.equal(
        areaPath(points, null, scale, scale, plot, false, false),
        "M0 100 L20 80 L20 100 L0 100 Z M60 40 L80 20 L80 100 L60 100 Z"
    );
    assert.equal(areaPath([], null, scale, scale, plot, false, false), "");
});
