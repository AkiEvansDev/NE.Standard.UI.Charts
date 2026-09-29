import assert from "node:assert/strict";
import test from "node:test";

import type { ChartModel, ChartSeries } from "../src/chart-model.ts";
import { applyChange, buildData, rowFromItem, xNumber } from "../src/chart-rows.ts";
import type { MomentParser } from "../src/chart-moment.ts";
import type { ChartRow, PathReader } from "../src/chart-rows.ts";

// The framework's reader is the runtime's; here a row's property is its camel-cased name, which is what the wire carries.
const read: PathReader = (item, path) => (item as Record<string, unknown>)[path.charAt(0).toLowerCase() + path.slice(1)];

// The framework's parser is the runtime's too, pinned by its own tests; this stand-in reads the one shape these rows write.
const parse: MomentParser = text => {
    const written = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/.exec(text);

    return written === null
        ? null
        : { year: Number(written[1]), month: Number(written[2]), day: Number(written[3]), hour: Number(written[4]), minute: Number(written[5]), second: Number(written[6]), millisecond: Number(written[7]) };
};

function series(key: string, valuePath: string | null, sizePath: string | null = null): ChartSeries {
    return { key, caption: key, valuePath, sizePath, color: null, stepped: null, smooth: null, markers: null };
}

function model(values: Partial<ChartModel>): ChartModel {
    return {
        kind: "line",
        x: { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption: null },
        y: { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption: null },
        series: [],
        xPath: "Time",
        seriesPath: null,
        valuePath: null,
        legend: "Bottom",
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

const wide = model({ series: [series("cpu", "Cpu"), series("memory", "Memory")] });
const long = model({ series: [], seriesPath: "Metric", valuePath: "Value" });

test("a row of the wide form carries a value per series, in the series' own order", () => {
    const row = rowFromItem({ time: 3, cpu: 41, memory: null }, "r1", wide, read);

    assert.deepEqual(row, { key: "r1", x: "3", values: [41, null], series: null, sizes: [] });
});

test("a row of the long form carries the series it names and the one value", () => {
    const row = rowFromItem({ time: 3, metric: "cpu", value: 41 }, "r1", long, read);

    assert.deepEqual(row, { key: "r1", x: "3", values: [41], series: "cpu", sizes: [] });
});

test("an x is read as this side's own number: a name's place, a moment's milliseconds, or the number itself", () => {
    const categories: string[] = [];

    assert.equal(xNumber("Berlin", "Category", categories, parse), 0);
    assert.equal(xNumber("Prague", "Category", categories, parse), 1);
    assert.equal(xNumber("Berlin", "Category", categories, parse), 0);
    assert.deepEqual(categories, ["Berlin", "Prague"]);

    assert.equal(xNumber("1970-01-01T00:00:10.000Z", "Time", [], parse), 10_000);
    assert.equal(xNumber("not a moment", "Time", [], parse), null);
    assert.equal(xNumber("12.5", "Linear", [], parse), 12.5);
    assert.equal(xNumber("", "Linear", [], parse), null);
});

test("the rows amount to a point per series, and to how far the data reaches", () => {
    const rows: ChartRow[] = [
        { key: "a", x: "1", values: [10, 20], series: null, sizes: [] },
        { key: "b", x: "2", values: [30, null], series: null, sizes: [] }
    ];
    const data = buildData(rows, wide, parse);

    assert.deepEqual(data.series.map(entry => entry.series.key), ["cpu", "memory"]);
    assert.deepEqual(data.series[0].points, [{ key: "a", x: 1, y: 10, size: null }, { key: "b", x: 2, y: 30, size: null }]);
    assert.deepEqual(data.series[1].points, [{ key: "a", x: 1, y: 20, size: null }, { key: "b", x: 2, y: null, size: null }]);
    assert.deepEqual([data.xMin, data.xMax, data.yMin, data.yMax], [1, 2, 10, 30]);
});

test("a series the data names and the author did not comes last, in the order it arrived", () => {
    const rows: ChartRow[] = [
        { key: "a", x: "1", values: [10], series: "cpu", sizes: [] },
        { key: "b", x: "1", values: [20], series: "disk", sizes: [] }
    ];
    const data = buildData(rows, long, parse);

    assert.deepEqual(data.series.map(entry => entry.series.key), ["cpu", "disk"]);
    assert.deepEqual(data.series[1].points, [{ key: "b", x: 1, y: 20, size: null }]);
});

test("an insert lands where the source put it, a replace takes the row's place, a remove takes it out", () => {
    const rows: ChartRow[] = [{ key: "a", x: "1", values: [1], series: null, sizes: [] }, { key: "c", x: "3", values: [3], series: null, sizes: [] }];
    const single = model({ series: [series("value", "Value")] });

    applyChange(rows, "Insert", [{ key: "b", oldKey: null, index: 1, item: { time: 2, value: 2 } }], [], single, read);
    assert.deepEqual(rows.map(row => row.key), ["a", "b", "c"]);

    applyChange(rows, "Replace", [{ key: "b", oldKey: "b", index: 1, item: { time: 2, value: 9 } }], [], single, read);
    assert.deepEqual(rows[1].values, [9]);

    applyChange(rows, "Remove", [{ key: "a", oldKey: "a", index: 0, item: null }], [], single, read);
    assert.deepEqual(rows.map(row => row.key), ["b", "c"]);

    applyChange(rows, "Reset", [], [], single, read);
    assert.deepEqual(rows, []);
});

test("an insert of a key the list holds replaces the row, and a replace of one it does not goes where the change says", () => {
    const rows: ChartRow[] = [{ key: "a", x: "1", values: [1], series: null, sizes: [] }, { key: "c", x: "3", values: [3], series: null, sizes: [] }];
    const single = model({ series: [series("value", "Value")] });

    applyChange(rows, "Insert", [{ key: "a", oldKey: null, index: 1, item: { time: 1, value: 7 } }], [], single, read);
    assert.deepEqual(rows.map(row => row.key), ["a", "c"]);
    assert.deepEqual(rows[0].values, [7]);

    applyChange(rows, "Replace", [{ key: "b", oldKey: "b", index: 1, item: { time: 2, value: 2 } }], [], single, read);
    assert.deepEqual(rows.map(row => row.key), ["a", "b", "c"]);
});

test("a move takes the row by its key to where the source moved it", () => {
    const rows: ChartRow[] = [
        { key: "a", x: "1", values: [1], series: null, sizes: [] },
        { key: "b", x: "2", values: [2], series: null, sizes: [] },
        { key: "c", x: "3", values: [3], series: null, sizes: [] }
    ];

    applyChange(rows, "Move", [], [{ key: "a", oldIndex: 0, newIndex: 2 }], wide, read);

    assert.deepEqual(rows.map(row => row.key), ["b", "c", "a"]);
});

test("with no x path a row stands at its place, and a row taken off the front moves the rest along as a render would", () => {
    const numbered = model({ xPath: null, series: [series("value", "Value")] });
    const rows: ChartRow[] = [{ key: "a", x: "0", values: [5], series: null, sizes: [] }, { key: "b", x: "1", values: [6], series: null, sizes: [] }];

    applyChange(rows, "Insert", [{ key: "c", oldKey: null, index: null, item: { value: 7 } }], [], numbered, read);
    applyChange(rows, "Remove", [{ key: "a", oldKey: "a", index: 0, item: null }], [], numbered, read);

    const data = buildData(rows, numbered, parse);

    assert.deepEqual(data.series[0].points.map(point => [point.key, point.x, point.y]), [["b", 0, 6], ["c", 1, 7]]);
});

test("an insert of many rows keeps their order and holds each key once", () => {
    const rows: ChartRow[] = [];
    const single = model({ series: [series("value", "Value")] });
    const items = Array.from({ length: 1000 }, (_, i) => ({ key: `k${i}`, oldKey: null, index: i, item: { time: i, value: i } }));

    applyChange(rows, "Insert", [...items, { key: "k3", oldKey: null, index: 0, item: { time: 3, value: 30 } }], [], single, read);

    assert.equal(rows.length, 1000);
    assert.equal(rows[999].key, "k999");
    assert.deepEqual(rows[3].values, [30]);
});
