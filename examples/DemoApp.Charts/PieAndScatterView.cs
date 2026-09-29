namespace DemoApp.Charts;

/// <summary>
/// The pie chart and the scatter chart: a turn shared out between one series' points, and a cloud of bubbles with nothing between
/// them. Rows the page holds; the controller holds only the words in the donut's hole.
/// </summary>
internal sealed class PieAndScatterView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.pie-and-scatter";

    protected override string Route => PieAndScatterRoute;

    public override string Title => "charts.page.pie-and-scatter";

    protected override string Description
        => "charts.page.pie-and-scatter.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("A month's revenue shared out by plan",
                "A pie chart shares the turn out between one series' points: a row is a sector, its x names it and its value is its share. There are no axes — the legend names the sectors, and a press there takes one out so the rest spread over the whole turn. A hole in the middle makes it a donut, and the words in the hole are the author's — bound here, so the buttons change them from the controller.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.a-month")
                            .OnClick(nameof(PlansController.ShowMonth))
                        )
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.a-year")
                            .OnClick(nameof(PlansController.ShowYear))
                        )
                    )
                    .AddChild(new PieChartComponent("plans")
                        .SetItems(Catalogue.Plans())
                        .SetX(nameof(PlanShare.Name))
                        .SetXAxis(UIChartAxis.Category())
                        .SetYAxis(UIChartAxis.Linear(format: "N1"))
                        .AddSeries("revenue", "charts.revenue", nameof(PlanShare.Revenue))
                        .SetDonut(0.62)
                        .BindCentreCaption(nameof(PlansController.Total))
                        .SetLegend(UIChartLegendPlacement.End)
                        .SetMinHeight(UILayoutLength.Absolute(300))
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
            )
        ];
}
