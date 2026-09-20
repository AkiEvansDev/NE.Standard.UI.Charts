using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A chart whose series may stand on one another rather than each on the axis — an area, a bar.
/// </summary>
public interface IStackedChartComponent
{
    /// <summary>Gets the registered property key for <see cref="Stacked"/>.</summary>
    static UIProperty StackedProperty { get; } = new(nameof(Stacked));

    /// <summary>Whether the series stand on one another, so what the viewer reads at an x is the total.</summary>
    bool Stacked { get; }
}
