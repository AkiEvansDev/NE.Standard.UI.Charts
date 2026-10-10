using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Charts;

/// <summary>The frame: the ticks and their words, the plot's box, the grid, the two axes and their captions.</summary>
public abstract partial class ChartComponentRendererBase
{
    /// <summary>
    /// How a value is written on each axis, and the page's packs it is written by, settled once per render so a tick and a tooltip
    /// read the same — and as the client's redraw writes them, through the formatters it shares with the server.
    /// </summary>
    private readonly record struct ChartFormats(string? X, string? Y, WebNumberCulturePack Numbers, WebTemporalCulturePack Dates);

    /// <summary>Each axis's format and the page's packs; a format the client could not write is refused here, with no rows as well.</summary>
    private static ChartFormats ResolveFormats(ChartSpec spec, ChartScale x, ChartScale y, CultureInfo culture)
        => new(FormatOf(spec.XAxis, x, "XAxis"), FormatOf(spec.YAxis, y, "YAxis"), WebNumberCulturePack.FromCulture(culture), WebTemporalCulturePack.FromCulture(culture));

    /// <summary>The format the axis writes under: the author's, or the one its resolved step asks for.</summary>
    private static string? FormatOf(UIChartAxis axis, ChartScale scale, string name)
    {
        if (axis.Format is not string format)
            return ChartTicks.DefaultFormat(axis.Kind, ChartTicks.Step(axis.Kind, scale.Min, scale.Max, axis.TickCount));

        if (axis.Kind == UIChartAxisKind.Time)
            UITemporalPattern.ValidateTokens(format, $"{name}.Format");
        else if (axis.Kind != UIChartAxisKind.Category && !WebNumberFormat.IsSupported(format))
            throw new InvalidOperationException($"{name}.Format '{format}' cannot be written: a number axis takes a format of the shared subset ({WebNumberFormat.Kinds}, with an optional precision).");

        return format;
    }

    /// <summary>The marks of one axis, each already written in the page's culture.</summary>
    private static List<ChartLabel> BuildTicks(UIChartAxis axis, string? format, ChartScale scale, IReadOnlyList<string> categories, ChartFormats formats, bool hasRows)
    {
        // With no rows, an axis the author left open has no range worth marking — a clock would print a moment nobody asked about.
        if (!hasRows && axis.Min is null && axis.Max is null)
            return [];

        var values = ChartTicks.Build(axis.Kind, scale, axis.TickCount);
        List<ChartLabel> labels = new(values.Length);

        for (var i = 0; i < values.Length; i++)
            labels.Add(new ChartLabel(values[i], FormatValue(axis.Kind, format, values[i], categories, formats)));

        return labels;
    }

    /// <summary>A value as the axis writes it: a name, a moment under its pattern, or a number under its format.</summary>
    private static string FormatValue(UIChartAxisKind kind, string? format, double value, IReadOnlyList<string> categories, ChartFormats formats)
    {
        if (kind == UIChartAxisKind.Category)
        {
            var index = (int)Math.Round(value);

            return index >= 0 && index < categories.Count ? categories[index] : string.Empty;
        }

        return kind == UIChartAxisKind.Time
            ? WebTemporalFormat.Format(ChartValues.ToDateTime(value), format, formats.Dates)
            : WebNumberFormat.Format(value, format, formats.Numbers);
    }

    /// <summary>
    /// The plot's box in the nominal frame, inside the room its labels and captions take.
    /// </summary>
    private static ChartPlot ResolvePlot(ChartSpec spec, IReadOnlyList<ChartLabel> leftTicks)
    {
        var widest = 0;

        for (var i = 0; i < leftTicks.Count; i++)
            widest = Math.Max(widest, leftTicks[i].Text.Length);

        var left = (widest * LabelCharacterWidth) + (LabelGap * 2) + (string.IsNullOrWhiteSpace(LeftAxis(spec).Caption) ? 0 : CaptionHeight);
        var bottom = TickHeight + (string.IsNullOrWhiteSpace(BottomAxis(spec).Caption) ? 0 : CaptionHeight);

        return new ChartPlot(left, PlotInset, Math.Max(1, NominalWidth - left - PlotInset), Math.Max(1, NominalHeight - bottom - PlotInset));
    }

    /// <summary>The axis written down the left of the plot: the values, or the bands where the chart lies on its side.</summary>
    private static UIChartAxis LeftAxis(ChartSpec spec)
        => spec.Horizontal ? spec.XAxis : spec.YAxis;

    /// <summary>The axis written under the plot: the bands, or the values where the chart lies on its side.</summary>
    private static UIChartAxis BottomAxis(ChartSpec spec)
        => spec.Horizontal ? spec.YAxis : spec.XAxis;

    /// <summary>
    /// Where a place on the band axis lands, across the plot or down it when bars lie on their side.
    /// </summary>
    private static double BandCoord(ChartSpec spec, ChartPlot plot, ChartScale band, double value)
        => spec.Horizontal ? plot.Down(band, value) : plot.X(band, value);

    /// <summary>Where a value lands: up the plot, or across it where the chart lies on its side.</summary>
    private static double ValueCoord(ChartSpec spec, ChartPlot plot, ChartScale value, double reading)
        => spec.Horizontal ? plot.X(value, reading) : plot.Y(value, reading);

    /// <summary>A line across the plot at every mark of an axis that asked for them.</summary>
    private static void RenderGrid(IHtmlElementBuilder svg, ChartSpec spec, ChartPlot plot, ChartScale x, ChartScale y, IReadOnlyList<ChartLabel> xTicks, IReadOnlyList<ChartLabel> yTicks)
    {
        if (!spec.XAxis.ShowGridLines && !spec.YAxis.ShowGridLines)
            return;

        _ = svg.Element("g", grid =>
        {
            _ = grid.Class(GridClassName);

            if (spec.YAxis.ShowGridLines)
            {
                for (var i = 0; i < yTicks.Count; i++)
                    RenderGridLine(grid, plot, ValueCoord(spec, plot, y, yTicks[i].Value), spec.Horizontal);
            }

            if (!spec.XAxis.ShowGridLines)
                return;

            for (var i = 0; i < xTicks.Count; i++)
                RenderGridLine(grid, plot, BandCoord(spec, plot, x, xTicks[i].Value), !spec.Horizontal);
        });
    }

    /// <summary>One line across the plot at a mark: down the box for a mark on the axis under it, across for one beside it.</summary>
    private static void RenderGridLine(IHtmlElementBuilder grid, ChartPlot plot, double at, bool down)
    {
        if (down)
            RenderLine(grid, GridLineClassName, at, plot.Top, at, plot.Bottom);
        else
            RenderLine(grid, GridLineClassName, plot.Left, at, plot.Right, at);
    }

    private static void RenderLine(IHtmlElementBuilder parent, string className, double x1, double y1, double x2, double y2)
        => parent.Element("line", line =>
        {
            _ = line.Class(className);
            _ = line.Attribute("x1", ChartPath.Coord(x1));
            _ = line.Attribute("y1", ChartPath.Coord(y1));
            _ = line.Attribute("x2", ChartPath.Coord(x2));
            _ = line.Attribute("y2", ChartPath.Coord(y2));
        });

    /// <summary>The two axis lines, their marks' labels and their captions.</summary>
    private static void RenderAxes(IHtmlElementBuilder svg, ChartSpec spec, ChartPlot plot, ChartScale x, ChartScale y, IReadOnlyList<ChartLabel> xTicks, IReadOnlyList<ChartLabel> yTicks, WebRenderContext context)
    {
        _ = svg.Element("g", axes =>
        {
            _ = axes.Class(AxesClassName);

            RenderLine(axes, AxisLineClassName, plot.Left, plot.Bottom, plot.Right, plot.Bottom);
            RenderLine(axes, AxisLineClassName, plot.Left, plot.Top, plot.Left, plot.Bottom);

            IReadOnlyList<ChartLabel> under = spec.Horizontal ? yTicks : xTicks;
            IReadOnlyList<ChartLabel> beside = spec.Horizontal ? xTicks : yTicks;

            for (var i = 0; i < under.Count; i++)
            {
                // A label at either end is kept inside the frame rather than hanging off it; its mark stays where it is.
                var half = under[i].Text.Length * LabelCharacterWidth / 2;
                var along = spec.Horizontal ? ValueCoord(spec, plot, y, under[i].Value) : BandCoord(spec, plot, x, under[i].Value);

                RenderText(axes, LabelClassName, under[i].Text, Math.Min(Math.Max(along, half), NominalWidth - half), plot.Bottom + 16, "middle");
            }

            for (var i = 0; i < beside.Count; i++)
            {
                var down = spec.Horizontal ? BandCoord(spec, plot, x, beside[i].Value) : ValueCoord(spec, plot, y, beside[i].Value);

                RenderText(axes, LabelClassName, beside[i].Text, plot.Left - LabelGap, down + 4, "end");
            }

            var bottomCaption = BottomAxis(spec).Caption;
            var leftCaption = LeftAxis(spec).Caption;

            if (!string.IsNullOrWhiteSpace(bottomCaption))
                RenderText(axes, CaptionClassName, context.Translate(bottomCaption), plot.Left + (plot.Width / 2), NominalHeight - 2, "middle");

            if (!string.IsNullOrWhiteSpace(leftCaption))
            {
                // Reading up the axis, which is how the caption beside a plot is read; the rotation is about the point it is placed at.
                var middle = plot.Top + (plot.Height / 2);

                RenderText(axes, CaptionClassName, context.Translate(leftCaption), 10, middle, "middle", $"rotate(-90 10 {ChartPath.Coord(middle)})");
            }
        });
    }

    /// <summary>One run of words in the drawing: a label, a caption, the empty chart's own line.</summary>
    private static void RenderText(IHtmlElementBuilder parent, string className, string text, double x, double y, string anchor, string? transform = null)
        => parent.Element("text", element =>
        {
            _ = element.Class(className);
            _ = element.Attribute("x", ChartPath.Coord(x));
            _ = element.Attribute("y", ChartPath.Coord(y));
            _ = element.Attribute("text-anchor", anchor);

            if (transform is not null)
                _ = element.Attribute("transform", transform);

            _ = element.Text(text);
        });
}
