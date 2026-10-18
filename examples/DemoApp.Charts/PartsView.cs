namespace DemoApp.Charts;

/// <summary>
/// What a whole is made of: a turn and a bar shared out between one series' points. Rows the page holds; the controller holds only
/// the words in the donut's hole and the drive's size.
/// </summary>
internal sealed class PartsView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.parts";

    protected override string Route => PartsRoute;

    public override string Title => "charts.page.parts";

    protected override string Description
        => "charts.page.parts.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("A month's revenue shared out by plan",
                "A pie chart shares the turn out between one series' points: a row is a sector, its x names it and its value is its share. There are no axes — the legend names the sectors, and a press there takes one out so the rest spread over the whole turn. A hole in the middle makes it a donut, and the words in the hole are the author's — bound here, so the buttons change them from the controller. The plans' names are keys of the page's words, which the category axis translates — switch the language and the legend and the tooltips follow.",
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
                        .SetXAxis(UIChartAxis.Category(translate: true))
                        .SetYAxis(UIChartAxis.Linear(format: "N1"))
                        .AddSeries("revenue", "charts.revenue", nameof(PlanShare.Revenue))
                        .SetDonut(0.62)
                        .BindCentreCaption(nameof(PlansController.Total))
                        .SetLegend(UIChartLegendPlacement.End)
                        .SetShowLegendValues(true)
                        .SetMinHeight(UILayoutLength.Absolute(300))
                    )
            ),
            Example("A drive's storage along one bar",
                "A share bar lays one series' points along a single bar: a row is a part, its x names it and its value is its length. A total the parts fall short of leaves the rest of it as the bar's empty track, and the legend names that too — bound here, so the buttons put the same files on a bigger drive. With legend values on, the legend is a table of each part's value and its share of the whole; a press on an entry takes the part out, and the rest of the drive grows by it.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.512-gb")
                            .OnClick(nameof(PlansController.ShowSmallDrive))
                        )
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.1-tb")
                            .OnClick(nameof(PlansController.ShowLargeDrive))
                        )
                    )
                    .AddChild(new ShareBarComponent("storage")
                        .SetItems(Catalogue.Storage())
                        .SetX(nameof(StorageUse.Name))
                        .SetXAxis(UIChartAxis.Category(translate: true))
                        .SetYAxis(UIChartAxis.Linear(format: "N1"))
                        .AddSeries("size", "charts.storage", nameof(StorageUse.Size))
                        .BindTotal(nameof(PlansController.DriveSize))
                        .SetCaption("charts.storage.caption")
                        .SetRemainderCaption("charts.storage.free")
                        .SetShowLegendValues(true)
                    )
            )
        ];
}
