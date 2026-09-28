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
    /// <summary>What a chart with no rows says in its plot.</summary>
    public const string Empty = "ui.chart.empty";

    /// <summary>What a chart's canvas is announced as where it has no series or rows to name.</summary>
    public const string Chart = "ui.chart.label";

    /// <summary>What a gauge says where it has no reading at all.</summary>
    public const string NoReading = "ui.chart.no-reading";

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, string> English { get; } = new Dictionary<string, string>(StringComparer.Ordinal)
    {
        [Empty] = "Nothing to draw",
        [Chart] = "Chart",
        [NoReading] = "—"
    }.ToFrozenDictionary(StringComparer.Ordinal);
}
