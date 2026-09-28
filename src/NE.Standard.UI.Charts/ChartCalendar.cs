using System;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The calendar a time axis is marked by once its step is a month or more: the first of a month, a quarter or a year rather than
/// a fixed count of days from the epoch, which drifts off the month. Pure arithmetic on the proleptic Gregorian calendar, so no
/// year is out of its reach. The browser's <c>chart-calendar.ts</c> holds the same arithmetic.
/// </summary>
internal static class ChartCalendar
{
    private const double Day = 24 * 60 * 60 * 1000d;
    private const double Year = 365 * Day;

    /// <summary>The earliest moment a time axis reaches: <see cref="DateTime.MinValue"/>, in the axis's own milliseconds.</summary>
    public const double MinTime = -62135596800000;

    /// <summary>The latest moment a time axis reaches: the last millisecond of <see cref="DateTime.MaxValue"/>'s day.</summary>
    public const double MaxTime = 253402300799999;

    /// <summary>How many months a time step moves by; zero for a step shorter than a month, which days and clocks mark.</summary>
    public static int MonthsOf(double step)
    {
        if (step < 30 * Day)
            return 0;

        if (step < 90 * Day)
            return 1;

        if (step < 180 * Day)
            return 3;

        return step < Year ? 6 : Math.Max(12, (int)Math.Round(step / Year) * 12);
    }

    /// <summary>The month a moment falls in, counted from the year zero: <c>year × 12 + month − 1</c>.</summary>
    public static long MonthOf(double moment)
    {
        (var year, var month) = CivilFromDays((long)Math.Floor(moment / Day));

        return (year * 12) + month - 1;
    }

    /// <summary>The first moment of a month counted as <see cref="MonthOf"/> counts it.</summary>
    public static double MonthStart(long month)
    {
        var year = FloorDivide(month, 12);

        return DaysFromCivil(year, (int)(month - (year * 12)) + 1) * Day;
    }

    /// <summary>The month at or below <paramref name="month"/> that a step of <paramref name="months"/> marks.</summary>
    public static long FloorToStep(long month, int months)
        => FloorDivide(month, months) * months;

    /// <summary>The day a first of the month is, counted from the epoch.</summary>
    private static long DaysFromCivil(long year, int month)
    {
        var y = month <= 2 ? year - 1 : year;
        var era = FloorDivide(y, 400);
        var yearOfEra = y - (era * 400);
        var dayOfYear = ((153 * (month > 2 ? month - 3 : month + 9)) + 2) / 5;
        var dayOfEra = (yearOfEra * 365) + (yearOfEra / 4) - (yearOfEra / 100) + dayOfYear;

        return (era * 146097) + dayOfEra - 719468;
    }

    /// <summary>The year and the month a day counted from the epoch falls in.</summary>
    private static (long Year, int Month) CivilFromDays(long days)
    {
        var shifted = days + 719468;
        var era = FloorDivide(shifted, 146097);
        var dayOfEra = shifted - (era * 146097);
        var yearOfEra = (dayOfEra - (dayOfEra / 1460) + (dayOfEra / 36524) - (dayOfEra / 146096)) / 365;
        var dayOfYear = dayOfEra - ((365 * yearOfEra) + (yearOfEra / 4) - (yearOfEra / 100));
        var shiftedMonth = ((5 * dayOfYear) + 2) / 153;
        var month = (int)(shiftedMonth < 10 ? shiftedMonth + 3 : shiftedMonth - 9);

        return (yearOfEra + (era * 400) + (month <= 2 ? 1 : 0), month);
    }

    private static long FloorDivide(long value, long divisor)
    {
        var quotient = value / divisor;

        return value % divisor != 0 && (value < 0) != (divisor < 0) ? quotient - 1 : quotient;
    }
}
