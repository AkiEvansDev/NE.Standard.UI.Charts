using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Primitives.Text;

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
    /// The number the axis reads the value as (a moment in milliseconds, a name by its place); false when it cannot.
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

                // Only a time axis reads text as a moment: on a value axis a date would be a number no one wrote. Only in the wire's
                // shapes, as the browser's redraw reads it: a text .NET reads in another ("09/29/2026", "Sep 29 2026", a bare clock
                // on today's date) would be placed on the first frame and dropped by the redraw.
                if (kind == UIChartAxisKind.Time && UIWrittenMoment.TryRead(text, out DateTime parsed))
                {
                    number = FromDateTime(parsed);
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
