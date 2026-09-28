namespace NE.Standard.UI.Charts;

/// <summary>
/// One point of a series: the row it came from, its x, and its value.
/// </summary>
/// <param name="Key">The key of the row the point came from.</param>
/// <param name="X">The point's place along the x axis, as the axis reads it.</param>
/// <param name="Y"><see langword="null"/> where the row had none, leaving a gap in the line rather than a point at zero.</param>
/// <param name="Size">A third value the point is sized by, where the series names one.</param>
/// <param name="Base">
/// Where a stacked point's bar or band starts: the total of its own side of the stack under it. <see langword="null"/> where the
/// point stands on the axis's zero.
/// </param>
public readonly record struct ChartPoint(string Key, double X, double? Y, double? Size = null, double? Base = null);
