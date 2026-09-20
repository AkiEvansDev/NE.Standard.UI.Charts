using System.Collections.Generic;
using NE.Standard.UI.Charts;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The chart as its client reads it off the root (<c>data-ui-chart</c>): what to draw, how to read a row, and how a tick is
/// written. Axes carry only the author's fixed ends; the browser resolves the open ones itself, so a later point can widen
/// the range.
/// </summary>
internal sealed record ChartClientModel
{
    public required string Kind { get; init; }

    public required ChartClientAxis X { get; init; }

    public required ChartClientAxis Y { get; init; }

    public required IReadOnlyList<ChartClientSeries> Series { get; init; }

    /// <summary>The row property the x comes from; unset, a row's place in the collection is its x.</summary>
    public string? XPath { get; init; }

    /// <summary>The row property naming the series a row belongs to; unset, a row carries a value per series.</summary>
    public string? SeriesPath { get; init; }

    /// <summary>The row property a series without one of its own reads.</summary>
    public string? ValuePath { get; init; }

    public UIChartLegendPlacement Legend { get; init; }

    public bool Tooltip { get; init; }

    public bool Stepped { get; init; }

    public bool Smooth { get; init; }

    public bool Markers { get; init; }

    public bool Stacked { get; init; }

    public bool SharedTooltip { get; init; }

    public bool Zoomable { get; init; }

    public bool FollowLatest { get; init; }

    public bool Horizontal { get; init; }

    public bool Bare { get; init; }

    public double Donut { get; init; }

    public string? CentreCaption { get; init; }
}

/// <summary>One axis as the client reads it.</summary>
internal sealed record ChartClientAxis
{
    public required UIChartAxisKind Kind { get; init; }

    public double? Min { get; init; }

    public double? Max { get; init; }

    public string? Format { get; init; }

    public bool Grid { get; init; }

    public int Ticks { get; init; }

    public string? Caption { get; init; }
}

/// <summary>One series as the client reads it; the colour is a CSS value, resolved here where the theme is known.</summary>
internal sealed record ChartClientSeries
{
    public required string Key { get; init; }

    public required string Caption { get; init; }

    public string? ValuePath { get; init; }

    public string? SizePath { get; init; }

    public string? Color { get; init; }

    public bool? Stepped { get; init; }

    public bool? Smooth { get; init; }

    public bool? Markers { get; init; }
}
