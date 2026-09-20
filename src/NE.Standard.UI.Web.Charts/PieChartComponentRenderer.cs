using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The pie chart: the turn shared out between one series' points, with a hole in the middle where the author asked for one.
/// </summary>
public class PieChartComponentRenderer : ChartComponentRendererBase
{
    public override string ComponentTypeKey => PieChartComponent.ComponentTypeKey;

    protected override string ChartKind => PieKind;

    protected override ChartCentre ReadCentre(WebRenderContext context)
        => new(ReadRenderValue(context, PieChartComponent.DonutProperty, 0d), ReadRenderValue<string?>(context, PieChartComponent.CentreCaptionProperty, null));
}
