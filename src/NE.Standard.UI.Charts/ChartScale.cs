using System;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The range one axis covers, and where a value inside it falls.
/// </summary>
/// <param name="Min">The low end of the range.</param>
/// <param name="Max">The high end of the range.</param>
/// <param name="Logarithmic">Whether the range is read on a base-ten logarithmic scale.</param>
public readonly record struct ChartScale(double Min, double Max, bool Logarithmic = false)
{
    /// <summary>Where the value falls in the range: zero at the low end, one at the high end.</summary>
    public double Fraction(double value)
    {
        if (Logarithmic)
        {
            if (value <= 0 || Min <= 0 || Max <= 0)
                return 0;

            var low = Math.Log10(Min);
            var span = Math.Log10(Max) - low;

            return span <= 0 ? 0 : (Math.Log10(value) - low) / span;
        }

        var width = Max - Min;

        return width <= 0 ? 0 : (value - Min) / width;
    }

    /// <summary>
    /// The value at a fraction of the range: the inverse of <see cref="Fraction"/>, which is what a pointer's place on the plot
    /// asks for.
    /// </summary>
    public double Value(double share)
    {
        if (!Logarithmic)
            return Min + (share * (Max - Min));

        if (Min <= 0 || Max <= 0)
            return Min;

        var low = Math.Log10(Min);

        return Math.Pow(10, low + (share * (Math.Log10(Max) - low)));
    }

    /// <summary>The value held inside the range, whichever way round an author's fixed ends put it.</summary>
    public double Within(double value)
        => Math.Min(Math.Max(value, Math.Min(Min, Max)), Math.Max(Min, Max));
}
