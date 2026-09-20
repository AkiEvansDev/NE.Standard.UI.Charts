using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Charts;

/// <summary>What the browser is told: the model on the root, and the legend it hides and shows series by.</summary>
public abstract partial class ChartComponentRendererBase
{
    /// <summary>One entry of the legend: what it is keyed by, what it says, and the colour its mark takes.</summary>
    private readonly record struct LegendEntry(string Key, string Caption, string Color);

    /// <summary>The chart as the browser reads it: the ends the author fixed rather than the ones this render settled on.</summary>
    private static ChartClientModel BuildModel(ChartSpec spec, ChartRenderData data, WebRenderContext context)
    {
        List<ChartClientSeries> series = new(data.Series.Count);

        for (var i = 0; i < data.Series.Count; i++)
        {
            ChartRenderSeries current = data.Series[i];

            series.Add(new ChartClientSeries
            {
                Key = current.Series.Key,
                Caption = ReadCaption(context, current.Series),
                ValuePath = current.Series.ValuePath ?? spec.ValuePath,
                SizePath = current.Series.SizePath,
                Color = SeriesColor(context, current),
                Stepped = current.Series.Stepped,
                Smooth = current.Series.Smooth,
                Markers = current.Series.ShowMarkers
            });
        }

        return new ChartClientModel
        {
            Kind = spec.Kind,
            X = ToClientAxis(context, spec.XAxis),
            Y = ToClientAxis(context, spec.YAxis),
            Series = series,
            XPath = spec.XPath,
            SeriesPath = spec.SeriesPath,
            ValuePath = spec.ValuePath,
            Legend = spec.Legend,
            Tooltip = spec.Tooltip,
            Stepped = spec.Stepped,
            Smooth = spec.Smooth,
            Markers = spec.Markers,
            Stacked = spec.Stacked,
            SharedTooltip = spec.SharedTooltip,
            Zoomable = spec.Zoomable,
            FollowLatest = spec.FollowLatest,
            Horizontal = spec.Horizontal,
            Bare = spec.Bare,
            Donut = spec.Donut,
            CentreCaption = spec.CentreCaption
        };
    }

    /// <summary>The words the legend and the tooltip name a series by: the caption, translated, or the key itself.</summary>
    private static string ReadCaption(WebRenderContext context, UIChartSeries series)
        => string.IsNullOrWhiteSpace(series.Caption) ? series.Key : context.Translate(series.Caption);

    /// <summary>The colour of a series: the one the author gave, or its place in the theme's categorical run, cycled as the browser cycles it.</summary>
    private static string SeriesColor(WebRenderContext context, ChartRenderSeries series)
        => ThemeColorRenderer.SeriesColorCss(context, series.Index, series.Series.Color);

    private static ChartClientAxis ToClientAxis(WebRenderContext context, UIChartAxis axis)
        => new()
        {
            Kind = axis.Kind,
            Min = axis.Min,
            Max = axis.Max,
            Format = axis.Format,
            Grid = axis.ShowGridLines,
            Ticks = axis.TickCount,
            Caption = string.IsNullOrWhiteSpace(axis.Caption) ? null : context.Translate(axis.Caption)
        };

    /// <summary>An entry per series, each a button the engine hides and shows its series by; none where the author asked for none.</summary>
    private static void RenderLegend(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data)
    {
        if (spec.Legend == UIChartLegendPlacement.None)
            return;

        LegendEntry[] entries = new LegendEntry[data.Series.Count];

        for (var i = 0; i < data.Series.Count; i++)
            entries[i] = new LegendEntry(data.Series[i].Series.Key, ReadCaption(context, data.Series[i].Series), SeriesColor(context, data.Series[i]));

        RenderLegendEntries(root, entries);
    }

    /// <summary>An entry per sector rather than per series: a pie's series is one, and what a viewer puts aside is a sector.</summary>
    private static void RenderSectorLegend(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartFormats formats, CultureInfo culture)
    {
        if (spec.Legend == UIChartLegendPlacement.None)
            return;

        List<ChartPoint> points = data.Series.Count > 0 ? data.Series[0].Points : [];
        LegendEntry[] entries = new LegendEntry[points.Count];

        for (var i = 0; i < points.Count; i++)
            entries[i] = new LegendEntry(points[i].Key, SectorLabel(spec, data, points[i], formats, culture), ThemeColorRenderer.SeriesColorCss(context, i));

        RenderLegendEntries(root, entries);
    }

    /// <summary>The legend as a row of buttons, one per entry, each pressed until the viewer puts it aside; none where there is nothing to name.</summary>
    private static void RenderLegendEntries(IHtmlElementBuilder root, IReadOnlyList<LegendEntry> entries)
    {
        if (entries.Count == 0)
            return;

        _ = root.Element("div", legend =>
        {
            _ = legend.Class(LegendClassName);

            for (var i = 0; i < entries.Count; i++)
            {
                LegendEntry entry = entries[i];

                _ = legend.Element("button", button =>
                {
                    _ = button.Class($"{LegendEntryClassName} ui-button ui-button--ghost ui-button--small");
                    _ = button.Attribute("type", "button");
                    _ = button.Attribute(SeriesAttribute, entry.Key);
                    _ = button.Attribute("aria-pressed", "true");
                    _ = button.Style(SeriesColorVariable, entry.Color);
                    _ = button.Element("span", mark => _ = mark.Class(LegendMarkClassName));
                    _ = button.Element("span", caption =>
                    {
                        _ = caption.Class(LegendCaptionClassName);
                        _ = caption.Text(entry.Caption);
                    });
                });
            }
        });
    }
}
