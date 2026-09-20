namespace NE.Standard.UI.Charts;

/// <summary>
/// How the values along an axis are read.
/// </summary>
public enum UIChartAxisKind
{
    /// <summary>Numbers, evenly spaced.</summary>
    Linear = 0,

    /// <summary>Moments in time, evenly spaced, marked at round intervals.</summary>
    Time = 1,

    /// <summary>Names, one place each, in the order the rows arrive.</summary>
    Category = 2,

    /// <summary>Numbers on a base-ten logarithmic scale; the range must stay above zero.</summary>
    Logarithmic = 3
}
