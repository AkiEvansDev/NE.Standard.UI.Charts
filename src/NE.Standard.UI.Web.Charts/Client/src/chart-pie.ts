// A turn shared out: the angle every value takes, and where a place on the turn lies. The port of
// `ChartPie` in NE.Standard.UI.Charts.

/** A turn, which is what the values share out between them. */
const Turn = Math.PI * 2;

/** Twelve o'clock, where the first sector starts. */
const Top = -Math.PI / 2;

/** One sector's share of the turn, in radians clockwise from twelve o'clock. */
export type Sector = {
    readonly start: number;
    readonly sweep: number;
};

/** A place in the drawing. */
export type Spot = {
    readonly x: number;
    readonly y: number;
};

/**
 * The angle each value takes, clockwise from twelve o'clock. A value that is zero or negative takes none; when every value
 * does, each takes nothing.
 */
export function sectorsOf(values: readonly (number | null)[]): Sector[] {
    let total = 0;

    for (const value of values) {
        if (value !== null && value > 0)
            total += value;
    }

    const sectors: Sector[] = [];
    let angle = Top;

    for (const value of values) {
        const sweep = total > 0 && value !== null && value > 0 ? (value / total) * Turn : 0;

        sectors.push({ start: angle, sweep });
        angle += sweep;
    }

    return sectors;
}

/** A place at that distance from the centre, at that angle. */
export function spotAt(centre: Spot, distance: number, angle: number): Spot {
    return { x: centre.x + Math.cos(angle) * distance, y: centre.y + Math.sin(angle) * distance };
}
