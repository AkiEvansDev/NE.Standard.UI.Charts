namespace DemoApp.Charts;

/// <summary>
/// What runs over a clock or a row of names: the line chart over names, over a clock with the readings that arrive and over series
/// the data names, the same quarters stacked as bands, and a chart with nothing in it.
/// </summary>
internal sealed class OverTimeView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.over-time";

    protected override string Route => OverTimeRoute;

    protected override string Header => "charts.page.over-time";

    protected override string Description
        => "charts.page.over-time.description";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            Example("Multi-series line chart",
                "Plots multiple property-mapped series across a categorical X axis with automatic outward-rounded Y bounds and culture-formatted tick labels.",
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
            Example("Live time series with zoom and follow",
                "Binds an observable time series with wheel zoom, drag pan, double-click reset and two-way VisibleRange synchronization. With FollowLatest enabled, newly appended samples advance a zoomed window automatically.",
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
                        .BindItems<ChartsController>(static c => c.Samples)
                        .SetX(nameof(Sample.Time))
                        .SetXAxis(UIChartAxis.Time("charts.time", format: "HH:mm"))
                        .SetYAxis(UIChartAxis.Linear("charts.percent", min: 0, max: 100, format: "N0"))
                        .AddSeries("cpu", "charts.cpu", nameof(Sample.Cpu))
                        .AddSeries("memory", "charts.memory", nameof(Sample.Memory))
                        .SetSmooth(true)
                        .SetShowMarkers(false)
                        .SetZoomable(true)
                        .SetFollowLatest(true)
                        .BindVisibleRange<ChartsController>(static c => c.VisibleRange)
                        .OnWindowChange(nameof(ChartsController.WindowChanged))
                        .OnPointClick(nameof(ChartsController.PointClicked))
                        .SetMinHeight(UILayoutLength.Absolute(280))
                    )
                    .AddChild(new TextComponent()
                        .BindTitle<ChartsController>(static c => c.Status)
                        .SetTitleWrap(true)
                        .SetTitleType(UITextAppearance.Caption)
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                    )
            ),
            Example("Data-driven series and stepped lines",
                "Derives series dynamically from row data via SetSeriesPath and SetValuePath, rendered with stepped interpolation and a shared crosshair tooltip per X value.",
                new LineChartComponent("requests")
                    .BindItems<ChartsController>(static c => c.Requests)
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
            Example("Stacked area chart",
                "Stacks filled series from a zero baseline so the top edge shows the combined total while each point tooltip reports its own series contribution.",
                new AreaChartComponent("revenue-stacked")
                    .SetItems(Catalogue.Quarters())
                    .SetX(nameof(Quarter.Name))
                    .SetXAxis(UIChartAxis.Category("charts.quarter"))
                    .SetYAxis(UIChartAxis.Linear("charts.revenue", format: "N0"))
                    .AddSeries("eu-west", "charts.eu-west", nameof(Quarter.EuropeWest))
                    .AddSeries("eu-central", "charts.eu-central", nameof(Quarter.EuropeCentral))
                    .AddSeries("us-east", "charts.us-east", nameof(Quarter.UsEast))
                    .SetStacked(true)
                    .SetMinHeight(UILayoutLength.Absolute(280))
            ),
            Example("Empty state",
                "An empty bound collection renders the chart frame and localized empty-data message instead of a blank plot.",
                new LineChartComponent("empty")
                    .BindItems<ChartsController>(static c => c.Nothing)
                    .SetX(nameof(Sample.Time))
                    .SetXAxis(UIChartAxis.Time("charts.time"))
                    .SetYAxis(UIChartAxis.Linear("charts.percent", min: 0, max: 100, format: "N0"))
                    .AddSeries("cpu", "charts.cpu", nameof(Sample.Cpu))
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(200))
            )
        ];
}
