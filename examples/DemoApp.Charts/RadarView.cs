namespace DemoApp.Charts;

/// <summary>
/// The radar chart: spokes round a centre, one per row, and each series closed into a shape over them. Rows the page holds, so the
/// page has no controller.
/// </summary>
internal sealed class RadarView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.radar";

    protected override string Route => RadarRoute;

    public override string Title => "charts.page.radar";

    protected override string Description
        => "charts.page.radar.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Three regions' quarter, measure by measure",
                "A radar chart puts a spoke per row round a centre — the x names it — and closes each series' values along the spokes into a filled shape, so where one series reaches further than another shows at a glance. The y axis is the one scale every spoke shares: here fixed from nothing to a hundred, its ticks the rings. Hover a corner for its value; a press on a legend entry puts a region aside.",
                new RadarChartComponent("scores")
                    .SetItems(Catalogue.Scores())
                    .SetX(nameof(RegionScore.Measure))
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
                    .SetYAxis(UIChartAxis.Linear(min: 0, max: 100, format: "N0"))
                    .AddSeries("ap-south", "charts.asia-south", nameof(RegionScore.ApSouth))
                    .SetShowMarkers(false)
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(320))
            )
        ];
}
