using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Charts;

/// <summary>The drawing itself: the canvas, a group per series with its path, its marks, its bars or its sector, and the tooltips.</summary>
public abstract partial class ChartComponentRendererBase
{
    private static void RenderCanvas(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartPlot plot, ChartScale x, ChartScale y, bool windowed, IReadOnlyList<ChartLabel> xTicks, IReadOnlyList<ChartLabel> yTicks, ChartFormats formats, CultureInfo culture)
    {
        // The canvas lies over an area of its own, so the aspect ratio of its viewBox never reaches the layout.
        _ = root.Element("div", area =>
        {
            _ = area.Class(AreaClassName);

            ChartSvg.Render(area, CanvasClassName, NominalWidth, NominalHeight, CanvasLabel(context, data), svg =>
            {
                if (!spec.Bare)
                {
                    RenderGrid(svg, spec, plot, x, y, xTicks, yTicks);
                    RenderAxes(svg, spec, plot, x, y, xTicks, yTicks, context);
                }

                // A line running out of a narrowed window is cut at the plot's edge rather than drawn over the axes and beyond.
                var clip = windowed ? RenderClip(context, svg, plot) : null;

                RenderPlot(context, svg, spec, data, plot, x, y, clip, formats, culture);

                if (data.Rows.Count == 0)
                    RenderEmpty(context, svg, plot);
            });
        });
    }

    /// <summary>
    /// What the canvas is announced as: the series it draws, by the names the legend gives them, or the chart's own word where it
    /// names none.
    /// </summary>
    private static string CanvasLabel(WebRenderContext context, ChartRenderData data)
    {
        if (data.Series.Count == 0)
            return context.Translate(ChartsStrings.Chart);

        var captions = new string[data.Series.Count];

        for (var i = 0; i < captions.Length; i++)
            captions[i] = ReadCaption(context, data.Series[i].Series);

        return string.Join(", ", captions);
    }

    /// <summary>
    /// The frame the plot is cut at, the id the chart's own so two charts on one page don't share a clip; the browser writes the
    /// same one when it draws.
    /// </summary>
    private static string RenderClip(WebRenderContext context, IHtmlElementBuilder svg, ChartPlot plot)
    {
        var id = "ui-chart-clip-" + context.Node.ComponentId.Value.ToString(CultureInfo.InvariantCulture);

        _ = svg.Element("clipPath", clip =>
        {
            _ = clip.Attribute("id", id);
            _ = clip.Element("rect", shape =>
            {
                _ = shape.Attribute("x", ChartPath.Coord(plot.Left));
                _ = shape.Attribute("y", ChartPath.Coord(plot.Top));
                _ = shape.Attribute("width", ChartPath.Coord(plot.Width));
                _ = shape.Attribute("height", ChartPath.Coord(plot.Height));
            });
        });

        return id;
    }

    /// <summary>Every series as its own group: one path, and a mark per point where the series draws them.</summary>
    private static void RenderPlot(WebRenderContext context, IHtmlElementBuilder svg, ChartSpec spec, ChartRenderData data, ChartPlot plot, ChartScale x, ChartScale y, string? clip, ChartFormats formats, CultureInfo culture)
    {
        // Bars share the band one x owns; a line and an area own the whole width and need none of this.
        var band = spec.Kind == BarKind
            ? ChartBars.Band(spec.Horizontal ? plot.Height : plot.Width, ChartBars.Slots(DrawnSeries(data), x))
            : 0;

        _ = svg.Element("g", group =>
        {
            _ = group.Class(PlotClassName);

            if (clip is not null)
                _ = group.Attribute("clip-path", $"url(#{clip})");

            for (var i = 0; i < data.Series.Count; i++)
                RenderSeries(context, group, spec, data, i, plot, x, y, band, formats, culture);
        });
    }

    private static void RenderSeries(WebRenderContext context, IHtmlElementBuilder plotGroup, ChartSpec spec, ChartRenderData data, int index, ChartPlot plot, ChartScale x, ChartScale y, double band, ChartFormats formats, CultureInfo culture)
    {
        ChartRenderSeries series = data.Series[index];
        var caption = ReadCaption(context, series.Series);
        var stepped = series.Series.Stepped ?? spec.Stepped;
        var smooth = series.Series.Smooth ?? spec.Smooth;
        var markers = series.Series.ShowMarkers ?? spec.Markers;

        _ = plotGroup.Element("g", group =>
        {
            _ = group.Class(SeriesClassName);
            _ = group.Attribute(SeriesAttribute, series.Series.Key);
            _ = group.Style(SeriesColorVariable, SeriesColor(context, series));

            if (spec.Kind == BarKind)
            {
                RenderBars(group, spec, data, series, caption, index, plot, x, y, band, formats, culture);
                return;
            }

            // A cloud of points: no line at all, and a third value may size each of them.
            if (spec.Kind == ScatterKind)
            {
                for (var i = 0; i < series.Drawn.Count; i++)
                    RenderMarker(group, spec, data, series, caption, i, plot, x, y, ChartBubbles.Radius(series.Drawn[i].Size, data.SizeMin, data.SizeMax), true, formats, culture);

                return;
            }

            if (spec.Kind == AreaKind)
            {
                _ = group.Element("path", fill =>
                {
                    _ = fill.Class(FillClassName);
                    _ = fill.Attribute("d", ChartPath.Area(series.Drawn, x, y, plot, stepped, smooth));
                });
            }

            var drawn = ChartPath.Line(series.Drawn, x, y, plot, stepped, smooth);

            _ = group.Element("path", line =>
            {
                _ = line.Class(LineClassName);
                _ = line.Attribute("d", drawn);
            });

            // The same line again, unpainted and wide: a two-pixel stroke is too thin for the pointer to hold.
            _ = group.Element("path", reach =>
            {
                _ = reach.Class(LineHitClassName);
                _ = reach.Attribute("d", drawn);
            });

            // A chart that draws no marks still needs something for a tooltip to anchor on: the mark is there, unpainted, and the
            // stylesheet shows it under the pointer.
            if (!markers && !spec.Tooltip)
                return;

            for (var i = 0; i < series.Drawn.Count; i++)
                RenderMarker(group, spec, data, series, caption, i, plot, x, y, markers ? ChartBubbles.PlainRadius - 1 : ChartBubbles.PlainRadius + 1, markers, formats, culture);
        });
    }

    /// <summary>
    /// One point: the mark the chart draws — unpainted where the chart draws none — and, over it, the circle the pointer
    /// actually answers.
    /// </summary>
    private static void RenderMarker(IHtmlElementBuilder group, ChartSpec spec, ChartRenderData data, ChartRenderSeries series, string caption, int index, ChartPlot plot, ChartScale x, ChartScale y, double radius, bool painted, ChartFormats formats, CultureInfo culture)
    {
        ChartPoint point = series.Drawn[index];

        if (point.Y is not double value)
            return;

        var left = ChartPath.Coord(plot.X(x, point.X));
        var top = ChartPath.Coord(plot.Y(y, value));
        var tooltip = TooltipText(spec, data, caption, point.X, RawValue(series, index), formats, culture);
        var key = point.Key;

        _ = group.Element("g", element =>
        {
            _ = element.Class(PointClassName);
            _ = element.Attribute(PointAttribute, key);

            _ = element.Element("circle", marker =>
            {
                _ = marker.Class(painted ? MarkerClassName : $"{MarkerClassName} {BareMarkerClassName}");
                _ = marker.Attribute("cx", left);
                _ = marker.Attribute("cy", top);
                _ = marker.Attribute("r", ChartPath.Coord(radius));
            });

            // A separate, fixed-size hit target: a marker that grows under the pointer would slip from under it, and a mark of
            // three is hard to find.
            _ = element.Element("circle", hit =>
            {
                _ = hit.Class(HitClassName);
                _ = hit.Attribute("cx", left);
                _ = hit.Attribute("cy", top);
                _ = hit.Attribute("r", ChartPath.Coord(ChartBubbles.Reach(radius)));

                if (tooltip is not null)
                    _ = hit.Attribute(WebAttributes.Tooltip, tooltip);
            });
        });
    }

    /// <summary>A bar per point, from what it stands on — its place in a stack, or zero — to the value, in its own place across the band.</summary>
    private static void RenderBars(IHtmlElementBuilder group, ChartSpec spec, ChartRenderData data, ChartRenderSeries series, string caption, int index, ChartPlot plot, ChartScale x, ChartScale y, double band, ChartFormats formats, CultureInfo culture)
    {
        var sideways = spec.Horizontal;

        for (var i = 0; i < series.Drawn.Count; i++)
        {
            ChartPoint point = series.Drawn[i];

            if (point.Y is not double value)
                continue;

            ChartBar bar = ChartBars.Bar(BandCoord(spec, plot, x, point.X), band, index, data.Series.Count, spec.Stacked);
            var reading = ValueCoord(spec, plot, y, value);
            var stands = ValueCoord(spec, plot, y, y.Within(point.Base ?? 0));
            var near = Math.Min(reading, stands);
            // A value of zero still draws a hair, so the bar is there to point at.
            var length = Math.Max(1, Math.Abs(reading - stands));
            var tooltip = TooltipText(spec, data, caption, point.X, RawValue(series, i), formats, culture);
            var key = point.Key;

            _ = group.Element("rect", rectangle =>
            {
                _ = rectangle.Class(BarClassName);
                _ = rectangle.Attribute("x", ChartPath.Coord(sideways ? near : bar.Start));
                _ = rectangle.Attribute("y", ChartPath.Coord(sideways ? bar.Start : near));
                _ = rectangle.Attribute("width", ChartPath.Coord(sideways ? length : bar.Thickness));
                _ = rectangle.Attribute("height", ChartPath.Coord(sideways ? bar.Thickness : length));
                _ = rectangle.Attribute(PointAttribute, key);

                if (tooltip is not null)
                    _ = rectangle.Attribute(WebAttributes.Tooltip, tooltip);
            });
        }
    }

    /// <summary>The value the series itself holds there, which is what a tooltip says even where the drawing stacks.</summary>
    private static double RawValue(ChartRenderSeries series, int index)
        => (index < series.Points.Count ? series.Points[index].Y : null) ?? 0;

    /// <summary>
    /// What a point says on hover: its series as the legend names it, its x and its value, each written by its own axis. Null where
    /// the chart shows no tooltip, or where a shared tooltip is the browser's to compose.
    /// </summary>
    private static string? TooltipText(ChartSpec spec, ChartRenderData data, string caption, double x, double value, ChartFormats formats, CultureInfo culture)
    {
        if (!spec.Tooltip || spec.SharedTooltip)
            return null;

        return $"{caption} — {FormatValue(spec.XAxis.Kind, formats.X, x, data.Categories, culture)}: {FormatValue(spec.YAxis.Kind, formats.Y, value, [], culture)}";
    }

    /// <summary>
    /// The turn shared out: one sector per point of the first series, the biggest circle the box holds, and a donut's words in its
    /// hole.
    /// </summary>
    private static void RenderPie(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartFormats formats, CultureInfo culture)
    {
        List<ChartPoint> points = data.Series.Count > 0 ? data.Series[0].Points : [];
        var values = new double?[points.Count];

        for (var i = 0; i < points.Count; i++)
            values[i] = points[i].Y;

        ChartSector[] sectors = ChartPie.Sectors(values);
        ChartSpot centre = new(NominalWidth / 2, NominalHeight / 2);
        var radius = (Math.Min(NominalWidth, NominalHeight) / 2) - PlotInset;
        var inner = radius * spec.Donut;

        _ = root.Element("div", area =>
        {
            _ = area.Class(AreaClassName);

            ChartSvg.Render(area, CanvasClassName, NominalWidth, NominalHeight, SectorsLabel(context, spec, data, formats, culture), svg =>
            {
                _ = svg.Element("g", group =>
                {
                    _ = group.Class(PlotClassName);

                    for (var i = 0; i < points.Count; i++)
                        RenderSector(context, group, spec, data, points[i], sectors[i], i, centre, radius, inner, formats, culture);

                    RenderSectorEdges(group, sectors, centre, radius, inner);
                });

                if (inner > 0 && !string.IsNullOrWhiteSpace(spec.CentreCaption))
                    RenderText(svg, CentreClassName, context.Translate(spec.CentreCaption), centre.X, centre.Y + 4, "middle");

                if (points.Count == 0)
                    RenderEmpty(context, svg, new ChartPlot(0, 0, NominalWidth, NominalHeight));
            });
        });
    }

    /// <summary>One sector: a ring from the hole to the rim, which the stylesheet cuts to the sector's own angles.</summary>
    private static void RenderSector(WebRenderContext context, IHtmlElementBuilder plotGroup, ChartSpec spec, ChartRenderData data, ChartPoint point, ChartSector sector, int index, ChartSpot centre, double radius, double inner, ChartFormats formats, CultureInfo culture)
    {
        if (sector.Sweep <= 0 || radius <= 0)
            return;

        var label = SectorLabel(spec, data, point, formats, culture);
        var tooltip = spec.Tooltip ? $"{label} — {FormatValue(spec.YAxis.Kind, formats.Y, point.Y ?? 0, [], culture)}" : null;

        _ = plotGroup.Element("g", group =>
        {
            // A sector is named by the row it came from, which is what its legend entry and the viewer's choice go by.
            _ = group.Class(SeriesClassName);
            _ = group.Attribute(SeriesAttribute, point.Key);
            _ = group.Style(SeriesColorVariable, ThemeColorRenderer.SeriesColorCss(context, index));

            _ = group.Element("circle", ring =>
            {
                _ = ring.Class(SectorClassName);
                _ = ring.Attribute("cx", ChartPath.Coord(centre.X));
                _ = ring.Attribute("cy", ChartPath.Coord(centre.Y));
                _ = ring.Attribute("r", ChartPath.Coord((radius + inner) / 2));
                _ = ring.Attribute("stroke-width", ChartPath.Coord(radius - inner));
                _ = ring.Style(ChartSvg.ArcStartVariable, ChartSvg.Degrees(sector.Start));
                _ = ring.Style(ChartSvg.ArcSweepVariable, ChartSvg.Degrees(sector.Sweep));
                _ = ring.Attribute(PointAttribute, point.Key);
                // The group is named by its row, so the sector itself says which series a press on it belongs to.
                _ = ring.Attribute(SeriesAttribute, data.Series[0].Series.Key);

                if (tooltip is not null)
                    _ = ring.Attribute(WebAttributes.Tooltip, tooltip);
            });
        });
    }

    /// <summary>The line at the start of every sector that has a neighbour, from the hole to the rim; a sector alone on the turn has none.</summary>
    private static void RenderSectorEdges(IHtmlElementBuilder plotGroup, ChartSector[] sectors, ChartSpot centre, double radius, double inner)
    {
        var drawn = 0;

        foreach (ChartSector sector in sectors)
        {
            if (sector.Sweep > 0)
                drawn++;
        }

        if (drawn < 2 || radius <= 0)
            return;

        foreach (ChartSector sector in sectors)
        {
            if (sector.Sweep <= 0)
                continue;

            ChartSpot from = ChartPie.At(centre, inner, sector.Start);
            ChartSpot to = ChartPie.At(centre, radius, sector.Start);

            _ = plotGroup.Element("line", line =>
            {
                _ = line.Class(SectorEdgeClassName);
                _ = line.Attribute("x1", ChartPath.Coord(from.X));
                _ = line.Attribute("y1", ChartPath.Coord(from.Y));
                _ = line.Attribute("x2", ChartPath.Coord(to.X));
                _ = line.Attribute("y2", ChartPath.Coord(to.Y));
            });
        }
    }

    /// <summary>What a turn shared out is announced as: the rows its sectors stand for, or the chart's own word where there are none.</summary>
    private static string SectorsLabel(WebRenderContext context, ChartSpec spec, ChartRenderData data, ChartFormats formats, CultureInfo culture)
    {
        List<ChartPoint> points = data.Series.Count > 0 ? data.Series[0].Points : [];

        if (points.Count == 0)
            return context.Translate(ChartsStrings.Chart);

        var labels = new string[points.Count];

        for (var i = 0; i < labels.Length; i++)
            labels[i] = SectorLabel(spec, data, points[i], formats, culture);

        return string.Join(", ", labels);
    }

    /// <summary>What a sector is called: its row's x, written as the x axis would write it.</summary>
    private static string SectorLabel(ChartSpec spec, ChartRenderData data, ChartPoint point, ChartFormats formats, CultureInfo culture)
        => FormatValue(spec.XAxis.Kind, formats.X, point.X, data.Categories, culture);

    /// <summary>A chart with no rows keeps its frame and says there is nothing in it.</summary>
    private static void RenderEmpty(WebRenderContext context, IHtmlElementBuilder svg, ChartPlot plot)
        => RenderText(svg, EmptyClassName, context.Translate(ChartsStrings.Empty), plot.Left + (plot.Width / 2), plot.Top + (plot.Height / 2), "middle");
}
