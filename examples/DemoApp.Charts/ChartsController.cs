using System;
using System.Globalization;
using System.Linq;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;

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
        Load = Samples[^1].Cpu;
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

    [RecursiveMember]
    public partial string Status { get; set; } = "The live chart holds forty readings. Take one and the line follows it.";

    /// <summary>What the bars page notes under its chart of countries.</summary>
    [RecursiveMember]
    public partial string BarStatus { get; set; } = "Press a bar for its value.";

    /// <summary>
    /// The stretch of the clock the live chart shows. Bound both ways: the viewer's wheel and drag write it, and the button below
    /// sets it from here, which is how a controller moves a chart.
    /// </summary>
    [RecursiveMember]
    public partial UIChartWindow? VisibleRange { get; set; }

    /// <summary>The last reading's processor load, which the gauge shows; a reading moves its arc.</summary>
    [RecursiveMember]
    public partial double Load { get; set; }

    /// <summary>A reading arrives: the chart draws the new point, and the oldest falls off the far end.</summary>
    [UICommand]
    public void TakeReading()
    {
        Sample last = Samples[^1];

        Samples.Add(Catalogue.NextSample(_taken++, last.Time));

        if (Samples.Count > Window)
            Samples.RemoveAt(0);

        Load = Samples[^1].Cpu;

        Status = string.Create(CultureInfo.InvariantCulture, $"Reading at {Samples[^1].Time:HH:mm}: CPU {Samples[^1].Cpu:N1}%, memory {Samples[^1].Memory:N1}%.");
    }

    /// <summary>
    /// The viewer moved the window along the clock. The range has reached the controller before this runs, so the line only reads
    /// it back — a windowed source would ask its store for the detail this stretch deserves.
    /// </summary>
    [UICommand]
    public void WindowChanged()
    {
        if (VisibleRange is not UIChartWindow view)
        {
            Status = string.Create(CultureInfo.InvariantCulture, $"Showing all {Samples.Count} readings.");
            return;
        }

        var inside = Samples.Count(sample => sample.Time >= view.FromTime && sample.Time <= view.ToTime);

        Status = string.Create(CultureInfo.InvariantCulture, $"Showing {view.FromTime:HH:mm} to {view.ToTime:HH:mm}: {inside} of {Samples.Count} readings.");
    }

    /// <summary>The other direction: the controller sets the window and the chart moves to it.</summary>
    [UICommand]
    public void ShowLastTenMinutes()
    {
        DateTime last = Samples[^1].Time;

        VisibleRange = UIChartWindow.Between(last.AddMinutes(-10), last);
        Status = "The last ten minutes, set by the controller rather than by the wheel.";
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
            ? $"A point of {series} was clicked: {point}."
            : string.Create(CultureInfo.InvariantCulture, $"{series} at {sample.Time:HH:mm}: CPU {sample.Cpu:N1}%, memory {sample.Memory:N1}%.");
    }

    /// <summary>The same event from a chart of bars, where a press lands on the bar rather than on a mark.</summary>
    [UICommand]
    public void BarClicked(string point, string series)
        => BarStatus = $"The {series} bar of {point} was pressed.";

    /// <summary>The last reading changes: one point moves, and nothing else is redrawn.</summary>
    [UICommand]
    public void ChangeLastReading()
    {
        Sample last = Samples[^1];

        last.Cpu = last.Cpu > 50 ? 12 : 94;
        Load = last.Cpu;

        Status = string.Create(CultureInfo.InvariantCulture, $"The reading at {last.Time:HH:mm} now says CPU {last.Cpu:N1}%.");
    }
}
