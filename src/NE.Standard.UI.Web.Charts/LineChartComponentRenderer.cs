using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The line chart: the shared frame with a path per series over it.
/// </summary>
public class LineChartComponentRenderer : ChartComponentRendererBase
{
    public override string ComponentTypeKey => LineChartComponent.ComponentTypeKey;

    protected override string ChartKind => LineKind;

    protected override ChartLineOptions ReadLineOptions(WebRenderContext context)
        => new(
            ReadRenderValue(context, LineChartComponent.SteppedProperty, false),
            ReadRenderValue(context, LineChartComponent.SmoothProperty, false),
            ReadRenderValue(context, LineChartComponent.ShowMarkersProperty, true));
}
