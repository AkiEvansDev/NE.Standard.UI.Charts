using System;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The range an axis covers: given ends stand, open ends round the data outward; <c>chart-ticks.ts</c> is its twin.
/// </summary>
public static class ChartRange
{
    private const double Day = 24 * 60 * 60 * 1000d;

    /// <summary>
    /// The range the axis covers over data of this extent, reaching zero with <paramref name="includeZero"/>.
    /// </summary>
    public static ChartScale Resolve(UIChartAxis axis, double dataMin, double dataMax, int categoryCount, bool includeZero = false)
    {
        ArgumentNullException.ThrowIfNull(axis);

        // A category stands in the middle of its own place, so the range reaches half a place past the first and the last.
        if (axis.Kind == UIChartAxisKind.Category)
            return new ChartScale(-0.5, Math.Max(0.5, categoryCount - 0.5));

        var hasData = double.IsFinite(dataMin) && double.IsFinite(dataMax) && dataMax >= dataMin;
        var min = axis.Min ?? (hasData ? dataMin : 0);
        var max = axis.Max ?? (hasData ? dataMax : 1);

        // Zero is the end the author left open, never the one they fixed.
        if (includeZero && axis.Kind != UIChartAxisKind.Logarithmic)
        {
            min = axis.Min ?? Math.Min(0, min);
            max = axis.Max ?? Math.Max(0, max);
        }

        if (axis.Kind == UIChartAxisKind.Logarithmic)
        {
            // A logarithmic axis has no place for zero: it starts at the power of ten under the smallest value it was given.
            var low = axis.Min ?? Math.Pow(10, Math.Floor(Math.Log10(min > 0 ? min : 1)));
            var high = axis.Max ?? Math.Pow(10, Math.Ceiling(Math.Log10(max > 0 ? max : 10)));

            low = low > 0 ? low : 1;

            return new ChartScale(low, high > low ? high : low * 10, true);
        }

        if (max - min <= 0)
        {
            // A band around a single value rather than a scale of no width. A moment counts from 1970, so an eighth of it would be
            // years: a day either side instead.
            var padding = axis.Kind == UIChartAxisKind.Time ? Day : Math.Abs(min) > 0 ? Math.Abs(min) / 8 : 1;

            // An end the author fixed past the data leaves the open one built from it, so the range never runs backward.
            return WithinTime(axis.Kind, axis.Min ?? (Math.Min(min, max) - padding), axis.Max ?? (Math.Max(min, max) + padding));
        }

        var step = ChartTicks.Step(axis.Kind, min, max, axis.TickCount);
        var months = axis.Kind == UIChartAxisKind.Time ? ChartCalendar.MonthsOf(step) : 0;

        if (months == 0)
            return WithinTime(axis.Kind, axis.Min ?? (Math.Floor(min / step) * step), axis.Max ?? (Math.Ceiling(max / step) * step));

        // A step of whole months rounds out to the first of a month it marks, not to a multiple of days from the epoch.
        var last = ChartCalendar.FloorToStep(ChartCalendar.MonthOf(max), months);

        if (ChartCalendar.MonthStart(last) < max)
            last += months;

        return WithinTime(axis.Kind, axis.Min ?? ChartCalendar.MonthStart(ChartCalendar.FloorToStep(ChartCalendar.MonthOf(min), months)), axis.Max ?? ChartCalendar.MonthStart(last));
    }

    /// <summary>A time axis stays inside the moments a <see cref="DateTime"/> can name, so no mark on it is one nothing can write.</summary>
    private static ChartScale WithinTime(UIChartAxisKind kind, double min, double max)
    {
        if (kind != UIChartAxisKind.Time)
            return new ChartScale(min, max);

        var low = Math.Clamp(min, ChartCalendar.MinTime, ChartCalendar.MaxTime);
        var high = Math.Clamp(max, ChartCalendar.MinTime, ChartCalendar.MaxTime);

        // A range pressed flat against an end keeps a day's width inside it.
        return high > low ? new ChartScale(low, high) : low > ChartCalendar.MinTime ? new ChartScale(low - Day, low) : new ChartScale(low, low + Day);
    }
}
