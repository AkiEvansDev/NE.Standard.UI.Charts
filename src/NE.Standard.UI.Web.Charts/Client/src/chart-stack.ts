// A stack of series: each carries the ones before it, so the total is what the viewer reads at an x — excluding any series the
// legend hid. The port of `ChartStacking` in NE.Standard.UI.Charts.

import type { ChartPoint } from "./chart-path.ts";
import type { ChartSeriesData } from "./chart-rows.ts";

/** Gives every series the points it is drawn from: its own with the ones before it added under them. */
export function stackSeries(series: readonly ChartSeriesData[]): void {
    const totals = new Map<number, number>();

    for (const entry of series) {
        const drawn: ChartPoint[] = [];

        for (const point of entry.points) {
            // A point the row had no value for stays missing and adds nothing, so the stack breaks where the data does.
            if (point.y === null) {
                drawn.push(point);
                continue;
            }

            const total = (totals.get(point.x) ?? 0) + point.y;

            totals.set(point.x, total);
            drawn.push({ ...point, y: total });
        }

        entry.drawn = drawn;
    }
}

/** What a series holds at each x, for the series above it to stand on: built once per series, read once per point. */
export type Baseline = ReadonlyMap<number, number>;

export function baselineOf(series: readonly ChartPoint[]): Baseline {
    const values = new Map<number, number>();

    for (const point of series)
        values.set(point.x, point.y ?? 0);

    return values;
}

/** What the series below holds at this x; zero where it holds nothing, which is where a stack starts. The corpus pins this reading. */
export function valueAt(series: readonly ChartPoint[], x: number): number {
    return baselineOf(series).get(x) ?? 0;
}
