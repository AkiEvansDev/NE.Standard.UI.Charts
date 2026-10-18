using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Charts;

/// <summary>One part's place along a whole, both as shares of it from 0 to 1.</summary>
/// <param name="Start">Where the part begins.</param>
/// <param name="Length">How much of the whole it takes.</param>
public readonly record struct ChartShare(double Start, double Length);

/// <summary>
/// A whole shared out along a line between values, a share bar's and a legend's; <c>chart-share.ts</c> is its twin.
/// </summary>
public static class ChartShares
{
    /// <summary>
    /// What the values are shares of: <paramref name="total"/>, or what the values come to where that is more; a value that is zero
    /// or negative counts for nothing.
    /// </summary>
    public static double Whole(IReadOnlyList<double?> values, double? total)
    {
        ArgumentNullException.ThrowIfNull(values);

        var sum = 0d;

        for (var i = 0; i < values.Count; i++)
        {
            if (values[i] is double value && value > 0)
                sum += value;
        }

        return total is double given && given > sum ? given : sum;
    }

    /// <summary>
    /// Each value's place along the whole, one after another from its start; a value that is zero, negative or none takes none,
    /// and so does every value of a whole that is nothing.
    /// </summary>
    public static ChartShare[] Parts(IReadOnlyList<double?> values, double? total)
    {
        var whole = Whole(values, total);
        ChartShare[] parts = new ChartShare[values.Count];
        var start = 0d;

        for (var i = 0; i < values.Count; i++)
        {
            var length = whole > 0 && values[i] is double value && value > 0 ? value / whole : 0;

            parts[i] = new ChartShare(start, length);
            start += length;
        }

        return parts;
    }
}
