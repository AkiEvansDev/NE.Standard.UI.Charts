using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// Series drawn as filled shapes over spokes: a row's x names a spoke, and the y axis is the scale they share.
/// </summary>
public abstract partial class RadarChartComponent<T>(string? id = null) : ChartComponentBase<T>(id)
    where T : RadarChartComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether a mark is drawn where a series meets a spoke. A series may say otherwise.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = true)]
    public bool ShowMarkers { get; set; } = true;
}

/// <summary>
/// Series drawn as filled shapes over spokes, one spoke per row.
/// </summary>
public sealed class RadarChartComponent(string? id = null) : RadarChartComponent<RadarChartComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.radar";
}
