using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// A chart as SVG the server writes and the browser keeps: the first frame is drawn here, and the engine re-draws it once sized
/// and whenever a point is patched.
/// </summary>
// Split across four files: this one reads the chart and writes the root, .Model what the browser is told, .Axes the frame,
// .Plot the series.
public abstract partial class ChartComponentRendererBase : WebComponentRendererBase
{
    /// <summary>The sink a chart's bound collection reaches the browser through, as values rather than rows.</summary>
    public const string SinkKind = "chart";

    /// <summary>On the root: the chart as its client reads it — the axes, the series and how to read a row.</summary>
    public const string ModelAttribute = "data-ui-chart";

    /// <summary>On the root: the rows the first frame was drawn from, which the browser then keeps and patches.</summary>
    public const string RowsAttribute = "data-ui-chart-rows";

    /// <summary>
    /// On a series' group and on its legend entry: the series' key. A pie's sector groups and entries are named by their rows
    /// instead, and the sector itself carries the series'.
    /// </summary>
    public const string SeriesAttribute = "data-ui-chart-series";

    /// <summary>On a point's mark: the key of the row it came from.</summary>
    public const string PointAttribute = "data-ui-chart-point";

    /// <summary>
    /// On a sector: its tooltip, which the engine shows mid-arc, since a sector's box is the whole ring's.
    /// </summary>
    public const string SectorTooltipAttribute = "data-ui-chart-tooltip";

    /// <summary>The window on a hidden element of its own, which is the chart's one writable value.</summary>
    public const string WindowValueKind = "chart-window";

    /// <summary>On the window's element: the window the chart shows, as its two ends.</summary>
    public const string WindowAttribute = "data-ui-chart-window";

    /// <summary>The kinds the browser draws, which is also what decides whether a range has to hold zero.</summary>
    protected const string LineKind = "line";
    protected const string AreaKind = "area";
    protected const string BarKind = "bar";
    protected const string PieKind = "pie";
    protected const string ScatterKind = "scatter";
    protected const string RadarKind = "radar";

    protected const string RootClassName = "ui-chart";
    protected const string AreaClassName = "ui-chart__area";
    protected const string CanvasClassName = "ui-chart__canvas";
    protected const string GridClassName = "ui-chart__grid";
    protected const string GridLineClassName = "ui-chart__grid-line";
    protected const string AxesClassName = "ui-chart__axes";
    protected const string AxisLineClassName = "ui-chart__axis-line";
    protected const string LabelClassName = "ui-chart__label";
    protected const string CaptionClassName = "ui-chart__caption";
    protected const string PlotClassName = "ui-chart__plot";
    protected const string SeriesClassName = "ui-chart__series";
    protected const string LineClassName = "ui-chart__line";
    protected const string LineHitClassName = "ui-chart__line-hit";
    protected const string FillClassName = "ui-chart__fill";
    protected const string BarClassName = "ui-chart__bar";
    protected const string BareClassName = "ui-chart--bare";
    /// <summary>What the root's legend placement class starts with, finished with the placement: <c>ui-chart--legend-bottom</c>.</summary>
    protected const string LegendClassPrefix = "ui-chart--legend-";
    protected const string ZoomableClassName = "ui-chart--zoomable";
    protected const string HorizontalClassName = "ui-chart--horizontal";
    protected const string PressableClassName = "ui-chart--pressable";
    protected const string SectorClassName = "ui-chart__sector";
    protected const string SectorEdgeClassName = "ui-chart__sector-edge";
    protected const string SectorAnchorClassName = "ui-chart__sector-anchor";
    protected const string BandsClassName = "ui-chart__bands";
    protected const string CentreClassName = "ui-chart__centre";
    protected const string PointClassName = "ui-chart__point";
    protected const string MarkerClassName = "ui-chart__marker";
    protected const string BareMarkerClassName = "ui-chart__marker--bare";
    protected const string HitClassName = "ui-chart__hit";
    protected const string LegendClassName = "ui-chart__legend";
    protected const string LegendEntryClassName = "ui-chart__legend-entry";
    protected const string LegendMarkClassName = "ui-chart__legend-mark";
    protected const string LegendCaptionClassName = "ui-chart__legend-caption";
    protected const string EmptyClassName = "ui-chart__empty";
    protected const string WindowClassName = "ui-chart__window";
    protected const string SeriesColorVariable = "--ui-chart-series-color";
    /// <summary>
    /// What a chart's clip is named by, finished with the component's id; the browser's own clips go on with <c>drawn</c>, so the
    /// two never meet.
    /// </summary>
    protected const string ClipIdPrefix = "ui-chart-clip-";

    // The first frame's box: text doesn't scale with the viewBox, so the browser re-draws at the real size and this only shapes
    // the first paint.
    private const double NominalWidth = 640;
    private const double NominalHeight = 280;

    // An estimated label cost for the unmeasured first frame; the browser measures its own by the same gaps (chart-draw.ts),
    // differing only by width.
    private const double LabelCharacterWidth = 6.5;
    private const double LabelGap = 8;
    private const double CaptionHeight = 16;
    private const double LabelHeight = 16;
    private const double TickHeight = 22;
    private const double PlotInset = 12;

    private static readonly JsonSerializerOptions ModelJsonOptions = WebWireJson.CreateOptions();

    protected override string ClassName => RootClassName;

    /// <summary>The kind the browser draws this chart as.</summary>
    protected abstract string ChartKind { get; }

    /// <summary>The x axis this chart draws on where the author set none.</summary>
    protected virtual UIChartAxis DefaultXAxis => UIChartAxis.Linear();

    /// <summary>The kind this instance draws as; a chart whose own properties decide it — a spark of bars — says so here.</summary>
    protected virtual string ReadKind(WebRenderContext context)
        => ChartKind;

    /// <summary>Whether this chart is drawn with nothing around it: no grid, no axes, the plot the whole box.</summary>
    protected virtual bool ReadBare(WebRenderContext context)
        => false;

    /// <summary>How this chart's lines are drawn; a chart with none of its own draws none.</summary>
    protected virtual ChartLineOptions ReadLineOptions(WebRenderContext context)
        => new(false, false, false);

    /// <summary>Whether this chart's series stand on one another; a chart that cannot stack never does.</summary>
    protected virtual bool ReadStacked(WebRenderContext context)
        => false;

    /// <summary>Whether this chart lies on its side, the values running across the box; a chart that cannot never does.</summary>
    protected virtual bool ReadHorizontal(WebRenderContext context)
        => false;

    /// <summary>How much of the radius the hole in the middle of this chart takes; a chart with no middle has none.</summary>
    protected virtual double ReadDonut(WebRenderContext context)
        => 0;

    /// <summary>
    /// Writes the words in the hole: a static caption recorded for a language switch, a bound one following its pushes.
    /// </summary>
    protected virtual void RenderCentre(WebRenderContext context, IHtmlElementBuilder centre)
    {
    }

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ChartSpec spec = ReadSpec(context);
        ChartRenderData data = ChartDataReader.Read(spec, ResolveItems(context).Items);
        CultureInfo culture = ResolveCulture(context);

        ApplyStacking(spec, data);

        // Once, on the root: the engine formats a tick and a tooltip by the nearest packs, as the typed cells of a grid do. They are
        // the page's, so a language switch writes them again before the chart draws itself anew.
        NumberCultureRenderer.RenderNumberCulture(root, culture);
        TemporalCultureRenderer.RenderTemporalCulture(root, culture);
        _ = root.Attribute(WebAttributes.PageCulture);

        _ = root.Attribute(WebAttributes.CollectionSink, SinkKind);
        _ = root.Class(LegendClassPrefix + spec.Legend.ToString().ToLowerInvariant());

        if (spec.Bare)
            _ = root.Class(BareClassName);

        // What the stylesheet says a press and a drag do: a hand over a point a command answers, a grip over a plot that moves.
        if (spec.Zoomable)
            _ = root.Class(ZoomableClassName);

        if (spec.Horizontal)
            _ = root.Class(HorizontalClassName);

        if (spec.Pressable)
            _ = root.Class(PressableClassName);

        _ = root.Attribute(ModelAttribute, JsonSerializer.Serialize(BuildModel(spec, data, context), ModelJsonOptions));
        _ = root.Attribute(RowsAttribute, JsonSerializer.Serialize(data.Rows, ModelJsonOptions));

        // The window is the x axis this frame draws; the y axis covers what the series reach inside it. Formats follow the
        // resolved scales, as the browser's do, so a tick and tooltip read the same on both sides.
        ChartScale whole = ChartRange.Resolve(spec.XAxis, data.XMin, data.XMax, data.Categories.Count);
        UIChartWindow? window = spec.VisibleRange is UIChartWindow given ? ChartWindow.Clamp(given, whole.Min, whole.Max) : null;
        ChartScale x = window is UIChartWindow view ? whole with { Min = view.From, Max = view.To } : whole;
        (var low, var high) = window is null ? (data.YMin, data.YMax) : ChartWindow.Extent(DrawnSeries(data), window);
        ChartScale y = ChartRange.Resolve(spec.YAxis, low, high, 0, StandsOnZero(spec.Kind));
        ChartFormats formats = new(FormatOf(spec.XAxis, x), FormatOf(spec.YAxis, y));

        // A turn shared out has no axes to lay out: the sectors are the whole drawing, and the legend names them.
        if (spec.Kind == PieKind)
        {
            RenderPie(context, root, spec, data, formats, culture);
            RenderWindowValue(context, root);
            RenderSectorLegend(context, root, spec, data, formats, culture);

            return;
        }

        // Spokes round a centre rather than two axes along a box: the rings stand for the y axis, and the legend names the series.
        if (spec.Kind == RadarKind)
        {
            RenderRadar(context, root, spec, data, y, formats, culture);
            RenderWindowValue(context, root);
            RenderLegend(context, root, spec, data);

            return;
        }

        // A chart with nothing around it has no ticks to write and no gutters to leave: the plot is the box, less a hair of air.
        IReadOnlyList<ChartLabel> xTicks = spec.Bare ? [] : BuildTicks(spec.XAxis, formats.X, x, data.Categories, culture, data.Rows.Count > 0);
        IReadOnlyList<ChartLabel> yTicks = spec.Bare ? [] : BuildTicks(spec.YAxis, formats.Y, y, data.Categories, culture, data.Rows.Count > 0);
        ChartPlot plot = spec.Bare ? new ChartPlot(2, 2, NominalWidth - 4, NominalHeight - 4) : ResolvePlot(spec, spec.Horizontal ? xTicks : yTicks);

        RenderCanvas(context, root, spec, data, plot, x, y, window is not null, xTicks, yTicks, formats, culture);
        RenderWindowValue(context, root);
        RenderLegend(context, root, spec, data);
    }

    /// <summary>
    /// The chart's settings, read once; a pie, a radar or a bare chart never zooms, and a radar has no x to share or window.
    /// </summary>
    private ChartSpec ReadSpec(WebRenderContext context)
    {
        ChartLineOptions lines = ReadLineOptions(context);
        var kind = ReadKind(context);
        var bare = ReadBare(context);
        var radar = kind == RadarKind;

        return new ChartSpec
        {
            Kind = kind,
            Bare = bare,
            XAxis = ReadRenderValue<UIChartAxis?>(context, IChartComponent.XAxisProperty, null) ?? DefaultXAxis,
            YAxis = ReadRenderValue<UIChartAxis?>(context, IChartComponent.YAxisProperty, null) ?? UIChartAxis.Linear(),
            Series = ReadRenderValue<IReadOnlyList<UIChartSeries>?>(context, IChartComponent.SeriesProperty, null) ?? [],
            XPath = ReadRenderValue<string?>(context, IChartComponent.XPathProperty, null),
            SeriesPath = ReadRenderValue<string?>(context, IChartComponent.SeriesPathProperty, null),
            ValuePath = ReadRenderValue<string?>(context, IChartComponent.ValuePathProperty, null),
            Legend = ReadRenderValue(context, IChartComponent.LegendProperty, UIChartLegendPlacement.Bottom),
            Tooltip = ReadRenderValue(context, IChartComponent.ShowTooltipProperty, true),
            Stepped = lines.Stepped,
            Smooth = lines.Smooth,
            Markers = lines.Markers,
            Stacked = ReadStacked(context),
            SharedTooltip = !radar && ReadRenderValue(context, IChartComponent.SharedTooltipProperty, false),
            Zoomable = kind != PieKind && !radar && !bare && ReadRenderValue(context, IChartComponent.ZoomableProperty, false),
            Pressable = context.ViewResolution.View.Events.TryGet(new CompiledUIEventAddress(context.Node.ComponentId, ChartEvents.PointClick), out _),
            FollowLatest = ReadRenderValue(context, IChartComponent.FollowLatestProperty, false),
            VisibleRange = radar ? null : ReadRenderValue<UIChartWindow?>(context, IChartComponent.VisibleRangeProperty, null),
            Horizontal = ReadHorizontal(context),
            Donut = ReadDonut(context)
        };
    }

    /// <summary>
    /// The series drawn from their running totals, keeping their own values for the tooltip.
    /// </summary>
    private static void ApplyStacking(ChartSpec spec, ChartRenderData data)
    {
        if (!spec.Stacked)
        {
            for (var i = 0; i < data.Series.Count; i++)
                data.Series[i].Drawn = data.Series[i].Points;

            return;
        }

        List<ChartPoint>[] raw = new List<ChartPoint>[data.Series.Count];

        for (var i = 0; i < data.Series.Count; i++)
            raw[i] = data.Series[i].Points;

        List<ChartPoint>[] stacked = ChartStacking.Stack(raw);

        data.YMin = double.PositiveInfinity;
        data.YMax = double.NegativeInfinity;

        for (var i = 0; i < data.Series.Count; i++)
        {
            data.Series[i].Drawn = stacked[i];

            for (var j = 0; j < stacked[i].Count; j++)
            {
                if (stacked[i][j].Y is double value)
                    data.TrackY(value);
            }
        }
    }

    /// <summary>The points every series is drawn from, which is what a band's width is shared between.</summary>
    private static IReadOnlyList<ChartPoint>[] DrawnSeries(ChartRenderData data)
    {
        IReadOnlyList<ChartPoint>[] drawn = new IReadOnlyList<ChartPoint>[data.Series.Count];

        for (var i = 0; i < data.Series.Count; i++)
            drawn[i] = data.Series[i].Drawn;

        return drawn;
    }

    /// <summary>Whether a chart of this kind draws from a baseline — a radar's is its centre — which is what makes zero part of the range.</summary>
    private static bool StandsOnZero(string kind)
        => kind is AreaKind or BarKind or RadarKind;

    /// <summary>
    /// The window on a hidden element of its own, which every chart carries so a bound <c>VisibleRange</c> always lands somewhere.
    /// </summary>
    private static void RenderWindowValue(WebRenderContext context, IHtmlElementBuilder root)
    {
        _ = root.Element("div", value =>
        {
            _ = value.Class(WindowClassName);
            _ = value.Attribute("hidden");
            _ = value.Attribute(WebAttributes.ValueKind, WindowValueKind);

            _ = RenderProperty<UIChartWindow?>(context, value, IChartComponent.VisibleRangeProperty, static (target, window) =>
            {
                if (window is UIChartWindow view)
                    _ = target.Attribute(WindowAttribute, JsonSerializer.Serialize(view, ModelJsonOptions));
            }, [WebDomOperation.Custom(WindowValueKind)]);
        });
    }
}
