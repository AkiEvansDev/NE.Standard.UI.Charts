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
    /// The series with the ones before them added under them, in the order given. A point with no value stays missing, so the
    /// stack breaks where the data does.
    /// </summary>
    public static List<ChartPoint>[] Stack(IReadOnlyList<IReadOnlyList<ChartPoint>> series)
    {
        ArgumentNullException.ThrowIfNull(series);

        Dictionary<double, double> totals = [];
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

                var total = (totals.TryGetValue(point.X, out var running) ? running : 0) + value;

                totals[point.X] = total;
                result.Add(point with { Y = total });
            }

            stacked[i] = result;
        }

        return stacked;
    }

    /// <summary>What the series below holds at this x; zero where it holds nothing, which is where a stack starts.</summary>
    public static double ValueAt(IReadOnlyList<ChartPoint> series, double x)
    {
        ArgumentNullException.ThrowIfNull(series);

        for (var i = 0; i < series.Count; i++)
        {
            if (series[i].X == x)
                return series[i].Y ?? 0;
        }

        return 0;
    }
}
