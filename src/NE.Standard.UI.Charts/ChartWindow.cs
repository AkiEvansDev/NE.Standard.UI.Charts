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
        var smallest = double.IsFinite(whole) ? whole * SmallestShare : ((max * 0.5) - (min * 0.5)) * (2 * SmallestShare);

        if (!double.IsFinite(whole))
        {
            if (!double.IsFinite(span.Width) || span.Width <= 0)
                return new UIChartWindow(min, max);

            var wide = Math.Max(span.Width, smallest);
            var start = Math.Max(Math.Min(double.IsFinite(span.From) ? span.From : min, max - wide), min);

            return new UIChartWindow(start, start + wide);
        }

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
        if (!double.IsFinite(factor) || factor <= 0 || !double.IsFinite(at) || !double.IsFinite(span.From) || !double.IsFinite(span.To))
            return Clamp(span, min, max);

        var halfSpan = (span.To * 0.5) - (span.From * 0.5);
        var width = double.IsFinite(span.Width) ? span.Width * factor : halfSpan * (2 * factor);

        if (!double.IsFinite(width))
            return Clamp(new UIChartWindow(min, max), min, max);

        var share = halfSpan > 0
            ? double.IsFinite(span.Width) ? Math.Clamp((at - span.From) / span.Width, 0, 1) : Math.Clamp(((at * 0.5) - (span.From * 0.5)) / halfSpan, 0, 1)
            : 0.5;

        return Clamp(new UIChartWindow(at - (share * width), at - (share * width) + width), min, max);
    }

    /// <summary>The window a drag leaves: the same width, moved by <paramref name="by"/> along the axis.</summary>
    public static UIChartWindow Pan(UIChartWindow span, double by, double min, double max)
        => double.IsFinite(by) ? Clamp(new UIChartWindow(span.From + by, span.To + by), min, max) : Clamp(span, min, max);

    /// <summary>
    /// The window kept on the far end as the data grows: the width it was given, ending where the data now does. Not narrowed to a
    /// whole narrower than it, which would keep it that narrow for good; a draw clamps what it shows. One with no width follows as the
    /// whole.
    /// </summary>
    public static UIChartWindow Follow(UIChartWindow span, double min, double max)
        => new(max - (double.IsFinite(span.Width) && span.Width > 0 ? span.Width : max - min), max);

    /// <summary>
    /// What the series reach inside the window, with the point either side so a line entering the view starts at its true value —
    /// the two ends of the one piece of line a window between two points lies inside included.
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

    /// <summary>Whether a point is drawn in the window, or the line from it to a neighbour crosses the window on its way.</summary>
    private static bool Reaches(IReadOnlyList<ChartPoint> points, int index, UIChartWindow? window)
    {
        if (window is not UIChartWindow span)
            return true;

        var x = points[index].X;

        return Meets(x, x, span)
            || (index + 1 < points.Count && Meets(x, points[index + 1].X, span))
            || (index > 0 && Meets(points[index - 1].X, x, span));
    }

    /// <summary>Whether the stretch between two x's, whichever way round, meets the window.</summary>
    private static bool Meets(double a, double b, UIChartWindow span)
        => Math.Min(a, b) <= span.To && Math.Max(a, b) >= span.From;
}
