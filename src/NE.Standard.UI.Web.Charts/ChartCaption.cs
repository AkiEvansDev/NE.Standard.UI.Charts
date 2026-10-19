using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Web.Charts;

/// <summary>A chart's caption — an axis's, a series', a share bar's rest — as the server draws it and the page reads it.</summary>
internal static class ChartCaption
{
    /// <summary>The caption where it has words — a key, or an author's text that is not blank — else null.</summary>
    public static UIPhrase? Words(UIPhrase? caption)
        => UIPhrase.HasWords(caption) ? caption : null;

    /// <summary>
    /// The caption as the client reads it, which translates it again at every language switch: an author's text as the plain string it
    /// looks up, a key as its phrase, arguments and all; null where it has no words.
    /// </summary>
    public static object? Wire(UIPhrase? caption)
        => UIPhrase.AsValue(Words(caption));
}
