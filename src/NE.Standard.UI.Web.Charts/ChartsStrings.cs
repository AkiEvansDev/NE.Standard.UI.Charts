using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The words a chart's own chrome writes, translated through the application's localization source like the framework's own
/// strings. The client writes the same words by the same keys.
/// </summary>
public sealed class ChartsStrings : IUIStringsSource
{
    public const string Empty = "ui.chart.empty";

    /// <summary>What a gauge says where it has no reading at all.</summary>
    public const string NoReading = "ui.chart.no-reading";

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, string> English { get; } = new Dictionary<string, string>(StringComparer.Ordinal)
    {
        [Empty] = "Nothing to draw",
        [NoReading] = "—"
    }.ToFrozenDictionary(StringComparer.Ordinal);
}
