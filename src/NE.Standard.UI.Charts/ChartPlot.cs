namespace NE.Standard.UI.Charts;

/// <summary>
/// The plot's box inside the chart, in chart units, and where a value lands within it.
/// </summary>
public readonly record struct ChartPlot(double Left, double Top, double Width, double Height)
{
    /// <summary>The box's end edge.</summary>
    public double Right => Left + Width;

    /// <summary>The box's bottom edge.</summary>
    public double Bottom => Top + Height;

    /// <summary>Where the value stands across the box.</summary>
    public double X(ChartScale scale, double value)
        => Left + (scale.Fraction(value) * Width);

    /// <summary>Where the value stands up the box, the low end of the range at the bottom.</summary>
    public double Y(ChartScale scale, double value)
        => Top + ((1 - scale.Fraction(value)) * Height);

    /// <summary>
    /// Where the value stands down the box, the low end of the range at the top — the band axis of a chart drawn on its side.
    /// </summary>
    public double Down(ChartScale scale, double value)
        => Top + (scale.Fraction(value) * Height);
}
