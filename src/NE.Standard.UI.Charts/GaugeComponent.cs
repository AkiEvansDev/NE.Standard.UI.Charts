using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One value on an arc, read in a range with bands that say what it means.
/// </summary>
public abstract partial class GaugeComponent<T>(string? id = null) : VisualComponentBase<T>(id)
    where T : GaugeComponent<T>, IUIComponentDefinition
{
    private readonly List<UIGaugeBand> _bands = [];

    /// <summary>
    /// Gets or sets the reading; unset, the arc is empty and the gauge says so.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public double? Value { get; set; }

    /// <summary>
    /// Gets the low end of the range, set by <see cref="SetRange"/>.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = 0d)]
    public double Min { get; private set; }

    /// <summary>
    /// Gets the high end of the range, set by <see cref="SetRange"/>.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = 100d)]
    public double Max { get; private set; } = 100;

    /// <summary>
    /// Gets the bands along the arc, in the order they were added.
    /// </summary>
    /// <remarks>Render-time only: the bands are how the gauge is built.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = null)]
    public IReadOnlyList<UIGaugeBand> Bands => _bands;

    /// <summary>
    /// Gets or sets the words under the reading — what is being measured.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Caption { get; set; }

    /// <summary>
    /// Gets or sets how the reading is written: a standard number format in the page's culture.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = "N0")]
    public string? Format { get; set; } = "N0";

    /// <summary>
    /// Gets or sets the unit written after the reading — a per cent sign, a word.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Unit { get; set; }

    /// <summary>
    /// Sets the range the reading is read in.
    /// </summary>
    public T SetRange(double min, double max)
    {
        if (max <= min)
            throw new ArgumentOutOfRangeException(nameof(max), max, "A gauge's range must run upward.");

        Min = min;
        Max = max;

        return Self;
    }

    /// <summary>
    /// Adds a band along the arc: what the stretch from <paramref name="from"/> to <paramref name="to"/> means.
    /// </summary>
    public T AddBand(double from, double to, UIThemeColor? color = null)
    {
        if (to <= from)
            throw new ArgumentOutOfRangeException(nameof(to), to, "A band must run upward.");

        _bands.Add(new UIGaugeBand { From = from, To = to, Color = color });

        return Self;
    }
}

/// <summary>
/// One value on an arc, with bands that say what the reading means.
/// </summary>
public sealed class GaugeComponent(string? id = null) : GaugeComponent<GaugeComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.gauge";
}
