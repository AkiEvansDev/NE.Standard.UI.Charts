using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The words a chart's chrome writes, translated as the framework's own strings are; the client writes them by the same keys.
/// </summary>
public sealed partial class ChartsStrings : IUIStringsSource
{
    /// <summary>What a chart with no rows says in its plot.</summary>
    public const string Empty = "ui.chart.empty";

    /// <summary>What a chart's canvas is announced as where it has no series or rows to name.</summary>
    public const string Chart = "ui.chart.label";

    /// <summary>What a gauge says where it has no reading at all.</summary>
    public const string NoReading = "ui.chart.no-reading";

    /// <summary>A point's tooltip, a sector's too: <c>{series}</c>, <c>{x}</c> and <c>{y}</c>, each already written.</summary>
    public const string Point = "ui.chart.point";

    /// <summary>One series' line in a shared tooltip: <c>{series}</c> and its <c>{value}</c> at the x under the pointer.</summary>
    public const string Reading = "ui.chart.reading";

    /// <summary>A list of names, one joined on at a time: the <c>{list}</c> so far and the <c>{next}</c> name.</summary>
    public const string List = "ui.chart.list";

    /// <inheritdoc/>
    public IReadOnlyDictionary<string, string> English { get; } = new Dictionary<string, string>(StringComparer.Ordinal)
    {
        [Empty] = "Nothing to draw",
        [Chart] = "Chart",
        [NoReading] = "—",
        [Point] = "{series} — {x}: {y}",
        [Reading] = "{series}: {value}",
        [List] = "{list}, {next}"
    }.ToFrozenDictionary(StringComparer.Ordinal);
}
