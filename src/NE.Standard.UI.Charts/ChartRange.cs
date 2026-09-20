using System;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The range an axis ends up covering: given ends stand, open ends follow the data and round outward to the axis's step. The
/// browser's <c>chart-ticks.ts</c> holds the same arithmetic.
/// </summary>
public static class ChartRange
{
    /// <summary>
    /// The range the axis covers over data of this extent. A chart whose marks stand on a baseline — an area, a bar — passes
    /// <paramref name="includeZero"/> so the range reaches zero.
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
            // One value, or a range flattened to a point: a band around it rather than a scale of no width.
            var padding = Math.Abs(min) > 0 ? Math.Abs(min) / 8 : 1;

            return new ChartScale(axis.Min ?? (min - padding), axis.Max ?? (max + padding));
        }

        var step = ChartTicks.Step(axis.Kind, min, max, axis.TickCount);

        return new ChartScale(axis.Min ?? (Math.Floor(min / step) * step), axis.Max ?? (Math.Ceiling(max / step) * step));
    }
}
