using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Charts;

/// <summary>One sector's share of the turn, in radians clockwise from twelve o'clock.</summary>
/// <param name="Start">Where the sector begins.</param>
/// <param name="Sweep">How much of the turn it takes.</param>
public readonly record struct ChartSector(double Start, double Sweep);

/// <summary>A place in the drawing.</summary>
/// <param name="X">Across.</param>
/// <param name="Y">Down.</param>
public readonly record struct ChartSpot(double X, double Y);

/// <summary>
/// A turn shared out: the angle every value takes and where a place on it lies. The browser's <c>chart-pie.ts</c> is the same
/// arithmetic.
/// </summary>
public static class ChartPie
{
    /// <summary>A turn, which is what the values share out between them.</summary>
    private const double Turn = Math.PI * 2;

    /// <summary>Twelve o'clock, where the first sector starts.</summary>
    private const double Top = -Math.PI / 2;

    /// <summary>
    /// The angle each value takes, clockwise from twelve o'clock. A value that is zero or negative takes none; when every value
    /// does, each takes nothing.
    /// </summary>
    public static ChartSector[] Sectors(IReadOnlyList<double?> values)
    {
        ArgumentNullException.ThrowIfNull(values);

        var total = 0d;

        for (var i = 0; i < values.Count; i++)
        {
            if (values[i] is double value && value > 0)
                total += value;
        }

        ChartSector[] sectors = new ChartSector[values.Count];
        var angle = Top;

        for (var i = 0; i < values.Count; i++)
        {
            var sweep = total > 0 && values[i] is double value && value > 0 ? value / total * Turn : 0;

            sectors[i] = new ChartSector(angle, sweep);
            angle += sweep;
        }

        return sectors;
    }

    /// <summary>A place at that distance from the centre, at that angle.</summary>
    public static ChartSpot At(ChartSpot centre, double distance, double angle)
        => new(centre.X + (Math.Cos(angle) * distance), centre.Y + (Math.Sin(angle) * distance));
}
