using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// Bars over an x axis, one per series at every x, side by side or stacked on one another. A bar always starts at zero.
/// </summary>
public abstract partial class BarChartComponent<T>(string? id = null) : ChartComponentBase<T>(id), IStackedChartComponent, IBarChartComponent
    where T : BarChartComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IStackedChartComponent), IsBindable = false, GenerateBinder = false, DefaultValue = false)]
    public bool Stacked { get; set; }

    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IBarChartComponent), IsBindable = false, GenerateBinder = false, DefaultValue = false)]
    public bool Horizontal { get; set; }
}

/// <summary>
/// Bars over an x axis, side by side or on one another.
/// </summary>
public sealed class BarChartComponent(string? id = null) : BarChartComponent<BarChartComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "charts.bar";
}
