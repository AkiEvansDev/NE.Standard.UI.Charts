using System;
using System.Collections.Generic;
using NE.Standard.UI.Charts;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// One series as this render holds it: what the author said about it, and the points the rows gave it.
/// </summary>
internal sealed class ChartRenderSeries(UIChartSeries series, int index)
{
    public UIChartSeries Series { get; } = series;

    /// <summary>The series' place among the chart's own, which is the colour it takes from the theme's run.</summary>
    public int Index { get; } = index;

    public List<ChartPoint> Points { get; } = [];

    /// <summary>
    /// The points as drawn, the series' own or the stack's totals; the tooltip reads <see cref="Points"/>.
    /// </summary>
    public IReadOnlyList<ChartPoint> Drawn { get; set; } = [];
}

/// <summary>
/// What the rows amount to: the series with their points, category names met, the rows as the browser is told them, and each
/// axis's reach.
/// </summary>
internal sealed class ChartRenderData
{
    public List<string> Categories { get; } = [];

    public List<ChartRenderSeries> Series { get; } = [];

    /// <summary>The rows as <c>data-ui-chart-rows</c> carries them: the key, the x as text, the value per series, and the series a long-form row names.</summary>
    public List<object?[]> Rows { get; } = [];

    public double XMin { get; set; } = double.PositiveInfinity;

    public double XMax { get; set; } = double.NegativeInfinity;

    public double YMin { get; set; } = double.PositiveInfinity;

    public double YMax { get; set; } = double.NegativeInfinity;

    public double SizeMin { get; set; } = double.PositiveInfinity;

    public double SizeMax { get; set; } = double.NegativeInfinity;

    /// <summary>Widens the reach of the x axis to take the value in.</summary>
    public void TrackX(double value)
    {
        XMin = Math.Min(XMin, value);
        XMax = Math.Max(XMax, value);
    }

    /// <summary>Widens the reach of the y axis to take the value in.</summary>
    public void TrackY(double value)
    {
        YMin = Math.Min(YMin, value);
        YMax = Math.Max(YMax, value);
    }

    /// <summary>Widens the run of third values a point may be sized by.</summary>
    public void TrackSize(double value)
    {
        SizeMin = Math.Min(SizeMin, value);
        SizeMax = Math.Max(SizeMax, value);
    }
}
