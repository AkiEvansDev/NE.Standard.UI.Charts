namespace DemoApp.Charts;

/// <summary>
/// The controller the pie page runs on: the words in the donut's hole and the drive the share bar shares out, bound, so a command that
/// changes them is seen reaching the chart as a push.
/// </summary>
internal sealed partial class PlansController : UIControllerBase
{
    /// <summary>The total the hole names: a month's revenue or a year's, as the buttons above the donut choose.</summary>
    [RecursiveMember]
    public partial UIPhrase? Total { get; set; } = new("charts.revenue-a-month");

    /// <summary>The hole names a month's revenue.</summary>
    [UICommand]
    public void ShowMonth()
        => Total = new UIPhrase("charts.revenue-a-month");

    /// <summary>The hole names a year's revenue.</summary>
    [UICommand]
    public void ShowYear()
        => Total = new UIPhrase("charts.revenue-a-year");

    /// <summary>The size of the drive the share bar shares out, in gigabytes: what the files leave of it is its empty track.</summary>
    [RecursiveMember]
    public partial double? DriveSize { get; set; } = 512;

    /// <summary>The files stand on a 512 GB drive.</summary>
    [UICommand]
    public void ShowSmallDrive()
        => DriveSize = 512;

    /// <summary>The files stand on a 1 TB drive.</summary>
    [UICommand]
    public void ShowLargeDrive()
        => DriveSize = 1024;
}
