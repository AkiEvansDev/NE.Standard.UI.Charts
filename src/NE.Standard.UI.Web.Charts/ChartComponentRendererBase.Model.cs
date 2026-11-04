using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Charts;

/// <summary>What the browser is told: the model on the root, and the legend it hides and shows series by.</summary>
public abstract partial class ChartComponentRendererBase
{
    /// <summary>
    /// One entry of the legend: what it is keyed by, what it says, the colour its mark takes, and where the legend is a table its
    /// value and its share of the whole, each written.
    /// </summary>
    private readonly record struct LegendEntry(string Key, string Caption, string Color, string? Value = null, string? Share = null);

    /// <summary>How a legend's share of the whole is written: a per cent to a tenth.</summary>
    private const string ShareFormat = "P1";

    /// <summary>An entry's classes: the framework's own small ghost button, marked as the legend's.</summary>
    private static readonly string LegendEntryClasses = $"{LegendEntryClassName} {WebClassNames.Button} {WebClassNames.ButtonVariant(UIButtonVariant.Ghost)} {WebClassNames.ButtonSize(UISize.Small)}";

    /// <summary>The chart as the browser reads it: the settings with the series as the client reads them.</summary>
    private static ChartSpec BuildModel(ChartSpec spec, ChartRenderData data, WebRenderContext context)
    {
        List<ChartClientSeries> series = new(data.Series.Count);

        for (var i = 0; i < data.Series.Count; i++)
        {
            ChartRenderSeries current = data.Series[i];

            series.Add(new ChartClientSeries
            {
                Key = current.Series.Key,
                Caption = ChartCaption.Wire(current.Series.Caption),
                ValuePath = current.Series.ValuePath ?? spec.ValuePath,
                SizePath = current.Series.SizePath,
                Color = SeriesColor(context, current),
                Stepped = current.Series.Stepped,
                Smooth = current.Series.Smooth,
                Markers = current.Series.ShowMarkers
            });
        }

        return spec with { ClientSeries = series };
    }

    /// <summary>The colour of a series: the one the author gave, or its place in the theme's categorical run, cycled as the browser cycles it.</summary>
    private static string SeriesColor(WebRenderContext context, ChartRenderSeries series)
        => ThemeColorRenderer.SeriesColorCss(context, series.Index, series.Series.Color);

    /// <summary>An entry per series, each a button the engine hides and shows its series by; none where the author asked for none.</summary>
    private static void RenderLegend(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data)
    {
        if (spec.Legend == UIChartLegendPlacement.None)
            return;

        List<LegendEntry> entries = new(data.Series.Count);

        for (var i = 0; i < data.Series.Count; i++)
        {
            ChartRenderSeries current = data.Series[i];

            if (spec.HideEmptySeries && !HasReading(current.Points))
                continue;

            entries.Add(new LegendEntry(current.Series.Key, ReadCaption(context, spec, current.Series), SeriesColor(context, current)));
        }

        RenderLegendEntries(root, entries, false, spec.LegendColumns, null);
    }

    /// <summary>Whether a series holds at least one placed value, so an empty series can be omitted without shifting colours.</summary>
    private static bool HasReading(List<ChartPoint> points)
    {
        for (var i = 0; i < points.Count; i++)
        {
            if (points[i].Y is not null)
                return true;
        }

        return false;
    }

    /// <summary>The words the legend and the tooltip name a series by: the caption, translated, or the key — translated where the chart says so.</summary>
    private static string ReadCaption(WebRenderContext context, ChartSpec spec, UIChartSeries series)
        => ChartCaption.Words(series.Caption) is { } caption ? context.Translate(caption) : spec.TranslateSeriesNames ? context.Translate(series.Key) : series.Key;

    /// <summary>
    /// An entry per part rather than per series — a pie's sector, a share bar's part — and a share bar's rest of its total: a pie's
    /// series is one, and what a viewer puts aside is a part.
    /// </summary>
    private static void RenderSectorLegend(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartFormats formats)
    {
        if (spec.Legend == UIChartLegendPlacement.None)
            return;

        List<ChartPoint> points = data.Series.Count > 0 ? data.Series[0].Points : [];
        var values = PartValues(points);
        ChartShare[] parts = ChartShares.Parts(values, spec.Total);
        LegendEntry[] entries = new LegendEntry[points.Count];

        for (var i = 0; i < points.Count; i++)
        {
            var label = SectorLabel(spec, data, points[i], formats);
            var color = ThemeColorRenderer.SeriesColorCss(context, i);

            entries[i] = spec.LegendValues
                ? new LegendEntry(points[i].Key, label, color, PartValue(context, spec, points[i].Y, formats), PartShare(context, points[i].Y, parts[i].Length, formats))
                : new LegendEntry(points[i].Key, label, color);
        }

        RenderLegendEntries(root, entries, spec.LegendValues, spec.LegendColumns, spec.Kind == ShareKind ? RestEntry(context, spec, values, formats) : null);
    }

    /// <summary>Every point's value as the arithmetic of a whole reads it.</summary>
    private static double?[] PartValues(List<ChartPoint> points)
    {
        var values = new double?[points.Count];

        for (var i = 0; i < points.Count; i++)
            values[i] = points[i].Y;

        return values;
    }

    /// <summary>A part's value as a tooltip writes it; a part with none says so as a gauge with no reading does.</summary>
    private static string PartValue(WebRenderContext context, ChartSpec spec, double? value, ChartFormats formats)
        => value is double given ? FormatValue(spec.YAxis.Kind, formats.Y, given, [], formats) : context.Translate(ChartsStrings.NoReading);

    /// <summary>A part's share of the whole, in the page's culture; a part with no value has none to write.</summary>
    private static string PartShare(WebRenderContext context, double? value, double share, ChartFormats formats)
        => value is null ? context.Translate(ChartsStrings.NoReading) : WebNumberFormat.Format(share, ShareFormat, formats.Numbers);

    /// <summary>What the parts leave of a share bar's total, named in the legend; none where they reach it or there is none.</summary>
    private static LegendEntry? RestEntry(WebRenderContext context, ChartSpec spec, double?[] values, ChartFormats formats)
    {
        var whole = ChartShares.Whole(values, spec.Total);
        var rest = whole - ChartShares.Whole(values, null);

        if (rest <= 0)
            return null;

        var caption = spec.Remainder is { } remainder ? context.Translate(remainder) : context.Translate(ChartsStrings.Rest);

        return spec.LegendValues
            ? new LegendEntry(string.Empty, caption, string.Empty, PartValue(context, spec, rest, formats), WebNumberFormat.Format(rest / whole, ShareFormat, formats.Numbers))
            : new LegendEntry(string.Empty, caption, string.Empty);
    }

    /// <summary>
    /// The legend as a row of buttons, one per entry, each pressed until the viewer puts it aside, and a share bar's rest after them,
    /// named but no button; a table of the parts' values and shares where <paramref name="values"/>. None where there is nothing to name.
    /// </summary>
    private static void RenderLegendEntries(IHtmlElementBuilder root, IReadOnlyList<LegendEntry> entries, bool values, int? columns, LegendEntry? rest)
    {
        if (entries.Count == 0 && rest is null)
            return;

        _ = root.Element("div", legend =>
        {
            _ = legend.Class(LegendClassName);

            if (values)
                _ = legend.Class(LegendValuesClassName);

            if (columns is int count)
            {
                _ = legend.Class(LegendColumnsClassName);
                _ = legend.Style(LegendColumnsVariable, count.ToString(CultureInfo.InvariantCulture));
            }

            // A press on an entry is the chart's own, never a clickable component's around it.
            _ = legend.Attribute(WebAttributes.EventBoundary);

            for (var i = 0; i < entries.Count; i++)
            {
                LegendEntry entry = entries[i];

                _ = legend.Element("button", button =>
                {
                    _ = button.Class(LegendEntryClasses);
                    _ = button.Attribute("type", "button");
                    _ = button.Attribute(SeriesAttribute, entry.Key);
                    _ = button.Attribute("aria-pressed", "true");
                    _ = button.Style(SeriesColorVariable, entry.Color);
                    RenderLegendParts(button, entry);
                });
            }

            if (rest is LegendEntry remainder)
            {
                _ = legend.Element("div", row =>
                {
                    _ = row.Class(LegendRestClassName);
                    RenderLegendParts(row, remainder);
                });
            }
        });
    }

    /// <summary>An entry's mark and name, and where the legend is a table its value and its share.</summary>
    private static void RenderLegendParts(IHtmlElementBuilder entry, LegendEntry content)
    {
        _ = entry.Element("span", mark => _ = mark.Class(LegendMarkClassName));
        RenderLegendText(entry, LegendCaptionClassName, content.Caption);

        if (content.Value is string value)
            RenderLegendText(entry, LegendValueClassName, value);

        if (content.Share is string share)
            RenderLegendText(entry, LegendShareClassName, share);
    }

    private static void RenderLegendText(IHtmlElementBuilder entry, string className, string text)
        => entry.Element("span", span =>
        {
            _ = span.Class(className);
            _ = span.Text(text);
        });
}
