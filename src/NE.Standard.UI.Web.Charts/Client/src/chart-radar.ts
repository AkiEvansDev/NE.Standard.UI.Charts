// A radar: a spoke per x the series hold, the turn shared evenly between them clockwise from twelve o'clock, and a value's reach
// along its spoke. The port of `ChartRadar` in NE.Standard.UI.Charts.

import { coord } from "./chart-path.ts";
import type { ChartPoint } from "./chart-path.ts";
import type { Spot } from "./chart-pie.ts";
import { fraction, within } from "./chart-ticks.ts";
import type { Scale } from "./chart-ticks.ts";

/** A turn, which the spokes share evenly. */
const Turn = Math.PI * 2;

/** Twelve o'clock, where the first spoke stands. */
const Top = -Math.PI / 2;

/**
 * The x every spoke stands for: each one any series holds, once, low to high — which for names is the order they were met in. A
 * row with no value still names its spoke.
 */
export function radarSpokes(series: readonly (readonly ChartPoint[])[]): number[] {
    const places = new Set<number>();

    for (const points of series) {
        for (const point of points)
            places.add(point.x);
    }

    return [...places].sort((left, right) => left - right);
}

/** The angle of a spoke, clockwise from twelve o'clock. */
export function spokeAngle(index: number, count: number): number {
    return count <= 0 ? Top : Top + (index * Turn) / count;
}

/**
 * How far along its spoke a value reaches: the centre is the low end of the range and the rim the high end; a value outside the
 * range stops at its end, and no value stays at the centre.
 */
export function radarReach(scale: Scale, value: number | null, radius: number): number {
    return value === null ? 0 : radius * Math.min(Math.max(fraction(scale, within(scale, value)), 0), 1);
}

/** The biggest radius the box holds with room left beside the rim for the spokes' names: across each side, and down. */
export function radarRadius(width: number, height: number, across: number, down: number): number {
    return Math.max(0, Math.min(width / 2 - across, height / 2 - down));
}

/** The closed shape through the places, one per spoke in order: a series' outline, or one ring of the grid. */
export function radarOutline(spots: readonly Spot[]): string {
    if (spots.length === 0)
        return "";

    const parts = [`M${coord(spots[0].x)} ${coord(spots[0].y)}`];

    for (let i = 1; i < spots.length; i++)
        parts.push(`L${coord(spots[i].x)} ${coord(spots[i].y)}`);

    return `${parts.join(" ")} Z`;
}

/**
 * How a spoke's name is anchored beside its tip: after it on the right of the turn, before it on the left, and centred at twelve
 * and six o'clock.
 */
export function spokeAnchor(angle: number): "start" | "middle" | "end" {
    const across = Math.cos(angle);

    return across > 0.3 ? "start" : across < -0.3 ? "end" : "middle";
}
