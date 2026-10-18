using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A chart that shares one whole out between one series' points — a pie, a share bar — and whose legend names those parts.
/// </summary>
public interface IShareChartComponent
{
    /// <summary>Gets the registered property key for <see cref="ShowLegendValues"/>.</summary>
    static UIProperty ShowLegendValuesProperty { get; } = new(nameof(ShowLegendValues));

    /// <summary>Whether the legend is a table: each part's name, its value and its share of the whole.</summary>
    bool ShowLegendValues { get; }
}
