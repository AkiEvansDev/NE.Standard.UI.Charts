using System;
using System.Collections.Generic;

namespace DemoApp.Charts;

/// <summary>
/// The demo's words: its pages' names, the captions it gives its series, axes and gauges, its buttons and its status lines, on
/// keys of the demo's own prefix, in English and in a second language; the framework's, the code field's and the charts' own words
/// are the tables they ship.
/// </summary>
internal static class ChartsDemoWords
{
    /// <summary>What every key of the demo starts with; every other string is content (<c>KeyPrefixes</c>).</summary>
    public const string KeyPrefix = "charts.";

    private static readonly Dictionary<string, string> English = new(StringComparer.Ordinal)
    {
        ["charts.eu-west"] = "Europe West",
        ["charts.eu-central"] = "Europe Central",
        ["charts.us-east"] = "US East",
        ["charts.asia-south"] = "Asia South",
        ["charts.requests"] = "Requests",
        ["charts.requests-a-minute"] = "Requests a minute",
        ["charts.cpu"] = "CPU",
        ["charts.average-cpu"] = "Average CPU, %",
        ["charts.memory"] = "Memory",
        ["charts.revenue"] = "Revenue, €k",
        ["charts.revenue-a-month"] = "€68.9k a month",
        ["charts.servers"] = "Servers",
        ["charts.quarter"] = "Quarter",
        ["charts.time"] = "Time",
        ["charts.percent"] = "Percent",
        ["charts.hour"] = "Hour",
        ["charts.disk-eu-west"] = "Disk used in Europe West",
        ["charts.outside-asia-south"] = "Outside Asia South, no sensor yet",
        ["charts.revenue-a-year"] = "€827k a year",
        ["charts.processor-at"] = "Processor at {time}",
        ["charts.unit.rising"] = "% and rising",
        ["charts.unit.falling"] = "% and falling",
        ["charts.spark.cpu"] = "CPU of api-eu-west-1, the last forty readings",
        ["charts.spark.revenue"] = "Revenue in Europe West, by quarter",

        ["charts.button.take-reading"] = "Take a reading",
        ["charts.button.change-last"] = "Change the last one",
        ["charts.button.last-ten-minutes"] = "Show the last ten minutes",
        ["charts.button.a-month"] = "A month",
        ["charts.button.a-year"] = "A year",
        ["charts.status.live"] = "The live chart holds forty readings. Take one and the line follows it.",
        ["charts.status.reading"] = "Reading at {time}: CPU {cpu}%, memory {memory}%.",
        ["charts.status.showing-all"] = "Showing all {total} readings.",
        ["charts.status.showing"] = "Showing {from} to {to}: {inside} of {total} readings.",
        ["charts.status.last-ten-minutes"] = "The last ten minutes, set by the controller rather than by the wheel.",
        ["charts.status.point"] = "{series} at {time}: CPU {cpu}%, memory {memory}%.",
        ["charts.status.point-unknown"] = "A point of {series} was clicked: {point}.",
        ["charts.status.changed"] = "The reading at {time} now says CPU {cpu}%.",
        ["charts.status.bar-hint"] = "Press a bar for its value.",
        ["charts.status.bar"] = "A bar was pressed: {series} of {point}.",

        ["charts.page.lines"] = "Lines",
        ["charts.page.lines.description"] = "SVG the server writes and the browser keeps: a point is an item of a keyed collection, so a reading that arrives moves one point.",
        ["charts.page.areas-and-bars"] = "Areas and bars",
        ["charts.page.areas-and-bars.description"] = "The line chart with its ground filled, and the chart that gives every x a band: bands, bars, a stack, and bars on their side.",
        ["charts.page.pie-and-scatter"] = "Pie and scatter",
        ["charts.page.pie-and-scatter.description"] = "The two charts without a line: a turn shared out between one series' points, and a cloud of points sized by a third value.",
        ["charts.page.radar"] = "Radar",
        ["charts.page.radar.description"] = "Series as shapes over spokes: a row names a spoke, and each series' values along them close into an outline to read against the others.",
        ["charts.page.sparks-and-gauges"] = "Sparks and gauges",
        ["charts.page.sparks-and-gauges.description"] = "The charts that stand in a cell or the corner of a tile; take a reading and watch the load's spark and its arc follow it.",
        ["charts.code"] = "Code",
        ["charts.copy"] = "Copy"
    };

    // The demo's second language, whole for its own words, so the missing-word report names only a real gap (DemoWordsCoverageTests).
    private static readonly Dictionary<string, string> Chinese = new(StringComparer.Ordinal)
    {
        ["charts.eu-west"] = "西欧",
        ["charts.eu-central"] = "中欧",
        ["charts.us-east"] = "美国东部",
        ["charts.asia-south"] = "南亚",
        ["charts.requests"] = "请求",
        ["charts.requests-a-minute"] = "每分钟请求数",
        ["charts.cpu"] = "处理器",
        ["charts.average-cpu"] = "平均处理器占用，%",
        ["charts.memory"] = "内存",
        ["charts.revenue"] = "收入（千欧元）",
        ["charts.revenue-a-month"] = "每月 6.89 万欧元",
        ["charts.servers"] = "服务器",
        ["charts.quarter"] = "季度",
        ["charts.time"] = "时间",
        ["charts.percent"] = "百分比",
        ["charts.hour"] = "小时",
        ["charts.disk-eu-west"] = "西欧磁盘用量",
        ["charts.outside-asia-south"] = "南亚室外，尚无传感器",
        ["charts.revenue-a-year"] = "每年 82.7 万欧元",
        ["charts.processor-at"] = "{time} 的处理器",
        ["charts.unit.rising"] = "%，上升中",
        ["charts.unit.falling"] = "%，下降中",
        ["charts.spark.cpu"] = "api-eu-west-1 的处理器占用，最近四十个读数",
        ["charts.spark.revenue"] = "西欧收入，按季度",

        ["charts.button.take-reading"] = "读取一次",
        ["charts.button.change-last"] = "修改最后一个",
        ["charts.button.last-ten-minutes"] = "显示最近十分钟",
        ["charts.button.a-month"] = "每月",
        ["charts.button.a-year"] = "每年",
        ["charts.status.live"] = "实时图表保留四十个读数。读取一次，折线随之延伸。",
        ["charts.status.reading"] = "{time} 的读数：处理器 {cpu}%，内存 {memory}%。",
        ["charts.status.showing-all"] = "显示全部 {total} 个读数。",
        ["charts.status.showing"] = "显示 {from} 至 {to}：{total} 个读数中的 {inside} 个。",
        ["charts.status.last-ten-minutes"] = "最近十分钟，由控制器而非滚轮设定。",
        ["charts.status.point"] = "{time} 的{series}：处理器 {cpu}%，内存 {memory}%。",
        ["charts.status.point-unknown"] = "点击了{series}的一个点：{point}。",
        ["charts.status.changed"] = "{time} 的读数现在为处理器 {cpu}%。",
        ["charts.status.bar-hint"] = "按下柱形查看其数值。",
        ["charts.status.bar"] = "按下了一个柱形：{point} 的{series}。",

        ["charts.page.lines"] = "折线图",
        ["charts.page.lines.description"] = "由服务器写出、浏览器保留的 SVG：每个点都是带键集合中的一项，因此新到的一个读数只移动一个点。",
        ["charts.page.areas-and-bars"] = "面积图与柱状图",
        ["charts.page.areas-and-bars.description"] = "填满下方区域的折线图，以及为每个 x 分出一个区间的图表：面积带、柱形、堆叠，以及横放的柱形。",
        ["charts.page.pie-and-scatter"] = "饼图与散点图",
        ["charts.page.pie-and-scatter.description"] = "两种没有连线的图表：把一整圈分给一个系列的各个点，以及按第三个值确定大小的点云。",
        ["charts.page.radar"] = "雷达图",
        ["charts.page.radar.description"] = "以辐条上的形状表示系列：每一行命名一根辐条，每个系列沿辐条的值闭合成轮廓，与其他系列对照阅读。",
        ["charts.page.sparks-and-gauges"] = "迷你图与仪表",
        ["charts.page.sparks-and-gauges.description"] = "放在单元格或卡片一角的图表；取一个读数，看负载的迷你图和弧线随之变化。",
        ["charts.code"] = "代码",
        ["charts.copy"] = "复制"
    };

    public static IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> Build()
        => new Dictionary<string, IReadOnlyDictionary<string, string>>(StringComparer.Ordinal) { ["en"] = English, ["zh-Hans"] = Chinese };
}
