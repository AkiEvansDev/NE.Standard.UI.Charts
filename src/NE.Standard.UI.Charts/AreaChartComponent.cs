using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A line chart with the area under each series filled to the axis's zero, or to the series below it when stacked.
/// </summary>
public abstract partial class AreaChartComponent<T> : LineChartComponent<T>, IStackedChartComponent
    where T : AreaChartComponent<T>, IUIComponentDefinition
{
    protected AreaChartComponent(string? id = null) : base(id)
    {
        // A band is read by its shape, not point by point: the marks the line chart wears would only crowd it.
        ShowMarkers = false;
    }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IStackedChartComponent), IsBindable = false, DefaultValue = false)]
    public bool Stacked { get; set; }
}

/// <summary>
/// A line chart with the ground under each series filled, stacked where the series add up to something.
/// </summary>
public sealed class AreaChartComponent(string? id = null) : AreaChartComponent<AreaChartComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.area";
}
