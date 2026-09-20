using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The bar chart: the shared frame with a bar per point, side by side in the x's own band or on one another.
/// </summary>
public class BarChartComponentRenderer : ChartComponentRendererBase
{
    public override string ComponentTypeKey => BarChartComponent.ComponentTypeKey;

    protected override string ChartKind => BarKind;

    protected override bool ReadStacked(WebRenderContext context)
        => ReadRenderValue(context, IStackedChartComponent.StackedProperty, false);

    protected override bool ReadHorizontal(WebRenderContext context)
        => ReadRenderValue(context, IBarChartComponent.HorizontalProperty, false);
}
