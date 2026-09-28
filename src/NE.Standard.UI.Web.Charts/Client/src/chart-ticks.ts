// The arithmetic of an axis: the range it covers, the round step it is marked at, and where a value lands in the plot. The port
// of `ChartRange`, `ChartTicks`, `ChartScale` and `ChartPlot` in NE.Standard.UI.Charts.

import { MaxTime, MinTime, floorToStep, monthOf, monthStart, monthsOf } from "./chart-calendar.ts";
import type { AxisKind, ChartAxis } from "./chart-model.ts";

/** No axis is marked more often than this, whatever the range and the count asked for. */
const MaximumTicks = 200;

/** No default format writes more decimals than a double holds. */
const MaximumDecimals = 15;

const Second = 1000;
const Minute = 60 * Second;
const Hour = 60 * Minute;
const Day = 24 * Hour;
const Year = 365 * Day;

// The intervals a clock is read at, not the round numbers a decimal step would land on: 15 minutes rather than 10, 6 hours rather
// than 5.
const TimeSteps = [
    Second, 2 * Second, 5 * Second, 10 * Second, 15 * Second, 30 * Second,
    Minute, 2 * Minute, 5 * Minute, 10 * Minute, 15 * Minute, 30 * Minute,
    Hour, 2 * Hour, 3 * Hour, 6 * Hour, 12 * Hour,
    Day, 2 * Day, 7 * Day, 14 * Day, 30 * Day, 90 * Day, 180 * Day, Year
];

export type Scale = {
    readonly min: number;
    readonly max: number;
    readonly logarithmic: boolean;
};

export type Plot = {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
};

/** Where the value falls in the range: zero at the low end, one at the high end. */
export function fraction(scale: Scale, value: number): number {
    if (scale.logarithmic) {
        if (value <= 0 || scale.min <= 0 || scale.max <= 0)
            return 0;

        const low = Math.log10(scale.min);
        const span = Math.log10(scale.max) - low;

        return span <= 0 ? 0 : (Math.log10(value) - low) / span;
    }

    const width = scale.max - scale.min;

    return width <= 0 ? 0 : (value - scale.min) / width;
}

/** The value at a fraction of the range: the inverse of `fraction`, which is what a pointer's place on the plot asks for. */
export function valueOf(scale: Scale, share: number): number {
    if (scale.logarithmic) {
        if (scale.min <= 0 || scale.max <= 0)
            return scale.min;

        const low = Math.log10(scale.min);

        return 10 ** (low + share * (Math.log10(scale.max) - low));
    }

    return scale.min + share * (scale.max - scale.min);
}

/** The value held inside the range, whichever way round an author's fixed ends put it. */
export function within(scale: Scale, value: number): number {
    return Math.min(Math.max(value, Math.min(scale.min, scale.max)), Math.max(scale.min, scale.max));
}

/** Where the value stands across the plot. */
export function plotX(plot: Plot, scale: Scale, value: number): number {
    return plot.left + fraction(scale, value) * plot.width;
}

/** Where the value stands up the plot, the low end of the range at the bottom. */
export function plotY(plot: Plot, scale: Scale, value: number): number {
    return plot.top + (1 - fraction(scale, value)) * plot.height;
}

/**
 * Where the value stands down the plot, the low end of the range at the top — the band axis of a chart drawn on its side.
 */
export function plotDown(plot: Plot, scale: Scale, value: number): number {
    return plot.top + fraction(scale, value) * plot.height;
}

/** The right edge of the plot. */
export function plotRight(plot: Plot): number {
    return plot.left + plot.width;
}

/** The bottom edge of the plot. */
export function plotBottom(plot: Plot): number {
    return plot.top + plot.height;
}

/**
 * The step a range of this kind is marked at, aiming for the given number of marks. A logarithmic range is marked at the powers of
 * ten, and answers with the power at its low end — the finest mark a label has to write.
 */
export function step(kind: AxisKind, min: number, max: number, count: number): number {
    const target = (max - min) / Math.max(1, count);

    if (target <= 0 || !Number.isFinite(target))
        return 1;

    if (kind === "Category")
        return 1;

    if (kind === "Logarithmic")
        return min > 0 ? 10 ** Math.floor(Math.log10(min)) : 1;

    if (kind !== "Time")
        return decimalStep(target);

    for (const candidate of TimeSteps) {
        if (candidate >= target)
            return candidate;
    }

    // Beyond a year the ladder runs out and round numbers of years take over.
    return decimalStep(target / Year) * Year;
}

/** The values the axis marks, low end first. */
export function ticks(kind: AxisKind, scale: Scale, count: number): number[] {
    if (scale.max <= scale.min)
        return [];

    if (kind === "Logarithmic")
        return powersOfTen(scale);

    let size = step(kind, scale.min, scale.max, count);
    const slack = size * 1e-9;
    const months = kind === "Time" ? monthsOf(size) : 0;

    if (months > 0)
        return calendarMarks(scale, months, slack);

    // Past the most marks an axis carries, the names are thinned by a stride rather than cut off after the two hundredth.
    if (kind === "Category")
        size = Math.max(1, Math.ceil((Math.floor(scale.max) - Math.ceil(scale.min) + 1) / MaximumTicks));

    // A step the range does not divide starts at the first multiple inside it, so the marks are round numbers, not the range's ends.
    const first = Math.ceil(scale.min / size) * size;
    const values: number[] = [];

    // Never a negative zero, which a mark just under the low end can be and which would be written as "-0".
    for (let value = first; value <= scale.max + slack && values.length < MaximumTicks; value += size)
        values.push(value === 0 ? 0 : value);

    return values;
}

/** The first of every month a step of whole months lands on inside the range: a quarter on January, April, July and October. */
function calendarMarks(scale: Scale, months: number, slack: number): number[] {
    let month = floorToStep(monthOf(scale.min), months);

    if (monthStart(month) < scale.min - slack)
        month += months;

    const values: number[] = [];

    for (let value = monthStart(month); value <= scale.max + slack && values.length < MaximumTicks; value = monthStart(month)) {
        values.push(value === 0 ? 0 : value);
        month += months;
    }

    return values;
}

/** The format a tick is written under when the author named none: as many decimals as the step needs, or the part of a clock the step moves. */
export function defaultFormat(kind: AxisKind, size: number): string | null {
    if (kind === "Category")
        return null;

    if (kind === "Time") {
        if (size < Minute)
            return "HH:mm:ss";

        if (size < Day)
            return "HH:mm";

        return size < 30 * Day ? "dd MMM" : "MMM yyyy";
    }

    if (size >= 1)
        return "N0";

    // The place the step's first digit stands at; the nudge keeps a power of ten that log10 reads a hair low on its own place.
    const decimals = -Math.floor(Math.log10(size) + 1e-9);

    return `N${Math.min(MaximumDecimals, decimals)}`;
}

/**
 * The range the axis covers over data of this extent; the ends the author fixed stand, the rest follow the data, rounded
 * outward. A chart whose marks stand on a baseline — an area, a bar — passes `includeZero` so the range reaches zero.
 */
export function resolveRange(axis: ChartAxis, dataMin: number, dataMax: number, categoryCount: number, includeZero = false): Scale {
    // A category stands in the middle of its own place, so the range reaches half a place past the first and the last.
    if (axis.kind === "Category")
        return { min: -0.5, max: Math.max(0.5, categoryCount - 0.5), logarithmic: false };

    const hasData = Number.isFinite(dataMin) && Number.isFinite(dataMax) && dataMax >= dataMin;
    let min = axis.min ?? (hasData ? dataMin : 0);
    let max = axis.max ?? (hasData ? dataMax : 1);

    // Zero is the end the author left open, never the one they fixed.
    if (includeZero && axis.kind !== "Logarithmic") {
        min = axis.min ?? Math.min(0, min);
        max = axis.max ?? Math.max(0, max);
    }

    if (axis.kind === "Logarithmic") {
        // A logarithmic axis has no place for zero: it starts at the power of ten under the smallest value it was given.
        const low = axis.min ?? 10 ** Math.floor(Math.log10(min > 0 ? min : 1));
        const high = axis.max ?? 10 ** Math.ceil(Math.log10(max > 0 ? max : 10));
        const bottom = low > 0 ? low : 1;

        return { min: bottom, max: high > bottom ? high : bottom * 10, logarithmic: true };
    }

    if (max - min <= 0) {
        // One value, or a range flattened to a point: a band around it rather than a scale of no width. A moment's number counts
        // from 1970, so an eighth of it would be years; a day either side of it is what one reading is read against.
        const padding = axis.kind === "Time" ? Day : Math.abs(min) > 0 ? Math.abs(min) / 8 : 1;

        // An end the author fixed past the data leaves the open one built from it, so the range never runs backward.
        return withinTime(axis.kind, axis.min ?? Math.min(min, max) - padding, axis.max ?? Math.max(min, max) + padding);
    }

    const size = step(axis.kind, min, max, axis.ticks);
    const months = axis.kind === "Time" ? monthsOf(size) : 0;

    if (months === 0)
        return withinTime(axis.kind, axis.min ?? Math.floor(min / size) * size, axis.max ?? Math.ceil(max / size) * size);

    // A step of whole months rounds out to the first of a month it marks, not to a multiple of days from the epoch.
    let last = floorToStep(monthOf(max), months);

    if (monthStart(last) < max)
        last += months;

    return withinTime(axis.kind, axis.min ?? monthStart(floorToStep(monthOf(min), months)), axis.max ?? monthStart(last));
}

/** A time axis stays inside the moments the server's `DateTime` can name, so no mark on it is one nothing can write. */
function withinTime(kind: AxisKind, min: number, max: number): Scale {
    if (kind !== "Time")
        return { min, max, logarithmic: false };

    const low = Math.min(Math.max(min, MinTime), MaxTime);
    const high = Math.min(Math.max(max, MinTime), MaxTime);

    // A range pressed flat against an end keeps a day's width inside it.
    if (high > low)
        return { min: low, max: high, logarithmic: false };

    return low > MinTime ? { min: low - Day, max: low, logarithmic: false } : { min: low, max: low + Day, logarithmic: false };
}

/** The nearest round number at or above the target: one, two or five times a power of ten. */
function decimalStep(target: number): number {
    const magnitude = 10 ** Math.floor(Math.log10(target));
    const normalized = target / magnitude;

    return normalized <= 1 ? magnitude : normalized <= 2 ? 2 * magnitude : normalized <= 5 ? 5 * magnitude : 10 * magnitude;
}

/** Every power of ten inside the range; the range's own ends when it holds fewer than two. */
function powersOfTen(scale: Scale): number[] {
    if (scale.min <= 0)
        return [];

    const first = Math.ceil(Math.log10(scale.min));
    const last = Math.floor(Math.log10(scale.max));

    if (last - first + 1 < 2)
        return [scale.min, scale.max];

    const values: number[] = [];

    for (let i = 0; i < Math.min(MaximumTicks, last - first + 1); i++)
        values.push(10 ** (first + i));

    return values;
}
