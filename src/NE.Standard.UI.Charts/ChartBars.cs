using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One bar's position across its band, in the direction the band runs (down the axis for a horizontal chart).
/// </summary>
public readonly record struct ChartBar(double Start, double Thickness);

/// <summary>
/// Where a bar stands within the band one x owns. The browser's <c>chart-bars.ts</c> holds the same arithmetic.
/// </summary>
public static class ChartBars
{
    /// <summary>How much of a band the bars take; the rest is the air that tells one x from the next.</summary>
    private const double BandFill = 0.72;

    /// <summary>No bar is thinner than this, however many of them share a band.</summary>
    private const double MinimumThickness = 1;

    /// <summary>How many places along the band axis the bars share: one per x the data holds.</summary>
    public static int Slots(IReadOnlyList<IReadOnlyList<ChartPoint>> series)
    {
        ArgumentNullException.ThrowIfNull(series);

        HashSet<double> places = [];

        for (var i = 0; i < series.Count; i++)
        {
            for (var j = 0; j < series[i].Count; j++)
                _ = places.Add(series[i][j].X);
        }

        return places.Count;
    }

    /// <summary>
    /// How much of the band axis one x takes, in the units the chart is drawn in; the length is the plot's own across the axis the
    /// bands run along.
    /// </summary>
    public static double Band(double length, int slots)
        => length / Math.Max(1, slots);

    /// <summary>
    /// One bar inside the band around <paramref name="center"/>: the band's fill for a stack, its share of it for a group.
    /// </summary>
    public static ChartBar Bar(double center, double band, int seriesIndex, int seriesCount, bool stacked)
    {
        var inner = band * BandFill;

        if (stacked || seriesCount <= 1)
            return new ChartBar(center - (inner / 2), Math.Max(MinimumThickness, inner));

        var thickness = inner / seriesCount;

        return new ChartBar(center - (inner / 2) + (seriesIndex * thickness), Math.Max(MinimumThickness, thickness));
    }
}
