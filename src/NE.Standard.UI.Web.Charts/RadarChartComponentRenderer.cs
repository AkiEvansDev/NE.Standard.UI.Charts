using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The radar chart: a spoke per row, rings at the value axis's ticks, and each series' values closed into a filled outline.
/// </summary>
public class RadarChartComponentRenderer : ChartComponentRendererBase
{
    public override string ComponentTypeKey => RadarChartComponent.ComponentTypeKey;

    protected override string ChartKind => RadarKind;

    protected override UIChartAxis DefaultXAxis => UIChartAxis.Category();

    protected override ChartLineOptions ReadLineOptions(WebRenderContext context)
        => new(false, false, ReadRenderValue(context, RadarChartComponent.ShowMarkersProperty, true));
}
