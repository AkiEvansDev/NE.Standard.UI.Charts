using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Compiled.Resolution;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The rows as points, read once each; <c>chart-rows.ts</c> is its twin, letting a patch move one point.
/// </summary>
internal static class ChartDataReader
{
    public static ChartRenderData Read(ChartSpec spec, IReadOnlyList<object?> items)
    {
        ArgumentNullException.ThrowIfNull(spec);
        ArgumentNullException.ThrowIfNull(items);

        ChartRenderData data = new();

        for (var i = 0; i < spec.Series.Count; i++)
            data.Series.Add(new ChartRenderSeries(spec.Series[i], i));

        for (var i = 0; i < items.Count; i++)
            ReadRow(spec, data, items[i], i);

        return data;
    }

    private static void ReadRow(ChartSpec spec, ChartRenderData data, object? item, int index)
    {
        // An item that is no row still holds its slot, so the page's changes, which name a place in the collection, find their rows.
        if (item is null)
        {
            data.Slots.Add(null);
            return;
        }

        var key = ReadKey(item, index);

        // With no x path a row is numbered by its place among the rows, not the items: chart-rows.ts numbers the rows it holds, and
        // holds none for a null item.
        object? raw = data.Rows.Count;

        if (spec.XPath is not null)
            _ = ItemContext.TryReadPath(item, spec.XPath, out raw);

        var text = ChartValues.ToText(raw);

        // A row whose x cannot be read is no point, not one at zero. Read off the text the browser is told, so every redraw
        // places it where the first frame did.
        if (raw is null || !ChartValues.TryToNumber(text, spec.XAxis.Kind, data.Categories, out var x))
        {
            data.Slots.Add(null);
            return;
        }

        data.TrackX(x);

        if (spec.IsLongForm)
        {
            _ = ItemContext.TryReadPath(item, spec.SeriesPath!, out var seriesValue);
            var seriesKey = ChartValues.ToText(seriesValue);
            ChartRenderSeries series = ResolveSeries(data, seriesKey);
            var value = ReadValue(item, series.Series.ValuePath ?? spec.ValuePath, data);
            var size = ReadSize(item, series.Series.SizePath, data);

            series.Points.Add(new ChartPoint(key, x, value, size));
            data.AddRow(size is null ? [key, text, new[] { value }, seriesKey] : [key, text, new[] { value }, seriesKey, new[] { size }]);

            return;
        }

        var values = new double?[data.Series.Count];
        var sizes = new double?[data.Series.Count];
        var sized = false;

        for (var i = 0; i < data.Series.Count; i++)
        {
            ChartRenderSeries series = data.Series[i];

            values[i] = ReadValue(item, series.Series.ValuePath ?? spec.ValuePath, data);
            sizes[i] = ReadSize(item, series.Series.SizePath, data);
            sized |= sizes[i] is not null;
            series.Points.Add(new ChartPoint(key, x, values[i], sizes[i]));
        }

        // The series slot stays where it is — a wide row names none — so the sizes come after it, and only where there are any.
        data.AddRow(sized ? [key, text, values, null, sizes] : [key, text, values]);
    }

    /// <summary>The row's key, which the sink's own changes name a row by; its place in the collection where it has none.</summary>
    private static string ReadKey(object item, int index)
    {
        if (item is IBindableItem bindable && !string.IsNullOrEmpty(bindable.Id))
            return bindable.Id;

        return ItemContext.TryReadProperty(item, nameof(IBindableItem.Id), out var id) && id is string text && text.Length > 0
            ? text
            : index.ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>The series of that key, added to the chart's own where the data names one the author did not.</summary>
    private static ChartRenderSeries ResolveSeries(ChartRenderData data, string key)
    {
        for (var i = 0; i < data.Series.Count; i++)
        {
            if (string.Equals(data.Series[i].Series.Key, key, StringComparison.Ordinal))
                return data.Series[i];
        }

        ChartRenderSeries series = new(new UIChartSeries { Key = key }, data.Series.Count);
        data.Series.Add(series);

        return series;
    }

    /// <summary>A point's value, and the reach of the y axis with it; null where the row had none.</summary>
    private static double? ReadValue(object item, string? path, ChartRenderData data)
    {
        if (string.IsNullOrWhiteSpace(path))
            return null;

        _ = ItemContext.TryReadPath(item, path, out var read);

        if (!ChartValues.TryToNumber(read, UIChartAxisKind.Linear, null, out var value))
            return null;

        data.TrackY(value);

        return value;
    }

    /// <summary>The third value a point is sized by, and the run of them with it; null where the series names none.</summary>
    private static double? ReadSize(object item, string? path, ChartRenderData data)
    {
        if (string.IsNullOrWhiteSpace(path))
            return null;

        _ = ItemContext.TryReadPath(item, path, out var read);

        if (!ChartValues.TryToNumber(read, UIChartAxisKind.Linear, null, out var value))
            return null;

        data.TrackSize(value);

        return value;
    }
}
