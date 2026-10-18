using NE.Standard.UI.Charts;

namespace NE.Standard.UI.Web.Charts;

/// <summary>One axis as the client reads it.</summary>
internal sealed record ChartClientAxis
{
    public required UIChartAxisKind Kind { get; init; }

    public double? Min { get; init; }

    public double? Max { get; init; }

    public string? Format { get; init; }

    public bool Grid { get; init; }

    public int Ticks { get; init; }

    /// <summary>Whether the client writes a category's name in the page's words, translated at every draw as a caption is.</summary>
    public bool Translate { get; init; }

    /// <summary>As the author wrote it: the client translates it, again at every language switch.</summary>
    public string? Caption { get; init; }

    /// <summary>An authored axis as the client reads it.</summary>
    public static ChartClientAxis Of(UIChartAxis axis)
        => new()
        {
            Kind = axis.Kind,
            Min = axis.Min,
            Max = axis.Max,
            Format = axis.Format,
            Grid = axis.ShowGridLines,
            Ticks = axis.TickCount,
            Translate = axis.TranslateNames,
            Caption = string.IsNullOrWhiteSpace(axis.Caption) ? null : axis.Caption
        };
}

/// <summary>One series as the client reads it; the colour is a CSS value, resolved here where the theme is known.</summary>
internal sealed record ChartClientSeries
{
    public required string Key { get; init; }

    /// <summary>As the author wrote it, or null for none — the client then names the series by its key; translated there.</summary>
    public string? Caption { get; init; }

    public string? ValuePath { get; init; }

    public string? SizePath { get; init; }

    public string? Color { get; init; }

    public bool? Stepped { get; init; }

    public bool? Smooth { get; init; }

    public bool? Markers { get; init; }
}
