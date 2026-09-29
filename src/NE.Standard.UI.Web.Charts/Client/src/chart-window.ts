// The stretch of the x axis a chart shows, and how a viewer's wheel and drag move it. The port of `ChartWindow` in
// NE.Standard.UI.Charts.

import type { ChartPoint } from "./chart-path.ts";

/** The least a window may cover, as a share of the whole extent — deep enough to read one point, never a singularity. */
const SmallestShare = 0.002;

/** A stretch of the x axis, in the units the axis is read in. */
export type Span = {
    readonly from: number;
    readonly to: number;
};

/** How much of the axis a stretch covers. */
function spanWidth(span: Span): number {
    return span.to - span.from;
}

/** The window kept inside the data, no narrower than the smallest share of it, slid back rather than stretched. */
export function clampWindow(span: Span, min: number, max: number): Span {
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min)
        return { from: min, to: max };

    const whole = max - min;
    const smallest = whole * SmallestShare;
    const width = Math.min(Math.max(Number.isFinite(spanWidth(span)) && spanWidth(span) > 0 ? spanWidth(span) : whole, smallest), whole);

    // As wide as the whole is the whole: max - width can land a hair under min, and the window would hang off the start.
    if (width >= whole)
        return { from: min, to: max };

    // Slid, not stretched: a window pushed past an end keeps the width the viewer zoomed to.
    const from = Math.max(Math.min(Number.isFinite(span.from) ? span.from : min, max - width), min);

    return { from, to: from + width };
}

/**
 * The window a wheel leaves: narrower or wider by `factor`, about the value under the pointer, so the point the viewer is
 * reading stays where it is.
 */
export function zoomWindow(span: Span, at: number, factor: number, min: number, max: number): Span {
    if (!Number.isFinite(factor) || factor <= 0 || !Number.isFinite(at))
        return clampWindow(span, min, max);

    const width = spanWidth(span) * factor;
    const share = spanWidth(span) > 0 ? Math.min(Math.max((at - span.from) / spanWidth(span), 0), 1) : 0.5;

    return clampWindow({ from: at - share * width, to: at - share * width + width }, min, max);
}

/** The window a drag leaves: the same width, moved by `by` along the axis. */
export function panWindow(span: Span, by: number, min: number, max: number): Span {
    return Number.isFinite(by) ? clampWindow({ from: span.from + by, to: span.to + by }, min, max) : clampWindow(span, min, max);
}

/** The window kept on the far end as the data grows: the same width, ending where the data now does. */
export function followWindow(span: Span, min: number, max: number): Span {
    return clampWindow({ from: max - spanWidth(span), to: max }, min, max);
}

/** What the series reach inside the window, with the point either side so a line entering the view starts at its true value. */
export function windowExtent(series: readonly (readonly ChartPoint[])[], window: Span | null): { min: number; max: number } {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const points of series) {
        for (let i = 0; i < points.length; i++) {
            const value = points[i].y;

            if (value === null || !reaches(points, i, window))
                continue;

            min = Math.min(min, value);
            max = Math.max(max, value);
        }
    }

    return { min, max };
}

/** Whether a point is drawn in the window, or is the one either side of it that the line comes from. */
function reaches(points: readonly ChartPoint[], index: number, window: Span | null): boolean {
    if (window === null)
        return true;

    const x = points[index].x;

    if (x >= window.from && x <= window.to)
        return true;

    return (index + 1 < points.length && points[index + 1].x >= window.from && points[index + 1].x <= window.to)
        || (index > 0 && points[index - 1].x >= window.from && points[index - 1].x <= window.to);
}
