using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A chart drawn as bars, whose bands may run down the box rather than across it.
/// </summary>
public interface IBarChartComponent
{
    /// <summary>Gets the registered property key for <see cref="Horizontal"/>.</summary>
    static UIProperty HorizontalProperty { get; } = new(nameof(Horizontal));

    /// <summary>Whether the bars lie on their side: the values run across the box and one band per x runs down it.</summary>
    bool Horizontal { get; }
}
