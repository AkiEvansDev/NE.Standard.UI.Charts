# NE.Standard.UI.Charts

Chart components for the [NE.Standard](https://github.com/AkiEvansDev/NE.Standard) UI framework. Two packages, on
the framework's own pattern — the **components**, which are platform-independent and hold the arithmetic of an axis,
and their **web rendering**, which carries the engine and the stylesheet embedded in its assembly.

A chart is **SVG the server writes and the browser keeps**. A point is an item of a keyed collection, and a reading
that arrives reaches the browser through the framework's collection sink as one value — no items host draws rows,
and nothing is rendered on the server twice. The browser then draws the chart again whole: the axes are scaled to
what the series now hold, and every mark is placed against them, which is one pass over the points, not a diff. A canvas would draw many thousands of points faster, and
would be a second rendering path with a data protocol of its own; it comes back only when a case needs it.

- **In this version:** the whole set — `LineChartComponent`, `AreaChartComponent`, `BarChartComponent`,
  `PieChartComponent`, `ScatterChartComponent`, `SparklineComponent` and `GaugeComponent`: one or more series over a
  linear, time, category or logarithmic x axis, stacked or side by side, bars on their side, a turn shared out as
  sectors, a cloud of bubbles, a shape with nothing around it, and one reading on an arc. The viewer hovers a point
  or a whole x, puts a series aside at the legend, presses a point to reach a command, and zooms and pans along the
  x axis where the author allowed it.
- **The stages to come:** the pinch on a touch device.

## Install

```
dotnet add package NE.Standard.UI.Charts --prerelease
dotnet add package NE.Standard.UI.Web.Charts --prerelease
```

Register the web rendering beside the framework's renderers:

```csharp
services.AddStandardRenderers();
services.AddCharts();
```

## Using it

A row is an x with a number per series, and each series names the row property it reads:

```csharp
new LineChartComponent()
    .BindItems(nameof(Controller.Samples))
    .SetX(nameof(Sample.Time))
    .SetXAxis(UIChartAxis.Time("Time", format: "HH:mm"))
    .SetYAxis(UIChartAxis.Linear("Percent", min: 0, max: 100, format: "N0"))
    .AddSeries("cpu", "CPU", nameof(Sample.Cpu))
    .AddSeries("memory", "Memory", nameof(Sample.Memory))
    .SetSmooth(true)
```

Or the series come from the data, and a row is one point of the series it names:

```csharp
new LineChartComponent()
    .BindItems(nameof(Controller.Readings))
    .SetX(nameof(Reading.Hour))
    .SetSeriesPath(nameof(Reading.Metric))
    .SetValuePath(nameof(Reading.Value))
    .SetStepped(true)
```

A series the data names and the author did not draws a line of its own, captioned by its key and coloured by the
next colour of the theme's categorical run. `AddSeries` for a key that does appear in the data gives that series its
caption, its colour and its own line style.

Every item of the collection is keyed — `IBindableItem.Id` — because that is how a patch finds the point it moves.
The rows are drawn in the collection's own order; `SortBy` on the component orders them where the source does not.

### The kinds

| Component | Draws | Its own |
|---|---|---|
| `LineChartComponent` | a line per series | `Stepped`, `Smooth`, `ShowMarkers` — a series may say otherwise |
| `AreaChartComponent` | the same lines with a band under each | `Stacked`, and the line chart's own; no marks are painted, though a point still answers the pointer |
| `BarChartComponent` | a bar per series at every x | `Stacked` — otherwise the bars share the x's band side by side; `Horizontal` lays them on their side, the values across the box and a band per x down it |
| `PieChartComponent` | one series' points as sectors of a turn | `SetDonut(share)` for a hole, `CentreCaption` for the words in it; no axes, and the legend names the sectors |
| `SparklineComponent` | one series with nothing around it, a line of text high | `Bars` for a run of bars instead of a line; no axes, no grid, no legend, and no marks until the pointer finds one |
| `ScatterChartComponent` | a mark per point and no line between them | a third value sizes each mark where the series names one: `AddSeries(key, caption, valuePath, sizePath)`, by area rather than by radius |
| `GaugeComponent` | one reading on a three-quarter arc | binds `Value` rather than a collection; `SetRange(min, max)`, `AddBand(from, to, colour)`, `Caption`, `Format`, `Unit` |

An area's band and a bar's length are read against zero, so those two take zero into the range whether the data
does or not; a line chart follows its data. `Stacked` puts the series on one another in the order they were added:
the top of the stack is the total, each part is what its own series added, and a tooltip still says what the series
itself holds. A series the legend puts aside leaves the stack rather than holding a gap in it.

### The axes

| Axis | x reads | A tick is written |
|---|---|---|
| `UIChartAxis.Linear` | a number | a standard .NET format — `N0`, `N2`, `P`, `F1` — or as many decimals as the step needs |
| `UIChartAxis.Time` | a `DateTime` | a pattern of the framework's shared token subset (`HH:mm`, `dd MMM`), or the part of a clock the step moves |
| `UIChartAxis.Category` | a name, one place per name in the order the rows arrive | the name itself |
| `UIChartAxis.Logarithmic` | a number above zero, on a base-ten scale | as a linear axis, marked at the powers of ten |

A range the author leaves open follows the data, rounded outward to the axis's own round step; `Min`/`Max` fix
either end. `ShowGridLines` and `TickCount` are the axis's, and a caption stands beside it.

A time axis reads the moment it is given as the wall clock it is written with, never shifted into another zone, so
pass a local or unspecified `DateTime` — and a `DateTimeOffset` or a text carrying a zone is read by the clock on its
face, the zone dropped. The browser reads it the same way, so a tick, a point and a bound range are one number on both
sides and a round step lands on a round clock reading.

### Where the drawing happens

Both ports are held to one corpus: `Client/tests/arithmetic-corpus.json` carries the cases and their answers, the
browser's own tests read it against the TypeScript, and the framework repository's `NE.Test.Standard.UI.Charts` reads the same file
against the C#. A change one side got and the other did not fails on both.

The server writes a correct first frame with no measurement — the ranges, the round ticks and their labels in the
page's culture, a path per series — at a nominal size the `viewBox` carries. The browser then re-draws the chart at
the size it really got, which is the only way text can be placed properly, and again whenever the collection
changes or the viewer puts a series aside. Both sides run the same arithmetic: `ChartRange`, `ChartTicks`,
`ChartPath`, `ChartStacking`, `ChartBars` and `ChartValues` here, `chart-ticks.ts`, `chart-path.ts`,
`chart-stack.ts`, `chart-bars.ts` and `chart-moment.ts` there.

### What the viewer can do

- **Hover a point** for its series, its x and its value, through the framework's own tooltip (`ShowTooltip`). A
  point answers through an unpainted circle of its own, wide enough to be easy to hit; a chart that paints no
  marks still answers, the mark being there unpainted until the pointer finds it.
- **Hover anywhere in the plot** where the author set `SharedTooltip`: one tooltip names every series at the x
  under the pointer, and a line marks which x that is.
- **Hover a series** — its line, its band, its sector, or its entry in the legend — and the rest of them go
  back, so the one being read stands alone. A line is held over its whole length rather than at its marks alone.
- **Hover a bar** and that bar alone is read: every other bar goes back, the ones stacked with it in its own
  column among them, since a stacked column is several values and not one.
- **Zoom and pan** where the author set `Zoomable`: the wheel narrows the stretch of the x axis on show about the
  pointer, a drag moves it along, and a double press gives the whole of the data back. The window is bound
  (`BindVisibleRange`), so a controller hears where the viewer is reading and can move the chart itself;
  `FollowLatest` keeps a window standing at the far end on the newest point.
- **Click a legend entry** to put its series aside and bring it back; the range then follows what is left. The
  choice stays in the browser and is never sent.
- **Click a point** — a mark, a bar or a sector — where the author wired `OnPointClick(command)`: the command is
  handed the key of the row the point was read from as `point` and the key of its series as `series`.
- The legend stands under the plot, over it, or at either edge (`SetLegend`).

### Its size

A chart fills the box it is given and has a floor of its own, so one dropped into a stack is not a line high;
`SetMinHeight`/`SetMaxHeight` say otherwise. The canvas is laid over its own area rather than sized by it — an
`<svg>` with a `viewBox` has an aspect ratio, and letting that reach the layout would make the engine's new
`viewBox` change the box it had just measured.

A series takes the colour the author gave it (`UIThemeColor`) or the next of the theme's categorical run, which
lives with the theme, so charts on one page read as one system in light and in dark; both sides cycle by the run's
length, the server reading it off the theme and the browser off the page.

### Inside the package

The web renderer is four files of one class — the root, the model, the frame, the plot — and every setting is read through
the foundation's own readers. The stylesheet imports the framework's Less contract (`Client/plugin/ne-standard-ui.less`,
copied beside the TypeScript one), so a chart's height follows the same responsive chain every component's does, and the
motion and the washes are the theme's. The engine is one class started from the framework's engine context, in the shape
the framework's own engines take; it lets go of a chart the page let go of.

## What it does not do

- No animation of a change, and no patch of one mark: a change redraws the chart, and a chart of many thousands of
  points streamed at a high rate is a case for the canvas that is not here.
- No drawing tools, annotations or trend lines.
- No export as an image — the SVG is the page's, and the browser's own save takes it.
- No heat map and no candlestick; both wait for a case.

## Licence

The framework's own — see `LICENSE.md`.
