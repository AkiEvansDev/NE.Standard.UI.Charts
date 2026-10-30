namespace DemoApp.Charts;

/// <summary>
/// What a whole is made of: a turn and a bar shared out between one series' points. Rows the page holds; the controller holds only
/// the words in the donut's hole and the drive's size.
/// </summary>
internal sealed class PartsView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.parts";

    protected override string Route => PartsRoute;

    protected override string Header => "charts.page.parts";

    protected override string Description
        => "charts.page.parts.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Donut chart with bound centre caption",
                "Divides a series across proportional sectors with an optional donut cutout, bound centre caption, translated category labels and interactive legend toggling.",
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
                        .BindCentreCaption<PlansController>(static c => c.Total)
                        .SetLegend(UIChartLegendPlacement.End)
                        .SetShowLegendValues(true)
                        .SetMinHeight(UILayoutLength.Absolute(300))
                    )
            ),
            Example("Share bar with bound capacity",
                "Lays segments along a single bar against an optional bound total, exposing remaining capacity as a labelled track entry and showing values and percentages in the legend.",
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
                        .BindTotal<PlansController>(static c => c.DriveSize)
                        .SetTitle("charts.storage.caption")
                        .SetRemainderCaption("charts.storage.free")
                        .SetShowLegendValues(true)
                    )
            )
        ];
}
