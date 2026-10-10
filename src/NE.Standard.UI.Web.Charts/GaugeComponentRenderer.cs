using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The gauge: one reading on an arc, its bands, and the reading in words; the arc is pure stylesheet, moved with no script.
/// </summary>
public class GaugeComponentRenderer : WebComponentRendererBase
{
    /// <summary>The operation the package's client writes the reading's words under.</summary>
    public const string ValueOperationKind = "chart-gauge-value";

    /// <summary>On the reading's number: how it is written.</summary>
    public const string FormatAttribute = "data-ui-gauge-format";

    protected const string RootClassName = "ui-gauge";
    protected const string MinVariable = "--ui-gauge-min";
    protected const string MaxVariable = "--ui-gauge-max";
    protected const string ValueVariable = "--ui-gauge-value";

    protected const string FrameClassName = "ui-gauge__frame";
    protected const string CanvasClassName = "ui-gauge__canvas";
    protected const string WordsClassName = "ui-gauge__words";
    protected const string TrackClassName = "ui-gauge__track";
    protected const string BandClassName = "ui-gauge__band";
    protected const string FillClassName = "ui-gauge__fill";
    protected const string ArcClassName = "ui-gauge__arc";
    protected const string StartCapClassName = "ui-gauge__cap ui-gauge__cap--start";
    protected const string EndCapClassName = "ui-gauge__cap ui-gauge__cap--end";
    protected const string ValueClassName = "ui-gauge__value";
    protected const string NumberClassName = "ui-gauge__number";
    protected const string UnitClassName = "ui-gauge__unit";
    protected const string CaptionClassName = "ui-gauge__caption";
    protected const string BandColorVariable = "--ui-gauge-band-color";
    protected const string RatioVariable = "--ui-gauge-ratio";
    protected const string CentreXVariable = "--ui-gauge-centre-x";
    protected const string CentreYVariable = "--ui-gauge-centre-y";

    private const string DefaultFormat = "N0";

    // The box the arc is drawn in: three quarters of a turn from lower left to lower right, with the reading and caption in
    // the middle.
    private const double Width = 200;
    private const double Height = 170;
    private const double CentreX = 100;
    private const double CentreY = 95;
    private const double Radius = 74;
    // Bands ride a thin ring of their own outside the arc, not under the reading: a translucent band overlapping it would leave
    // a jagged-pixel fringe at the edges and ends.
    private const double BandRadius = 87;
    // Two bands whose shares differ by less than this meet, and their meeting is flush rather than two round ends.
    private const double Touching = 1e-9;
    private const double Start = Math.PI * 0.75;
    private const double Sweep = Math.PI * 1.5;

    public override string ComponentTypeKey => GaugeComponent.ComponentTypeKey;

    protected override string ClassName => RootClassName;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        CultureInfo culture = ResolveCulture(context);

        // The page's pack: a language switch writes it again before the reading is written anew.
        NumberCultureRenderer.RenderNumberCulture(root, culture);
        _ = root.Attribute(WebAttributes.PageCulture);

        var low = ReadRenderValue(context, GaugeComponent.MinProperty, 0d);
        var max = ReadRenderValue<double?>(context, GaugeComponent.MaxProperty, null);
        var high = max > low ? max.Value : low + 100;

        // The range and the reading, from which the stylesheet works out the reading's share; none reads as the low end.
        _ = root.Style(MinVariable, low.ToString(CultureInfo.InvariantCulture));
        _ = root.Style(MaxVariable, high.ToString(CultureInfo.InvariantCulture));

        _ = RenderProperty<double?>(context, root, GaugeComponent.ValueProperty, static (target, current) =>
        {
            if (current is double value)
                _ = target.Style(ValueVariable, value.ToString(CultureInfo.InvariantCulture));
        },
        [
            WebDomOperation.Style(ValueVariable),
            WebDomOperation.Custom(ValueOperationKind, target: $".{NumberClassName}")
        ]);

        _ = root.Element("div", frame =>
        {
            _ = frame.Class(FrameClassName);
            // The words are laid over the arc, not drawn in it, so the stylesheet shapes and places the dial from the arc's
            // own box and centre.
            _ = frame.Style(RatioVariable, $"{ChartPath.Coord(Width)} / {ChartPath.Coord(Height)}");
            _ = frame.Style(CentreXVariable, Percent(CentreX / Width));
            _ = frame.Style(CentreYVariable, Percent(CentreY / Height));

            RenderArc(context, frame, ReadRenderValue<IReadOnlyList<UIGaugeBand>?>(context, GaugeComponent.BandsProperty, null) ?? [], low, high);
            RenderWords(context, frame, culture);
        });
    }

    private static string Percent(double share)
        => ChartPath.Coord(share * 100) + "%";

    /// <summary>
    /// The arc: the track, the bands and the reading's share, unannounced since the words over it say what it shows.
    /// </summary>
    private static void RenderArc(WebRenderContext context, IHtmlElementBuilder frame, IReadOnlyList<UIGaugeBand> bands, double low, double high)
        => ChartSvg.Render(frame, CanvasClassName, Width, Height, null, svg =>
        {
            // The stylesheet cuts each circle to its stretch and turns the round ends into place, both from these three.
            _ = svg.Style(ChartSvg.ArcStartVariable, ChartSvg.Degrees(Start));
            _ = svg.Style(ChartSvg.ArcSweepVariable, ChartSvg.Degrees(Sweep));
            _ = svg.Style(ChartSvg.ArcOriginVariable, $"{ChartPath.Coord(CentreX)}px {ChartPath.Coord(CentreY)}px");

            _ = svg.Element("g", track => RenderRing(track.Class(TrackClassName), Radius, roundStart: true, roundEnd: true));

            for (var i = 0; i < bands.Count; i++)
                RenderBand(context, svg, bands, i, low, high);

            _ = svg.Element("g", fill => RenderRing(fill.Class(FillClassName), Radius, roundStart: true, roundEnd: true));
        });

    /// <summary>
    /// A ring: a whole circle the stylesheet cuts to the stretch its group names, with a dot at each round end
    /// (<c>mixins/arc.less</c>) since the browser antialiases a stroked arc into visible pixel steps.
    /// </summary>
    private static void RenderRing(IHtmlElementBuilder group, double radius, bool roundStart, bool roundEnd)
    {
        _ = group.Element("circle", arc =>
        {
            _ = arc.Class(ArcClassName);
            _ = arc.Attribute("cx", ChartPath.Coord(CentreX));
            _ = arc.Attribute("cy", ChartPath.Coord(CentreY));
            _ = arc.Attribute("r", ChartPath.Coord(radius));
        });

        if (roundStart)
            RenderCap(group, radius, StartCapClassName);

        if (roundEnd)
            RenderCap(group, radius, EndCapClassName);
    }

    /// <summary>A round end: a dot standing where a turn of none would put it, which the stylesheet turns about the centre to its end.</summary>
    private static void RenderCap(IHtmlElementBuilder group, double radius, string className)
        => group.Element("circle", cap =>
        {
            _ = cap.Class(className);
            _ = cap.Attribute("cx", ChartPath.Coord(CentreX + radius));
            _ = cap.Attribute("cy", ChartPath.Coord(CentreY));
        });

    /// <summary>
    /// One band on the ring outside the arc, its end round where it stops and flush where another carries it on.
    /// </summary>
    private static void RenderBand(WebRenderContext context, IHtmlElementBuilder svg, IReadOnlyList<UIGaugeBand> bands, int index, double low, double high)
    {
        UIGaugeBand band = bands[index];
        var from = Share(band.From, low, high);
        var to = Share(band.To, low, high);

        if (to <= from)
            return;

        _ = svg.Element("g", group =>
        {
            _ = group.Class(BandClassName);
            _ = group.Style(ChartSvg.ArcFromVariable, ChartPath.Coord(from));
            _ = group.Style(ChartSvg.ArcToVariable, ChartPath.Coord(to));
            _ = group.Style(BandColorVariable, ThemeColorRenderer.SeriesColorCss(context, index, band.Color));

            RenderRing(group, BandRadius, !Continues(bands, index, from, low, high, atStart: true), !Continues(bands, index, to, low, high, atStart: false));
        });
    }

    /// <summary>Whether another band that is drawn meets this one at <paramref name="share"/>: ends there where this one starts, or starts there where it ends.</summary>
    private static bool Continues(IReadOnlyList<UIGaugeBand> bands, int index, double share, double low, double high, bool atStart)
    {
        for (var i = 0; i < bands.Count; i++)
        {
            if (i == index)
                continue;

            var from = Share(bands[i].From, low, high);
            var to = Share(bands[i].To, low, high);

            if (to > from && Math.Abs((atStart ? to : from) - share) < Touching)
                return true;
        }

        return false;
    }

    /// <summary>Where a value falls in the range, from none of it to all of it.</summary>
    private static double Share(double value, double low, double high)
        => high > low ? Math.Clamp((value - low) / (high - low), 0, 1) : 0;

    /// <summary>
    /// The reading and caption: words of the page's own type laid over the arc, not drawn inside the viewBox, since scaled
    /// text can't survive a dial's stretch.
    /// </summary>
    private static void RenderWords(WebRenderContext context, IHtmlElementBuilder frame, CultureInfo culture)
    {
        var format = ReadRenderValue<string?>(context, GaugeComponent.FormatProperty, null) ?? DefaultFormat;

        // Refused with no reading as well: the client writes the first value pushed under it.
        if (!WebNumberFormat.IsSupported(format))
            throw new InvalidOperationException($"GaugeComponent.Format '{format}' cannot be written: a reading takes a format of the shared subset ({WebNumberFormat.Kinds}, with an optional precision).");

        var value = ReadRenderValue<double?>(context, GaugeComponent.ValueProperty, null);

        _ = frame.Element("div", words =>
        {
            _ = words.Class(WordsClassName);

            // The number the client writes, and the unit as a property of its own that follows a language switch or a push; no
            // reading hides the unit with the number's word.
            _ = words.Element("span", reading =>
            {
                _ = reading.Class(ValueClassName);

                _ = reading.Element("span", number => _ = number
                    .Class(NumberClassName)
                    .Attribute(FormatAttribute, format)
                    .Text(Reading(context, value, format, culture))
                );

                _ = reading.Element("span", unit =>
                {
                    _ = unit.Class(UnitClassName);

                    if (value is null)
                        _ = unit.Attribute("hidden");

                    _ = RenderProperty<string?>(context, unit, GaugeComponent.UnitProperty, static (target, text) =>
                    {
                        if (!string.IsNullOrEmpty(text))
                            _ = target.Text(text);
                    }, [WebDomOperation.Text()]);
                });
            });

            // Always written, empty or not: a static caption is recorded for a language switch, a bound one follows its pushes.
            _ = words.Element("span", text =>
            {
                _ = text.Class(CaptionClassName);
                _ = RenderProperty<string?>(context, text, GaugeComponent.CaptionProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Text(value);
                }, [WebDomOperation.Text()]);
            });
        });
    }

    /// <summary>The reading's number as the page's culture writes it; the page's own word for none where there is no reading.</summary>
    private static string Reading(WebRenderContext context, double? value, string format, CultureInfo culture)
        => value is double number
            ? WebNumberFormat.Format(number, format, WebNumberCulturePack.FromCulture(culture))
            : context.Translate(ChartsStrings.NoReading);
}
