// A radar's spokes and reaches; the port of `ChartRadar`.

import { addSegment, coord } from "./chart-path.ts";
import type { ChartPoint, Segment } from "./chart-path.ts";
import type { Spot } from "./chart-pie.ts";
import { fraction, within } from "./chart-ticks.ts";
import type { Scale } from "./chart-ticks.ts";

/** A turn, which the spokes share evenly. */
const Turn = Math.PI * 2;

/** Twelve o'clock, where the first spoke stands. */
const Top = -Math.PI / 2;

/** The x every spoke stands for, once each, low to high; a row with no value still names its spoke. */
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
 * How far along its spoke a value reaches, from the range's low end at the centre; clamped to the range, and a missing value
 * stays at the centre.
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

/** `radarOutline` as straight pieces, for the reason `lineSegments` gives. */
export function radarEdges(spots: readonly Spot[]): Segment[] {
    const edges: Segment[] = [];

    for (let i = 0; i < spots.length && spots.length > 1; i++) {
        const from = spots[i];
        const to = spots[(i + 1) % spots.length];

        addSegment(edges, from.x, from.y, to.x, to.y);
    }

    return edges;
}

/**
 * How a spoke's name is anchored beside its tip: after it on the right of the turn, before it on the left, and centred at twelve
 * and six o'clock.
 */
export function spokeAnchor(angle: number): "start" | "middle" | "end" {
    const across = Math.cos(angle);

    return across > 0.3 ? "start" : across < -0.3 ? "end" : "middle";
}
