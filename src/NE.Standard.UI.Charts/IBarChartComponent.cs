using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A chart drawn as bars, whose bands may run down the box rather than across it.
/// </summary>
public interface IBarChartComponent
{
    /// <summary>Gets the registered property key for <see cref="Orientation"/>.</summary>
    static UIProperty OrientationProperty { get; } = new(nameof(Orientation));

    /// <summary>
    /// Which way the bars stand: <see cref="UIOrientation.Vertical"/>, up from the x axis; <see cref="UIOrientation.Horizontal"/>, on
    /// their side, the values across the box and one band per x down it.
    /// </summary>
    UIOrientation? Orientation { get; }
}
