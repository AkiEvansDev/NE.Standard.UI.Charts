// The corpus both ports are held to: `arithmetic-corpus.json` carries the cases and the answers, and NE.Test.Standard.UI.Charts
// reads the same file against the C# port. A change to the arithmetic that only one side got fails here and there.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { bandWidth, barOf, barSlots } from "../src/chart-bars.ts";
import { PlainRadius, bubbleRadius, pointReach } from "../src/chart-bubbles.ts";
import type { AxisKind, ChartAxis } from "../src/chart-model.ts";
import { momentNumber } from "../src/chart-moment.ts";
import type { MomentParser } from "../src/chart-moment.ts";
import { areaPath, coord, linePath } from "../src/chart-path.ts";
import type { ChartPoint } from "../src/chart-path.ts";
import { sectorsOf } from "../src/chart-pie.ts";
import type { ChartSeriesData } from "../src/chart-rows.ts";
import { stackSeries, valueAt } from "../src/chart-stack.ts";
import { defaultFormat, plotDown, plotX, plotY, resolveRange, step, ticks, valueOf } from "../src/chart-ticks.ts";
import type { Plot, Scale } from "../src/chart-ticks.ts";
import { clampWindow, followWindow, panWindow, windowExtent, zoomWindow } from "../src/chart-window.ts";

const corpus = JSON.parse(readFileSync(fileURLToPath(new URL("./arithmetic-corpus.json", import.meta.url)), "utf8"));

/** The box and the scales every path case is drawn in, so a case carries only what it is about. */
const plot: Plot = { left: 0, top: 0, width: 100, height: 100 };
const scale: Scale = { min: 0, max: 10, logarithmic: false };
const Tolerance = 1e-9;

function close(actual: number, expected: number, name: string): void {
    assert.ok(Math.abs(actual - expected) <= Tolerance, `${name}: ${actual} is not ${expected}`);
}

function axisOf(entry: { kind: string; min: number | null; max: number | null; ticks: number }): ChartAxis {
    return { kind: entry.kind as AxisKind, min: entry.min, max: entry.max, format: null, grid: true, ticks: entry.ticks, caption: null };
}

function pointsOf(entries: readonly { x: number; y: number | null }[]): ChartPoint[] {
    return entries.map(entry => ({ key: `p${entry.x}`, x: entry.x, y: entry.y, size: null }));
}

function seriesOf(entries: readonly { x: number; y: number | null }[], index: number): ChartSeriesData {
    const points = pointsOf(entries);

    return {
        series: { key: `s${index}`, caption: `s${index}`, valuePath: null, sizePath: null, color: null, stepped: null, smooth: null, markers: null },
        index,
        points,
        drawn: points
    };
}

// The text is read by the framework's `temporal.parse`, whose own tests hold the corpus's moments; here the numbering of what it
// read is the chart's, so the corpus carries the fields beside the text for this side.
const parse: MomentParser = text => corpus.moments.find((entry: { text: string }) => entry.text === text)?.written ?? null;

test("corpus: the number a moment is read as", () => {
    for (const entry of corpus.moments) {
        const moment = parse(entry.text);

        assert.equal(moment === null ? null : momentNumber(moment), entry.expected, entry.case);
    }
});

test("corpus: the range an axis covers over the data it was given", () => {
    for (const entry of corpus.ranges) {
        const resolved = resolveRange(
            axisOf(entry),
            entry.dataMin ?? Number.POSITIVE_INFINITY,
            entry.dataMax ?? Number.NEGATIVE_INFINITY,
            entry.categories,
            entry.includeZero
        );

        close(resolved.min, entry.expected.min, `${entry.case} (min)`);
        close(resolved.max, entry.expected.max, `${entry.case} (max)`);
        assert.equal(resolved.logarithmic, entry.expected.logarithmic, entry.case);
    }
});

test("corpus: the step a range is marked at, and the marks themselves", () => {
    for (const entry of corpus.steps)
        close(step(entry.kind as AxisKind, entry.min, entry.max, entry.count), entry.expected, entry.case);

    for (const entry of corpus.ticks)
        assert.deepEqual(ticks(entry.kind as AxisKind, entry.scale as Scale, entry.count), entry.expected, entry.case);

    for (const entry of corpus.formats)
        assert.equal(defaultFormat(entry.kind as AxisKind, entry.step), entry.expected, `${entry.kind} ${entry.step}`);
});

test("corpus: where a value lands in the plot, and what stands at a share of the range", () => {
    for (const entry of corpus.places) {
        close(plotX(entry.plot as Plot, entry.scale as Scale, entry.value), entry.expectedX, "x");
        close(plotY(entry.plot as Plot, entry.scale as Scale, entry.value), entry.expectedY, "y");
        close(plotDown(entry.plot as Plot, entry.scale as Scale, entry.value), entry.expectedDown, "down");
    }

    for (const entry of corpus.shares)
        close(valueOf(entry.scale as Scale, entry.share), entry.expected, "value");

    for (const entry of corpus.coords)
        assert.equal(coord(entry.value), entry.expected, `coord ${entry.value}`);
});

test("corpus: the path a series is drawn as", () => {
    for (const entry of corpus.lines)
        assert.equal(linePath(pointsOf(entry.points), scale, scale, plot, entry.stepped, entry.smooth), entry.expected, entry.case);

    for (const entry of corpus.areas) {
        const baseline = entry.baseline === null ? null : pointsOf(entry.baseline);

        assert.equal(areaPath(pointsOf(entry.points), baseline, scale, scale, plot, entry.stepped, entry.smooth), entry.expected, entry.case);
    }
});

test("corpus: the stack a series stands on", () => {
    for (const entry of corpus.stacks) {
        const series = (entry.series as { x: number; y: number | null }[][]).map(seriesOf);

        stackSeries(series);

        assert.deepEqual(series.map(one => one.drawn.map(point => point.y)), entry.expected, entry.case);
    }

    for (const entry of corpus.baselines)
        close(valueAt(pointsOf(entry.points), entry.at), entry.expected, entry.case);
});

test("corpus: the band one x owns and the bar's place in it", () => {
    for (const entry of corpus.bands)
        close(bandWidth(entry.length, entry.slots), entry.expected, entry.case);

    for (const entry of corpus.slots)
        assert.equal(barSlots((entry.series as { x: number; y: number | null }[][]).map(pointsOf)), entry.expected, entry.case);

    for (const entry of corpus.bars) {
        const bar = barOf(entry.center, entry.band, entry.index, entry.count, entry.stacked);

        close(bar.start, entry.expected.start, `${entry.case} (start)`);
        close(bar.thickness, entry.expected.thickness, `${entry.case} (thickness)`);
    }
});

test("corpus: the turn shared out", () => {
    for (const entry of corpus.sectors) {
        const sectors = sectorsOf(entry.values);

        assert.equal(sectors.length, entry.expectedShares.length, entry.case);

        for (let i = 0; i < sectors.length; i++)
            close(sectors[i].sweep / (Math.PI * 2), entry.expectedShares[i], `${entry.case} (${i})`);
    }
});

test("corpus: how wide a point is drawn and how far it answers the pointer", () => {
    for (const entry of corpus.radii)
        close(bubbleRadius(entry.size, entry.min, entry.max), entry.expected, entry.case);

    for (const entry of corpus.reaches)
        close(pointReach(entry.radius), entry.expected, `reach ${entry.radius}`);

    assert.equal(PlainRadius, 4);
});

test("corpus: the window the viewer reads, and what the series reach inside it", () => {
    for (const entry of corpus.windows) {
        const window = { from: entry.from, to: entry.to };
        const moved = entry.op === "clamp"
            ? clampWindow(window, entry.min, entry.max)
            : entry.op === "zoom"
                ? zoomWindow(window, entry.at, entry.factor, entry.min, entry.max)
                : entry.op === "pan"
                    ? panWindow(window, entry.by, entry.min, entry.max)
                    : followWindow(window, entry.min, entry.max);

        close(moved.from, entry.expected.from, `${entry.case} (from)`);
        close(moved.to, entry.expected.to, `${entry.case} (to)`);
    }

    for (const entry of corpus.extents) {
        const extent = windowExtent((entry.series as { x: number; y: number | null }[][]).map(pointsOf), entry.window);

        close(extent.min, entry.expected.min, `${entry.case} (min)`);
        close(extent.max, entry.expected.max, `${entry.case} (max)`);
    }
});
