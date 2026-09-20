using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The sparkline: a line or a run of bars with nothing around it — the plot is the whole box.
/// </summary>
public class SparklineComponentRenderer : LineChartComponentRenderer
{
    public override string ComponentTypeKey => SparklineComponent.ComponentTypeKey;

    protected override string ChartKind => LineKind;

    /// <summary>A spark of bars is drawn as a bar chart is, in a box with nothing around it.</summary>
    protected override string ReadKind(WebRenderContext context)
        => ReadRenderValue(context, SparklineComponent.BarsProperty, false) ? BarKind : LineKind;

    protected override bool ReadBare(WebRenderContext context)
        => true;
}
