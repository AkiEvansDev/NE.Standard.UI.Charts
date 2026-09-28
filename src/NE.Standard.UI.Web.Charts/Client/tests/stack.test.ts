import assert from "node:assert/strict";
import test from "node:test";

import { bandWidth, barOf, barSlots } from "../src/chart-bars.ts";
import type { ChartAxis, ChartSeries } from "../src/chart-model.ts";
import { areaPath } from "../src/chart-path.ts";
import type { ChartPoint } from "../src/chart-path.ts";
import type { ChartSeriesData } from "../src/chart-rows.ts";
import { stackSeries } from "../src/chart-stack.ts";
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

function point(x: number, y: number | null, base?: number): ChartPoint {
    return base === undefined ? { key: `p${x}`, x, y } : { key: `p${x}`, x, y, base };
}

test("a stack draws every series from the running total at its x, and its own points stay for the tooltip", () => {
    const first = seriesData("a", [point(0, 1), point(5, 2)], 0);
    const second = seriesData("b", [point(0, 3), point(5, 4)], 1);

    stackSeries([first, second]);

    assert.deepEqual(first.drawn, [point(0, 1, 0), point(5, 2, 0)]);
    assert.deepEqual(second.drawn, [point(0, 4, 1), point(5, 6, 2)]);
    assert.deepEqual(second.points, [point(0, 3), point(5, 4)]);
});

test("a point the row had no value for adds nothing to the stack and stays missing", () => {
    const first = seriesData("a", [point(0, 1), point(5, null)], 0);
    const second = seriesData("b", [point(0, 2), point(5, 2)], 1);

    stackSeries([first, second]);

    assert.deepEqual(first.drawn, [point(0, 1, 0), point(5, null)]);
    assert.deepEqual(second.drawn, [point(0, 3, 1), point(5, 2, 0)]);
});

test("a series with nothing at an x leaves the one above it on the total under it, not on zero", () => {
    const first = seriesData("a", [point(0, 5)], 0);
    const second = seriesData("b", [point(0, null)], 1);
    const third = seriesData("c", [point(0, 3)], 2);

    stackSeries([first, second, third]);

    assert.deepEqual(third.drawn, [point(0, 8, 5)]);
});

test("values below zero stack apart from those above it, so neither side is drawn over the other", () => {
    const first = seriesData("a", [point(0, -3)], 0);
    const second = seriesData("b", [point(0, 5)], 1);
    const third = seriesData("c", [point(0, -2)], 2);

    stackSeries([first, second, third]);

    assert.deepEqual(first.drawn, [point(0, -3, 0)]);
    assert.deepEqual(second.drawn, [point(0, 5, 0)]);
    assert.deepEqual(third.drawn, [point(0, -5, -3)]);
});

test("a range a bar stands in reaches zero, unless the author fixed that end", () => {
    assert.deepEqual(resolveRange(axis({}), 12, 47, 0, true), { min: 0, max: 50, logarithmic: false });
    assert.deepEqual(resolveRange(axis({ min: 10 }), 12, 47, 0, true), { min: 10, max: 50, logarithmic: false });
    assert.deepEqual(resolveRange(axis({}), -8, -2, 0, true), { min: -8, max: 0, logarithmic: false });
});

test("a band is a share of the plot, and a bar its own place in the band", () => {
    assert.equal(bandWidth(plot.width, 4), 25);
    assert.equal(barSlots([[point(0, 1), point(5, 1)], [point(0, 2), point(9, 2)]], scale), 3);

    assert.deepEqual(barOf(50, 25, 0, 2, false), { start: 41, thickness: 9 });
    assert.deepEqual(barOf(50, 25, 1, 2, false), { start: 50, thickness: 9 });
    assert.deepEqual(barOf(50, 25, 1, 2, true), { start: 41, thickness: 18 });
});

test("an area closes on the axis's zero, and on its points' own bases in a stack", () => {
    const points = [point(0, 0), point(5, 5), point(10, 10)];
    const stacked = [point(0, 0, 2), point(5, 5, 2), point(10, 10, 2)];

    assert.equal(areaPath(points, scale, scale, plot, false, false), "M0 100 L50 50 L100 0 L100 100 L0 100 Z");
    assert.equal(areaPath(stacked, scale, scale, plot, false, false), "M0 100 L50 50 L100 0 L100 80 L50 80 L0 80 Z");
});

test("an area breaks where its line does, and each stretch closes on its own", () => {
    const points = [point(0, 0), point(2, 2), point(4, null), point(6, 6), point(8, 8)];

    assert.equal(
        areaPath(points, scale, scale, plot, false, false),
        "M0 100 L20 80 L20 100 L0 100 Z M60 40 L80 20 L80 100 L60 100 Z"
    );
    assert.equal(areaPath([], scale, scale, plot, false, false), "");
});

test("a series the legend put aside is out of the stack: the one above it stands on the series drawn under it, not on its raw values", () => {
    const first = seriesData("a", [point(0, 1), point(5, 2)], 0);
    const hidden = seriesData("b", [point(0, 10), point(5, 20)], 1);
    const third = seriesData("c", [point(0, 3), point(5, 4)], 2);
    const drawn = [first, third];

    stackSeries(drawn);

    assert.deepEqual(third.drawn.map(each => each.base), [1, 2]);
    assert.deepEqual(third.drawn.map(each => each.y), [4, 6]);
    assert.deepEqual(hidden.drawn.map(each => each.y), [10, 20]);
});

test("bars share the band among the series drawn, so one put aside leaves no empty place in it", () => {
    const drawn = [[point(0, 1), point(1, 2)], [point(0, 3), point(1, 4)]];
    const band = bandWidth(100, barSlots(drawn, scale));

    assert.equal(band, 50);
    assert.deepEqual(barOf(25, band, 1, drawn.length, false), { start: 25, thickness: 18 });
});

test("a window zoomed in shares the band among the places it shows, so the bars it keeps widen", () => {
    const drawn = [[point(0, 1), point(1, 2), point(2, 3), point(3, 4)]];

    assert.equal(barSlots(drawn, { min: -0.5, max: 3.5, logarithmic: false }), 4);
    assert.equal(barSlots(drawn, { min: 0.5, max: 2.5, logarithmic: false }), 2);
});
