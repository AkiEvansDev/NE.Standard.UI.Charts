using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The base every chart shares: rows, x, series, axes and legend; a chart hosts no item template.
/// </summary>
public abstract partial class ChartComponentBase<T>(string? id = null) : ItemsComponentBase<T, IBindableItem>(id), IChartComponent, IItemValuesComponent, IPressablePartsComponent, IClientWriteCheckComponent
    where T : ChartComponentBase<T>, IUIComponentDefinition
{
    private readonly List<UIChartSeries> _series = [];

    // The window's binding as the author gave it, bound again as the chart's gestures say whether the page may write it back.
    private UIBinding? _windowBinding;

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
    /// Gets the row property naming a row's series, set by <see cref="SetSeriesPath"/>; unset, a row carries a value per series.
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
    public UIChartLegendPlacement? Legend { get; set; }

    /// <summary>
    /// Gets or sets whether a point names its series, its x and its value on hover, through the framework's tooltip.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = true)]
    public bool? ShowTooltip { get; set; }

    /// <summary>
    /// Gets or sets whether one tooltip names every series at the x under the pointer, instead of one per point (not on a radar).
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = false)]
    public bool? SharedTooltip { get; set; }

    /// <summary>
    /// Gets or sets whether the viewer may zoom and pan the x axis; a pie, a radar or a bare chart never zooms.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = false)]
    public bool? Zoomable
    {
        get;
        set
        {
            field = value;
            BindWindow();
        }
    }

    /// <summary>
    /// Gets or sets whether a window narrower than the data stays pinned to the latest end as new data arrives.
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), IsBindable = false, DefaultValue = false)]
    public bool? FollowLatest
    {
        get;
        set
        {
            field = value;
            BindWindow();
        }
    }

    /// <summary>
    /// Gets or sets the visible stretch of the x axis, bound both ways while the chart zooms or follows the latest, else one way;
    /// unset, the whole of the data (not on a radar).
    /// </summary>
    [UIComponentProperty(Contract = typeof(IChartComponent), DefaultValue = null, BindingCapabilities = UIBindingCapabilities.SourceToTarget | UIBindingCapabilities.TargetToSource, DefaultBindingMode = UIBindingMode.TwoWay, GenerateBinder = false)]
    public UIChartWindow? VisibleRange { get; set; }

    /// <summary>
    /// Binds <see cref="VisibleRange"/> to a path; it takes the page's window back only while the chart zooms or follows the latest,
    /// so a chart that moves no window refuses a forged one, whichever was said first.
    /// </summary>
    public T BindVisibleRange(string path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.TwoWay)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        return BindVisibleRange(RecursivePath.Parse(path), scope, mode);
    }

    /// <inheritdoc cref="BindVisibleRange(string, UIBindingScope, UIBindingMode)"/>
    public T BindVisibleRange(RecursivePath path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.TwoWay)
    {
        ArgumentNullException.ThrowIfNull(path);

        _windowBinding = UIBinding.Property(IChartComponent.VisibleRangeProperty, path, scope, mode);
        BindWindow();

        return Self;
    }

    /// <inheritdoc cref="BindVisibleRange(string, UIBindingScope, UIBindingMode)"/>
    public T BindVisibleRange<TSource>(Expression<Func<TSource, object?>> path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode mode = UIBindingMode.TwoWay)
    {
        ArgumentNullException.ThrowIfNull(path);

        return BindVisibleRange(RecursivePath.FromExpression(path), scope, mode);
    }

    /// <summary>The window bound as the author said where the chart moves it, else one way: no gesture of its own writes it back.</summary>
    private void BindWindow()
    {
        if (_windowBinding is not { } binding)
            return;

        UIBindingMode mode = MovesWindow || binding.Mode is not (UIBindingMode.TwoWay or UIBindingMode.OneWayToSource) ? binding.Mode : UIBindingMode.OneWay;

        _ = Bind(IChartComponent.VisibleRangeProperty, binding.Source, binding.Scope, mode);
    }

    /// <summary>Whether the page moves the chart's window: the kind has one, and the chart zooms or follows the latest.</summary>
    private bool MovesWindow => Zooms || (HasWindow && FollowLatest == true);

    /// <summary>Whether the viewer zooms the chart: the kind has a window and is drawn with its axes, and the chart is zoomable.</summary>
    private bool Zooms => HasWindow && !IsBare && Zoomable == true;

    /// <summary>Whether the chart kind shows a stretch of an x axis at all; a pie, a share bar and a radar show none.</summary>
    protected virtual bool HasWindow => true;

    /// <summary>Whether the chart kind is drawn with nothing around it — a sparkline — and so never zooms, as its renderer draws it.</summary>
    protected virtual bool IsBare => false;

    /// <summary>Where the chart kind's legend stands when <see cref="Legend"/> is unset.</summary>
    protected virtual UIChartLegendPlacement DefaultLegend => UIChartLegendPlacement.Bottom;

    /// <inheritdoc/>
    /// <remarks>
    /// A chart that moves no window refuses every one the page sends, however it is bound; one that moves it takes any whose ends
    /// read (<see cref="UIChartWindowJsonConverter"/>), held to the data's extent where it is drawn. Render-time only.
    /// </remarks>
    [UIComponentProperty(Contract = typeof(IClientWriteCheckComponent), IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public UIClientWriteCheck? ClientWriteCheck => MovesWindow ? null : ChartWindowRefusal.Instance;

    /// <inheritdoc/>
    /// <remarks>A chart has no components inside an item template, so a change to a point has to reach it as a replace of the row.</remarks>
    [UIComponentProperty(Contract = typeof(IItemValuesComponent), IsBindable = false, GenerateSetter = false, DefaultValue = false)]
    public bool TakesItemValues => true;

    /// <summary>
    /// Gets whether the chart's own parts are presses — a legend's entries, which hide and show their series, a zoom, a point's click —
    /// so that a link may hold only a chart with none, a sparkline's as it comes. A kind with no window (a pie) has no zoom to press.
    /// </summary>
    public bool HasPressableParts => (Legend ?? DefaultLegend) != UIChartLegendPlacement.None || Zooms || HasPointClick();

    private bool HasPointClick()
    {
        foreach (UIEvent registered in Events)
        {
            if (string.Equals(registered.Name, ChartEvents.PointClick, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

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
    /// Reads which series a row belongs to from this row property; without it, a row carries a value per series.
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
    /// Adds a series reading <paramref name="valuePath"/>, else the chart's own <c>ValuePath</c> for rows keyed by <c>SeriesPath</c>.
    /// </summary>
    public T AddSeries(string key, UIPhrase? caption = null, string? valuePath = null, string? sizePath = null, UIThemeColor? color = null)
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

/// <summary>The page's window refused, for a chart that moves none.</summary>
internal sealed class ChartWindowRefusal : UIClientWriteCheck
{
    public static ChartWindowRefusal Instance { get; } = new();

    /// <inheritdoc/>
    public override bool Accepts(UIProperty property, object? value)
        => property != IChartComponent.VisibleRangeProperty;
}
