using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace NE.Standard.UI.Charts;

/// <summary>One straight piece of a drawn line, from one place to the next.</summary>
/// <param name="X1">Where it starts, across.</param>
/// <param name="Y1">Where it starts, down.</param>
/// <param name="X2">Where it ends, across.</param>
/// <param name="Y2">Where it ends, down.</param>
public readonly record struct ChartSegment(double X1, double Y1, double X2, double Y2);

/// <summary>
/// A series as the SVG it becomes; <c>chart-path.ts</c> is its twin, so a server- and a browser-drawn chart match exactly.
/// </summary>
public static class ChartPath
{
    /// <summary>About how long a piece of a curve is, in drawing units: short enough that the pieces read as the curve.</summary>
    private const double CurvePiece = 4;

    /// <summary>
    /// The line through the points, broken wherever a row had no value; a lone point is shown by its marker.
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
    /// The band between a series' line and its <see cref="ChartPoint.Base"/> or the axis's zero.
    /// </summary>
    public static string Area(IReadOnlyList<ChartPoint> points, ChartScale x, ChartScale y, ChartPlot plot, bool stepped, bool smooth)
    {
        ArgumentNullException.ThrowIfNull(points);

        var zero = plot.Y(y, y.Within(0));
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
                AppendBand(builder, points, start, i - 1, x, y, plot, stepped, smooth, zero);

            start = -1;
        }

        return builder.ToString();
    }

    /// <summary>
    /// The line <see cref="Line"/> describes as straight pieces, since a lone line antialiases smoothly where a path steps.
    /// </summary>
    public static IReadOnlyList<ChartSegment> Segments(IReadOnlyList<ChartPoint> points, ChartScale x, ChartScale y, ChartPlot plot, bool stepped, bool smooth)
    {
        ArgumentNullException.ThrowIfNull(points);

        List<ChartSegment> segments = [];
        List<(double X, double Y)> run = [];

        for (var i = 0; i < points.Count; i++)
        {
            ChartPoint point = points[i];

            if (point.Y is double value)
            {
                run.Add((plot.X(x, point.X), plot.Y(y, value)));
                continue;
            }

            AddRunPieces(segments, run, stepped, smooth);
            run.Clear();
        }

        AddRunPieces(segments, run, stepped, smooth);

        return segments;
    }

    /// <summary>One unbroken run's pieces, the way <see cref="Line"/> walks it: straight, stepped, or curved.</summary>
    private static void AddRunPieces(List<ChartSegment> segments, List<(double X, double Y)> run, bool stepped, bool smooth)
    {
        if (run.Count < 2)
            return;

        if (stepped)
        {
            AddStepPieces(segments, run);
            return;
        }

        for (var i = 1; i < run.Count; i++)
        {
            if (smooth)
                AddCurvePieces(segments, run, i);
            else
                AddSegment(segments, run[i - 1].X, run[i - 1].Y, run[i].X, run[i].Y);
        }
    }

    /// <summary>The stair <see cref="AppendSteps"/> draws: across to halfway, up or down to the next value, and across to the last point.</summary>
    private static void AddStepPieces(List<ChartSegment> segments, List<(double X, double Y)> run)
    {
        var atX = run[0].X;
        var atY = run[0].Y;

        for (var i = 1; i < run.Count; i++)
        {
            var middle = (run[i - 1].X + run[i].X) / 2;

            AddSegment(segments, atX, atY, middle, atY);
            AddSegment(segments, middle, atY, middle, run[i].Y);
            atX = middle;
            atY = run[i].Y;
        }

        AddSegment(segments, atX, atY, run[^1].X, atY);
    }

    /// <summary>
    /// The curve <see cref="AppendCurve"/> draws into a point, cut into pieces about <see cref="CurvePiece"/> long.
    /// </summary>
    private static void AddCurvePieces(List<ChartSegment> segments, List<(double X, double Y)> run, int index)
    {
        var before = Math.Max(0, index - 2);
        var after = Math.Min(run.Count - 1, index + 1);

        (var startX, var startY) = run[index - 1];
        (var endX, var endY) = run[index];
        var firstX = startX + ((endX - run[before].X) / 6);
        var firstY = startY + ((endY - run[before].Y) / 6);
        var secondX = endX - ((run[after].X - startX) / 6);
        var secondY = endY - ((run[after].Y - startY) / 6);

        var reach = Distance(startX, startY, firstX, firstY) + Distance(firstX, firstY, secondX, secondY) + Distance(secondX, secondY, endX, endY);
        var pieces = Math.Max(1, (int)Math.Ceiling(reach / CurvePiece));
        var atX = startX;
        var atY = startY;

        for (var k = 1; k <= pieces; k++)
        {
            var t = (double)k / pieces;
            var rest = 1 - t;
            var a = rest * rest * rest;
            var b = 3 * rest * rest * t;
            var c = 3 * rest * t * t;
            var d = t * t * t;
            var nextX = (a * startX) + (b * firstX) + (c * secondX) + (d * endX);
            var nextY = (a * startY) + (b * firstY) + (c * secondY) + (d * endY);

            AddSegment(segments, atX, atY, nextX, nextY);
            atX = nextX;
            atY = nextY;
        }
    }

    private static double Distance(double fromX, double fromY, double toX, double toY)
        => Math.Sqrt(((toX - fromX) * (toX - fromX)) + ((toY - fromY) * (toY - fromY)));

    /// <summary>A piece from one place to another; none where the two are the same place, which would draw a dot of the line's cap.</summary>
    internal static void AddSegment(List<ChartSegment> segments, double fromX, double fromY, double toX, double toY)
    {
        if (fromX != toX || fromY != toY)
            segments.Add(new ChartSegment(fromX, fromY, toX, toY));
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

    /// <summary>One unbroken stretch of the band: the tops from <paramref name="from"/> to <paramref name="to"/>, then the bases back.</summary>
    private static void AppendBand(StringBuilder builder, IReadOnlyList<ChartPoint> points, int from, int to, ChartScale x, ChartScale y, ChartPlot plot, bool stepped, bool smooth, double zero)
    {
        List<(double X, double Y)> top = new(to - from + 1);

        for (var i = from; i <= to; i++)
            top.Add((plot.X(x, points[i].X), plot.Y(y, points[i].Y!.Value)));

        AppendRun(builder, top, stepped, smooth);

        // Nothing under it: the band closes on the axis's zero, which is one straight edge whatever the line did.
        if (points[from].Base is null)
        {
            _ = builder
                .Append(" L").Append(Coord(top[^1].X)).Append(' ').Append(Coord(zero))
                .Append(" L").Append(Coord(top[0].X)).Append(' ').Append(Coord(zero))
                .Append(" Z");

            return;
        }

        List<(double X, double Y)> bottom = new(top.Count);

        for (var i = to; i >= from; i--)
            bottom.Add((plot.X(x, points[i].X), plot.Y(y, points[i].Base ?? 0)));

        _ = builder.Append(" L").Append(Coord(bottom[0].X)).Append(' ').Append(Coord(bottom[0].Y));

        AppendSegments(builder, bottom, stepped, smooth);

        _ = builder.Append(" Z");
    }
}
