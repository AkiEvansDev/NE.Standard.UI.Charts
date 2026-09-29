using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A cloud of unconnected points; a series' <c>sizePath</c> makes it a bubble chart.
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
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.scatter";
}
