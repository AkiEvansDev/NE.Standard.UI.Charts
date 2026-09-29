namespace DemoApp.Charts;

/// <summary>
/// The line chart: over names, over a clock with the readings that arrive, over series the data names, and with nothing in it.
/// </summary>
internal sealed class LinesView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.lines";

    protected override string Route => LinesRoute;

    public override string Title => "charts.page.lines";

    protected override string Description
        => "charts.page.lines.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Eight quarters the page holds",
                "A chart of rows the page holds whole: the x axis is a name rather than a number, and each series names the row property it reads. The ranges follow the data, rounded outward to the axis's own step, and the labels are written in the page's culture.",
                new LineChartComponent("revenue")
                    .SetItems(Catalogue.Quarters())
                    .SetX(nameof(Quarter.Name))
                    .SetXAxis(UIChartAxis.Category("charts.quarter"))
                    .SetYAxis(UIChartAxis.Linear("charts.revenue", format: "N0"))
                    .AddSeries("eu-west", "charts.eu-west", nameof(Quarter.EuropeWest))
                    .AddSeries("eu-central", "charts.eu-central", nameof(Quarter.EuropeCentral))
                    .AddSeries("us-east", "charts.us-east", nameof(Quarter.UsEast))
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("Forty readings, and the ones that arrive",
                "A bound collection over a clock: the server drew the first frame, and every change after it reaches the browser as values through the chart's sink. Take a reading and the line follows it; change the last one and that point alone moves. The wheel narrows the stretch of the clock on show about the pointer, a drag moves it, and a double press gives the whole of it back — the window is bound, so the line under the chart is the controller reading what the viewer settled on, and the button sets it the other way round. Zoomed in, the chart follows the latest reading as it arrives.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(8)
                        .SetWrap(true)
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.take-reading")
                            .OnClick(nameof(ChartsController.TakeReading))
                        )
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.change-last")
                            .OnClick(nameof(ChartsController.ChangeLastReading))
                        )
                        .AddChild(new ButtonComponent()
                            .SetTitle("charts.button.last-ten-minutes")
                            .OnClick(nameof(ChartsController.ShowLastTenMinutes))
                        )
                    )
                    .AddChild(new LineChartComponent("load")
                        .BindItems(nameof(ChartsController.Samples))
                        .SetX(nameof(Sample.Time))
                        .SetXAxis(UIChartAxis.Time("charts.time", format: "HH:mm"))
                        .SetYAxis(UIChartAxis.Linear("charts.percent", min: 0, max: 100, format: "N0"))
                        .AddSeries("cpu", "charts.cpu", nameof(Sample.Cpu))
                        .AddSeries("memory", "charts.memory", nameof(Sample.Memory))
                        .SetSmooth(true)
                        .SetShowMarkers(false)
                        .SetZoomable(true)
                        .SetFollowLatest(true)
                        .BindVisibleRange(nameof(ChartsController.VisibleRange))
                        .OnWindowChange(nameof(ChartsController.WindowChanged))
                        .OnPointClick(nameof(ChartsController.PointClicked))
                        .SetMinHeight(UILayoutLength.Absolute(280))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(ChartsController.Status))
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                    )
            ),
            Example("A day of requests, whose series are the data's own",
                "The same component read the other way round: the chart names the row property that says which series a row belongs to, so the series are whatever the rows name — a kind that appears draws a line of its own, in the next colour of the theme's run. Stepped, because a count belongs to its hour rather than to the slope between two of them; the step is centred on the hour it holds, so a point's own mark sits in the middle of its step instead of on a corner. One tooltip names every kind at the hour under the pointer, with a line marking which hour that is, rather than one tooltip per point.",
                new LineChartComponent("requests")
                    .BindItems(nameof(ChartsController.Requests))
                    .SetX(nameof(Reading.Hour))
                    .SetSeriesPath(nameof(Reading.Metric))
                    .SetValuePath(nameof(Reading.Value))
                    .SetXAxis(UIChartAxis.Linear("charts.hour", min: 0, max: 23, format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("charts.requests", format: "N0"))
                    .SetStepped(true)
                    .SetSharedTooltip(true)
                    .SetLegend(UIChartLegendPlacement.End)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("A chart with nothing in it",
                "A bound collection with no rows: the frame is drawn and the chart says so, rather than showing an empty box.",
                new LineChartComponent("empty")
                    .BindItems(nameof(ChartsController.Nothing))
                    .SetX(nameof(Sample.Time))
                    .SetXAxis(UIChartAxis.Time("charts.time"))
                    .SetYAxis(UIChartAxis.Linear("charts.percent", min: 0, max: 100, format: "N0"))
                    .AddSeries("cpu", "charts.cpu", nameof(Sample.Cpu))
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(200))
            )
        ];
}
