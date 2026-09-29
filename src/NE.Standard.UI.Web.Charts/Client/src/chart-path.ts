// A series as the SVG it becomes; the port of `ChartPath`, so a server- and a browser-drawn chart match exactly.

import { plotX, plotY, within } from "./chart-ticks.ts";
import type { Plot, Scale } from "./chart-ticks.ts";

export type ChartPoint = {
    readonly key: string;
    readonly x: number;
    readonly y: number | null;
    /** A third value the point is sized by, where the series names one. */
    readonly size?: number | null;
    /** Where a stacked point's bar or band starts: the total of its own side of the stack under it; absent where it stands on zero. */
    readonly base?: number | null;
};

/** One straight piece of a drawn line, from one place to the next. */
export type Segment = {
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
};

type Vertex = {
    readonly x: number;
    readonly y: number;
};

/** About how long a piece of a curve is, in drawing units: short enough that the pieces read as the curve. */
const CurvePiece = 4;

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
 * The band between a series' line and what it stands on — each point's own `base` in a stack, or the axis's zero — closed like
 * the line.
 */
export function areaPath(points: readonly ChartPoint[], x: Scale, y: Scale, plot: Plot, stepped: boolean, smooth: boolean): string {
    const zero = plotY(plot, y, within(y, 0));
    let path = "";
    let start = -1;

    for (let i = 0; i <= points.length; i++) {
        if (i < points.length && points[i].y !== null) {
            if (start < 0)
                start = i;

            continue;
        }

        if (start >= 0)
            path = appendBand(path, points, start, i - 1, x, y, plot, stepped, smooth, zero);

        start = -1;
    }

    return path;
}

/**
 * The line `linePath` describes as straight pieces: Chrome antialiases a path at four samples a pixel, a staircase, and a lone
 * line smoothly.
 */
export function lineSegments(points: readonly ChartPoint[], x: Scale, y: Scale, plot: Plot, stepped: boolean, smooth: boolean): Segment[] {
    const segments: Segment[] = [];
    let run: Vertex[] = [];

    for (const point of points) {
        if (point.y !== null) {
            run.push({ x: plotX(plot, x, point.x), y: plotY(plot, y, point.y) });
            continue;
        }

        addRunPieces(segments, run, stepped, smooth);
        run = [];
    }

    addRunPieces(segments, run, stepped, smooth);

    return segments;
}

/** One unbroken run's pieces, the way `linePath` walks it: straight, stepped, or curved. */
function addRunPieces(segments: Segment[], run: readonly Vertex[], stepped: boolean, smooth: boolean): void {
    if (run.length < 2)
        return;

    if (stepped) {
        addStepPieces(segments, run);
        return;
    }

    for (let i = 1; i < run.length; i++) {
        if (smooth)
            addCurvePieces(segments, run, i);
        else
            addSegment(segments, run[i - 1].x, run[i - 1].y, run[i].x, run[i].y);
    }
}

/** The stair `steps` draws: across to halfway, up or down to the next value, and across to the last point. */
function addStepPieces(segments: Segment[], run: readonly Vertex[]): void {
    let atX = run[0].x;
    let atY = run[0].y;

    for (let i = 1; i < run.length; i++) {
        const middle = (run[i - 1].x + run[i].x) / 2;

        addSegment(segments, atX, atY, middle, atY);
        addSegment(segments, middle, atY, middle, run[i].y);
        atX = middle;
        atY = run[i].y;
    }

    addSegment(segments, atX, atY, run[run.length - 1].x, atY);
}

/** The curve `curve` draws into a point, cut into pieces about `CurvePiece` long. */
function addCurvePieces(segments: Segment[], run: readonly Vertex[], index: number): void {
    const before = Math.max(0, index - 2);
    const after = Math.min(run.length - 1, index + 1);

    const startX = run[index - 1].x;
    const startY = run[index - 1].y;
    const endX = run[index].x;
    const endY = run[index].y;
    const firstX = startX + (endX - run[before].x) / 6;
    const firstY = startY + (endY - run[before].y) / 6;
    const secondX = endX - (run[after].x - startX) / 6;
    const secondY = endY - (run[after].y - startY) / 6;

    const reach = distance(startX, startY, firstX, firstY) + distance(firstX, firstY, secondX, secondY) + distance(secondX, secondY, endX, endY);
    const pieces = Math.max(1, Math.ceil(reach / CurvePiece));
    let atX = startX;
    let atY = startY;

    for (let k = 1; k <= pieces; k++) {
        const t = k / pieces;
        const rest = 1 - t;
        const a = rest * rest * rest;
        const b = 3 * rest * rest * t;
        const c = 3 * rest * t * t;
        const d = t * t * t;
        const nextX = a * startX + b * firstX + c * secondX + d * endX;
        const nextY = a * startY + b * firstY + c * secondY + d * endY;

        addSegment(segments, atX, atY, nextX, nextY);
        atX = nextX;
        atY = nextY;
    }
}

function distance(fromX: number, fromY: number, toX: number, toY: number): number {
    return Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
}

/** A piece from one place to another; none where the two are the same place, which would draw a dot of the line's cap. */
export function addSegment(segments: Segment[], fromX: number, fromY: number, toX: number, toY: number): void {
    if (fromX !== toX || fromY !== toY)
        segments.push({ x1: fromX, y1: fromY, x2: toX, y2: toY });
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

/** One unbroken stretch of the band: the tops from `from` to `to`, then the bases back. */
function appendBand(
    path: string,
    points: readonly ChartPoint[],
    from: number,
    to: number,
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
    if (points[from].base === undefined || points[from].base === null)
        return result + ` L${coord(top[top.length - 1].x)} ${coord(zero)} L${coord(top[0].x)} ${coord(zero)} Z`;

    const bottom: Vertex[] = [];

    for (let i = to; i >= from; i--)
        bottom.push({ x: plotX(plot, x, points[i].x), y: plotY(plot, y, points[i].base ?? 0) });

    result += ` L${coord(bottom[0].x)} ${coord(bottom[0].y)}`;

    return result + segments(bottom, stepped, smooth) + " Z";
}
