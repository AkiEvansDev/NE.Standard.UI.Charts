using NE.Standard.UI.Charts;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The scatter chart: the shared frame with a mark per point and no line between them.
/// </summary>
public class ScatterChartComponentRenderer : ChartComponentRendererBase
{
    public override string ComponentTypeKey => ScatterChartComponent.ComponentTypeKey;

    protected override string ChartKind => ScatterKind;
}
