using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The base every chart shares: the row collection, the x axis property, the series drawn over it, the two axes and the legend.
/// A chart hosts no item template.
/// </summary>
public abstract partial class ChartComponentBase<T>(string? id = null) : ItemsComponentBase<T, IBindableItem>(id), IChartComponent, IItemValuesComponent
    where T : ChartComponentBase<T>, IUIComponentDefinition
{
    private readonly List<UIChartSeries> _series = [];

    /// <inheritdoc/>
    /// <remarks>Render-time only: the series are how the chart is built.</remarks>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIChartSeries> Series => _series;

    /// <summary>
    /// Gets the row property the x axis reads, set by <see cref="SetX"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public string? XPath { get; private set; }

    /// <summary>
    /// Gets the row property naming which series a row belongs to, set by <see cref="SetSeriesPath"/>; unset, a row carries a value
    /// per series instead, each series naming its own property.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public string? SeriesPath { get; private set; }

    /// <summary>
    /// Gets the row property every series that names none of its own reads, set by <see cref="SetValuePath"/>.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public string? ValuePath { get; private set; }

    /// <summary>
    /// Gets or sets the x axis; unset, a linear one that follows the data.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = null)]
    public UIChartAxis? XAxis { get; set; }

    /// <summary>
    /// Gets or sets the y axis; unset, a linear one that follows the data.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = null)]
    public UIChartAxis? YAxis { get; set; }

    /// <summary>
    /// Gets or sets where the legend stands; a click on an entry there hides and shows its series, in the browser alone.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = UIChartLegendPlacement.Bottom)]
    public UIChartLegendPlacement Legend { get; set; } = UIChartLegendPlacement.Bottom;

    /// <summary>
    /// Gets or sets whether a point names its series, its x and its value on hover, through the framework's tooltip.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = true)]
    public bool ShowTooltip { get; set; } = true;

    /// <summary>
    /// Gets or sets whether one tooltip names every series at the x under the pointer, instead of one per point.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = false)]
    public bool SharedTooltip { get; set; }

    /// <summary>
    /// Gets or sets whether the viewer may zoom and pan the x axis with wheel, drag and double press. Off by default; a pie or a
    /// bare chart never zooms whatever this says.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = false)]
    public bool Zoomable { get; set; }

    /// <summary>
    /// Gets or sets whether a window narrower than the data stays pinned to the latest end as new data arrives.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = false)]
    public bool FollowLatest { get; set; }

    /// <summary>
    /// Gets or sets the visible stretch of the x axis; unset, the whole of the data. Bound both ways: the viewer's drag and
    /// wheel write it, and setting it moves the chart.
    /// </summary>
    [UIComponentProperty(
        Contract = typeof(IChartComponent),
        DefaultValue = null,
        BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource,
        DefaultBindingMode = UIBindingMode.TwoWay)]
    public UIChartWindow? VisibleRange { get; set; }

    /// <inheritdoc/>
    /// <remarks>A chart has no components inside an item template, so a change to a point has to reach it as a replace of the row.</remarks>
    [UIComponentProperty(Contract = typeof(IItemValuesComponent), IsBindable = false, GenerateSetter = false, DefaultValue = false)]
    public bool TakesItemValues => true;

    /// <summary>
    /// Reads the x of every point from this row property — a number, a moment or a name, which the x axis's kind says which of.
    /// </summary>
    public T SetX(string propertyPath)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyPath);

        XPath = propertyPath;
        return Self;
    }

    /// <summary>
    /// Reads which series a row belongs to from this row property. Without it, a row carries a value per series, each series
    /// naming its own property.
    /// </summary>
    public T SetSeriesPath(string propertyPath)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyPath);

        SeriesPath = propertyPath;
        return Self;
    }

    /// <summary>
    /// Reads a point's value from this row property, for every series that names none of its own.
    /// </summary>
    public T SetValuePath(string propertyPath)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyPath);

        ValuePath = propertyPath;
        return Self;
    }

    /// <summary>
    /// Adds a series reading its value from <paramref name="valuePath"/> when given, else the chart's own <c>ValuePath</c> for
    /// rows keyed by <c>SeriesPath</c>. A sized chart reads size from <paramref name="sizePath"/>.
    /// </summary>
    public T AddSeries(string key, string? caption = null, string? valuePath = null, string? sizePath = null, UIThemeColor? color = null)
        => AddSeries(new UIChartSeries { Key = key, Caption = caption, ValuePath = valuePath, SizePath = sizePath, Color = color });

    /// <summary>
    /// Adds a series as it stands.
    /// </summary>
    public T AddSeries(UIChartSeries series)
    {
        ArgumentNullException.ThrowIfNull(series);
        ArgumentException.ThrowIfNullOrWhiteSpace(series.Key);

        for (var i = 0; i < _series.Count; i++)
        {
            if (string.Equals(_series[i].Key, series.Key, StringComparison.Ordinal))
                throw new InvalidOperationException($"Chart '{Id}' already has a series keyed '{series.Key}'.");
        }

        _series.Add(series);
        return Self;
    }
}
