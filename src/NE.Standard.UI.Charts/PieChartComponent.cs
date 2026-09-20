using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One series as sectors of a turn: a row's x names the sector, its value is the share. No axes — the legend and tooltip say
/// what a sector is.
/// </summary>
public abstract partial class PieChartComponent<T>(string? id = null) : ChartComponentBase<T>(id)
    where T : PieChartComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets how much of the radius the hole in the middle takes, from none (a pie) to nearly all of it (a thin ring).
    /// </summary>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, GenerateSetter = false, DefaultValue = 0d)]
    public double Donut { get; private set; }

    /// <summary>
    /// Gets or sets the words in the middle of a donut — a total, a name. Nothing is written where there is no hole to write it in.
    /// </summary>
    [Translatable]
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = null)]
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
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "charts.pie";
}
