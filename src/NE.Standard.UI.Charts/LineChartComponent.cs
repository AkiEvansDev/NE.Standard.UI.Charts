using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One or more series drawn as lines over an x axis: a point is an item of the bound collection, and a patch moves a point.
/// </summary>
public abstract partial class LineChartComponent<T>(string? id = null) : ChartComponentBase<T>(id)
    where T : LineChartComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether the lines step between points instead of sloping; a series may override it.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool Stepped { get; set; }

    /// <summary>
    /// Gets or sets whether the lines curve through their points instead of joining them straight. A series may say otherwise.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool Smooth { get; set; }

    /// <summary>
    /// Gets or sets whether a mark is drawn at every point. A series may say otherwise.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = true)]
    public bool ShowMarkers { get; set; } = true;
}

/// <summary>
/// One or more series drawn as lines over an x axis: a point is an item of the bound collection, and a patch moves a point.
/// </summary>
public sealed class LineChartComponent(string? id = null) : LineChartComponent<LineChartComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.line";
}
