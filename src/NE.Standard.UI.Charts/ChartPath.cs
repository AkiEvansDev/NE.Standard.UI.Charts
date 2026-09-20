using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A series as the SVG path string it becomes. The browser's <c>chart-path.ts</c> holds the same walk, so a server- and a
/// browser-drawn chart match exactly.
/// </summary>
public static class ChartPath
{
    /// <summary>
    /// The line through the points, broken wherever a row had no value — a run of one point draws nothing, and its marker is what
    /// shows it.
    /// </summary>
    public static string Line(IReadOnlyList<ChartPoint> points, ChartScale x, ChartScale y, ChartPlot plot, bool stepped, bool smooth)
    {
        ArgumentNullException.ThrowIfNull(points);

        StringBuilder builder = new();
        List<(double X, double Y)> run = [];

        for (var i = 0; i < points.Count; i++)
        {
            ChartPoint point = points[i];

            if (point.Y is double value)
            {
                run.Add((plot.X(x, point.X), plot.Y(y, value)));
                continue;
            }

            AppendRun(builder, run, stepped, smooth);
            run.Clear();
        }

        AppendRun(builder, run, stepped, smooth);

        return builder.ToString();
    }

    /// <summary>
    /// The band between a series' line and its baseline — the series below it in a stack, or the axis's zero when there is
    /// none — closed like the line.
    /// </summary>
    public static string Area(IReadOnlyList<ChartPoint> points, IReadOnlyList<ChartPoint>? baseline, ChartScale x, ChartScale y, ChartPlot plot, bool stepped, bool smooth)
    {
        ArgumentNullException.ThrowIfNull(points);

        var zero = plot.Y(y, Math.Clamp(0, y.Min, y.Max));
        StringBuilder builder = new();
        var start = -1;

        for (var i = 0; i <= points.Count; i++)
        {
            if (i < points.Count && points[i].Y is not null)
            {
                if (start < 0)
                    start = i;

                continue;
            }

            if (start >= 0)
                AppendBand(builder, points, start, i - 1, baseline, x, y, plot, stepped, smooth, zero);

            start = -1;
        }

        return builder.ToString();
    }

    /// <summary>A coordinate as the markup carries it: two decimals at most, invariant, and never a negative zero.</summary>
    public static string Coord(double value)
    {
        if (!double.IsFinite(value))
            return "0";

        // Half away from zero's way up, not .NET's to-even: the browser's Math.round is what the other port has.
        var rounded = Math.Floor((value * 100) + 0.5) / 100;

        return (rounded == 0 ? 0 : rounded).ToString(CultureInfo.InvariantCulture);
    }

    private static void AppendRun(StringBuilder builder, List<(double X, double Y)> run, bool stepped, bool smooth)
    {
        if (run.Count == 0)
            return;

        if (builder.Length > 0)
            _ = builder.Append(' ');

        _ = builder.Append('M').Append(Coord(run[0].X)).Append(' ').Append(Coord(run[0].Y));

        AppendSegments(builder, run, stepped, smooth);
    }

    private static void AppendSegments(StringBuilder builder, List<(double X, double Y)> run, bool stepped, bool smooth)
    {
        if (stepped)
        {
            AppendSteps(builder, run);
            return;
        }

        for (var i = 1; i < run.Count; i++)
        {
            if (smooth)
            {
                AppendCurve(builder, run, i);
                continue;
            }

            _ = builder.Append(" L").Append(Coord(run[i].X)).Append(' ').Append(Coord(run[i].Y));
        }
    }

    /// <summary>
    /// A stair centred on its points: a value holds from halfway back to halfway on, so a point's mark sits mid-step, not on
    /// a corner.
    /// </summary>
    private static void AppendSteps(StringBuilder builder, List<(double X, double Y)> run)
    {
        if (run.Count < 2)
            return;

        for (var i = 1; i < run.Count; i++)
        {
            var middle = (run[i - 1].X + run[i].X) / 2;

            _ = builder.Append(" H").Append(Coord(middle)).Append(" V").Append(Coord(run[i].Y));
        }

        _ = builder.Append(" H").Append(Coord(run[^1].X));
    }

    /// <summary>One segment as a cubic whose handles follow the points on either side — a Catmull-Rom curve, which passes through every point.</summary>
    private static void AppendCurve(StringBuilder builder, List<(double X, double Y)> run, int index)
    {
        var before = Math.Max(0, index - 2);
        var after = Math.Min(run.Count - 1, index + 1);

        var firstX = run[index - 1].X + ((run[index].X - run[before].X) / 6);
        var firstY = run[index - 1].Y + ((run[index].Y - run[before].Y) / 6);
        var secondX = run[index].X - ((run[after].X - run[index - 1].X) / 6);
        var secondY = run[index].Y - ((run[after].Y - run[index - 1].Y) / 6);

        _ = builder
            .Append(" C").Append(Coord(firstX)).Append(' ').Append(Coord(firstY))
            .Append(' ').Append(Coord(secondX)).Append(' ').Append(Coord(secondY))
            .Append(' ').Append(Coord(run[index].X)).Append(' ').Append(Coord(run[index].Y));
    }

    /// <summary>One unbroken stretch of the band: the tops from <paramref name="from"/> to <paramref name="to"/>, then the baseline back.</summary>
    private static void AppendBand(StringBuilder builder, IReadOnlyList<ChartPoint> points, int from, int to, IReadOnlyList<ChartPoint>? baseline, ChartScale x, ChartScale y, ChartPlot plot, bool stepped, bool smooth, double zero)
    {
        List<(double X, double Y)> top = new(to - from + 1);

        for (var i = from; i <= to; i++)
            top.Add((plot.X(x, points[i].X), plot.Y(y, points[i].Y!.Value)));

        AppendRun(builder, top, stepped, smooth);

        // Nothing under it: the band closes on the axis's zero, which is one straight edge whatever the line did.
        if (baseline is null)
        {
            _ = builder
                .Append(" L").Append(Coord(top[^1].X)).Append(' ').Append(Coord(zero))
                .Append(" L").Append(Coord(top[0].X)).Append(' ').Append(Coord(zero))
                .Append(" Z");

            return;
        }

        List<(double X, double Y)> bottom = new(top.Count);

        for (var i = to; i >= from; i--)
            bottom.Add((plot.X(x, points[i].X), plot.Y(y, ChartStacking.ValueAt(baseline, points[i].X))));

        _ = builder.Append(" L").Append(Coord(bottom[0].X)).Append(' ').Append(Coord(bottom[0].Y));

        AppendSegments(builder, bottom, stepped, smooth);

        _ = builder.Append(" Z");
    }
}
