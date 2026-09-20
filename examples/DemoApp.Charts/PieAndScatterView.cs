using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Extensions;

namespace DemoApp.Charts;

/// <summary>
/// The pie chart and the scatter chart: a turn shared out between one series' points, and a cloud of bubbles with nothing between
/// them. Rows the page holds, so the page has no controller.
/// </summary>
internal sealed class PieAndScatterView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.pie-and-scatter";

    protected override string Route => PieAndScatterRoute;

    public override string Title => "Pie and scatter";

    protected override string Description
        => "The two charts without a line: a turn shared out between one series' points, and a cloud of points sized by a third value.";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            UIPage.Section("A day's visits as a turn shared out",
                "A pie chart shares the turn out between one series' points: a row is a sector, its x names it and its value is its share. There are no axes — the legend names the sectors, and a press there takes one out so the rest spread over the whole turn. A hole in the middle makes it a donut, and the words in the hole are the author's.",
                new PieChartComponent("sources")
                    .SetItems(Catalogue.Sources())
                    .SetX(nameof(Share.Name))
                    .SetXAxis(UIChartAxis.Category())
                    .SetYAxis(UIChartAxis.Linear(format: "N0"))
                    .AddSeries("visits", "Visits", nameof(Share.Visits))
                    .SetDonut(0.62)
                    .SetCentreCaption("10,000 visits")
                    .SetLegend(UIChartLegendPlacement.End)
                    .SetMinHeight(UILayoutLength.Absolute(300))
            ),
            UIPage.Section("A dozen countries as a cloud of bubbles",
                "A scatter chart draws its points and no line between them: a row is a place on both axes, and a third value the series names sizes it — by area, so twice the number is twice the ink. Hover one for what it is.",
                new ScatterChartComponent("countries")
                    .SetItems(Catalogue.Countries())
                    .SetX(nameof(Country.Income))
                    .SetXAxis(UIChartAxis.Linear("Income a head, $", format: "N0"))
                    .SetYAxis(UIChartAxis.Linear("Years of life", format: "N0"))
                    .AddSeries("countries", "Countries", nameof(Country.Life), nameof(Country.People))
                    .SetLegend(UIChartLegendPlacement.None)
                    .SetMinHeight(UILayoutLength.Absolute(320))
            )
        ];
}
