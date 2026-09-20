using System;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Web.Abstractions.Html;

namespace NE.Standard.UI.Web.Charts;

/// <summary>The one canvas every drawing of the package opens: a picture the browser re-lays out at its real size, taking no focus.</summary>
internal static class ChartSvg
{
    /// <summary>The custom properties the contract's <c>.ui-arc-cut()</c> and <c>.ui-arc-cap()</c> cut a circle down by.</summary>
    public const string ArcStartVariable = "--ui-arc-start";
    public const string ArcSweepVariable = "--ui-arc-sweep";
    public const string ArcFromVariable = "--ui-arc-from";
    public const string ArcToVariable = "--ui-arc-to";
    public const string ArcOriginVariable = "--ui-arc-origin";

    public static void Render(IHtmlElementBuilder parent, string className, double width, double height, Action<IHtmlElementBuilder> draw)
        => parent.Element("svg", svg =>
        {
            _ = svg.Class(className);
            _ = svg.Attribute("viewBox", $"0 0 {ChartPath.Coord(width)} {ChartPath.Coord(height)}");
            _ = svg.Attribute("role", "img");
            _ = svg.Attribute("focusable", "false");
            draw(svg);
        });

    /// <summary>An angle as the stylesheet writes one.</summary>
    public static string Degrees(double radians)
        => ChartPath.Coord(radians * 180 / Math.PI) + "deg";
}
