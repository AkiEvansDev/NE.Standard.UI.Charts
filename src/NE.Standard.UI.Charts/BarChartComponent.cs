using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Charts;

/// <summary>
/// Bars over an x axis, one per series at every x, side by side or stacked on one another. A bar always starts at zero.
/// </summary>
public abstract partial class BarChartComponent<T>(string? id = null) : ChartComponentBase<T>(id), IStackedChartComponent, IBarChartComponent
    where T : BarChartComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IStackedChartComponent), IsBindable = false, DefaultValue = false)]
    public bool? Stacked { get; set; }

    /// <inheritdoc/>
    /// <remarks>One way at every width: the chart is drawn on the server, its bands laid out once.</remarks>
    [UIComponentProperty(Contract = typeof(IBarChartComponent), IsBindable = false, DefaultValue = UIOrientation.Vertical)]
    public UIOrientation? Orientation { get; set; }
}

/// <summary>
/// Bars over an x axis, side by side or on one another.
/// </summary>
public sealed class BarChartComponent(string? id = null) : BarChartComponent<BarChartComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.bar";
}
