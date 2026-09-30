using System;
using System.Collections.Frozen;
using System.Collections.Generic;

namespace NE.Standard.UI.Web.Charts;

public sealed partial class ChartsStrings
{
    /// <inheritdoc/>
    public IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> Translations { get; } = new Dictionary<string, IReadOnlyDictionary<string, string>>(StringComparer.Ordinal)
    {
        ["ru"] = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            [Empty] = "Нет данных",
            [Chart] = "Диаграмма",
            [NoReading] = "—",
            [Point] = "{series} — {x}: {y}",
            [Sector] = "{label} — {value}",
            [Reading] = "{series}: {value}",
            [List] = "{list}, {next}"
        }.ToFrozenDictionary(StringComparer.Ordinal),
        ["zh-Hans"] = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            [Empty] = "没有数据",
            [Chart] = "图表",
            [NoReading] = "无读数",
            [Point] = "{series} — {x}：{y}",
            [Sector] = "{label} — {value}",
            [Reading] = "{series}：{value}",
            [List] = "{list}、{next}"
        }.ToFrozenDictionary(StringComparer.Ordinal)
    }.ToFrozenDictionary(StringComparer.Ordinal);
}
