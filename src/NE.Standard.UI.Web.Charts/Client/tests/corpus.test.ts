// The corpus both ports are held to: `arithmetic-corpus.json` carries the cases and the answers, and NE.Test.Standard.UI.Charts
// reads the same file against the C# port. A change to the arithmetic that only one side got fails here and there.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import type { WrittenMoment } from "ne-standard-ui";

import { bandWidth, barOf, barSlots } from "../src/chart-bars.ts";
import { PlainRadius, bubbleRadius, pointReach } from "../src/chart-bubbles.ts";
import type { AxisKind, ChartAxis } from "../src/chart-model.ts";
import { momentNumber } from "../src/chart-moment.ts";
import type { MomentParser } from "../src/chart-moment.ts";
import { areaPath, coord, linePath, lineSegments } from "../src/chart-path.ts";
import type { ChartPoint, Segment } from "../src/chart-path.ts";
import { sectorsOf } from "../src/chart-pie.ts";
import type { Spot } from "../src/chart-pie.ts";
import { radarEdges, radarOutline, radarRadius, radarReach, radarSpokes, spokeAnchor, spokeAngle } from "../src/chart-radar.ts";
import { xNumber } from "../src/chart-rows.ts";
import type { ChartSeriesData } from "../src/chart-rows.ts";
import { stackSeries } from "../src/chart-stack.ts";
import { defaultFormat, plotDown, plotX, plotY, resolveRange, step, ticks, valueOf, within } from "../src/chart-ticks.ts";
import type { Plot, Scale } from "../src/chart-ticks.ts";
import { clampWindow, followWindow, panWindow, windowExtent, zoomWindow } from "../src/chart-window.ts";
import type { Span } from "../src/chart-window.ts";

type CorpusPoint = { readonly x: number; readonly y: number | null; readonly base?: number };

/** A straight piece as the corpus writes it: where it starts and where it ends, across and down. */
type CorpusSegment = readonly [number, number, number, number];

type CorpusWindow = { readonly case: string; readonly from: number; readonly to: number; readonly min: number; readonly max: number; readonly expected: Span }
    & ({ readonly op: "clamp" | "follow" } | { readonly op: "zoom"; readonly at: number; readonly factor: number } | { readonly op: "pan"; readonly by: number });

type Corpus = {
    readonly moments: readonly { readonly case: string; readonly text: string; readonly written: WrittenMoment; readonly expected: number | null }[];
    readonly texts: readonly { readonly case: string; readonly text: string; readonly kind: AxisKind; readonly expected: number | null }[];
    readonly ranges: readonly {
        readonly case: string;
        readonly kind: AxisKind;
        readonly min: number | null;
        readonly max: number | null;
        readonly ticks: number;
        readonly dataMin: number | null;
        readonly dataMax: number | null;
        readonly categories: number;
        readonly includeZero: boolean;
        readonly expected: Scale;
    }[];
    readonly steps: readonly { readonly case: string; readonly kind: AxisKind; readonly min: number; readonly max: number; readonly count: number; readonly expected: number }[];
    readonly ticks: readonly { readonly case: string; readonly kind: AxisKind; readonly scale: Scale; readonly count: number; readonly expected: readonly number[] }[];
    readonly formats: readonly { readonly kind: AxisKind; readonly step: number; readonly expected: string | null }[];
    readonly places: readonly { readonly plot: Plot; readonly scale: Scale; readonly value: number; readonly expectedX: number; readonly expectedY: number; readonly expectedDown: number }[];
    readonly shares: readonly { readonly scale: Scale; readonly share: number; readonly expected: number }[];
    readonly withins: readonly { readonly case: string; readonly scale: Scale; readonly value: number; readonly expected: number }[];
    readonly coords: readonly { readonly value: number; readonly expected: string }[];
    readonly lines: readonly { readonly case: string; readonly points: readonly CorpusPoint[]; readonly stepped: boolean; readonly smooth: boolean; readonly expected: string }[];
    readonly areas: readonly { readonly case: string; readonly points: readonly CorpusPoint[]; readonly stepped: boolean; readonly smooth: boolean; readonly expected: string }[];
    readonly segments: readonly { readonly case: string; readonly points: readonly CorpusPoint[]; readonly stepped: boolean; readonly smooth: boolean; readonly expected: readonly CorpusSegment[] }[];
    readonly curves: readonly {
        readonly case: string;
        readonly points: readonly CorpusPoint[];
        readonly expectedCount: number;
        readonly expectedStart: readonly [number, number];
        readonly expectedEnd: readonly [number, number];
        readonly expectedLongest: number;
    }[];
    readonly edges: readonly { readonly case: string; readonly spots: readonly Spot[]; readonly expected: readonly CorpusSegment[] }[];
    readonly stacks: readonly {
        readonly case: string;
        readonly series: readonly (readonly CorpusPoint[])[];
        readonly expected: readonly (readonly (number | null)[])[];
        readonly bases: readonly (readonly (number | null)[])[];
    }[];
    readonly bands: readonly { readonly case: string; readonly length: number; readonly slots: number; readonly expected: number }[];
    readonly slots: readonly { readonly case: string; readonly series: readonly (readonly CorpusPoint[])[]; readonly band: Scale; readonly expected: number }[];
    readonly bars: readonly {
        readonly case: string;
        readonly center: number;
        readonly band: number;
        readonly index: number;
        readonly count: number;
        readonly stacked: boolean;
        readonly expected: { readonly start: number; readonly thickness: number };
    }[];
    readonly sectors: readonly { readonly case: string; readonly values: readonly (number | null)[]; readonly expectedShares: readonly number[] }[];
    readonly spokes: readonly { readonly case: string; readonly series: readonly (readonly CorpusPoint[])[]; readonly expected: readonly number[] }[];
    readonly spokeAngles: readonly { readonly case: string; readonly index: number; readonly count: number; readonly expected: number; readonly anchor: string }[];
    readonly radarReaches: readonly { readonly case: string; readonly scale: Scale; readonly value: number | null; readonly radius: number; readonly expected: number }[];
    readonly radarRadii: readonly { readonly case: string; readonly width: number; readonly height: number; readonly across: number; readonly down: number; readonly expected: number }[];
    readonly outlines: readonly { readonly case: string; readonly spots: readonly Spot[]; readonly expected: string }[];
    readonly radii: readonly { readonly case: string; readonly size: number | null; readonly min: number; readonly max: number; readonly expected: number }[];
    readonly reaches: readonly { readonly radius: number; readonly expected: number }[];
    readonly windows: readonly CorpusWindow[];
    readonly extents: readonly {
        readonly case: string;
        readonly series: readonly (readonly CorpusPoint[])[];
        readonly window: Span | null;
        readonly expected: { readonly min: number; readonly max: number };
    }[];
};

const corpus = JSON.parse(readFileSync(fileURLToPath(new URL("./arithmetic-corpus.json", import.meta.url)), "utf8")) as Corpus;

/** The box and the scales every path case is drawn in, so a case carries only what it is about. */
const plot: Plot = { left: 0, top: 0, width: 100, height: 100 };
const scale: Scale = { min: 0, max: 10, logarithmic: false };
const Tolerance = 1e-9;

function close(actual: number, expected: number, name: string): void {
    assert.ok(Math.abs(actual - expected) <= Tolerance, `${name}: ${actual} is not ${expected}`);
}

function axisOf(entry: { kind: AxisKind; min: number | null; max: number | null; ticks: number }): ChartAxis {
    return { kind: entry.kind, min: entry.min, max: entry.max, format: null, grid: true, ticks: entry.ticks, caption: null };
}

function pointsOf(entries: readonly CorpusPoint[]): ChartPoint[] {
    return entries.map(entry => ({ key: `p${entry.x}`, x: entry.x, y: entry.y, size: null, base: entry.base ?? null }));
}

function seriesOf(entries: readonly CorpusPoint[], index: number): ChartSeriesData {
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
const parse: MomentParser = text => corpus.moments.find(entry => entry.text === text)?.written ?? null;

test("corpus: the number a moment is read as", () => {
    for (const entry of corpus.moments) {
        const moment = parse(entry.text);

        assert.equal(moment === null ? null : momentNumber(moment), entry.expected, entry.case);
    }
});

test("corpus: the number an x's text is read as", () => {
    for (const entry of corpus.texts)
        assert.equal(xNumber(entry.text, entry.kind, [], parse), entry.expected, entry.case);
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
        close(step(entry.kind, entry.min, entry.max, entry.count), entry.expected, entry.case);

    for (const entry of corpus.ticks)
        assert.deepEqual(ticks(entry.kind, entry.scale, entry.count), entry.expected, entry.case);

    for (const entry of corpus.formats)
        assert.equal(defaultFormat(entry.kind, entry.step), entry.expected, `${entry.kind} ${entry.step}`);
});

test("corpus: where a value lands in the plot, and what stands at a share of the range", () => {
    for (const entry of corpus.places) {
        close(plotX(entry.plot, entry.scale, entry.value), entry.expectedX, "x");
        close(plotY(entry.plot, entry.scale, entry.value), entry.expectedY, "y");
        close(plotDown(entry.plot, entry.scale, entry.value), entry.expectedDown, "down");
    }

    for (const entry of corpus.shares)
        close(valueOf(entry.scale, entry.share), entry.expected, "value");

    for (const entry of corpus.withins)
        close(within(entry.scale, entry.value), entry.expected, entry.case);

    for (const entry of corpus.coords)
        assert.equal(coord(entry.value), entry.expected, `coord ${entry.value}`);
});

test("corpus: the path a series is drawn as", () => {
    for (const entry of corpus.lines)
        assert.equal(linePath(pointsOf(entry.points), scale, scale, plot, entry.stepped, entry.smooth), entry.expected, entry.case);

    for (const entry of corpus.areas)
        assert.equal(areaPath(pointsOf(entry.points), scale, scale, plot, entry.stepped, entry.smooth), entry.expected, entry.case);
});

test("corpus: the straight pieces a line and a radar's shape are drawn with", () => {
    for (const entry of corpus.segments)
        sameSegments(lineSegments(pointsOf(entry.points), scale, scale, plot, entry.stepped, entry.smooth), entry.expected, entry.case);

    for (const entry of corpus.curves) {
        const pieces = lineSegments(pointsOf(entry.points), scale, scale, plot, false, true);
        const longest = Math.max(...pieces.map(piece => Math.hypot(piece.x2 - piece.x1, piece.y2 - piece.y1)));

        assert.equal(pieces.length, entry.expectedCount, entry.case);
        close(pieces[0].x1, entry.expectedStart[0], `${entry.case} (start x)`);
        close(pieces[0].y1, entry.expectedStart[1], `${entry.case} (start y)`);
        close(pieces[pieces.length - 1].x2, entry.expectedEnd[0], `${entry.case} (end x)`);
        close(pieces[pieces.length - 1].y2, entry.expectedEnd[1], `${entry.case} (end y)`);
        close(longest, entry.expectedLongest, `${entry.case} (longest)`);

        for (let i = 1; i < pieces.length; i++)
            assert.ok(pieces[i].x1 === pieces[i - 1].x2 && pieces[i].y1 === pieces[i - 1].y2, `${entry.case}: piece ${i} starts where the one before ends`);
    }

    for (const entry of corpus.edges)
        sameSegments(radarEdges(entry.spots), entry.expected, entry.case);
});

function sameSegments(actual: readonly Segment[], expected: readonly CorpusSegment[], name: string): void {
    assert.equal(actual.length, expected.length, `${name} (count)`);

    for (let i = 0; i < actual.length; i++) {
        close(actual[i].x1, expected[i][0], `${name} (${i} x1)`);
        close(actual[i].y1, expected[i][1], `${name} (${i} y1)`);
        close(actual[i].x2, expected[i][2], `${name} (${i} x2)`);
        close(actual[i].y2, expected[i][3], `${name} (${i} y2)`);
    }
}

test("corpus: the stack a series stands on", () => {
    for (const entry of corpus.stacks) {
        const series = entry.series.map(seriesOf);

        stackSeries(series);

        assert.deepEqual(series.map(one => one.drawn.map(point => point.y)), entry.expected, entry.case);
        assert.deepEqual(series.map(one => one.drawn.map(point => point.base ?? null)), entry.bases, entry.case);
    }
});

test("corpus: the band one x owns and the bar's place in it", () => {
    for (const entry of corpus.bands)
        close(bandWidth(entry.length, entry.slots), entry.expected, entry.case);

    for (const entry of corpus.slots)
        assert.equal(barSlots(entry.series.map(pointsOf), entry.band), entry.expected, entry.case);

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

test("corpus: a radar's spokes, how far a value reaches along one, and the shape through them", () => {
    for (const entry of corpus.spokes)
        assert.deepEqual(radarSpokes(entry.series.map(pointsOf)), entry.expected, entry.case);

    for (const entry of corpus.spokeAngles) {
        close(spokeAngle(entry.index, entry.count), entry.expected, entry.case);
        assert.equal(spokeAnchor(spokeAngle(entry.index, entry.count)), entry.anchor, `${entry.case} (anchor)`);
    }

    for (const entry of corpus.radarReaches)
        close(radarReach(entry.scale, entry.value, entry.radius), entry.expected, entry.case);

    for (const entry of corpus.radarRadii)
        close(radarRadius(entry.width, entry.height, entry.across, entry.down), entry.expected, entry.case);

    for (const entry of corpus.outlines)
        assert.equal(radarOutline(entry.spots), entry.expected, entry.case);
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
        const extent = windowExtent(entry.series.map(pointsOf), entry.window);

        close(extent.min, entry.expected.min, `${entry.case} (min)`);
        close(extent.max, entry.expected.max, `${entry.case} (max)`);
    }
});
