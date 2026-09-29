using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One series as sectors of a turn: a row's x names the sector, its value is the share.
/// </summary>
public abstract partial class PieChartComponent<T>(string? id = null) : ChartComponentBase<T>(id)
    where T : PieChartComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets how much of the radius the hole in the middle takes, set by <c>SetDonut</c>.
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateSetter = false, DefaultValue = 0d)]
    public double Donut { get; private set; }

    /// <summary>
    /// Gets or sets the words in the middle of a donut; nothing is written without a hole.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? CentreCaption { get; set; }

    /// <summary>
    /// Leaves a hole in the middle, as a share of the radius — the shape a total is written in.
    /// </summary>
    public T SetDonut(double share = 0.6)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(share);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(share, 0.9);

        Donut = share;
        return Self;
    }
}

/// <summary>
/// One series as sectors of a turn, with or without a hole in the middle.
/// </summary>
public sealed class PieChartComponent(string? id = null) : PieChartComponent<PieChartComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.pie";
}
