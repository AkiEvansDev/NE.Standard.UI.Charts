// The number a time axis reads a moment as, and the moment it stands for. The port of `ChartValues.FromDateTime`/`ToDateTime`
// in NE.Standard.UI.Charts, numbering by wall clock so both sides land on the same places.

import type { WrittenMoment } from "ne-standard-ui";

/** What reads a moment off the wire's text: the framework's parser, handed in so the arithmetic stays a function of its arguments. */
export type MomentParser = (text: string) => WrittenMoment | null;

/** The wall clock a moment is written with, as milliseconds: the same number whatever zone the reader sits in. */
export function momentNumber(moment: WrittenMoment): number {
    return Date.UTC(moment.year, moment.month - 1, moment.day, moment.hour, moment.minute, moment.second, moment.millisecond);
}

/**
 * The moment a time axis's number stands for, as a date whose own fields read that wall clock — the axis's number is a wall
 * clock, not an instant.
 */
export function momentDate(value: number): Date {
    // The offset in force at the moment itself, not at the instant the number would otherwise name, which a zone's change moves.
    const guess = new Date(value + new Date(value).getTimezoneOffset() * 60_000);

    return new Date(value + guess.getTimezoneOffset() * 60_000);
}
