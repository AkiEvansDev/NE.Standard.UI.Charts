using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A cloud of unconnected points; a third value may size each one via <c>AddSeries(key, caption, valuePath, sizePath)</c>, making
/// it a bubble chart. Without a size path, every point is drawn the same.
/// </summary>
public abstract partial class ScatterChartComponent<T>(string? id = null) : ChartComponentBase<T>(id)
    where T : ScatterChartComponent<T>, IUIComponentDefinition
{
}

/// <summary>
/// A cloud of points, each optionally sized by a third value.
/// </summary>
public sealed class ScatterChartComponent(string? id = null) : ScatterChartComponent<ScatterChartComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "charts.scatter";
}
