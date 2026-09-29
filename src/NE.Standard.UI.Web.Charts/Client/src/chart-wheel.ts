// What a wheel turn over a zoomable chart does to its window, worked out before the event is taken: a turn with nothing to
// change leaves the page's own scroll alone.

import type { WheelPixels } from "ne-standard-ui";
import { zoomWindow } from "./chart-window.ts";
import type { Span } from "./chart-window.ts";

/** The zoom notches one wheel event turned, by distance: none for a mostly sideways turn, and at most `most` either way. */
export function zoomNotches(pixels: WheelPixels, notch: number, most: number): number {
    if (!Number.isFinite(pixels.y) || Math.abs(pixels.x) > Math.abs(pixels.y))
        return 0;

    return Math.min(Math.max(pixels.y / notch, -most), most);
}

/** The window a wheel leaves, scaled by `factor` about `at`; unchanged at either limit, so a turn past it is no change. */
export function wheelWindow(view: Span | null, whole: Span, at: number, factor: number): Span | null {
    const current = view ?? whole;
    const moved = zoomWindow(current, at, factor, whole.from, whole.to);

    if (Math.abs((moved.to - moved.from) - (current.to - current.from)) <= slackOf(whole))
        return view;

    return narrowed(moved, whole);
}

/** Whether two windows are the same stretch: both none, or the same two ends. */
export function sameWindow(left: Span | null, right: Span | null): boolean {
    if (left === null || right === null)
        return left === right;

    return left.from === right.from && left.to === right.to;
}

/**
 * A window covering the whole of the data is no window at all: widening past the ends returns the chart's own range, so it
 * follows new data as before instead of sliding.
 */
function narrowed(view: Span, whole: Span): Span | null {
    return view.to - view.from >= whole.to - whole.from - slackOf(whole) ? null : view;
}

/** How near two widths may be and still read as one, against the whole the window is taken from. */
function slackOf(whole: Span): number {
    return (whole.to - whole.from) * 1e-6;
}
