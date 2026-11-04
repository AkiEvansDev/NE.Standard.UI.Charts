namespace DemoApp.Charts;

/// <summary>
/// What is read against each other: the quarters as bars side by side, a day of requests one bar an hour, a dozen servers as bars
/// on their side and as a cloud of bubbles, and three regions' measures as shapes over spokes.
/// </summary>
internal sealed class SideBySideView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.side-by-side";

    protected override string Route => SideBySideRoute;

    protected override string Header => "charts.page.side-by-side";

    protected override string Description
        => "charts.page.side-by-side.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Grouped bar chart",
                "Compares multiple series side by side within each category band; clicking a legend item hides that series and redistributes the band across remaining series.",
                new BarChartComponent("revenue-bars")
                    .SetItems(Catalogue.Quarters())
                    .SetX<Quarter>(static q => q.Name)
                    .SetXAxis(UIChartAxis.Category("charts.quarter"))
                    .SetYAxis(UIChartAxis.Linear("charts.revenue", format: "N0"))
                    .AddSeries<Quarter>("eu-west", "charts.eu-west", static q => q.EuropeWest)
                    .AddSeries<Quarter>("eu-central", "charts.eu-central", static q => q.EuropeCentral)
                    .AddSeries<Quarter>("us-east", "charts.us-east", static q => q.UsEast)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("Stacked bar chart",
                "Stacks data-driven series within each hourly column so column height shows total volume while hovering highlights an individual segment and its value.",
                new BarChartComponent("requests-bars")
                    .BindItems<ChartsController>(static c => c.Requests)
                    .SetX<Reading>(static r => r.Hour)
                    .SetSeriesPath<Reading>(static r => r.Metric)
                    .SetValuePath<Reading>(static r => r.Value)
                    .SetXAxis(UIChartAxis.Linear("charts.hour", min: -0.5, max: 23.5, format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("charts.requests", format: "N0"))
                    .SetStacked(true)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("Horizontal bar chart with zoom and click",
                "Renders horizontal bars for readable category labels, with vertical wheel zoom, drag pan, double-click reset and OnPointClick commands carrying the clicked row and series keys.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new BarChartComponent("servers-bars")
                        .SetItems(Catalogue.Servers())
                        .SetX<Server>(static s => s.Name)
                        .SetXAxis(UIChartAxis.Category())
                        .SetYAxis(UIChartAxis.Linear("charts.requests-a-minute", format: "N0"))
                        .AddSeries<Server>("requests", "charts.requests", static s => s.Requests)
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetZoomable(true)
                        .OnPointClick(nameof(ChartsController.BarClicked))
                        .SetLegend(UIChartLegendPlacement.None)
                        .SetMinHeight(UILayoutLength.Absolute(380))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle<ChartsController>(static c => c.BarStatus)
                        .SetTitleWrap(true)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                    )
            ),
            Example("Bubble scatter chart",
                "Plots X and Y coordinates per item and scales marker area proportionally from a third size property.",
                new ScatterChartComponent("servers")
                    .SetItems(Catalogue.Servers())
                    .SetX<Server>(static s => s.Requests)
                    .SetXAxis(UIChartAxis.Linear("charts.requests-a-minute", format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("charts.average-cpu", format: "N0"))
                    .AddSeries<Server>("servers", "charts.servers", static s => s.Cpu, static s => s.Cost)
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(320))
            ),
            Example("Multi-series radar chart",
                "Compares multiple series across radial spokes sharing a fixed 0–100 scale, with translated spoke labels and interactive legend filtering.",
                new RadarChartComponent("scores")
                    .SetItems(Catalogue.Scores())
                    .SetX<RegionScore>(static r => r.Measure)
                    .SetXAxis(UIChartAxis.Category(translate: true))
                    .SetYAxis(UIChartAxis.Linear(min: 0, max: 100, format: "N0"))
                    .AddSeries<RegionScore>("eu-west", "charts.eu-west", static r => r.EuWest)
                    .AddSeries<RegionScore>("us-east", "charts.us-east", static r => r.UsEast)
                    .AddSeries<RegionScore>("ap-south", "charts.asia-south", static r => r.ApSouth)
                    .SetLegend(UIChartLegendPlacement.End)
                    .SetMinHeight(UILayoutLength.Absolute(360))
            ),
            Example("Single-series radar profile",
                "Renders a single series without vertex markers or legend for a clean profile polygon while preserving vertex hover tooltips.",
                new RadarChartComponent("asia-south")
                    .SetItems(Catalogue.Scores())
                    .SetX<RegionScore>(static r => r.Measure)
                    .SetXAxis(UIChartAxis.Category(translate: true))
                    .SetYAxis(UIChartAxis.Linear(min: 0, max: 100, format: "N0"))
                    .AddSeries<RegionScore>("ap-south", "charts.asia-south", static r => r.ApSouth)
                    .SetShowMarkers(false)
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(320))
            )
        ];
}
