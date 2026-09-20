using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Charts;

/// <summary>
/// What every chart has, and the property keys a shared renderer reads them by, since each chart kind is its own sealed
/// component.
/// </summary>
public interface IChartComponent
{
    /// <summary>Gets the registered property key for <see cref="Series"/>.</summary>
    static UIProperty SeriesProperty { get; } = new(nameof(Series));

    /// <summary>Gets the registered property key for <see cref="XPath"/>.</summary>
    static UIProperty XPathProperty { get; } = new(nameof(XPath));

    /// <summary>Gets the registered property key for <see cref="SeriesPath"/>.</summary>
    static UIProperty SeriesPathProperty { get; } = new(nameof(SeriesPath));

    /// <summary>Gets the registered property key for <see cref="ValuePath"/>.</summary>
    static UIProperty ValuePathProperty { get; } = new(nameof(ValuePath));

    /// <summary>Gets the registered property key for <see cref="XAxis"/>.</summary>
    static UIProperty XAxisProperty { get; } = new(nameof(XAxis));

    /// <summary>Gets the registered property key for <see cref="YAxis"/>.</summary>
    static UIProperty YAxisProperty { get; } = new(nameof(YAxis));

    /// <summary>Gets the registered property key for <see cref="Legend"/>.</summary>
    static UIProperty LegendProperty { get; } = new(nameof(Legend));

    /// <summary>Gets the registered property key for <see cref="ShowTooltip"/>.</summary>
    static UIProperty ShowTooltipProperty { get; } = new(nameof(ShowTooltip));

    /// <summary>Gets the registered property key for <see cref="SharedTooltip"/>.</summary>
    static UIProperty SharedTooltipProperty { get; } = new(nameof(SharedTooltip));

    /// <summary>Gets the registered property key for <see cref="Zoomable"/>.</summary>
    static UIProperty ZoomableProperty { get; } = new(nameof(Zoomable));

    /// <summary>Gets the registered property key for <see cref="FollowLatest"/>.</summary>
    static UIProperty FollowLatestProperty { get; } = new(nameof(FollowLatest));

    /// <summary>Gets the registered property key for <see cref="VisibleRange"/>.</summary>
    static UIProperty VisibleRangeProperty { get; } = new(nameof(VisibleRange));

    /// <summary>The series drawn over the x axis, in the order they were added.</summary>
    IReadOnlyList<UIChartSeries> Series { get; }

    /// <summary>The row property the x of every point comes from.</summary>
    string? XPath { get; }

    /// <summary>The row property naming which series a row belongs to; unset, a row carries a value per series.</summary>
    string? SeriesPath { get; }

    /// <summary>The row property a series that names none of its own reads.</summary>
    string? ValuePath { get; }

    /// <summary>The x axis.</summary>
    UIChartAxis? XAxis { get; }

    /// <summary>The y axis.</summary>
    UIChartAxis? YAxis { get; }

    /// <summary>Where the legend stands.</summary>
    UIChartLegendPlacement Legend { get; }

    /// <summary>Whether a point names itself on hover.</summary>
    bool ShowTooltip { get; }

    /// <summary>Whether one tooltip names every series at the x under the pointer, rather than one naming the point under it.</summary>
    bool SharedTooltip { get; }

    /// <summary>Whether the viewer may zoom and pan along the x axis.</summary>
    bool Zoomable { get; }

    /// <summary>Whether a window narrower than the data stays on the far end as the data grows past it.</summary>
    bool FollowLatest { get; }

    /// <summary>The stretch of the x axis the chart shows; unset, the whole of what the data reaches.</summary>
    UIChartWindow? VisibleRange { get; }
}
