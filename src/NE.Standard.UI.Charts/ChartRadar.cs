using System;
using System.Collections.Generic;
using System.Text;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A radar's spokes and reaches; <c>chart-radar.ts</c> is its twin.
/// </summary>
public static class ChartRadar
{
    /// <summary>A turn, which the spokes share evenly.</summary>
    private const double Turn = Math.PI * 2;

    /// <summary>Twelve o'clock, where the first spoke stands.</summary>
    private const double Top = -Math.PI / 2;

    /// <summary>
    /// The x every spoke stands for, once each, low to high; a row with no value still names its spoke.
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
    /// How far along its spoke a value reaches, from the range's low end at the centre; clamped to the range, and a missing value
    /// stays at the centre.
    /// </summary>
    public static double Reach(ChartScale scale, double? value, double radius)
        => value is double reading ? radius * Math.Clamp(scale.Fraction(scale.Within(reading)), 0, 1) : 0;

    /// <summary>
    /// Where a ring's value is written: the middle of the ring's first side, off every spoke a series has a corner on; on the first
    /// spoke where fewer than three spokes make no side to stand on.
    /// </summary>
    public static ChartSpot RingLabel(ChartSpot centre, double reach, int count)
    {
        if (count < 3)
            return ChartPie.At(centre, reach, Top);

        ChartSpot from = ChartPie.At(centre, reach, Angle(0, count));
        ChartSpot to = ChartPie.At(centre, reach, Angle(1, count));

        return new((from.X + to.X) / 2, (from.Y + to.Y) / 2);
    }

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
    /// <see cref="Outline"/> as straight pieces, for the reason <see cref="ChartPath.Segments"/> gives.
    /// </summary>
    public static IReadOnlyList<ChartSegment> Edges(IReadOnlyList<ChartSpot> spots)
    {
        ArgumentNullException.ThrowIfNull(spots);

        List<ChartSegment> edges = new(spots.Count);

        for (var i = 0; i < spots.Count && spots.Count > 1; i++)
        {
            ChartSpot from = spots[i];
            ChartSpot to = spots[(i + 1) % spots.Count];

            ChartPath.AddSegment(edges, from.X, from.Y, to.X, to.Y);
        }

        return edges;
    }

    /// <summary>
    /// How a spoke's name is anchored beside its tip.
    /// </summary>
    public static string Anchor(double angle)
    {
        var across = Math.Cos(angle);

        return across > 0.3 ? "start" : across < -0.3 ? "end" : "middle";
    }
}
