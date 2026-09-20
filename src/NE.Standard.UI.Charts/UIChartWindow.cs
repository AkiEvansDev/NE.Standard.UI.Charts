using System;
using System.Globalization;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The stretch of the x axis a chart shows, in the axis's own units — a number, clock milliseconds, or a category place. Unset,
/// the chart shows the whole of its data.
/// </summary>
public readonly record struct UIChartWindow(double From, double To)
{
    // The two ends are the wire; nothing computed goes on it, so the browser reads the same shape it writes.
    /// <summary>How much of the axis the window covers.</summary>
    [JsonIgnore]
    public double Width => To - From;

    /// <summary>The window between two moments, for a chart whose x axis is a clock.</summary>
    public static UIChartWindow Between(DateTime from, DateTime to)
        => new(ChartValues.FromDateTime(from), ChartValues.FromDateTime(to));

    /// <summary>The near end as a moment, for a chart whose x axis is a clock.</summary>
    [JsonIgnore]
    public DateTime FromTime => ChartValues.ToDateTime(From);

    /// <summary>The far end as a moment, for a chart whose x axis is a clock.</summary>
    [JsonIgnore]
    public DateTime ToTime => ChartValues.ToDateTime(To);

    public override string ToString()
        => string.Create(CultureInfo.InvariantCulture, $"{From} .. {To}");
}
