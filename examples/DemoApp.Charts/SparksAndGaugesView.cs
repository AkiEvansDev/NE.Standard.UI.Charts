namespace DemoApp.Charts;

/// <summary>
/// The small charts: two sparks, and two readings on an arc. One of each follows the live readings, so a reading taken here moves
/// a spark and a gauge at once.
/// </summary>
internal sealed class SparksAndGaugesView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.sparks-and-gauges";

    protected override string Route => SparksAndGaugesRoute;

    public override string Title => "charts.page.sparks-and-gauges";

    protected override string Description
        => "charts.page.sparks-and-gauges.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Sparks, for a cell or the corner of a tile",
                "A sparkline is one series with nothing around it: no axes, no grid, no legend, a line of text high. It is read as a shape rather than for its numbers, so the marks stay out of the way — a point still says what it is on hover. Bars where the values are counts, a line where they are a level.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new ButtonComponent()
                        .SetTitle("charts.button.take-reading")
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
                                .BindItems(nameof(ChartsController.Samples))
                                .SetX(nameof(Sample.Time))
                                .SetXAxis(UIChartAxis.Time())
                                .AddSeries("cpu", "charts.cpu", nameof(Sample.Cpu))
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
                                .SetX(nameof(Quarter.Name))
                                .SetXAxis(UIChartAxis.Category())
                                .AddSeries("eu-west", "charts.eu-west", nameof(Quarter.EuropeWest))
                                .SetBars(true)
                            )
                        )
                    )
            ),
            Example("A reading on an arc",
                "A gauge is the one chart that binds a value rather than a collection: the reading, the range it is read in, and the bands that say what it means. Its arc is a whole circle the stylesheet cuts down to the reading, so a value the server pushes moves it without a line of script — take a reading above and watch it follow, the caption naming the reading's minute and the unit whether the load rose or fell, both bound and pushed with it. A gauge with no reading yet says so over an empty arc.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(32)
                    .SetWrap(true)
                    .AddChild(new GaugeComponent("gauge-load")
                        .BindValue(nameof(ChartsController.Load))
                        .SetRange(0, 100)
                        .AddBand(0, 60, UIThemeColor.FromStyle(UIColorStyle.Success))
                        .AddBand(60, 85, UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .AddBand(85, 100, UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .BindCaption(nameof(ChartsController.LoadCaption))
                        .BindUnit(nameof(ChartsController.LoadUnit))
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
                    .AddChild(new GaugeComponent("gauge-disk")
                        .SetValue(61)
                        .SetRange(0, 100)
                        .AddBand(80, 100, UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetCaption("charts.disk-eu-west")
                        .SetFormat("N0")
                        .SetUnit("%")
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
                    .AddChild(new GaugeComponent("gauge-outside")
                        .SetRange(-20, 40)
                        .SetCaption("charts.outside-asia-south")
                        .SetUnit(" °C")
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
            )
        ];
}
