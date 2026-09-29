// How wide a point is drawn, by area so twice the value reads as twice the ink; the port of `ChartBubbles`.

/** The radius a point with no third value takes. */
export const PlainRadius = 4;

/** The smallest and the largest a sized point is drawn at. */
const SmallestRadius = 3;
const LargestRadius = 18;

/** The least a point answers the pointer over: a mark of three is hard to hit, and every kind of point is worth the same reach. */
const ReachRadius = 11;

/** How wide a point answers the pointer: its own mark where that is the wider, and the least reach where it is not. */
export function pointReach(radius: number): number {
    return Math.max(radius, ReachRadius);
}

/**
 * The radius for a value between `min` and `max`; the plain radius when there is no value, the middle radius when they are equal.
 */
export function bubbleRadius(size: number | null | undefined, min: number, max: number): number {
    if (size === null || size === undefined || !Number.isFinite(min) || !Number.isFinite(max))
        return PlainRadius;

    if (max <= min)
        return (SmallestRadius + LargestRadius) / 2;

    // By area: the radius follows the square root of the share, or a big value swamps the picture.
    const share = Math.min(Math.max((size - min) / (max - min), 0), 1);
    const smallest = SmallestRadius * SmallestRadius;
    const largest = LargestRadius * LargestRadius;

    return Math.sqrt(smallest + share * (largest - smallest));
}
