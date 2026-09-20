using System;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One axis of a chart: what it is called, how its values are read, the range it covers and how a tick is written.
/// </summary>
public sealed record UIChartAxis
{
    /// <summary>The caption beside the axis; unset, none is drawn.</summary>
    public string? Caption { get; init; }

    /// <summary>How the values along the axis are read.</summary>
    public UIChartAxisKind Kind { get; init; }

    /// <summary>The low end of the range; unset, it follows the data.</summary>
    public double? Min { get; init; }

    /// <summary>The high end of the range; unset, it follows the data.</summary>
    public double? Max { get; init; }

    /// <summary>
    /// How a tick is written: a standard number format (<c>N0</c>, <c>N2</c>, <c>P</c>, …), or on a time axis a token pattern
    /// (<c>HH:mm</c>, <c>dd MMM</c>, …). A category writes its own name.
    /// </summary>
    public string? Format { get; init; }

    /// <summary>Whether a line is drawn across the plot at every tick.</summary>
    public bool ShowGridLines { get; init; } = true;

    /// <summary>How many ticks the axis aims for; the round step nearest that count wins.</summary>
    public int TickCount { get; init; } = 5;

    /// <summary>An axis of numbers.</summary>
    public static UIChartAxis Linear(string? caption = null, double? min = null, double? max = null, string? format = null)
        => new() { Kind = UIChartAxisKind.Linear, Caption = caption, Min = min, Max = max, Format = format };

    /// <summary>An axis of moments, marked at round intervals.</summary>
    public static UIChartAxis Time(string? caption = null, DateTime? min = null, DateTime? max = null, string? format = null)
        => new()
        {
            Kind = UIChartAxisKind.Time,
            Caption = caption,
            Min = min is DateTime from ? ChartValues.FromDateTime(from) : null,
            Max = max is DateTime to ? ChartValues.FromDateTime(to) : null,
            Format = format
        };

    /// <summary>An axis of names, one place each, in the order the rows arrive.</summary>
    public static UIChartAxis Category(string? caption = null)
        => new() { Kind = UIChartAxisKind.Category, Caption = caption };

    /// <summary>An axis of numbers on a base-ten logarithmic scale.</summary>
    public static UIChartAxis Logarithmic(string? caption = null, double? min = null, double? max = null, string? format = null)
        => new() { Kind = UIChartAxisKind.Logarithmic, Caption = caption, Min = min, Max = max, Format = format };
}
