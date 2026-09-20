namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// How a chart of lines draws them, as its own component says: the defaults a series may override.
/// </summary>
public readonly record struct ChartLineOptions(bool Stepped, bool Smooth, bool Markers);
