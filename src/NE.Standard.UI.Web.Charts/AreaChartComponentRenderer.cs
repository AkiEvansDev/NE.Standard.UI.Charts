using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The area chart: the line chart with a band under each line.
/// </summary>
public class AreaChartComponentRenderer : LineChartComponentRenderer
{
    public override string ComponentTypeKey => AreaChartComponent.ComponentTypeKey;

    protected override string ChartKind => AreaKind;

    protected override bool ReadStacked(WebRenderContext context)
        => ReadRenderValue(context, IStackedChartComponent.StackedProperty, false);
}
