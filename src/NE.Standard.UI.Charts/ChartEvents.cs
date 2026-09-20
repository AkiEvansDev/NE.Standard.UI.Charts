namespace NE.Standard.UI.Charts;

/// <summary>
/// The events a chart raises beyond a component's own.
/// </summary>
public static class ChartEvents
{
    /// <summary>A click on a point, a bar or a sector, carrying the point's key and its series' key in that order.</summary>
    public const string PointClick = "point-click";

    /// <summary>The viewer moved the window along the x axis; the range has reached the server by the time this runs.</summary>
    public const string WindowChange = "window-change";
}
