// A whole shared out along a line between values, a share bar's and a legend's. The port of `ChartShares` in
// NE.Standard.UI.Charts.

/** One part's place along a whole, both as shares of it from 0 to 1. */
export type Share = {
    readonly start: number;
    readonly length: number;
};

/**
 * What the values are shares of: `total`, or what the values come to where that is more; a value that is zero or negative counts
 * for nothing.
 */
export function shareWhole(values: readonly (number | null)[], total: number | null): number {
    let sum = 0;

    for (const value of values) {
        if (value !== null && Number.isFinite(value) && value > 0)
            sum += value;
    }

    return total !== null && Number.isFinite(total) && total > sum ? total : sum;
}

/**
 * Each value's place along the whole, one after another from its start; a value that is zero, negative or none takes none, and so
 * does every value of a whole that is nothing.
 */
export function sharesOf(values: readonly (number | null)[], total: number | null): Share[] {
    let whole = shareWhole(values, total);
    let scale = 1;

    if (!Number.isFinite(whole)) {
        scale = maxPositive(values, total);
        whole = scale > 0 ? scaledWhole(values, total, scale) : 0;
    }

    const parts: Share[] = [];
    let start = 0;

    for (const value of values) {
        const length = whole > 0 && value !== null && Number.isFinite(value) && value > 0 ? (value / scale) / whole : 0;

        parts.push({ start, length });
        start += length;
    }

    return parts;
}

function maxPositive(values: readonly (number | null)[], total: number | null): number {
    let max = total !== null && Number.isFinite(total) && total > 0 ? total : 0;

    for (const value of values) {
        if (value !== null && Number.isFinite(value) && value > max)
            max = value;
    }

    return max;
}

function scaledWhole(values: readonly (number | null)[], total: number | null, scale: number): number {
    let sum = 0;

    for (const value of values) {
        if (value !== null && Number.isFinite(value) && value > 0)
            sum += value / scale;
    }

    return total !== null && Number.isFinite(total) && (total / scale) > sum ? total / scale : sum;
}
