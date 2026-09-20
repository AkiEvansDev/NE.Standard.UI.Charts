namespace NE.Standard.UI.Charts;

/// <summary>
/// Where a chart's legend stands, or that it stands nowhere.
/// </summary>
public enum UIChartLegendPlacement
{
    /// <summary>No legend.</summary>
    None = 0,

    /// <summary>Above the plot.</summary>
    Top = 1,

    /// <summary>Under the plot.</summary>
    Bottom = 2,

    /// <summary>At the start edge, reading down.</summary>
    Start = 3,

    /// <summary>At the end edge, reading down.</summary>
    End = 4
}
