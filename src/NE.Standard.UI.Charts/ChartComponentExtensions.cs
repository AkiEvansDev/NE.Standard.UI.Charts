using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Charts;

/// <summary>
/// What an author wires on a chart beyond a component's own.
/// </summary>
public static class ChartComponentExtensions
{
    /// <summary>
    /// Runs <paramref name="command"/> when a point is clicked, with its key as <c>point</c> and its series' as <c>series</c>.
    /// </summary>
    public static T OnPointClick<T>(this T chart, string command)
        where T : ChartComponentBase<T>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(chart);

        return chart.On(ChartEvents.PointClick, command, ChartArguments.Point("point"), ChartArguments.Series("series"));
    }

    /// <inheritdoc cref="OnPointClick{T}(T, string)"/>
    public static T OnPointClick<T>(this T chart, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : ChartComponentBase<T>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(chart);

        return chart.On(ChartEvents.PointClick, command, arguments);
    }

    /// <summary>
    /// Runs <paramref name="command"/> when the viewer moves the window, after the bound <c>VisibleRange</c> reached the server.
    /// </summary>
    public static T OnWindowChange<T>(this T chart, string command)
        where T : ChartComponentBase<T>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(chart);

        return chart.On(ChartEvents.WindowChange, command);
    }

    /// <inheritdoc cref="OnWindowChange{T}(T, string)"/>
    public static T OnWindowChange<T>(this T chart, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
        where T : ChartComponentBase<T>, IUIComponentDefinition
    {
        ArgumentNullException.ThrowIfNull(chart);

        return chart.On(ChartEvents.WindowChange, command, arguments);
    }
}
