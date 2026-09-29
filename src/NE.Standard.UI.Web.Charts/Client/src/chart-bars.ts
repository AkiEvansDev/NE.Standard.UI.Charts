// Where a bar stands within the band one x owns. The port of `ChartBars` in NE.Standard.UI.Charts.

import type { ChartPoint } from "./chart-path.ts";
import type { Scale } from "./chart-ticks.ts";

/** How much of a band the bars take; the rest is the air that tells one x from the next. */
const BandFill = 0.72;

/** No bar is thinner than this, however many of them share a band. */
const MinimumThickness = 1;

/** One bar's place across its band, in the direction the band runs — down the box on a chart drawn on its side. */
export type Bar = {
    readonly start: number;
    readonly thickness: number;
};

/** How many places the bars share: one per x inside the range shown, so a zoomed window widens the bars it keeps. */
export function barSlots(series: readonly (readonly ChartPoint[])[], band: Scale): number {
    const places = new Set<number>();

    for (const points of series) {
        for (const point of points) {
            if (point.x >= band.min && point.x <= band.max)
                places.add(point.x);
        }
    }

    return places.size;
}

/**
 * How much of the band axis one x takes, in the units the chart is drawn in; the length is the plot's own across the axis the
 * bands run along.
 */
export function bandWidth(length: number, slots: number): number {
    return length / Math.max(1, slots);
}

/** One bar inside the band around `center`: the band's fill for a stack, its share of it for a group. */
export function barOf(center: number, band: number, seriesIndex: number, seriesCount: number, stacked: boolean): Bar {
    const inner = band * BandFill;

    if (stacked || seriesCount <= 1)
        return { start: center - inner / 2, thickness: Math.max(MinimumThickness, inner) };

    const thickness = inner / seriesCount;

    return { start: center - inner / 2 + seriesIndex * thickness, thickness: Math.max(MinimumThickness, thickness) };
}
