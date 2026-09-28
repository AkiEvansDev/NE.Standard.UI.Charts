using System;

namespace NE.Standard.UI.Charts;

/// <summary>
/// How wide a sized point is drawn: scaled by area, not radius, so twice the value reads as twice the ink. The browser's
/// <c>chart-bubbles.ts</c> holds the same arithmetic.
/// </summary>
public static class ChartBubbles
{
    /// <summary>The radius a point with no third value takes.</summary>
    public const double PlainRadius = 4;

    /// <summary>The smallest a sized point is drawn at.</summary>
    public const double SmallestRadius = 3;

    /// <summary>The largest a sized point is drawn at.</summary>
    public const double LargestRadius = 18;

    /// <summary>The least a point answers the pointer over: a mark of three is hard to hit, and every kind of point is worth the same reach.</summary>
    public const double ReachRadius = 11;

    /// <summary>How wide a point answers the pointer: its own mark where that is the wider, and the least reach where it is not.</summary>
    public static double Reach(double radius) => Math.Max(radius, ReachRadius);

    /// <summary>
    /// The radius for a value between <paramref name="min"/> and <paramref name="max"/>; the plain radius when there is no value,
    /// the middle radius when they are equal.
    /// </summary>
    public static double Radius(double? size, double min, double max)
    {
        if (size is not double value || !double.IsFinite(min) || !double.IsFinite(max))
            return PlainRadius;

        if (max <= min)
            return (SmallestRadius + LargestRadius) / 2;

        // By area: the radius follows the square root of the share, or a big value swamps the picture.
        var share = Math.Clamp((value - min) / (max - min), 0, 1);
        var smallest = SmallestRadius * SmallestRadius;
        var largest = LargestRadius * LargestRadius;

        return Math.Sqrt(smallest + (share * (largest - smallest)));
    }
}
