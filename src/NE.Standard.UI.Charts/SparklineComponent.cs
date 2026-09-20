using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One series with nothing around it: no axes, no grid, no legend, a line or bars the height of a line of text, for a table
/// cell or a tile's corner. A point still says what it is on hover.
/// </summary>
public abstract partial class SparklineComponent<T> : LineChartComponent<T>
    where T : SparklineComponent<T>, IUIComponentDefinition
{
    protected SparklineComponent(string? id = null) : base(id)
    {
        // A spark is read as a shape beside something else: no legend, and no marks until the pointer finds one.
        Legend = UIChartLegendPlacement.None;
        ShowMarkers = false;
    }

    /// <summary>
    /// Gets or sets whether the values are drawn as a run of bars rather than a line.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = false)]
    public bool Bars { get; set; }
}

/// <summary>
/// One series with nothing around it: a line or a run of bars the height of a line of text.
/// </summary>
public sealed class SparklineComponent(string? id = null) : SparklineComponent<SparklineComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "charts.spark";
}
