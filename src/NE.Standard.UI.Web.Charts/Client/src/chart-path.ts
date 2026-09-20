// A series as the SVG path string it becomes. The port of `ChartPath` in NE.Standard.UI.Charts, so a server- and browser-drawn
// chart match exactly.

import { baselineOf } from "./chart-stack.ts";
import type { Baseline } from "./chart-stack.ts";
import { plotX, plotY } from "./chart-ticks.ts";
import type { Plot, Scale } from "./chart-ticks.ts";

export type ChartPoint = {
    readonly key: string;
    readonly x: number;
    readonly y: number | null;
    /** A third value the point is sized by, where the series names one. */
    readonly size?: number | null;
};

type Vertex = {
    readonly x: number;
    readonly y: number;
};

/** The line through the points, broken wherever a row had no value — a run of one point draws nothing, and its marker shows it. */
export function linePath(points: readonly ChartPoint[], x: Scale, y: Scale, plot: Plot, stepped: boolean, smooth: boolean): string {
    let path = "";
    let run: Vertex[] = [];

    for (const point of points) {
        if (point.y !== null) {
            run.push({ x: plotX(plot, x, point.x), y: plotY(plot, y, point.y) });
            continue;
        }

        path = appendRun(path, run, stepped, smooth);
        run = [];
    }

    return appendRun(path, run, stepped, smooth);
}

/**
 * The band between a series' line and its baseline — the series below it in a stack, or the axis's zero when there is none —
 * closed like the line.
 */
export function areaPath(
    points: readonly ChartPoint[],
    baseline: readonly ChartPoint[] | null,
    x: Scale,
    y: Scale,
    plot: Plot,
    stepped: boolean,
    smooth: boolean
): string {
    const zero = plotY(plot, y, Math.min(Math.max(0, y.min), y.max));
    // Once per series, not once per point: the series below is read by x for every point of this one.
    const stands = baseline === null ? null : baselineOf(baseline);
    let path = "";
    let start = -1;

    for (let i = 0; i <= points.length; i++) {
        if (i < points.length && points[i].y !== null) {
            if (start < 0)
                start = i;

            continue;
        }

        if (start >= 0)
            path = appendBand(path, points, start, i - 1, stands, x, y, plot, stepped, smooth, zero);

        start = -1;
    }

    return path;
}

/** A coordinate as the markup carries it: two decimals at most, and never a negative zero. */
export function coord(value: number): string {
    if (!Number.isFinite(value))
        return "0";

    const rounded = Math.round(value * 100) / 100;

    return String(rounded === 0 ? 0 : rounded);
}

function appendRun(path: string, run: readonly Vertex[], stepped: boolean, smooth: boolean): string {
    if (run.length === 0)
        return path;

    const prefix = path.length > 0 ? path + " " : "";

    return prefix + `M${coord(run[0].x)} ${coord(run[0].y)}` + segments(run, stepped, smooth);
}

function segments(run: readonly Vertex[], stepped: boolean, smooth: boolean): string {
    if (stepped)
        return steps(run);

    let result = "";

    for (let i = 1; i < run.length; i++) {
        if (smooth) {
            result += curve(run, i);
            continue;
        }

        result += ` L${coord(run[i].x)} ${coord(run[i].y)}`;
    }

    return result;
}

/**
 * A stair centred on its points: a value holds from halfway back to halfway on, so a point's mark sits mid-step, not on a
 * corner.
 */
function steps(run: readonly Vertex[]): string {
    if (run.length < 2)
        return "";

    let result = "";

    for (let i = 1; i < run.length; i++)
        result += ` H${coord((run[i - 1].x + run[i].x) / 2)} V${coord(run[i].y)}`;

    return result + ` H${coord(run[run.length - 1].x)}`;
}

/** One segment as a cubic whose handles follow the points on either side — a Catmull-Rom curve, which passes through every point. */
function curve(run: readonly Vertex[], index: number): string {
    const before = Math.max(0, index - 2);
    const after = Math.min(run.length - 1, index + 1);

    const firstX = run[index - 1].x + (run[index].x - run[before].x) / 6;
    const firstY = run[index - 1].y + (run[index].y - run[before].y) / 6;
    const secondX = run[index].x - (run[after].x - run[index - 1].x) / 6;
    const secondY = run[index].y - (run[after].y - run[index - 1].y) / 6;

    return ` C${coord(firstX)} ${coord(firstY)} ${coord(secondX)} ${coord(secondY)} ${coord(run[index].x)} ${coord(run[index].y)}`;
}

/** One unbroken stretch of the band: the tops from `from` to `to`, then the baseline back. */
function appendBand(
    path: string,
    points: readonly ChartPoint[],
    from: number,
    to: number,
    baseline: Baseline | null,
    x: Scale,
    y: Scale,
    plot: Plot,
    stepped: boolean,
    smooth: boolean,
    zero: number
): string {
    const top: Vertex[] = [];

    for (let i = from; i <= to; i++)
        top.push({ x: plotX(plot, x, points[i].x), y: plotY(plot, y, points[i].y as number) });

    let result = appendRun(path, top, stepped, smooth);

    // Nothing under it: the band closes on the axis's zero, which is one straight edge whatever the line did.
    if (baseline === null)
        return result + ` L${coord(top[top.length - 1].x)} ${coord(zero)} L${coord(top[0].x)} ${coord(zero)} Z`;

    const bottom: Vertex[] = [];

    for (let i = to; i >= from; i--)
        bottom.push({ x: plotX(plot, x, points[i].x), y: plotY(plot, y, baseline.get(points[i].x) ?? 0) });

    result += ` L${coord(bottom[0].x)} ${coord(bottom[0].y)}`;

    return result + segments(bottom, stepped, smooth) + " Z";
}
