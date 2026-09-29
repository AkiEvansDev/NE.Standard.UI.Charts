// A time axis's marks at a step of a month or more, on the first of a month rather than a count of days, which drifts off it.
// Pure proleptic Gregorian arithmetic, since `Date.UTC` reads the years 0 to 99 as 1900 to 1999. The port of `ChartCalendar`.

const Day = 24 * 60 * 60 * 1000;
const Year = 365 * Day;

/** The earliest moment a time axis reaches: .NET's `DateTime.MinValue`, in the axis's own milliseconds. */
export const MinTime = -62135596800000;

/** The latest moment a time axis reaches: the last millisecond of .NET's `DateTime.MaxValue`'s day. */
export const MaxTime = 253402300799999;

/** How many months a time step moves by; zero for a step shorter than a month, which days and clocks mark. */
export function monthsOf(step: number): number {
    if (step < 30 * Day)
        return 0;

    if (step < 90 * Day)
        return 1;

    if (step < 180 * Day)
        return 3;

    return step < Year ? 6 : Math.max(12, Math.round(step / Year) * 12);
}

/** The month a moment falls in, counted from the year zero: `year × 12 + month − 1`. */
export function monthOf(moment: number): number {
    const civil = civilFromDays(Math.floor(moment / Day));

    return civil.year * 12 + civil.month - 1;
}

/** The first moment of a month counted as `monthOf` counts it. */
export function monthStart(month: number): number {
    const year = Math.floor(month / 12);

    return daysFromCivil(year, month - year * 12 + 1, 1) * Day;
}

/** The month at or below `month` that a step of `months` marks. */
export function floorToStep(month: number, months: number): number {
    return Math.floor(month / months) * months;
}

/** The day a date is, counted from the epoch. */
export function daysFromCivil(year: number, month: number, day: number): number {
    const y = month <= 2 ? year - 1 : year;
    const era = Math.floor(y / 400);
    const yearOfEra = y - era * 400;
    const dayOfYear = Math.floor((153 * (month > 2 ? month - 3 : month + 9) + 2) / 5) + day - 1;
    const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;

    return era * 146097 + dayOfEra - 719468;
}

/** The year and the month a day counted from the epoch falls in. */
function civilFromDays(days: number): { readonly year: number; readonly month: number } {
    const shifted = days + 719468;
    const era = Math.floor(shifted / 146097);
    const dayOfEra = shifted - era * 146097;
    const yearOfEra = Math.floor((dayOfEra - Math.floor(dayOfEra / 1460) + Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365);
    const dayOfYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
    const shiftedMonth = Math.floor((5 * dayOfYear + 2) / 153);
    const month = shiftedMonth < 10 ? shiftedMonth + 3 : shiftedMonth - 9;

    return { year: yearOfEra + era * 400 + (month <= 2 ? 1 : 0), month };
}
