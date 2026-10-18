namespace DemoApp.Charts;

/// <summary>
/// What is read against each other: the quarters as bars side by side, a day of requests one bar an hour, a dozen servers as bars
/// on their side and as a cloud of bubbles, and three regions' measures as shapes over spokes.
/// </summary>
internal sealed class SideBySideView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.side-by-side";

    protected override string Route => SideBySideRoute;

    public override string Title => "charts.page.side-by-side";

    protected override string Description
        => "charts.page.side-by-side.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("The same quarters, side by side",
                "A bar chart gives every x a band and every series its share of it: three bars per quarter, read against each other. Hover one for its value, and put a series aside at the legend to give the rest the whole band.",
                new BarChartComponent("revenue-bars")
                    .SetItems(Catalogue.Quarters())
                    .SetX(nameof(Quarter.Name))
                    .SetXAxis(UIChartAxis.Category("charts.quarter"))
                    .SetYAxis(UIChartAxis.Linear("charts.revenue", format: "N0"))
                    .AddSeries("eu-west", "charts.eu-west", nameof(Quarter.EuropeWest))
                    .AddSeries("eu-central", "charts.eu-central", nameof(Quarter.EuropeCentral))
                    .AddSeries("us-east", "charts.us-east", nameof(Quarter.UsEast))
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("A day of requests as one bar an hour",
                "Stacked: the series are the kinds the rows name, and an hour's parts stand on one another rather than each from zero — a part is as tall as what its own kind carried, the top of the bar is the hour's whole traffic, and a tooltip says the part's own value rather than the running total. Hover a part and it alone is read, the parts under it among the rest that go back.",
                new BarChartComponent("requests-bars")
                    .BindItems(nameof(ChartsController.Requests))
                    .SetX(nameof(Reading.Hour))
                    .SetSeriesPath(nameof(Reading.Metric))
                    .SetValuePath(nameof(Reading.Value))
                    .SetXAxis(UIChartAxis.Linear("charts.hour", min: -0.5, max: 23.5, format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("charts.requests", format: "N0"))
                    .SetStacked(true)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("A dozen servers as bars on their side",
                "Horizontal bars: the values run across the box and every x owns a band down it, which is what a long name asks for — the names are read down the left instead of being turned on end under the plot, and the first of them is read first, so it stands highest. Everything else is the same chart: the band, a series' share of it, the stack, the tooltip. It zooms as a line does, down the names — the wheel narrows them, a drag moves along them, a double press gives them all back — so a press on a bar waits out the double press, the bar keeping its pressed look, before it reaches a command with the row's key and the series' key.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new BarChartComponent("servers-bars")
                        .SetItems(Catalogue.Servers())
                        .SetX(nameof(Server.Name))
                        .SetXAxis(UIChartAxis.Category())
                        .SetYAxis(UIChartAxis.Linear("charts.requests-a-minute", format: "N0"))
                        .AddSeries("requests", "charts.requests", nameof(Server.Requests))
                        .SetHorizontal(true)
                        .SetZoomable(true)
                        .OnPointClick(nameof(ChartsController.BarClicked))
                        .SetLegend(UIChartLegendPlacement.None)
                        .SetMinHeight(UILayoutLength.Absolute(380))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(ChartsController.BarStatus))
                        .SetTitleWrap(true)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                    )
            ),
            Example("A dozen servers as a cloud of bubbles",
                "A scatter chart draws its points and no line between them: a row is a place on both axes, and a third value the series names sizes it — by area, so twice the number is twice the ink. Hover one for what it is.",
                new ScatterChartComponent("servers")
                    .SetItems(Catalogue.Servers())
                    .SetX(nameof(Server.Requests))
                    .SetXAxis(UIChartAxis.Linear("charts.requests-a-minute", format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("charts.average-cpu", format: "N0"))
                    .AddSeries("servers", "charts.servers", nameof(Server.Cpu), nameof(Server.Cost))
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(320))
            ),
            Example("Three regions' quarter, measure by measure",
                "A radar chart puts a spoke per row round a centre — the x names it — and closes each series' values along the spokes into a filled shape, so where one series reaches further than another shows at a glance. The y axis is the one scale every spoke shares: here fixed from nothing to a hundred, its ticks the rings. Hover a corner for its value; a press on a legend entry puts a region aside. The measures are keys of the page's words, which the category axis translates, so a spoke's name follows a language switch.",
                new RadarChartComponent("scores")
                    .SetItems(Catalogue.Scores())
                    .SetX(nameof(RegionScore.Measure))
                    .SetXAxis(UIChartAxis.Category(translate: true))
                    .SetYAxis(UIChartAxis.Linear(min: 0, max: 100, format: "N0"))
                    .AddSeries("eu-west", "charts.eu-west", nameof(RegionScore.EuWest))
                    .AddSeries("us-east", "charts.us-east", nameof(RegionScore.UsEast))
                    .AddSeries("ap-south", "charts.asia-south", nameof(RegionScore.ApSouth))
                    .SetLegend(UIChartLegendPlacement.End)
                    .SetMinHeight(UILayoutLength.Absolute(360))
            ),
            Example("One region alone, without marks",
                "A single series reads as a character sheet does: the shape is the profile. Without marks the outline is all there is, and a hover still finds a corner's value.",
                new RadarChartComponent("asia-south")
                    .SetItems(Catalogue.Scores())
                    .SetX(nameof(RegionScore.Measure))
                    .SetXAxis(UIChartAxis.Category(translate: true))
                    .SetYAxis(UIChartAxis.Linear(min: 0, max: 100, format: "N0"))
                    .AddSeries("ap-south", "charts.asia-south", nameof(RegionScore.ApSouth))
                    .SetShowMarkers(false)
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(320))
            )
        ];
}
