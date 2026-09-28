// A stack of series: each carries the ones before it, so the total is what the viewer reads at an x — excluding any series the
// legend hid. The port of `ChartStacking` in NE.Standard.UI.Charts.

import type { ChartPoint } from "./chart-path.ts";
import type { ChartSeriesData } from "./chart-rows.ts";

/**
 * Gives every series the points it is drawn from: its own with the ones before it added under them, a point's value its top and
 * its `base` where it starts. Positive and negative values stack apart, each from zero outward, so a part below zero is never
 * drawn over by one above it; a point stands on its own side's total, not on the series under it, which may hold nothing there.
 */
export function stackSeries(series: readonly ChartSeriesData[]): void {
    const above = new Map<number, number>();
    const below = new Map<number, number>();

    for (const entry of series) {
        const drawn: ChartPoint[] = [];

        for (const point of entry.points) {
            // A point the row had no value for stays missing and adds nothing, so the stack breaks where the data does.
            if (point.y === null) {
                drawn.push(point);
                continue;
            }

            const totals = point.y < 0 ? below : above;
            const stands = totals.get(point.x) ?? 0;

            totals.set(point.x, stands + point.y);
            drawn.push({ ...point, y: stands + point.y, base: stands });
        }

        entry.drawn = drawn;
    }
}
