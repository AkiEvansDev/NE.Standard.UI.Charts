using System;
using System.Globalization;
using System.Linq;

namespace DemoApp.Charts;

/// <summary>
/// The controller the pages with live data run on: the readings the live chart draws, the requests the long-form charts draw,
/// and the commands that append and change a point so a patch can be watched moving one.
/// </summary>
internal sealed partial class ChartsController : UIControllerBase
{
    /// <summary>How many readings the live chart keeps; a new one pushes the oldest off the far end.</summary>
    private const int Window = 40;

    private int _taken = Window;

    public ChartsController()
    {
        ShowLoad();
    }

    /// <summary>A reading a minute, which the buttons add to and change.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<Sample> Samples { get; } = [.. Catalogue.Samples(Window)];

    /// <summary>A day of requests by kind: one row per hour and kind, and the chart's series are the kinds it meets.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<Reading> Requests { get; } = [.. Catalogue.Requests()];

    /// <summary>A bound collection with nothing in it, so the empty chart's own words can be read.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<Sample> Nothing { get; } = [];

    /// <summary>What the live chart's page notes under it: a word with the reading's numbers, so it switches with the page.</summary>
    [RecursiveMember]
    public partial UIPhrase? Status { get; set; } = new("charts.status.live");

    /// <summary>What the bars page notes under its chart of servers.</summary>
    [RecursiveMember]
    public partial UIPhrase? BarStatus { get; set; } = new("charts.status.bar-hint");

    /// <summary>
    /// The stretch of the clock the live chart shows. Bound both ways: the viewer's wheel and drag write it, and the button below
    /// sets it from here, which is how a controller moves a chart.
    /// </summary>
    [RecursiveMember]
    public partial UIChartWindow? VisibleRange { get; set; }

    /// <summary>The last reading's processor load, which the gauge shows; a reading moves its arc.</summary>
    [RecursiveMember]
    public partial double Load { get; set; }

    /// <summary>The gauge's caption, which names the reading's minute: a bound caption the server pushes with every reading.</summary>
    [RecursiveMember]
    public partial UIPhrase? LoadCaption { get; set; }

    /// <summary>The gauge's unit, which says whether the load rose or fell since the reading before: a bound unit, pushed as the caption is.</summary>
    [RecursiveMember]
    public partial UIPhrase? LoadUnit { get; set; }

    /// <summary>A reading arrives: the chart draws the new point, and the oldest falls off the far end.</summary>
    [UICommand]
    public void TakeReading()
    {
        Sample last = Samples[^1];

        Samples.Add(Catalogue.NextSample(_taken++, last.Time));

        if (Samples.Count > Window)
            Samples.RemoveAt(0);

        ShowLoad();

        Status = UIPhrase.Of("charts.status.reading", ("time", Clock(Samples[^1].Time)), ("cpu", Percent(Samples[^1].Cpu)), ("memory", Percent(Samples[^1].Memory)));
    }

    /// <summary>The gauge follows the last reading: its arc, the minute its caption names, and the way its unit says it went.</summary>
    private void ShowLoad()
    {
        Sample last = Samples[^1];

        Load = last.Cpu;
        LoadCaption = UIPhrase.Of("charts.processor-at", ("time", Clock(last.Time)));
        LoadUnit = new UIPhrase(Samples.Count > 1 && last.Cpu < Samples[^2].Cpu ? "charts.unit.falling" : "charts.unit.rising");
    }

    /// <summary>A minute as the status lines write it.</summary>
    private static string Clock(DateTime time)
        => time.ToString("HH:mm", CultureInfo.InvariantCulture);

    /// <summary>A load as the status lines write it, one decimal.</summary>
    private static string Percent(double value)
        => value.ToString("N1", CultureInfo.InvariantCulture);

    /// <summary>
    /// The viewer moved the window along the clock. The range has reached the controller before this runs, so the line only reads
    /// it back — a windowed source would ask its store for the detail this stretch deserves.
    /// </summary>
    [UICommand]
    public void WindowChanged()
    {
        if (VisibleRange is not UIChartWindow view)
        {
            Status = UIPhrase.Of("charts.status.showing-all", ("total", Samples.Count));
            return;
        }

        var inside = Samples.Count(sample => sample.Time >= view.FromTime && sample.Time <= view.ToTime);

        Status = UIPhrase.Of("charts.status.showing", ("from", Clock(view.FromTime)), ("to", Clock(view.ToTime)), ("inside", inside), ("total", Samples.Count));
    }

    /// <summary>The other direction: the controller sets the window and the chart moves to it.</summary>
    [UICommand]
    public void ShowLastTenMinutes()
    {
        DateTime last = Samples[^1].Time;

        VisibleRange = UIChartWindow.Between(last.AddMinutes(-10), last);
        Status = new UIPhrase("charts.status.last-ten-minutes");
    }

    /// <summary>
    /// A point was clicked. The chart hands over the key of the row the point was read from and the key of its series, in that
    /// order, so the controller can look the row up itself.
    /// </summary>
    [UICommand]
    public void PointClicked(string point, string series)
    {
        Sample? sample = Samples.FirstOrDefault(current => string.Equals(current.Id, point, StringComparison.Ordinal));

        Status = sample is null
            ? UIPhrase.Of("charts.status.point-unknown", ("series", SeriesName(series)), ("point", point))
            : UIPhrase.Of("charts.status.point", ("series", SeriesName(series)), ("time", Clock(sample.Time)), ("cpu", Percent(sample.Cpu)), ("memory", Percent(sample.Memory)));
    }

    /// <summary>A series by the demo's word for it; one the demo has no word for is named by the key the chart sent.</summary>
    private static object SeriesName(string series)
        => series is "cpu" or "memory" or "requests" ? new UIPhrase(ChartsDemoWords.KeyPrefix + series) : series;

    /// <summary>The same event from a chart of bars, where a press lands on the bar rather than on a mark.</summary>
    [UICommand]
    public void BarClicked(string point, string series)
        => BarStatus = UIPhrase.Of("charts.status.bar", ("series", SeriesName(series)), ("point", point));

    /// <summary>The last reading changes: one point moves, and nothing else is redrawn.</summary>
    [UICommand]
    public void ChangeLastReading()
    {
        Sample last = Samples[^1];

        last.Cpu = last.Cpu > 50 ? 12 : 94;
        ShowLoad();

        Status = UIPhrase.Of("charts.status.changed", ("time", Clock(last.Time)), ("cpu", Percent(last.Cpu)));
    }
}
