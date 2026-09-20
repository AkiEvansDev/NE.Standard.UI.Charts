using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Charts;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Extensions;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Charts;

/// <summary>
/// The small charts: two sparks, and two readings on an arc. One of each follows the live readings, so a reading taken here moves
/// a spark and a gauge at once.
/// </summary>
internal sealed class SparksAndGaugesView : ChartsDemoView, IUIViewDefinition
{
    public static string ViewKey => "charts.sparks-and-gauges";

    protected override string Route => SparksAndGaugesRoute;

    public override string Title => "Sparks and gauges";

    protected override string Description
        => "The charts that stand in a cell or the corner of a tile; take a reading and watch the load's spark and its arc follow it.";

    protected override IVisualComponent[] CreateSections()
        =>
        [
            UIPage.Section("Sparks, for a cell or the corner of a tile",
                "A sparkline is one series with nothing around it: no axes, no grid, no legend, a line of text high. It is read as a shape rather than for its numbers, so the marks stay out of the way — a point still says what it is on hover. Bars where the values are counts, a line where they are a level.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .AddChild(new ButtonComponent()
                        .SetTitle("Take a reading")
                        .OnClick(nameof(ChartsController.TakeReading))
                    )
                    .AddChild(new StackPanelComponent()
                        .SetOrientation(UIOrientation.Horizontal)
                        .SetSpacing(32)
                        .AddChild(CreateTile("Load, the last forty readings", new SparklineComponent("spark-load")
                            .BindItems(nameof(ChartsController.Samples))
                            .SetX(nameof(Sample.Time))
                            .SetXAxis(UIChartAxis.Time())
                            .AddSeries("cpu", "CPU", nameof(Sample.Cpu))
                            .SetSmooth(true)
                        ))
                        .AddChild(CreateTile("Revenue in the north, by quarter", new SparklineComponent("spark-revenue")
                            .SetItems(Catalogue.Quarters())
                            .SetX(nameof(Quarter.Name))
                            .SetXAxis(UIChartAxis.Category())
                            .AddSeries("north", "North", nameof(Quarter.North))
                            .SetBars(true)
                        ))
                    )
            ),
            UIPage.Section("A reading on an arc",
                "A gauge is the one chart that binds a value rather than a collection: the reading, the range it is read in, and the bands that say what it means. Its arc is a dash of the whole path worked out by the stylesheet, so a value the server pushes moves it without a line of script — take a reading above and watch it follow.",
                new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(32)
                    .AddChild(new GaugeComponent("gauge-load")
                        .BindValue(nameof(ChartsController.Load))
                        .SetRange(0, 100)
                        .AddBand(0, 60, UIThemeColor.FromStyle(UIColorStyle.Success))
                        .AddBand(60, 85, UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .AddBand(85, 100, UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetCaption("Processor")
                        .SetUnit("%")
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
                    .AddChild(new GaugeComponent("gauge-disk")
                        .SetValue(1.8)
                        .SetRange(0, 4)
                        .AddBand(3, 4, UIThemeColor.FromStyle(UIColorStyle.Warning))
                        .SetCaption("Disk written this hour")
                        .SetFormat("N1")
                        .SetUnit(" GB")
                        .SetMinHeight(UILayoutLength.Absolute(200))
                    )
            )
        ];

    /// <summary>A spark beside its own caption, which is how one is read: a shape, not a chart.</summary>
    private static StackPanelComponent CreateTile(string caption, IVisualComponent spark)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(4)
            .SetMinWidth(UILayoutLength.Absolute(280))
            .AddChild(new TextComponent()
                .SetTitle(caption)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            )
            .AddChild(spark);
}
