// A stack of series, each on the ones before it; the port of `ChartStacking`.

import type { ChartPoint } from "./chart-path.ts";
import type { ChartSeriesData } from "./chart-rows.ts";

/**
 * Gives every series the points it is drawn from, a point's `base` where it starts. Positive and negative values stack apart,
 * so a part below zero is never drawn over; a point stands on its own side's total, since the series under it may hold nothing there.
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
