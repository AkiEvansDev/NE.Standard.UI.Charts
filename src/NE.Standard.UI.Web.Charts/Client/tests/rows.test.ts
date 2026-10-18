import assert from "node:assert/strict";
import test from "node:test";

import type { ChartModel, ChartSeries } from "../src/chart-model.ts";
import { applyChange, buildData, readSlots, rowFromItem, rowsOf, xNumber } from "../src/chart-rows.ts";
import type { MomentParser } from "../src/chart-moment.ts";
import type { ChartRow, ChartSlot, PathReader } from "../src/chart-rows.ts";
import { readNumber } from "./framework-numbers.ts";

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
        x: { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null },
        y: { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null },
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
        legendValues: false,
        remainderCaption: null,
        ...values
    };
}

const wide = model({ series: [series("cpu", "Cpu"), series("memory", "Memory")] });
const long = model({ series: [], seriesPath: "Metric", valuePath: "Value" });

test("a row of the wide form carries a value per series, in the series' own order", () => {
    const row = rowFromItem({ time: 3, cpu: 41, memory: null }, "r1", wide, read, readNumber);

    assert.deepEqual(row, { key: "r1", x: "3", values: [41, null], series: null, sizes: [] });
});

test("a row of the long form carries the series it names and the one value", () => {
    const row = rowFromItem({ time: 3, metric: "cpu", value: 41 }, "r1", long, read, readNumber);

    assert.deepEqual(row, { key: "r1", x: "3", values: [41], series: "cpu", sizes: [] });
});

test("an x is read as this side's own number: a name's place, a moment's milliseconds, or the number itself", () => {
    const categories = new Map<string, number>();

    assert.equal(xNumber("Berlin", "Category", categories, parse, readNumber), 0);
    assert.equal(xNumber("Prague", "Category", categories, parse, readNumber), 1);
    assert.equal(xNumber("Berlin", "Category", categories, parse, readNumber), 0);
    assert.deepEqual([...categories], [["Berlin", 0], ["Prague", 1]]);

    assert.equal(xNumber("1970-01-01T00:00:10.000Z", "Time", new Map(), parse, readNumber), 10_000);
    assert.equal(xNumber("not a moment", "Time", new Map(), parse, readNumber), null);
    assert.equal(xNumber("12.5", "Linear", new Map(), parse, readNumber), 12.5);
    assert.equal(xNumber("", "Linear", new Map(), parse, readNumber), null);
});

test("a name is found by its place among the names met, not by a search of them all: a known one keeps the place it was given", () => {
    const categories = new Map([["Berlin", 0], ["Prague", 1]]);

    assert.equal(xNumber("Prague", "Category", categories, parse, readNumber), 1);
    assert.equal(xNumber("Vienna", "Category", categories, parse, readNumber), 2);
    assert.equal(categories.get("Vienna"), 2);
});

test("the names a category axis meets are its places in the order they arrived, however many there are", () => {
    const bands = model({ x: { kind: "Category", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null }, series: [series("value", "Value")] });
    const rows: ChartRow[] = Array.from({ length: 4000 }, (_, i) => ({ key: `r${i}`, x: `n${i % 2000}`, values: [i], series: null, sizes: [] }));
    const data = buildData(rows, bands, parse, readNumber);

    assert.equal(data.categories.length, 2000);
    assert.equal(data.categories[1999], "n1999");
    assert.deepEqual(data.series[0].points.slice(1999, 2001).map(point => point.x), [1999, 0]);
});

test("the rows amount to a point per series, and to how far the data reaches", () => {
    const rows: ChartRow[] = [
        { key: "a", x: "1", values: [10, 20], series: null, sizes: [] },
        { key: "b", x: "2", values: [30, null], series: null, sizes: [] }
    ];
    const data = buildData(rows, wide, parse, readNumber);

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
    const data = buildData(rows, long, parse, readNumber);

    assert.deepEqual(data.series.map(entry => entry.series.key), ["cpu", "disk"]);
    assert.deepEqual(data.series[1].points, [{ key: "b", x: 1, y: 20, size: null }]);
});

test("an insert lands where the source put it, a replace takes the row's place, a remove takes it out", () => {
    const rows: ChartRow[] = [{ key: "a", x: "1", values: [1], series: null, sizes: [] }, { key: "c", x: "3", values: [3], series: null, sizes: [] }];
    const single = model({ series: [series("value", "Value")] });

    applyChange(rows, "Insert", [{ key: "b", oldKey: null, index: 1, item: { time: 2, value: 2 } }], [], single, read, readNumber);
    assert.deepEqual(rows.map(row => row.key), ["a", "b", "c"]);

    applyChange(rows, "Replace", [{ key: "b", oldKey: "b", index: 1, item: { time: 2, value: 9 } }], [], single, read, readNumber);
    assert.deepEqual(rows[1].values, [9]);

    applyChange(rows, "Remove", [{ key: "a", oldKey: "a", index: 0, item: null }], [], single, read, readNumber);
    assert.deepEqual(rows.map(row => row.key), ["b", "c"]);

    applyChange(rows, "Reset", [], [], single, read, readNumber);
    assert.deepEqual(rows, []);
});

test("an insert of a key the list holds replaces the row, and a replace of one it does not goes where the change says", () => {
    const rows: ChartRow[] = [{ key: "a", x: "1", values: [1], series: null, sizes: [] }, { key: "c", x: "3", values: [3], series: null, sizes: [] }];
    const single = model({ series: [series("value", "Value")] });

    applyChange(rows, "Insert", [{ key: "a", oldKey: null, index: 1, item: { time: 1, value: 7 } }], [], single, read, readNumber);
    assert.deepEqual(rows.map(row => row.key), ["a", "c"]);
    assert.deepEqual(rows[0].values, [7]);

    applyChange(rows, "Replace", [{ key: "b", oldKey: "b", index: 1, item: { time: 2, value: 2 } }], [], single, read, readNumber);
    assert.deepEqual(rows.map(row => row.key), ["a", "b", "c"]);
});

test("a move takes the row by its key to where the source moved it", () => {
    const rows: ChartRow[] = [
        { key: "a", x: "1", values: [1], series: null, sizes: [] },
        { key: "b", x: "2", values: [2], series: null, sizes: [] },
        { key: "c", x: "3", values: [3], series: null, sizes: [] }
    ];

    applyChange(rows, "Move", [], [{ key: "a", oldIndex: 0, newIndex: 2 }], wide, read, readNumber);

    assert.deepEqual(rows.map(row => row.key), ["b", "c", "a"]);
});

test("with no x path a row stands at its place, and a row taken off the front moves the rest along as a render would", () => {
    const numbered = model({ xPath: null, series: [series("value", "Value")] });
    const rows: ChartRow[] = [{ key: "a", x: "0", values: [5], series: null, sizes: [] }, { key: "b", x: "1", values: [6], series: null, sizes: [] }];

    applyChange(rows, "Insert", [{ key: "c", oldKey: null, index: null, item: { value: 7 } }], [], numbered, read, readNumber);
    applyChange(rows, "Remove", [{ key: "a", oldKey: "a", index: 0, item: null }], [], numbered, read, readNumber);

    const data = buildData(rows, numbered, parse, readNumber);

    assert.deepEqual(data.series[0].points.map(point => [point.key, point.x, point.y]), [["b", 0, 6], ["c", 1, 7]]);
});

test("the server's rows hold an empty slot for an item that is none, so a change's index finds the item's place", () => {
    // [A, null, B] with no x path, as the server writes it: the null item holds its slot and is no point.
    const root = { getAttribute: () => JSON.stringify([["a", "0", [5]], null, ["b", "1", [6]]]) } as unknown as Element;
    const slots = readSlots(root, readNumber);
    const numbered = model({ xPath: null, series: [series("value", "Value")] });

    assert.deepEqual(slots.map(slot => slot?.key ?? null), ["a", null, "b"]);

    // C inserted before B, at B's place in the collection; then the null item replaced by D, at its own.
    applyChange(slots, "Insert", [{ key: "c", oldKey: null, index: 2, item: { value: 7 } }], [], numbered, read, readNumber);
    applyChange(slots, "Replace", [{ key: "d", oldKey: "1", index: 1, item: { value: 8 } }], [], numbered, read, readNumber);

    assert.deepEqual(slots.map(slot => slot?.key ?? null), ["a", "d", "c", "b"]);

    const data = buildData(rowsOf(slots), numbered, parse, readNumber);

    assert.deepEqual(data.series[0].points.map(point => [point.key, point.x, point.y]), [["a", 0, 5], ["d", 1, 8], ["c", 2, 7], ["b", 3, 6]]);
});

test("a null item inserted, replaced into or removed by its index holds or gives up its slot without moving a row", () => {
    const single = model({ series: [series("value", "Value")] });
    const slots: ChartSlot[] = [{ key: "a", x: "1", values: [1], series: null, sizes: [] }, { key: "b", x: "2", values: [2], series: null, sizes: [] }];

    applyChange(slots, "Insert", [{ key: "n", oldKey: null, index: 1, item: null }], [], single, read, readNumber);
    assert.deepEqual(slots.map(slot => slot?.key ?? null), ["a", null, "b"]);

    // An item whose x path reads nothing is no row either, as the server holds none for it.
    applyChange(slots, "Replace", [{ key: "a", oldKey: "a", index: 0, item: { value: 3 } }], [], single, read, readNumber);
    assert.deepEqual(slots.map(slot => slot?.key ?? null), [null, null, "b"]);

    applyChange(slots, "Remove", [{ key: "n", oldKey: "n", index: 1, item: null }], [], single, read, readNumber);
    applyChange(slots, "Insert", [{ key: "c", oldKey: null, index: 1, item: { time: 3, value: 3 } }], [], single, read, readNumber);
    assert.deepEqual(slots.map(slot => slot?.key ?? null), [null, "c", "b"]);

    applyChange(slots, "Move", [], [{ key: null, oldIndex: 0, newIndex: 2 }], single, read, readNumber);
    assert.deepEqual(slots.map(slot => slot?.key ?? null), ["c", "b", null]);
    assert.deepEqual(rowsOf(slots).map(row => row.key), ["c", "b"]);
});

test("an insert of many rows keeps their order and holds each key once", () => {
    const rows: ChartRow[] = [];
    const single = model({ series: [series("value", "Value")] });
    const items = Array.from({ length: 1000 }, (_, i) => ({ key: `k${i}`, oldKey: null, index: i, item: { time: i, value: i } }));

    applyChange(rows, "Insert", [...items, { key: "k3", oldKey: null, index: 0, item: { time: 3, value: 30 } }], [], single, read, readNumber);

    assert.equal(rows.length, 1000);
    assert.equal(rows[999].key, "k999");
    assert.deepEqual(rows[3].values, [30]);
});

test("a patched row with no x is no point, and names no blank band, as the server's reader skips it", () => {
    const bands = model({ x: { kind: "Category", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null }, series: [series("value", "Value")] });
    const slots: ChartSlot[] = [];

    applyChange(slots, "Insert", [{ key: "a", oldKey: null, index: 0, item: { time: "Berlin", value: 1 } }, { key: "b", oldKey: null, index: 1, item: { time: null, value: 2 } }], [], bands, read, readNumber);

    const data = buildData(rowsOf(slots), bands, parse, readNumber);

    assert.deepEqual(data.categories, ["Berlin"]);
    assert.deepEqual(data.series[0].points.map(point => point.key), ["a"]);
});

test("on a logarithmic axis a value at zero or below is a gap and an x there no point, so neither reaches the range", () => {
    const axis = { kind: "Logarithmic", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null } as const;
    const logarithmic = model({ x: axis, y: axis, series: [series("value", "Value")] });
    const rows: ChartRow[] = [
        { key: "a", x: "0", values: [5], series: null, sizes: [] },
        { key: "b", x: "10", values: [0.01], series: null, sizes: [] },
        { key: "c", x: "100", values: [-5], series: null, sizes: [] },
        { key: "d", x: "1000", values: [0], series: null, sizes: [] }
    ];
    const data = buildData(rows, logarithmic, parse, readNumber);

    assert.deepEqual(data.series[0].points.map(point => [point.key, point.x, point.y]), [["b", 10, 0.01], ["c", 100, null], ["d", 1000, null]]);
    assert.deepEqual([data.xMin, data.xMax, data.yMin, data.yMax], [10, 1000, 0.01, 0.01]);
});

test("with no x path a logarithmic axis leaves the row at place zero out, and the rest stand at their places", () => {
    const axis = { kind: "Logarithmic", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null } as const;
    const numbered = model({ x: axis, xPath: null, series: [series("value", "Value")] });
    const rows: ChartRow[] = [0, 1, 2].map(place => ({ key: `r${place}`, x: String(place), values: [5 + place], series: null, sizes: [] }));

    assert.deepEqual(buildData(rows, numbered, parse, readNumber).series[0].points.map(point => [point.key, point.x]), [["r1", 1], ["r2", 2]]);
});

test("a numeric text is read as the server's invariant culture reads one: a no-break space before it is no number", () => {
    const single = model({ series: [series("value", "Value")] });

    assert.deepEqual(rowFromItem({ time: 1, value: " 12.5\t" }, "r1", single, read, readNumber).values, [12.5]);
    assert.deepEqual(rowFromItem({ time: 1, value: "\u00a012.5" }, "r1", single, read, readNumber).values, [null]);
});
