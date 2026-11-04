namespace DemoApp.Charts;

/// <summary>
/// The small charts: two sparks, and readings on an arc. One of each follows the live readings, so a reading taken here moves a spark
/// and a gauge at once.
/// </summary>
internal sealed class AtAGlanceView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.at-a-glance";

    protected override string Route => AtAGlanceRoute;

    protected override string Header => "charts.page.at-a-glance";

    protected override string Description
        => "charts.page.at-a-glance.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Sparklines",
                "Compact single-series charts without axes, gridlines or legends, sized to sit inline beside metrics or inside table cells. Switch between smooth lines and categorical bars while keeping per-point hover tooltips.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new ButtonComponent()
                        .SetTitle("charts.button.take-reading")
                        .SetHorizontalAlignment(UIAlignment.Start)
                        .OnClick(nameof(ChartsController.TakeReading))
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(32)
                        .SetWrap(true)
                        // A spark beside its own caption, which is how one is read: a shape, not a chart.
                        .AddChild(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Vertical)
                            .SetSpacing(4)
                            .SetMinWidth(UILayoutLength.Absolute(280))
                            .AddChild(new TextComponent()
                                .SetTitle("charts.spark.cpu")
                                .SetTitleType(UITextAppearance.Caption)
                                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                            )
                            .AddChild(new SparklineComponent("spark-load")
                                .BindItems<ChartsController>(static c => c.Samples)
                                .SetX<Sample>(static s => s.Time)
                                .SetXAxis(UIChartAxis.Time())
                                .AddSeries<Sample>("cpu", "charts.cpu", static s => s.Cpu)
                                .SetSmooth(true)
                            )
                        )
                        .AddChild(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Vertical)
                            .SetSpacing(4)
                            .SetMinWidth(UILayoutLength.Absolute(280))
                            .AddChild(new TextComponent()
                                .SetTitle("charts.spark.revenue")
                                .SetTitleType(UITextAppearance.Caption)
                                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                            )
                            .AddChild(new SparklineComponent("spark-revenue")
                                .SetItems(Catalogue.Quarters())
                                .SetX<Quarter>(static q => q.Name)
                                .SetXAxis(UIChartAxis.Category())
                                .AddSeries<Quarter>("eu-west", "charts.eu-west", static q => q.EuropeWest)
                                .SetBars(true)
                            )
                        )
                    )
            ),
            Example("Gauges and threshold bands",
                "Gauges bind a scalar value within a numeric range and highlight threshold bands along the arc. Bound value, title and unit properties update live from the server, while a null value renders an empty-reading state.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(32)
                    .SetWrap(true)
                    .AddChild(new GaugeComponent("gauge-load")
                        .BindValue<ChartsController>(static c => c.Load)
                        .SetRange(0, 100)
                        .AddBand(0, 60, UIThemeColor.FromStyle(UIColorStyle.Success))
                        .AddBand(60, 85, UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .AddBand(85, 100, UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .BindTitle<ChartsController>(static c => c.LoadTitle)
                        .BindUnit<ChartsController>(static c => c.LoadUnit)
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
                    .AddChild(new GaugeComponent("gauge-disk")
                        .SetValue(61)
                        .SetRange(0, 100)
                        .AddBand(80, 100, UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetTitle("charts.disk-eu-west")
                        .SetFormat("N0")
                        .SetUnit("%")
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
                    .AddChild(new GaugeComponent("gauge-outside")
                        .SetRange(-20, 40)
                        .SetTitle("charts.outside-asia-south")
                        .SetUnit(" °C")
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
            )
        ];
}
