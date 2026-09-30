using System;
using System.Collections.Generic;
using System.Globalization;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The round marks an axis carries; <c>chart-ticks.ts</c> is its twin.
/// </summary>
public static class ChartTicks
{
    /// <summary>No axis is marked more often than this, whatever the range and the count asked for.</summary>
    private const int MaximumTicks = 200;

    /// <summary>No default format writes more decimals than a double holds.</summary>
    private const int MaximumDecimals = 15;

    private const double Second = 1000;
    private const double Minute = 60 * Second;
    private const double Hour = 60 * Minute;
    private const double Day = 24 * Hour;
    private const double Year = 365 * Day;

    // The intervals a clock is read at, not the round numbers a decimal step would land on: 15 minutes rather than 10, 6 hours
    // rather than 5.
    private static readonly double[] TimeSteps =
    [
        Second, 2 * Second, 5 * Second, 10 * Second, 15 * Second, 30 * Second,
        Minute, 2 * Minute, 5 * Minute, 10 * Minute, 15 * Minute, 30 * Minute,
        Hour, 2 * Hour, 3 * Hour, 6 * Hour, 12 * Hour,
        Day, 2 * Day, 7 * Day, 14 * Day, 30 * Day, 90 * Day, 180 * Day, Year
    ];

    /// <summary>
    /// The step a range is marked at, aiming for <paramref name="count"/> marks; a logarithmic range answers the power at its low end,
    /// the finest a label writes.
    /// </summary>
    public static double Step(UIChartAxisKind kind, double min, double max, int count)
    {
        var target = (max - min) / Math.Max(1, count);

        if (target <= 0 || double.IsNaN(target) || double.IsInfinity(target))
            return 1;

        if (kind == UIChartAxisKind.Category)
            return 1;

        if (kind == UIChartAxisKind.Logarithmic)
            return min > 0 ? Math.Pow(10, Math.Floor(Math.Log10(min))) : 1;

        if (kind != UIChartAxisKind.Time)
            return DecimalStep(target);

        for (var i = 0; i < TimeSteps.Length; i++)
        {
            if (TimeSteps[i] >= target)
                return TimeSteps[i];
        }

        // Beyond a year the ladder runs out and round numbers of years take over.
        return DecimalStep(target / Year) * Year;
    }

    /// <summary>The values the axis marks, low end first.</summary>
    public static double[] Build(UIChartAxisKind kind, ChartScale scale, int count)
    {
        if (scale.Max <= scale.Min)
            return [];

        if (kind == UIChartAxisKind.Logarithmic)
            return PowersOfTen(scale);

        var step = Step(kind, scale.Min, scale.Max, count);
        var slack = step * 1e-9;
        var months = kind == UIChartAxisKind.Time ? ChartCalendar.MonthsOf(step) : 0;

        if (months > 0)
            return CalendarMarks(scale, months, slack);

        // Past the most marks an axis carries, the names are thinned by a stride rather than cut off after the two hundredth.
        if (kind == UIChartAxisKind.Category)
            step = Math.Max(1, Math.Ceiling((Math.Floor(scale.Max) - Math.Ceiling(scale.Min) + 1) / MaximumTicks));

        // A step the range does not divide starts at the first multiple inside it, so the marks are round numbers, not the range's ends.
        var first = Math.Ceiling(scale.Min / step) * step;
        List<double> values = [];

        // Each mark counted from the first rather than added to the last: under values so large that the step is below their
        // precision a running sum stands still, and the axis would repeat one mark as often as it carries marks. A mark that rounds
        // onto the one before it is left out.
        for (var index = 0; values.Count < MaximumTicks; index++)
        {
            var value = first + (index * step);

            // Past the high end, or no number at all where an end of the range is none.
            if (value > scale.Max + slack || !double.IsFinite(value))
                break;

            // Never a negative zero, which a mark just under the low end can be and which would be written as "-0".
            if (values.Count == 0 || value > values[^1])
                values.Add(value == 0 ? 0 : value);
        }

        return [.. values];
    }

    /// <summary>The first of every month a step of whole months lands on inside the range: a quarter on January, April, July and October.</summary>
    private static double[] CalendarMarks(ChartScale scale, int months, double slack)
    {
        var month = ChartCalendar.FloorToStep(ChartCalendar.MonthOf(scale.Min), months);

        if (ChartCalendar.MonthStart(month) < scale.Min - slack)
            month += months;

        List<double> values = [];

        for (var value = ChartCalendar.MonthStart(month); value <= scale.Max + slack && values.Count < MaximumTicks; value = ChartCalendar.MonthStart(month))
        {
            values.Add(value == 0 ? 0 : value);
            month += months;
        }

        return [.. values];
    }

    /// <summary>
    /// The format a tick is written under when the author named none.
    /// </summary>
    public static string? DefaultFormat(UIChartAxisKind kind, double step)
    {
        if (kind == UIChartAxisKind.Category)
            return null;

        if (kind == UIChartAxisKind.Time)
        {
            if (step < Minute)
                return "HH:mm:ss";

            if (step < Day)
                return "HH:mm";

            return step < 30 * Day ? "dd MMM" : "MMM yyyy";
        }

        if (step >= 1)
            return "N0";

        // The place the step's first digit stands at; the nudge keeps a power of ten that Log10 reads a hair low on its own place.
        var decimals = -(int)Math.Floor(Math.Log10(step) + 1e-9);

        return "N" + Math.Min(MaximumDecimals, decimals).ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>The nearest round number at or above the target: one, two or five times a power of ten.</summary>
    private static double DecimalStep(double target)
    {
        var magnitude = Math.Pow(10, Math.Floor(Math.Log10(target)));
        var normalized = target / magnitude;

        return normalized <= 1 ? magnitude : normalized <= 2 ? 2 * magnitude : normalized <= 5 ? 5 * magnitude : 10 * magnitude;
    }

    /// <summary>Every power of ten inside the range; the range's own ends when it holds fewer than two.</summary>
    private static double[] PowersOfTen(ChartScale scale)
    {
        if (scale.Min <= 0)
            return [];

        var first = (int)Math.Ceiling(Math.Log10(scale.Min));
        var last = (int)Math.Floor(Math.Log10(scale.Max));

        if (last - first + 1 < 2)
            return [scale.Min, scale.Max];

        var values = new double[Math.Min(MaximumTicks, last - first + 1)];

        for (var i = 0; i < values.Length; i++)
            values[i] = Math.Pow(10, first + i);

        return values;
    }
}
