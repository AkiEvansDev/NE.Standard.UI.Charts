using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// Series drawn as shapes over spokes: a row's x names a spoke, and each series' values along the spokes close into a filled
/// outline, so two series read against each other at a glance — a character's attributes, a product's scores. The x axis is a
/// category one unless the author sets another; the y axis is the scale every spoke shares, its ticks the rings of the grid.
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
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "charts.radar";
}
