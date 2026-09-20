using NE.Standard.UI.Abstractions.Styling;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One series of a chart: its key, the words the legend and the tooltip name it by, where its value comes from and how it is drawn.
/// </summary>
public sealed record UIChartSeries
{
    /// <summary>The key the legend, the tooltip and a point's click name the series by.</summary>
    public required string Key { get; init; }

    /// <summary>The words the legend shows; unset, the key itself.</summary>
    public string? Caption { get; init; }

    /// <summary>
    /// The row property this series' value is read from. Unset, the series takes the chart's own <c>ValuePath</c>, for rows
    /// whose <c>SeriesPath</c> names this series.
    /// </summary>
    public string? ValuePath { get; init; }

    /// <summary>
    /// The row property a point is sized by, on a chart that sizes its points — a scatter's bubbles. Unset, every point of the
    /// series is drawn the same size.
    /// </summary>
    public string? SizePath { get; init; }

    /// <summary>The colour of the line and its markers; unset, the next of the theme's categorical palette.</summary>
    public UIThemeColor? Color { get; init; }

    /// <summary>Whether the line steps between points instead of sloping; unset, the chart's own setting.</summary>
    public bool? Stepped { get; init; }

    /// <summary>Whether the line curves through its points instead of joining them straight; unset, the chart's own setting.</summary>
    public bool? Smooth { get; init; }

    /// <summary>Whether a mark is drawn at every point; unset, the chart's own setting.</summary>
    public bool? ShowMarkers { get; init; }
}
