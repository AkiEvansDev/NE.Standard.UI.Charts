using System;
using System.Collections.Generic;
using System.Globalization;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A row's value as an axis reads it, and as the browser is told it.
/// </summary>
public static class ChartValues
{
    /// <summary>
    /// A moment as the number a time axis reads: the wall clock it is written with, never shifted into another zone.
    /// </summary>
    public static double FromDateTime(DateTime value)
        => (value - DateTime.UnixEpoch).TotalMilliseconds;

    /// <summary>The moment a time axis's number stands for.</summary>
    public static DateTime ToDateTime(double value)
        => DateTime.UnixEpoch.AddMilliseconds(value);

    /// <summary>
    /// The number the axis reads the value as: a number as itself, a moment in milliseconds, a name by its place among names
    /// seen so far. False when the axis cannot read the value.
    /// </summary>
    public static bool TryToNumber(object? value, UIChartAxisKind kind, IList<string>? categories, out double number)
    {
        number = 0;

        if (value is null)
            return false;

        if (kind == UIChartAxisKind.Category)
        {
            if (categories is null)
                return false;

            var name = ToText(value);
            var index = categories.IndexOf(name);

            if (index < 0)
            {
                index = categories.Count;
                categories.Add(name);
            }

            number = index;
            return true;
        }

        switch (value)
        {
            case DateTime moment:
                number = FromDateTime(moment);
                return true;

            case DateTimeOffset moment:
                number = FromDateTime(moment.DateTime);
                return true;

            case string text:
                if (double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out number))
                    return true;

                // Parsed as an offset so the text's zone is dropped, not shifted into the reader's own zone.
                if (DateTimeOffset.TryParse(text, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTimeOffset parsed))
                {
                    number = FromDateTime(parsed.DateTime);
                    return true;
                }

                return false;

            case bool flag:
                number = flag ? 1 : 0;
                return true;

            case IConvertible convertible:
                try
                {
                    number = convertible.ToDouble(CultureInfo.InvariantCulture);
                    return !double.IsNaN(number) && !double.IsInfinity(number);
                }
                catch (InvalidCastException)
                {
                    return false;
                }
                catch (FormatException)
                {
                    return false;
                }
                catch (OverflowException)
                {
                    return false;
                }

            default:
                return false;
        }
    }

    /// <summary>
    /// The value as the browser is told it: a moment in the wire's own form, a number invariantly, anything else as text.
    /// </summary>
    public static string ToText(object? value)
        => value switch
        {
            null => string.Empty,
            DateTime moment => moment.ToString("yyyy-MM-ddTHH:mm:ss.fff", CultureInfo.InvariantCulture),
            DateTimeOffset moment => moment.DateTime.ToString("yyyy-MM-ddTHH:mm:ss.fff", CultureInfo.InvariantCulture),
            string text => text,
            bool flag => flag ? "true" : "false",
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture),
            _ => value.ToString() ?? string.Empty
        };
}
