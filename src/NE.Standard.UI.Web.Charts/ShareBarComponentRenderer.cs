using System.Globalization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The share bar: one series' points one after another along a single bar, what they leave of a total as its empty track, and the
/// author's words over it.
/// </summary>
public class ShareBarComponentRenderer : ChartComponentRendererBase
{
    /// <summary>The DOM operation a bound total's push takes: written on the root, and the bar drawn again.</summary>
    public const string TotalOperationKind = "chart-total";

    public override string ComponentTypeKey => ShareBarComponent.ComponentTypeKey;

    protected override string ChartKind => ShareKind;

    protected override bool ReadLegendValues(WebRenderContext context)
        => ReadRenderValue(context, IShareChartComponent.ShowLegendValuesProperty, false);

    protected override double? ReadTotal(WebRenderContext context)
        => ReadRenderValue<double?>(context, ShareBarComponent.TotalProperty, null);

    protected override string? ReadRemainderCaption(WebRenderContext context)
        => ReadRenderValue<string?>(context, ShareBarComponent.RemainderCaptionProperty, null);

    protected override void RenderTotal(WebRenderContext context, IHtmlElementBuilder root)
        => _ = RenderProperty<double?>(context, root, ShareBarComponent.TotalProperty, static (target, total) =>
        {
            if (total is double value)
                _ = target.Attribute(TotalAttribute, value.ToString("R", CultureInfo.InvariantCulture));
        }, [WebDomOperation.Custom(TotalOperationKind)]);

    protected override void RenderHeading(WebRenderContext context, IHtmlElementBuilder heading)
        => _ = RenderProperty<string?>(context, heading, ShareBarComponent.CaptionProperty, static (target, caption) =>
        {
            if (!string.IsNullOrWhiteSpace(caption))
                _ = target.Text(caption);
        }, [WebDomOperation.Text()]);
}
