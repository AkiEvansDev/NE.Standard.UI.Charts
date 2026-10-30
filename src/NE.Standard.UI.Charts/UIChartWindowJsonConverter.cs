using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Charts;

/// <summary>
/// Writes a window as its two ends and reads one back only with both finite and the near end before the far one, so a page's write of
/// any other is refused before the controller or a window-change command sees it.
/// </summary>
public sealed class UIChartWindowJsonConverter : JsonConverter<UIChartWindow>
{
    private const string FromName = "from";
    private const string ToName = "to";

    /// <inheritdoc/>
    public override UIChartWindow Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartObject)
            throw new JsonException("A chart's window is an object of two ends.");

        double? from = null;
        double? to = null;

        while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
        {
            if (reader.TokenType != JsonTokenType.PropertyName)
                throw new JsonException("A chart's window holds only its two ends.");

            var name = reader.GetString();

            if (!reader.Read() || reader.TokenType != JsonTokenType.Number)
                throw new JsonException("A chart's window's end is a number.");

            if (string.Equals(name, FromName, StringComparison.OrdinalIgnoreCase))
                from = reader.GetDouble();
            else if (string.Equals(name, ToName, StringComparison.OrdinalIgnoreCase))
                to = reader.GetDouble();
            else
                throw new JsonException($"A chart's window has no '{name}'.");
        }

        // A window no gesture leaves: ends missing, past a double's reach, or the far one not past the near one.
        if (from is not double near || to is not double far || !double.IsFinite(near) || !double.IsFinite(far) || far <= near)
            throw new JsonException("A chart's window needs two finite ends, the near one first.");

        return new UIChartWindow(near, far);
    }

    /// <inheritdoc/>
    public override void Write(Utf8JsonWriter writer, UIChartWindow value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);

        writer.WriteStartObject();
        writer.WriteNumber(FromName, value.From);
        writer.WriteNumber(ToName, value.To);
        writer.WriteEndObject();
    }
}
