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
    /// <summary>Where a radar's series meets each spoke: the point it holds there, if any, and the place its outline passes.</summary>
    private readonly record struct RadarShape(ChartPoint?[] Points, ChartSpot[] Spots);

    private static void RenderCanvas(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartPlot plot, ChartScale x, ChartScale y, bool windowed, IReadOnlyList<ChartLabel> xTicks, IReadOnlyList<ChartLabel> yTicks, ChartFormats formats, CultureInfo culture)
    {
        // The canvas lies over an area of its own, so the aspect ratio of its viewBox never reaches the layout.
        _ = root.Element("div", area =>
        {
            _ = area.Class(AreaClassName);

            ChartSvg.Render(area, CanvasClassName, NominalWidth, NominalHeight, CanvasLabel(context, data), svg =>
            {
                RenderCanvasBoundary(svg, spec);

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
    /// What the canvas is announced as: its series' names, or the chart's own word.
    /// </summary>
    private static string CanvasLabel(WebRenderContext context, ChartRenderData data)
    {
        if (data.Series.Count == 0)
            return context.Translate(ChartsStrings.Chart);

        var captions = new string[data.Series.Count];

        for (var i = 0; i < captions.Length; i++)
            captions[i] = ReadCaption(context, data.Series[i].Series);

        return WordList(context, captions);
    }

    /// <summary>Names as one list, each joined on by the package's word (<see cref="ChartsStrings.List"/>), so a language writes its own separator.</summary>
    private static string WordList(WebRenderContext context, string[] names)
    {
        var list = names.Length > 0 ? names[0] : string.Empty;

        for (var i = 1; i < names.Length; i++)
            list = context.Translate(ChartsStrings.List, new Dictionary<string, object?>(StringComparer.Ordinal) { ["list"] = list, ["next"] = names[i] });

        return list;
    }

    /// <summary>
    /// A canvas that takes presses keeps them from a clickable component around it; one that takes none lets a press through,
    /// so a spark on a card still opens the card.
    /// </summary>
    private static void RenderCanvasBoundary(IHtmlElementBuilder svg, ChartSpec spec)
    {
        if (spec.Pressable || spec.Zoomable)
            _ = svg.Attribute(WebAttributes.EventBoundary);
    }

    /// <summary>
    /// The frame the plot is cut at, under an id of the chart's own so two charts on one page don't share a clip.
    /// </summary>
    private static string RenderClip(WebRenderContext context, IHtmlElementBuilder svg, ChartPlot plot)
    {
        var id = ClipIdPrefix + context.Node.ComponentId.Value.ToString(CultureInfo.InvariantCulture);

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

    /// <summary>Every series as its own group: one path, and a mark per point where the series draws them; an area's bands under them all.</summary>
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

            // Every band under every series' line and marks: a later series' band laid over an earlier one would take its points
            // from the pointer.
            if (spec.Kind == AreaKind)
                RenderAreaBands(context, group, spec, data, plot, x, y);

            for (var i = 0; i < data.Series.Count; i++)
                RenderSeries(context, group, spec, data, i, plot, x, y, band, formats, culture);
        });
    }

    private static void RenderAreaBands(WebRenderContext context, IHtmlElementBuilder plotGroup, ChartSpec spec, ChartRenderData data, ChartPlot plot, ChartScale x, ChartScale y)
        => plotGroup.Element("g", bands =>
        {
            _ = bands.Class(BandsClassName);

            for (var i = 0; i < data.Series.Count; i++)
            {
                ChartRenderSeries series = data.Series[i];
                var stepped = series.Series.Stepped ?? spec.Stepped;
                var smooth = series.Series.Smooth ?? spec.Smooth;

                RenderBand(bands, series.Series.Key, SeriesColor(context, series), ChartPath.Area(series.Drawn, x, y, plot, stepped, smooth));
            }
        });

    /// <summary>One series' band, in the layer of bands under every series: keyed and coloured as its series is, so it is read as one with it.</summary>
    private static void RenderBand(IHtmlElementBuilder bands, string key, string color, string outline)
        => bands.Element("path", fill =>
        {
            _ = fill.Class(FillClassName);
            _ = fill.Attribute(SeriesAttribute, key);
            _ = fill.Style(SeriesColorVariable, color);
            _ = fill.Attribute("d", outline);
        });

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
                RenderBars(context, group, spec, data, series, caption, index, plot, x, y, band, formats, culture);
                return;
            }

            // A cloud of points: no line at all, and a third value may size each of them.
            if (spec.Kind == ScatterKind)
            {
                for (var i = 0; i < series.Drawn.Count; i++)
                    RenderMarker(context, group, spec, data, series, caption, i, plot, x, y, ChartBubbles.Radius(series.Drawn[i].Size, data.SizeMin, data.SizeMax), true, formats, culture);

                return;
            }

            RenderSegments(group, LineClassName, ChartPath.Segments(series.Drawn, x, y, plot, stepped, smooth));

            // The same line unpainted and wide, for a pointer a thin stroke cannot hold; never painted, it stays one path.
            _ = group.Element("path", reach =>
            {
                _ = reach.Class(LineHitClassName);
                _ = reach.Attribute("d", ChartPath.Line(series.Drawn, x, y, plot, stepped, smooth));
            });

            // A chart drawing no marks keeps one unpainted for a tooltip to anchor on; the stylesheet shows it under the pointer.
            if (!markers && !spec.Tooltip)
                return;

            for (var i = 0; i < series.Drawn.Count; i++)
                RenderMarker(context, group, spec, data, series, caption, i, plot, x, y, markers ? ChartBubbles.PlainRadius - 1 : ChartBubbles.PlainRadius + 1, markers, formats, culture);
        });
    }

    /// <summary>
    /// A line as <c>&lt;line&gt;</c> pieces under one group, since Chrome antialiases a path as a staircase (<see cref="ChartPath.Segments"/>).
    /// </summary>
    private static void RenderSegments(IHtmlElementBuilder parent, string className, IReadOnlyList<ChartSegment> segments)
        => parent.Element("g", group =>
        {
            _ = group.Class(className);

            for (var i = 0; i < segments.Count; i++)
            {
                ChartSegment segment = segments[i];

                _ = group.Element("line", line =>
                {
                    _ = line.Attribute("x1", ChartPath.Coord(segment.X1));
                    _ = line.Attribute("y1", ChartPath.Coord(segment.Y1));
                    _ = line.Attribute("x2", ChartPath.Coord(segment.X2));
                    _ = line.Attribute("y2", ChartPath.Coord(segment.Y2));
                });
            }
        });

    /// <summary>
    /// One point: its mark, unpainted where the chart draws none, and over it the circle the pointer answers.
    /// </summary>
    private static void RenderMarker(WebRenderContext context, IHtmlElementBuilder group, ChartSpec spec, ChartRenderData data, ChartRenderSeries series, string caption, int index, ChartPlot plot, ChartScale x, ChartScale y, double radius, bool painted, ChartFormats formats, CultureInfo culture)
    {
        ChartPoint point = series.Drawn[index];

        if (point.Y is not double value)
            return;

        var tooltip = TooltipText(context, spec, data, caption, point.X, RawValue(series, index), formats, culture);

        RenderPointMark(group, point.Key, plot.X(x, point.X), plot.Y(y, value), radius, painted, tooltip);
    }

    /// <summary>A point's two circles where it stands: the mark, and the fixed-size one the pointer answers, carrying the tooltip.</summary>
    private static void RenderPointMark(IHtmlElementBuilder group, string key, double x, double y, double radius, bool painted, string? tooltip)
    {
        var left = ChartPath.Coord(x);
        var top = ChartPath.Coord(y);

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
    private static void RenderBars(WebRenderContext context, IHtmlElementBuilder group, ChartSpec spec, ChartRenderData data, ChartRenderSeries series, string caption, int index, ChartPlot plot, ChartScale x, ChartScale y, double band, ChartFormats formats, CultureInfo culture)
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
            var tooltip = TooltipText(context, spec, data, caption, point.X, RawValue(series, i), formats, culture);
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
    /// What a point says on hover; null without a tooltip, or where a shared one is the browser's to compose.
    /// </summary>
    private static string? TooltipText(WebRenderContext context, ChartSpec spec, ChartRenderData data, string caption, double x, double value, ChartFormats formats, CultureInfo culture)
    {
        if (!spec.Tooltip || spec.SharedTooltip)
            return null;

        return context.Translate(ChartsStrings.Point, new Dictionary<string, object?>(StringComparer.Ordinal)
        {
            ["series"] = caption,
            ["x"] = FormatValue(spec.XAxis.Kind, formats.X, x, data.Categories, culture),
            ["y"] = FormatValue(spec.YAxis.Kind, formats.Y, value, [], culture)
        });
    }

    /// <summary>
    /// The turn shared out between the first series' points, with a donut's words over its hole.
    /// </summary>
    private void RenderPie(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartFormats formats, CultureInfo culture)
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
                RenderCanvasBoundary(svg, spec);

                _ = svg.Element("g", group =>
                {
                    _ = group.Class(PlotClassName);

                    for (var i = 0; i < points.Count; i++)
                        RenderSector(context, group, spec, data, points[i], sectors[i], i, centre, radius, inner, formats, culture);

                    RenderSectorEdges(group, sectors, centre, radius, inner);
                });

                if (points.Count == 0)
                    RenderEmpty(context, svg, new ChartPlot(0, 0, NominalWidth, NominalHeight));
            });

            // The page's own type over the hole, as a gauge's words are over its arc: text scaled with the viewBox would stretch.
            if (inner > 0)
                _ = area.Element("span", words => RenderCentre(context, words.Class(CentreClassName)));
        });
    }

    /// <summary>
    /// One sector: a ring the stylesheet cuts to its angles, and a dot mid-arc for its tooltip, since the ring's box is the whole turn's.
    /// </summary>
    private static void RenderSector(WebRenderContext context, IHtmlElementBuilder plotGroup, ChartSpec spec, ChartRenderData data, ChartPoint point, ChartSector sector, int index, ChartSpot centre, double radius, double inner, ChartFormats formats, CultureInfo culture)
    {
        if (sector.Sweep <= 0 || radius <= 0)
            return;

        var label = SectorLabel(spec, data, point, formats, culture);
        var tooltip = spec.Tooltip
            ? context.Translate(ChartsStrings.Sector, new Dictionary<string, object?>(StringComparer.Ordinal) { ["label"] = label, ["value"] = FormatValue(spec.YAxis.Kind, formats.Y, point.Y ?? 0, [], culture) })
            : null;

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
                    _ = ring.Attribute(SectorTooltipAttribute, tooltip);
            });

            if (tooltip is null)
                return;

            ChartSpot middle = ChartPie.At(centre, (radius + inner) / 2, sector.Start + (sector.Sweep / 2));

            _ = group.Element("circle", mark =>
            {
                _ = mark.Class(SectorAnchorClassName);
                _ = mark.Attribute("cx", ChartPath.Coord(middle.X));
                _ = mark.Attribute("cy", ChartPath.Coord(middle.Y));
                _ = mark.Attribute("r", "1");
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

        return WordList(context, labels);
    }

    /// <summary>What a sector is called: its row's x, written as the x axis would write it.</summary>
    private static string SectorLabel(ChartSpec spec, ChartRenderData data, ChartPoint point, ChartFormats formats, CultureInfo culture)
        => FormatValue(spec.XAxis.Kind, formats.X, point.X, data.Categories, culture);

    /// <summary>
    /// The radar: spokes, rings and each series' filled outline, every band under every outline and mark.
    /// </summary>
    private static void RenderRadar(WebRenderContext context, IHtmlElementBuilder root, ChartSpec spec, ChartRenderData data, ChartScale y, ChartFormats formats, CultureInfo culture)
    {
        var spokes = ChartRadar.Spokes(DrawnSeries(data));
        var names = new string[spokes.Length];
        var widest = 0;

        for (var i = 0; i < spokes.Length; i++)
        {
            names[i] = FormatValue(spec.XAxis.Kind, formats.X, spokes[i], data.Categories, culture);
            widest = Math.Max(widest, names[i].Length);
        }

        ChartSpot centre = new(NominalWidth / 2, NominalHeight / 2);
        var radius = ChartRadar.Radius(NominalWidth, NominalHeight, (widest * LabelCharacterWidth) + LabelGap + PlotInset, LabelHeight + LabelGap + PlotInset);
        IReadOnlyList<ChartLabel> rings = BuildTicks(spec.YAxis, formats.Y, y, [], culture, data.Rows.Count > 0);

        _ = root.Element("div", area =>
        {
            _ = area.Class(AreaClassName);

            ChartSvg.Render(area, CanvasClassName, NominalWidth, NominalHeight, CanvasLabel(context, data), svg =>
            {
                RenderCanvasBoundary(svg, spec);

                if (spokes.Length > 0 && radius > 0)
                    RenderRadarFrame(svg, spec, names, rings, y, centre, radius);

                RadarShape[] shapes = new RadarShape[data.Series.Count];

                for (var i = 0; i < shapes.Length; i++)
                    shapes[i] = ReadRadarShape(data.Series[i], spokes, y, centre, radius);

                _ = svg.Element("g", group =>
                {
                    _ = group.Class(PlotClassName);

                    // One layer, or a later band would take an earlier one's corners from the pointer. A band stays a path: its edge lies
                    // under the outline, and it is four-fifths transparent.
                    _ = group.Element("g", bands =>
                    {
                        _ = bands.Class(BandsClassName);

                        for (var i = 0; i < shapes.Length; i++)
                            RenderBand(bands, data.Series[i].Series.Key, SeriesColor(context, data.Series[i]), ChartRadar.Outline(shapes[i].Spots));
                    });

                    for (var i = 0; i < shapes.Length; i++)
                        RenderRadarSeries(context, group, spec, data, i, shapes[i], formats, culture);
                });

                if (data.Rows.Count == 0)
                    RenderEmpty(context, svg, new ChartPlot(0, 0, NominalWidth, NominalHeight));
            });
        });
    }

    /// <summary>
    /// What the series are read against: rings, rim, spokes and their names, where the axes ask for them.
    /// </summary>
    private static void RenderRadarFrame(IHtmlElementBuilder svg, ChartSpec spec, string[] names, IReadOnlyList<ChartLabel> rings, ChartScale y, ChartSpot centre, double radius)
    {
        var count = names.Length;

        if (spec.YAxis.ShowGridLines)
        {
            _ = svg.Element("g", grid =>
            {
                _ = grid.Class(GridClassName);

                for (var i = 0; i < rings.Count; i++)
                {
                    var reach = ChartRadar.Reach(y, rings[i].Value, radius);

                    if (reach > 0 && reach < radius)
                        RenderRadarRing(grid, GridLineClassName, count, centre, reach);
                }
            });
        }

        _ = svg.Element("g", axes =>
        {
            _ = axes.Class(AxesClassName);

            RenderRadarRing(axes, AxisLineClassName, count, centre, radius);

            for (var i = 0; i < count; i++)
            {
                var angle = ChartRadar.Angle(i, count);
                ChartSpot tip = ChartPie.At(centre, radius, angle);
                ChartSpot name = ChartPie.At(centre, radius + LabelGap, angle);

                if (spec.XAxis.ShowGridLines)
                    RenderLine(axes, AxisLineClassName, centre.X, centre.Y, tip.X, tip.Y);

                RenderText(axes, LabelClassName, names[i], name.X, SpokeNameBaseline(angle, name.Y), ChartRadar.Anchor(angle));
            }

            // A ring's value beside the top spoke, clear of a mark on it and just inside the ring; one that would sit on the one written
            // before it is left out.
            var last = double.NaN;

            for (var i = 0; i < rings.Count; i++)
            {
                var reach = ChartRadar.Reach(y, rings[i].Value, radius);

                if (reach <= 0 || (double.IsFinite(last) && Math.Abs(reach - last) < LabelHeight))
                    continue;

                last = reach;
                RenderText(axes, LabelClassName, rings[i].Text, centre.X + LabelGap, centre.Y - reach + 12, "start");
            }
        });
    }

    /// <summary>One ring: the shape through every spoke at the same reach, drawn as its sides.</summary>
    private static void RenderRadarRing(IHtmlElementBuilder parent, string className, int count, ChartSpot centre, double reach)
    {
        ChartSpot[] spots = new ChartSpot[count];

        for (var i = 0; i < count; i++)
            spots[i] = ChartPie.At(centre, reach, ChartRadar.Angle(i, count));

        RenderSegments(parent, className, ChartRadar.Edges(spots));
    }

    /// <summary>Where a spoke's name sits for its tip: above one at the top of the turn, under one at the bottom, level beside the rest.</summary>
    private static double SpokeNameBaseline(double angle, double y)
    {
        var down = Math.Sin(angle);

        return down < -0.3 ? y : down > 0.3 ? y + 12 : y + 4;
    }

    /// <summary>
    /// Where a series meets each spoke; its outline passes the centre on a spoke it holds no value on.
    /// </summary>
    private static RadarShape ReadRadarShape(ChartRenderSeries series, double[] spokes, ChartScale y, ChartSpot centre, double radius)
    {
        ChartPoint?[] points = new ChartPoint?[spokes.Length];
        ChartSpot[] spots = new ChartSpot[spokes.Length];

        foreach (ChartPoint point in series.Drawn)
        {
            var spoke = Array.BinarySearch(spokes, point.X);

            if (spoke >= 0)
                points[spoke] ??= point;
        }

        for (var i = 0; i < spokes.Length; i++)
            spots[i] = ChartPie.At(centre, ChartRadar.Reach(y, points[i]?.Y, radius), ChartRadar.Angle(i, spokes.Length));

        return new RadarShape(points, spots);
    }

    /// <summary>One series closed into a shape over the spokes: its outline, and a mark where it meets each spoke it has a value on.</summary>
    private static void RenderRadarSeries(WebRenderContext context, IHtmlElementBuilder plotGroup, ChartSpec spec, ChartRenderData data, int index, RadarShape shape, ChartFormats formats, CultureInfo culture)
    {
        ChartRenderSeries series = data.Series[index];
        var caption = ReadCaption(context, series.Series);
        var markers = series.Series.ShowMarkers ?? spec.Markers;

        _ = plotGroup.Element("g", group =>
        {
            _ = group.Class(SeriesClassName);
            _ = group.Attribute(SeriesAttribute, series.Series.Key);
            _ = group.Style(SeriesColorVariable, SeriesColor(context, series));

            RenderSegments(group, LineClassName, ChartRadar.Edges(shape.Spots));

            // As on a line: a chart that draws no marks still needs something for a tooltip to anchor on.
            if (!markers && !spec.Tooltip)
                return;

            for (var i = 0; i < shape.Points.Length; i++)
            {
                if (shape.Points[i] is not ChartPoint point || point.Y is not double value)
                    continue;

                var tooltip = TooltipText(context, spec, data, caption, point.X, value, formats, culture);

                RenderPointMark(group, point.Key, shape.Spots[i].X, shape.Spots[i].Y, markers ? ChartBubbles.PlainRadius - 1 : ChartBubbles.PlainRadius + 1, markers, tooltip);
            }
        });
    }

    /// <summary>A chart with no rows keeps its frame and says there is nothing in it.</summary>
    private static void RenderEmpty(WebRenderContext context, IHtmlElementBuilder svg, ChartPlot plot)
        => RenderText(svg, EmptyClassName, context.Translate(ChartsStrings.Empty), plot.Left + (plot.Width / 2), plot.Top + (plot.Height / 2), "middle");
}
