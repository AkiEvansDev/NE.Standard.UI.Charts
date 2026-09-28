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

    /// <summary>The moment a time axis's number stands for; a number past either end a <see cref="DateTime"/> can name reads as that end.</summary>
    public static DateTime ToDateTime(double value)
        => double.IsNaN(value) ? DateTime.UnixEpoch : DateTime.UnixEpoch.AddMilliseconds(Math.Clamp(value, ChartCalendar.MinTime, ChartCalendar.MaxTime));

    /// <summary>
    /// The number the axis reads the value as: a number as itself, a moment in milliseconds on a time axis, a name by its place
    /// among names seen so far. False when the axis cannot read the value.
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
            case DateTime moment when kind == UIChartAxisKind.Time:
                number = FromDateTime(moment);
                return true;

            case DateTimeOffset moment when kind == UIChartAxisKind.Time:
                number = FromDateTime(moment.DateTime);
                return true;

            // A moment is placed only on a time axis, as its text is: on a value axis it would turn into a number no one wrote.
            case DateTime or DateTimeOffset:
                return false;

            case string text:
                // "NaN", "Infinity" and a number too large to hold parse too, and are no value an axis can place.
                if (double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out number))
                    return double.IsFinite(number);

                // Only a time axis reads text as a moment: on a value axis a date would turn into a number no one wrote.
                // Parsed as an offset so the text's zone is dropped, not shifted into the reader's own zone; a text naming none is
                // read as universal, so the calendar's first and last days parse whatever zone the server sits in.
                if (kind == UIChartAxisKind.Time && DateTimeOffset.TryParse(text, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out DateTimeOffset parsed))
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
