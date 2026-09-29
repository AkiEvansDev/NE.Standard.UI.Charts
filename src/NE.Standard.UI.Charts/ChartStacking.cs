using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A stack of series, each on the ones before it; <c>chart-stack.ts</c> is its twin.
/// </summary>
public static class ChartStacking
{
    /// <summary>
    /// The series stacked in the order given, a point's <see cref="ChartPoint.Base"/> where it starts; a missing value breaks the stack.
    /// </summary>
    /// <remarks>
    /// Positive and negative values stack apart, each from zero outward, so a part below zero is never drawn over by one above it;
    /// a point stands on its own side's total, since the series under it may hold nothing at that x.
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
