import assert from "node:assert/strict";
import test from "node:test";

import { PlainRadius, bubbleRadius, pointReach } from "../src/chart-bubbles.ts";
import type { ChartModel, ChartSeries } from "../src/chart-model.ts";
import { buildData, rowFromItem } from "../src/chart-rows.ts";
import type { ChartRow } from "../src/chart-rows.ts";

function series(key: string, valuePath: string | null, sizePath: string | null): ChartSeries {
    return { key, caption: key, valuePath, sizePath, color: null, stepped: null, smooth: null, markers: null };
}

function model(values: Partial<ChartModel>): ChartModel {
    return {
        kind: "scatter",
        x: { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption: null },
        y: { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption: null },
        series: [],
        xPath: "Income",
        seriesPath: null,
        valuePath: null,
        legend: "None",
        tooltip: true,
        stepped: false,
        smooth: false,
        markers: true,
        stacked: false,
        sharedTooltip: false,
        zoomable: false,
        followLatest: false,
        horizontal: false,
        bare: false,
        donut: 0,
        ...values
    };
}

test("a point with no third value is drawn at the plain radius, and one in a run of equal values in the middle", () => {
    assert.equal(bubbleRadius(null, 0, 100), PlainRadius);
    assert.equal(bubbleRadius(undefined, 0, 100), PlainRadius);
    assert.equal(bubbleRadius(5, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), PlainRadius);
    assert.equal(bubbleRadius(5, 5, 5), 10.5);
});

test("a sized point takes its share of the run by area, so twice the value is twice the ink", () => {
    assert.equal(bubbleRadius(0, 0, 100), 3);
    assert.equal(bubbleRadius(100, 0, 100), 18);
    assert.equal(Math.round(bubbleRadius(50, 0, 100) * 100) / 100, 12.9);
    assert.equal(bubbleRadius(-20, 0, 100), 3);
    assert.equal(bubbleRadius(200, 0, 100), 18);
});

test("a row carries a third value per series where the series names one, and the run of them is the data's", () => {
    const sized = model({ series: [series("cities", "Life", "People")] });
    const row = rowFromItem({ income: 42_000, life: 81.2, people: 8_900_000 }, "r1", sized, (item, path) => (item as Record<string, unknown>)[path.toLowerCase()]);

    assert.deepEqual(row, { key: "r1", x: "42000", values: [81.2], series: null, sizes: [8_900_000] });

    const rows: ChartRow[] = [
        { key: "a", x: "1", values: [10], series: null, sizes: [100] },
        { key: "b", x: "2", values: [20], series: null, sizes: [400] }
    ];
    const data = buildData(rows, sized, () => null);

    assert.deepEqual(data.series[0].points, [{ key: "a", x: 1, y: 10, size: 100 }, { key: "b", x: 2, y: 20, size: 400 }]);
    assert.deepEqual([data.sizeMin, data.sizeMax], [100, 400]);
});

test("a point answers the pointer over its own mark, or over the least reach where the mark is smaller", () => {
    assert.equal(pointReach(3), 11);
    assert.equal(pointReach(PlainRadius), 11);
    assert.equal(pointReach(18), 18);
});
