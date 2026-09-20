using System.Collections.Generic;
using NE.Standard.UI.Charts;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// A chart's authored settings as one value, read off the component once and handed to everything the render does with them.
/// </summary>
internal sealed record ChartSpec
{
    public required string Kind { get; init; }

    public required UIChartAxis XAxis { get; init; }

    public required UIChartAxis YAxis { get; init; }

    public required IReadOnlyList<UIChartSeries> Series { get; init; }

    public string? XPath { get; init; }

    public string? SeriesPath { get; init; }

    public string? ValuePath { get; init; }

    public UIChartLegendPlacement Legend { get; init; }

    public bool Tooltip { get; init; }

    public bool Stepped { get; init; }

    public bool Smooth { get; init; }

    public bool Markers { get; init; }

    /// <summary>Whether the series stand on one another, so what the viewer reads at an x is the total.</summary>
    public bool Stacked { get; init; }

    /// <summary>Whether one tooltip names every series at the x under the pointer, rather than one per point.</summary>
    public bool SharedTooltip { get; init; }

    /// <summary>Whether the viewer may zoom and pan along the x axis.</summary>
    public bool Zoomable { get; init; }

    /// <summary>Whether a window narrower than the data stays on the far end as the data grows past it.</summary>
    public bool FollowLatest { get; init; }

    /// <summary>The stretch of the x axis the chart shows; unset, the whole of what the data reaches.</summary>
    public UIChartWindow? VisibleRange { get; init; }

    /// <summary>Whether the bars lie on their side: the values run across the box and one band per x runs down it.</summary>
    public bool Horizontal { get; init; }

    /// <summary>Whether the chart is drawn with nothing around it: no grid, no axes, the plot the whole box.</summary>
    public bool Bare { get; init; }

    /// <summary>How much of a pie's radius the hole in the middle takes.</summary>
    public double Donut { get; init; }

    /// <summary>The words in the middle of a donut.</summary>
    public string? CentreCaption { get; init; }

    /// <summary>Whether a row is one point of the series it names, rather than an x with a value per series.</summary>
    public bool IsLongForm => !string.IsNullOrWhiteSpace(SeriesPath);
}
