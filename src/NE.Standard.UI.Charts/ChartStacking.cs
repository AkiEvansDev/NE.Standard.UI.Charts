using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A stack of series: each carries the ones before it, so the total is what the viewer reads at an x — excluding any series
/// the legend hid. The browser's <c>chart-stack.ts</c> holds the same walk.
/// </summary>
public static class ChartStacking
{
    /// <summary>
    /// The series with the ones before them added under them, in the order given: a point's value is its top, and
    /// <see cref="ChartPoint.Base"/> where it starts. A point with no value stays missing, so the stack breaks where the data does.
    /// </summary>
    /// <remarks>
    /// Positive and negative values stack apart, each from zero outward, so a part below zero is never drawn over by one above
    /// it; a point stands on its own side's total, not on the series under it, which may hold nothing at that x.
    /// </remarks>
    public static List<ChartPoint>[] Stack(IReadOnlyList<IReadOnlyList<ChartPoint>> series)
    {
        ArgumentNullException.ThrowIfNull(series);

        Dictionary<double, double> above = [];
        Dictionary<double, double> below = [];
        List<ChartPoint>[] stacked = new List<ChartPoint>[series.Count];

        for (var i = 0; i < series.Count; i++)
        {
            IReadOnlyList<ChartPoint> points = series[i];
            List<ChartPoint> result = new(points.Count);

            for (var j = 0; j < points.Count; j++)
            {
                ChartPoint point = points[j];

                if (point.Y is not double value)
                {
                    result.Add(point);
                    continue;
                }

                Dictionary<double, double> totals = value < 0 ? below : above;
                var stands = totals.TryGetValue(point.X, out var running) ? running : 0;

                totals[point.X] = stands + value;
                result.Add(point with { Y = stands + value, Base = stands });
            }

            stacked[i] = result;
        }

        return stacked;
    }
}
