// The rows a chart holds, and the points they amount to: the server's first frame, then patched by the collection sink as
// inserts, replaces and moves. The port of `ChartDataReader` in NE.Standard.UI.Web.Charts.

import { RowsAttribute, isLongForm } from "./chart-model.ts";
import { momentNumber } from "./chart-moment.ts";
import type { MomentParser } from "./chart-moment.ts";
import type { ChartModel, ChartSeries } from "./chart-model.ts";
import type { ChartPoint } from "./chart-path.ts";

/**
 * One row: its key, its x as text — the number it amounts to is each axis's own — and a value per series. A chart that names no
 * x path reads its x off the row's place instead, so the text is whatever the row came with and nothing reads it.
 */
export type ChartRow = {
    readonly key: string;
    readonly x: string;
    readonly values: readonly (number | null)[];
    readonly series: string | null;
    /** A third value per series, where any series names where to read one; empty otherwise. */
    readonly sizes: readonly (number | null)[];
};

/** One series with the points the rows gave it; a series the data named and the author did not comes last, in the order it arrived. */
export type ChartSeriesData = {
    readonly series: ChartSeries;
    readonly index: number;
    readonly points: ChartPoint[];
    /** The points as they are drawn: the series' own, or the stack's running totals. The tooltip keeps reading `points`. */
    drawn: readonly ChartPoint[];
};

export type ChartData = {
    readonly series: ChartSeriesData[];
    readonly categories: string[];
    readonly xMin: number;
    readonly xMax: number;
    readonly yMin: number;
    readonly yMax: number;
    readonly sizeMin: number;
    readonly sizeMax: number;
};

/** One item of a collection change, as the sink hands it over. */
export type ChartChangeItem = {
    readonly key: string | null;
    readonly oldKey: string | null;
    readonly index: number | null;
    readonly item: unknown;
};

/** The rows the server drew from; an empty list where the attribute is missing or does not parse. */
export function readRows(root: Element): ChartRow[] {
    const text = root.getAttribute(RowsAttribute);

    if (text === null || text.length === 0)
        return [];

    try {
        const raw = JSON.parse(text) as unknown[];
        const rows: ChartRow[] = [];

        for (const entry of raw) {
            if (!Array.isArray(entry))
                continue;

            const values = Array.isArray(entry[2]) ? (entry[2] as unknown[]).map(value => numberOf(value)) : [];
            const sizes = Array.isArray(entry[4]) ? (entry[4] as unknown[]).map(value => numberOf(value)) : [];
            // The series slot is there but empty on a wide row, which is what makes room for the sizes after it.
            const series = entry.length > 3 && entry[3] !== null && entry[3] !== undefined ? String(entry[3]) : null;

            rows.push({ key: String(entry[0] ?? ""), x: String(entry[1] ?? ""), values, series, sizes });
        }

        return rows;
    }
    catch {
        return [];
    }
}

/** A property read off an item — the framework's own rule, `rows.readPath` on the engine context; a test hands in a plain one. */
export type PathReader = (item: unknown, path: string) => unknown;

/** The row an item amounts to: its x, and its value for every series that reads one off it. */
export function rowFromItem(item: unknown, key: string, model: ChartModel, read: PathReader): ChartRow {
    const x = textOf(model.xPath === null ? null : read(item, model.xPath));

    if (isLongForm(model)) {
        const series = textOf(read(item, model.seriesPath as string));
        const named = seriesOfKey(model, series);
        const path = named?.valuePath ?? model.valuePath;
        const sizePath = named?.sizePath ?? null;

        return {
            key,
            x,
            values: [path === null ? null : numberOf(read(item, path))],
            series,
            sizes: sizePath === null ? [] : [numberOf(read(item, sizePath))]
        };
    }

    const values: (number | null)[] = [];
    const sizes: (number | null)[] = [];
    let sized = false;

    for (const series of model.series) {
        const path = series.valuePath ?? model.valuePath;

        values.push(path === null ? null : numberOf(read(item, path)));
        sizes.push(series.sizePath === null ? null : numberOf(read(item, series.sizePath)));
        sized ||= series.sizePath !== null;
    }

    return { key, x, values, series: null, sizes: sized ? sizes : [] };
}

/** The rows after a collection change; the same array, patched, so the caller keeps one list per chart. */
export function applyChange(
    rows: ChartRow[],
    action: string,
    items: readonly ChartChangeItem[],
    moves: readonly { key: string | null; oldIndex: number | null; newIndex: number | null }[],
    model: ChartModel,
    read: PathReader
): void {
    if (action === "Reset") {
        rows.length = 0;
        return;
    }

    if (action === "Move") {
        for (const move of moves)
            moveRow(rows, move.key, move.oldIndex, move.newIndex);

        return;
    }

    // The keys held, so an insert of many rows — the first load is one — asks a set rather than scanning the list once per row.
    const keys = new Set<string>();

    for (const row of rows)
        keys.add(row.key);

    for (const change of items) {
        const key = change.key ?? change.oldKey;

        if (key === null)
            continue;

        if (action === "Remove") {
            const at = keys.has(key) ? indexOfKey(rows, key) : -1;

            if (at >= 0) {
                rows.splice(at, 1);
                keys.delete(key);
            }

            continue;
        }

        const row = rowFromItem(change.item, change.key ?? key, model, read);
        const heldKey = action === "Replace" ? change.oldKey ?? key : key;

        // A key the list already holds is that row, whichever action names it: an Insert of one must not draw the point twice.
        const held = keys.has(heldKey) ? indexOfKey(rows, heldKey) : -1;

        if (held >= 0) {
            rows[held] = row;
            keys.delete(heldKey);
            keys.add(row.key);
            continue;
        }

        const index = change.index;

        if (index === null || index < 0 || index >= rows.length)
            rows.push(row);
        else
            rows.splice(index, 0, row);

        keys.add(row.key);
    }
}

/** The rows as points: a series per key, the names a category axis met, and how far the data reaches on either axis. */
export function buildData(rows: readonly ChartRow[], model: ChartModel, parse: MomentParser): ChartData {
    const categories: string[] = [];
    const series: ChartSeriesData[] = model.series.map((entry, index) => ({ series: entry, index, points: [], drawn: [] }));
    const long = isLongForm(model);
    const x = emptyExtent();
    const y = emptyExtent();
    const size = emptyExtent();

    for (let place = 0; place < rows.length; place++) {
        const row = rows[place];
        // With no x path the server numbered the rows by their place, and a patch keeps that: a row inserted or removed moves the
        // ones after it, as a render would.
        const at = model.xPath === null ? placeNumber(place, model.x.kind, categories) : xNumber(row.x, model.x.kind, categories, parse);

        // A row whose x cannot be read is no point at all, rather than a point at zero.
        if (at === null)
            continue;

        extend(x, at);

        if (long) {
            const target = resolveSeries(series, row.series ?? "");

            addPoint(target, row, at, row.values.length > 0 ? row.values[0] : null, row.sizes.length > 0 ? row.sizes[0] : null, y, size);
            continue;
        }

        for (let i = 0; i < series.length; i++)
            addPoint(series[i], row, at, i < row.values.length ? row.values[i] : null, i < row.sizes.length ? row.sizes[i] : null, y, size);
    }

    // Until a stack says otherwise, a series is drawn from its own points.
    for (const entry of series)
        entry.drawn = entry.points;

    return { series, categories, xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max, sizeMin: size.min, sizeMax: size.max };
}

/** One point onto its series, and the value and the size, where the row has them, into how far the data reaches. */
function addPoint(target: ChartSeriesData, row: ChartRow, x: number, value: number | null, size: number | null, y: Extent, sizes: Extent): void {
    target.points.push({ key: row.key, x, y: value, size });

    if (value !== null)
        extend(y, value);

    if (size !== null)
        extend(sizes, size);
}

type Extent = { min: number; max: number };

/** Empty until the first value: the infinities, which any number narrows. */
function emptyExtent(): Extent {
    return { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
}

function extend(extent: Extent, value: number): void {
    extent.min = Math.min(extent.min, value);
    extent.max = Math.max(extent.max, value);
}

/** A row's place as its axis's number: itself, or on a category axis the place's own name, as the server writes it. */
function placeNumber(place: number, kind: string, categories: string[]): number {
    return kind === "Category" ? xNumber(String(place), kind, categories, () => null) ?? place : place;
}

/**
 * The x as its axis's number: a name's place among the names, or the number its text writes — on a time axis, failing that, the
 * moment's wall clock. The server reads the same text the same way (`ChartValues.TryToNumber`).
 */
export function xNumber(text: string, kind: string, categories: string[], parse: MomentParser): number | null {
    if (kind === "Category") {
        const index = categories.indexOf(text);

        if (index >= 0)
            return index;

        categories.push(text);

        return categories.length - 1;
    }

    const value = numberText(text);

    if (value !== null || kind !== "Time")
        return value;

    const moment = parse(text);

    return moment === null ? null : momentNumber(moment);
}

/** A number as .NET's invariant float reads one: a sign, digits with one point, an exponent, and blanks either side. */
const NumberText = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;

/** The number a text writes — never a hex, a blank or `Infinity`, which `Number` would read and the server would not. */
function numberText(text: string): number | null {
    if (!NumberText.test(text))
        return null;

    const value = Number(text);

    return Number.isFinite(value) ? value : null;
}

function numberOf(value: unknown): number | null {
    if (typeof value === "number")
        return Number.isFinite(value) ? value : null;

    if (typeof value === "boolean")
        return value ? 1 : 0;

    return typeof value === "string" ? numberText(value) : null;
}

function textOf(value: unknown): string {
    if (value === null || value === undefined)
        return "";

    if (typeof value === "string")
        return value;

    if (typeof value === "boolean")
        return value ? "true" : "false";

    return String(value);
}

function seriesOfKey(model: ChartModel, key: string): ChartSeries | null {
    for (const series of model.series) {
        if (series.key === key)
            return series;
    }

    return null;
}

/** The series of that key, added where the data names one the author did not. */
function resolveSeries(series: ChartSeriesData[], key: string): ChartSeriesData {
    for (const entry of series) {
        if (entry.series.key === key)
            return entry;
    }

    const added: ChartSeriesData = {
        series: { key, caption: key, valuePath: null, sizePath: null, color: null, stepped: null, smooth: null, markers: null },
        index: series.length,
        points: [],
        drawn: []
    };

    series.push(added);

    return added;
}

function indexOfKey(rows: readonly ChartRow[], key: string): number {
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].key === key)
            return i;
    }

    return -1;
}

function moveRow(rows: ChartRow[], key: string | null, oldIndex: number | null, newIndex: number | null): void {
    const from = key !== null ? indexOfKey(rows, key) : oldIndex ?? -1;

    if (from < 0 || from >= rows.length)
        return;

    const [row] = rows.splice(from, 1);
    const to = newIndex === null || newIndex < 0 || newIndex > rows.length ? rows.length : newIndex;

    rows.splice(to, 0, row);
}
