namespace DemoApp.Charts;

/// <summary>
/// The controller the pie page runs on: the words in the donut's hole, bound, so a command that changes them is seen reaching the
/// hole as a push.
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
}
