using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A radar: a spoke per x the series hold, the turn shared evenly between them clockwise from twelve o'clock, and a value's
/// reach along its spoke. The browser's <c>chart-radar.ts</c> is the same arithmetic.
/// </summary>
public static class ChartRadar
{
    /// <summary>A turn, which the spokes share evenly.</summary>
    private const double Turn = Math.PI * 2;

    /// <summary>Twelve o'clock, where the first spoke stands.</summary>
    private const double Top = -Math.PI / 2;

    /// <summary>
    /// The x every spoke stands for: each one any series holds, once, low to high — which for names is the order they were met in.
    /// A row with no value still names its spoke.
    /// </summary>
    public static double[] Spokes(IReadOnlyList<IReadOnlyList<ChartPoint>> series)
    {
        ArgumentNullException.ThrowIfNull(series);

        SortedSet<double> places = [];

        for (var i = 0; i < series.Count; i++)
        {
            for (var j = 0; j < series[i].Count; j++)
                _ = places.Add(series[i][j].X);
        }

        var spokes = new double[places.Count];

        places.CopyTo(spokes);

        return spokes;
    }

    /// <summary>The angle of a spoke, clockwise from twelve o'clock.</summary>
    public static double Angle(int index, int count)
        => count <= 0 ? Top : Top + (index * Turn / count);

    /// <summary>
    /// How far along its spoke a value reaches: the centre is the low end of the range and the rim the high end; a value outside
    /// the range stops at its end, and no value stays at the centre.
    /// </summary>
    public static double Reach(ChartScale scale, double? value, double radius)
        => value is double reading ? radius * Math.Clamp(scale.Fraction(scale.Within(reading)), 0, 1) : 0;

    /// <summary>The biggest radius the box holds with room left beside the rim for the spokes' names: across each side, and down.</summary>
    public static double Radius(double width, double height, double across, double down)
        => Math.Max(0, Math.Min((width / 2) - across, (height / 2) - down));

    /// <summary>The closed shape through the places, one per spoke in order: a series' outline, or one ring of the grid.</summary>
    public static string Outline(IReadOnlyList<ChartSpot> spots)
    {
        ArgumentNullException.ThrowIfNull(spots);

        if (spots.Count == 0)
            return string.Empty;

        StringBuilder builder = new();

        _ = builder.Append('M').Append(ChartPath.Coord(spots[0].X)).Append(' ').Append(ChartPath.Coord(spots[0].Y));

        for (var i = 1; i < spots.Count; i++)
            _ = builder.Append(" L").Append(ChartPath.Coord(spots[i].X)).Append(' ').Append(ChartPath.Coord(spots[i].Y));

        return builder.Append(" Z").ToString();
    }

    /// <summary>
    /// How a spoke's name is anchored beside its tip: after it on the right of the turn, before it on the left, and centred at
    /// twelve and six o'clock.
    /// </summary>
    public static string Anchor(double angle)
    {
        var across = Math.Cos(angle);

        return across > 0.3 ? "start" : across < -0.3 ? "end" : "middle";
    }
}
