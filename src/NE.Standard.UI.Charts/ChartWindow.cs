using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The stretch of the x axis a chart shows, and how the viewer moves it; <c>chart-window.ts</c> is its twin.
/// </summary>
public static class ChartWindow
{
    /// <summary>The least a window may cover, as a share of the whole extent — deep enough to read one point, never a singularity.</summary>
    public const double SmallestShare = 0.002;

    /// <summary>
    /// The window kept inside the data, no narrower than <see cref="SmallestShare"/> of it, slid back rather than stretched.
    /// </summary>
    public static UIChartWindow Clamp(UIChartWindow span, double min, double max)
    {
        if (!double.IsFinite(min) || !double.IsFinite(max) || max <= min)
            return new UIChartWindow(min, max);

        var whole = max - min;
        var smallest = whole * SmallestShare;
        var width = Math.Clamp(double.IsFinite(span.Width) && span.Width > 0 ? span.Width : whole, smallest, whole);
        // As wide as the whole is the whole: max - width can land a hair under min, and the window would hang off the start.
        if (width >= whole)
            return new UIChartWindow(min, max);

        // Slid, not stretched: a window pushed past an end keeps the width the viewer zoomed to.
        var from = Math.Max(Math.Min(double.IsFinite(span.From) ? span.From : min, max - width), min);

        return new UIChartWindow(from, from + width);
    }

    /// <summary>
    /// The window a wheel leaves, scaled by <paramref name="factor"/> about the value under the pointer, which stays put.
    /// </summary>
    public static UIChartWindow Zoom(UIChartWindow span, double at, double factor, double min, double max)
    {
        if (!double.IsFinite(factor) || factor <= 0 || !double.IsFinite(at))
            return Clamp(span, min, max);

        var width = span.Width * factor;
        var share = span.Width > 0 ? Math.Clamp((at - span.From) / span.Width, 0, 1) : 0.5;

        return Clamp(new UIChartWindow(at - (share * width), at - (share * width) + width), min, max);
    }

    /// <summary>The window a drag leaves: the same width, moved by <paramref name="by"/> along the axis.</summary>
    public static UIChartWindow Pan(UIChartWindow span, double by, double min, double max)
        => double.IsFinite(by) ? Clamp(new UIChartWindow(span.From + by, span.To + by), min, max) : Clamp(span, min, max);

    /// <summary>The window kept on the far end as the data grows: the same width, ending where the data now does.</summary>
    public static UIChartWindow Follow(UIChartWindow span, double min, double max)
        => Clamp(new UIChartWindow(max - span.Width, max), min, max);

    /// <summary>
    /// What the series reach inside the window, with the point either side so a line entering the view starts at its true value.
    /// </summary>
    public static (double Min, double Max) Extent(IReadOnlyList<IReadOnlyList<ChartPoint>> series, UIChartWindow? window)
    {
        ArgumentNullException.ThrowIfNull(series);

        var min = double.PositiveInfinity;
        var max = double.NegativeInfinity;

        for (var i = 0; i < series.Count; i++)
        {
            IReadOnlyList<ChartPoint> points = series[i];

            for (var j = 0; j < points.Count; j++)
            {
                if (points[j].Y is not double value || !Reaches(points, j, window))
                    continue;

                min = Math.Min(min, value);
                max = Math.Max(max, value);
            }
        }

        return (min, max);
    }

    /// <summary>Whether a point is drawn in the window, or is the one either side of it that the line comes from.</summary>
    private static bool Reaches(IReadOnlyList<ChartPoint> points, int index, UIChartWindow? window)
    {
        if (window is not UIChartWindow span)
            return true;

        var x = points[index].X;

        if (x >= span.From && x <= span.To)
            return true;

        return (index + 1 < points.Count && points[index + 1].X >= span.From && points[index + 1].X <= span.To)
            || (index > 0 && points[index - 1].X >= span.From && points[index - 1].X <= span.To);
    }
}
