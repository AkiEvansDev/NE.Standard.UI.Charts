using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One series with no axes, grid or legend, the height of a line of text, for a table cell or a tile's corner.
/// </summary>
[UIComponentPropertyDefault(nameof(IChartComponent.Legend), nameof(DefaultLegendValue))]
[UIComponentPropertyDefault(nameof(ShowMarkers), nameof(DefaultShowMarkers))]
public abstract partial class SparklineComponent<T>(string? id = null) : LineChartComponent<T>(id)
    where T : SparklineComponent<T>, IUIComponentDefinition
{
    // A spark is read as a shape beside something else: no legend, and no marks until the pointer finds one.
    private const UIChartLegendPlacement DefaultLegendValue = UIChartLegendPlacement.None;
    private const bool DefaultShowMarkers = false;

    /// <summary>
    /// Gets or sets whether the values are drawn as a run of bars rather than a line.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = false)]
    public bool? Bars { get; set; }

    /// <inheritdoc/>
    protected override bool IsBare => true;

    /// <inheritdoc/>
    protected override UIChartLegendPlacement DefaultLegend => UIChartLegendPlacement.None;
}

/// <summary>
/// One series with nothing around it: a line or a run of bars the height of a line of text.
/// </summary>
public sealed class SparklineComponent(string? id = null) : SparklineComponent<SparklineComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.spark";
}
