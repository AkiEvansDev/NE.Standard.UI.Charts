namespace DemoApp.Charts;

/// <summary>
/// The area chart and the bar chart: the same quarters as stacked bands and as bars side by side, a day of requests as one bar an
/// hour, and a dozen servers as bars on their side.
/// </summary>
internal sealed class AreasAndBarsView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.areas-and-bars";

    protected override string Route => AreasAndBarsRoute;

    public override string Title => "Areas and bars";

    protected override string Description
        => "The line chart with its ground filled, and the chart that gives every x a band: bands, bars, a stack, and bars on their side.";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("The same quarters, stacked as bands",
                "An area chart is the line chart with the ground under each series filled. Stacked, the bands stand on one another, so the top edge is the total and each band is what its own series added to it; the y axis takes zero in, since a band drawn from anywhere else lies about its size. A tooltip still says what its own series holds, not the running total.",
                new AreaChartComponent("revenue-stacked")
                    .SetItems(Catalogue.Quarters())
                    .SetX(nameof(Quarter.Name))
                    .SetXAxis(UIChartAxis.Category("Quarter"))
                    .SetYAxis(UIChartAxis.Linear("Revenue, €k", format: "N0"))
                    .AddSeries("eu-west", "Europe West", nameof(Quarter.EuropeWest))
                    .AddSeries("eu-central", "Europe Central", nameof(Quarter.EuropeCentral))
                    .AddSeries("us-east", "US East", nameof(Quarter.UsEast))
                    .SetStacked(true)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("The same quarters, side by side",
                "A bar chart gives every x a band and every series its share of it: three bars per quarter, read against each other. Hover one for its value, and put a series aside at the legend to give the rest the whole band.",
                new BarChartComponent("revenue-bars")
                    .SetItems(Catalogue.Quarters())
                    .SetX(nameof(Quarter.Name))
                    .SetXAxis(UIChartAxis.Category("Quarter"))
                    .SetYAxis(UIChartAxis.Linear("Revenue, €k", format: "N0"))
                    .AddSeries("eu-west", "Europe West", nameof(Quarter.EuropeWest))
                    .AddSeries("eu-central", "Europe Central", nameof(Quarter.EuropeCentral))
                    .AddSeries("us-east", "US East", nameof(Quarter.UsEast))
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("A day of requests as one bar an hour",
                "Stacked: the series are the kinds the rows name, and an hour's parts stand on one another rather than each from zero — a part is as tall as what its own kind carried, the top of the bar is the hour's whole traffic, and a tooltip says the part's own value rather than the running total. Hover a part and it alone is read, the parts under it among the rest that go back.",
                new BarChartComponent("requests-bars")
                    .BindItems(nameof(ChartsController.Requests))
                    .SetX(nameof(Reading.Hour))
                    .SetSeriesPath(nameof(Reading.Metric))
                    .SetValuePath(nameof(Reading.Value))
                    .SetXAxis(UIChartAxis.Linear("Hour", min: -0.5, max: 23.5, format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("Requests", format: "N0"))
                    .SetStacked(true)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("A dozen servers as bars on their side",
                "Horizontal bars: the values run across the box and every x owns a band down it, which is what a long name asks for — the names are read down the left instead of being turned on end under the plot, and the first of them is read first, so it stands highest. Everything else is the same chart: the band, a series' share of it, the stack, the tooltip. A press on a bar reaches a command with the row's key and the series' key.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new BarChartComponent("servers-bars")
                        .SetItems(Catalogue.Servers())
                        .SetX(nameof(Server.Name))
                        .SetXAxis(UIChartAxis.Category())
                        .SetYAxis(UIChartAxis.Linear("Requests a minute", format: "N0"))
                        .AddSeries("requests", "Requests", nameof(Server.Requests))
                        .SetHorizontal(true)
                        .OnPointClick(nameof(ChartsController.BarClicked))
                        .SetLegend(UIChartLegendPlacement.None)
                        .SetMinHeight(UILayoutLength.Absolute(380))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(ChartsController.BarStatus))
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                    )
            )
        ];
}
