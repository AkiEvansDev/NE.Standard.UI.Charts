using System.Collections.Generic;
using System.Text.Json.Serialization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// A chart's authored settings as one value, read off the component once and handed to everything the render does with them; written
/// whole as the model its client reads off the root (<c>data-ui-chart</c>), less what only the server reads.
/// </summary>
internal sealed record ChartSpec
{
    public required string Kind { get; init; }

    /// <summary>The x axis as the author set it, else the chart's default.</summary>
    [JsonIgnore]
    public UIChartAxis XAxis { get; init; } = UIChartAxis.Linear();

    /// <summary>The y axis as the author set it.</summary>
    [JsonIgnore]
    public UIChartAxis YAxis { get; init; } = UIChartAxis.Linear();

    /// <summary>The series as the author declared them.</summary>
    [JsonIgnore]
    public IReadOnlyList<UIChartSeries> Series { get; init; } = [];

    /// <summary>The x axis as the client reads it: the ends the author fixed rather than the ones a render settled on, so a later point can widen the range.</summary>
    public ChartClientAxis X => ChartClientAxis.Of(XAxis);

    /// <summary>The y axis as the client reads it, as <see cref="X"/>.</summary>
    public ChartClientAxis Y => ChartClientAxis.Of(YAxis);

    /// <summary>The series as the client reads them, their colours resolved where the theme is known; set as the model is written.</summary>
    [JsonPropertyName("series")]
    public IReadOnlyList<ChartClientSeries> ClientSeries { get; init; } = [];

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

    /// <summary>Whether the series stand on one another, so what the viewer reads at an x is the total.</summary>
    public bool Stacked { get; init; }

    /// <summary>Whether one tooltip names every series at the x under the pointer, rather than one per point.</summary>
    public bool SharedTooltip { get; init; }

    /// <summary>Whether the viewer may zoom and pan along the x axis.</summary>
    public bool Zoomable { get; init; }

    /// <summary>Whether a press on a point, a bar or a sector reaches a command the author wired (<c>OnPointClick</c>).</summary>
    [JsonIgnore]
    public bool Pressable { get; init; }

    /// <summary>Whether a window narrower than the data stays on the far end as the data grows past it.</summary>
    public bool FollowLatest { get; init; }

    /// <summary>The stretch of the x axis the chart shows; unset, the whole of what the data reaches.</summary>
    [JsonIgnore]
    public UIChartWindow? VisibleRange { get; init; }

    /// <summary>Whether the bars lie on their side: the values run across the box and one band per x runs down it.</summary>
    public bool Horizontal { get; init; }

    /// <summary>Whether the chart is drawn with nothing around it: no grid, no axes, the plot the whole box.</summary>
    public bool Bare { get; init; }

    /// <summary>How much of a pie's radius the hole in the middle takes.</summary>
    public double Donut { get; init; }

    /// <summary>Whether the legend is a table of each part's value and its share of the whole, a pie's or a share bar's.</summary>
    public bool LegendValues { get; init; }

    /// <summary>The whole a share bar's parts are shares of; unset, what they come to.</summary>
    [JsonIgnore]
    public double? Total { get; init; }

    /// <summary>What a share bar's legend calls the part of the total the rows leave, where it has words; null for the package's word.</summary>
    [JsonIgnore]
    public UIPhrase? Remainder { get; init; }

    /// <summary>
    /// <see cref="Remainder"/> as the author wrote it — a text as the plain string, a key as its phrase; null for the package's word. The
    /// client translates it, again at every language switch.
    /// </summary>
    public object? RemainderCaption => ChartCaption.Wire(Remainder);

    /// <summary>Whether a row is one point of the series it names, rather than an x with a value per series.</summary>
    [JsonIgnore]
    public bool IsLongForm => !string.IsNullOrWhiteSpace(SeriesPath);
}
