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
  `PieChartComponent`, `RadarChartComponent`, `ScatterChartComponent`, `SparklineComponent` and `GaugeComponent`: one or
  more series over a linear, time, category or logarithmic x axis, stacked or side by side, bars on their side, a turn
  shared out as sectors, series closed into shapes over spokes, a cloud of bubbles, a shape with nothing around it, and one
  reading on an arc. The viewer hovers a point
  or a whole x, puts a series aside at the legend, presses a point to reach a command, and zooms and pans along the
  x axis where the author allowed it.
- **The stages to come:** the pinch on a touch device.

## Install

```
dotnet add package NE.Standard.UI.Charts
dotnet add package NE.Standard.UI.Web.Charts
```

Both packages bring their namespaces as global usings, so the code below needs no `using` line for them; a project that
sets `NEStandardUIImplicitUsings` to `false` writes its own.

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
caption and its colour.

A series with a line style of its own is a `UIChartSeries`, passed to the other `AddSeries` overload: its `Stepped`,
`Smooth` and `ShowMarkers`, left unset, take the chart's.

```csharp
new LineChartComponent()
    .BindItems(nameof(Controller.Samples))
    .SetX(nameof(Sample.Time))
    .SetSmooth(true)
    .AddSeries("cpu", "CPU", nameof(Sample.Cpu))
    .AddSeries(new UIChartSeries { Key = "limit", Caption = "Limit", ValuePath = nameof(Sample.Limit), Stepped = true, ShowMarkers = false })
```

Every item of the collection is keyed — `IBindableItem.Id` — because that is how a patch finds the point it moves.
The rows are drawn in the collection's own order; `SortBy` on the component orders them where the source does not. A chart
that names no `SetX` reads a row's x off its place in the collection, on both sides: a row inserted or removed moves the ones
after it, as a render would.

### The kinds

| Component | Draws | Its own |
|---|---|---|
| `LineChartComponent` | a line per series | `Stepped`, `Smooth`, `ShowMarkers` — a series added as a `UIChartSeries` may say otherwise |
| `AreaChartComponent` | the same lines with a band under each | `Stacked`, and the line chart's own; no marks are painted, though a point still answers the pointer |
| `BarChartComponent` | a bar per series at every x | `Stacked` — otherwise the bars share the x's band side by side; `Horizontal` lays them on their side, the values across the box and a band per x down it |
| `PieChartComponent` | one series' points as sectors of a turn | `SetDonut(share)` for a hole, `CentreCaption` for the words in it; no axes, and the legend names the sectors |
| `RadarChartComponent` | each series as a filled shape over spokes, one spoke per x | `ShowMarkers`, which a series may override; the x axis is a category one unless the author sets another, and the y axis is the scale every spoke shares — its ticks are the rings, its low end the centre. No zoom, no window and no shared tooltip: there is no x to move along |
| `SparklineComponent` | one series with nothing around it, a line of text high | `Bars` for a run of bars instead of a line; no axes, no grid, no legend, and no marks until the pointer finds one |
| `ScatterChartComponent` | a mark per point and no line between them | a third value sizes each mark where the series names one: `AddSeries(key, caption, valuePath, sizePath)`, by area rather than by radius |
| `GaugeComponent` | one reading on a three-quarter arc | binds `Value` rather than a collection; `SetRange(min, max)`, `AddBand(from, to, colour)`, `Caption`, `Format`, `Unit` |

An area's band, a bar's length and a radar's reach from its centre are read against zero, so those take zero into the
range whether the data does or not; a line chart follows its data. A radar's spokes are every x any series holds, once, in
order, so a series with no value on one holds its outline at the centre there, and one the legend puts aside keeps its
spokes — the shape the rest make does not turn. `Stacked` puts the series on one another in the order they were added:
the top of the stack is the total, each part is what its own series added, and a tooltip still says what the series
itself holds. A part stands on everything stacked under it at its x, whether or not the series just below holds a value
there, and values below zero stack downward apart from those above it, so neither side is drawn over the other. A series
the legend puts aside leaves the stack rather than holding a gap in it.

### The axes

| Axis | x reads | A tick is written |
|---|---|---|
| `UIChartAxis.Linear` | a number | a standard .NET format — `N0`, `N2`, `P`, `F1` — or as many decimals as the step needs |
| `UIChartAxis.Time` | a `DateTime` | a pattern of the framework's shared token subset (`HH:mm`, `dd MMM`), or the part of a clock the step moves |
| `UIChartAxis.Category` | a name, one place per name in the order the rows arrive | the name itself |
| `UIChartAxis.Logarithmic` | a number above zero, on a base-ten scale | a standard .NET format, or as many decimals as its smallest mark needs; marked at the powers of ten |

A range the author leaves open follows the data, rounded outward to the axis's own round step; `Min`/`Max` fix
either end, and an end fixed past all of the data leaves the open one built from it rather than a range running backward. `ShowGridLines` and `TickCount` are the axis's, and a caption stands beside it. A category axis with more names
than an axis carries marks (two hundred) thins them by a stride rather than cutting the rest off.

A value an axis cannot place is no value: a text `"NaN"` or `"Infinity"`, or a number too large to hold, is a gap, as a null
is. A number written as text is read as .NET's invariant culture reads one — a hex, a blank or a thousands separator is no
number. A moment, or its text, is placed only on a time axis — on a value axis a date would turn into a number no one wrote.
An x is read off the text the browser is told, on both sides, so a point the first frame places is the one every redraw
places.

A time axis reads the moment it is given as the wall clock it is written with, never shifted into another zone, so
pass a local or unspecified `DateTime` — and a `DateTimeOffset` or a text carrying a zone is read by the clock on its
face, the zone dropped. The browser reads it the same way, so a tick, a point and a bound range are one number on both
sides and a round step lands on a round clock reading. A step of a month or more is marked on the calendar — the first of a
month, a quarter or a year — rather than every so many days from 1970, which drifts off the month. The axis stays inside the
moments a `DateTime` can name, and a single moment is drawn with a day either side of it.

### Where the drawing happens

The server writes a correct first frame with no measurement — the ranges, the round ticks and their labels in the
page's culture, a path per series — at a nominal size the `viewBox` carries. The browser then re-draws the chart at
the size it really got, which is the only way text can be placed properly, and again whenever the collection
changes or the viewer puts a series aside — once per frame, however many changes, drags or wheel notches arrived before
it. Both sides run the same arithmetic: `ChartRange`, `ChartTicks`, `ChartScale`, `ChartPlot`, `ChartCalendar`,
`ChartPath`, `ChartStacking`, `ChartBars`, `ChartPie`, `ChartRadar`, `ChartBubbles`, `ChartWindow` and `ChartValues` here,
`chart-ticks.ts` (the range, the ticks, the scale and the plot), `chart-calendar.ts`, `chart-path.ts`, `chart-stack.ts`,
`chart-bars.ts`, `chart-pie.ts`, `chart-radar.ts`, `chart-bubbles.ts`, `chart-window.ts`, `chart-moment.ts` and `chart-rows.ts`'s reading of an
x there — held to one corpus of cases both test suites read.

The legend follows the data: the server writes it for the first frame, and a series or a sector that arrives or goes later
arrives or goes in the legend too, an entry the viewer put aside staying aside. The canvas is announced as a picture named
by what the legend names — or by the `ui.chart.label` string (*Chart*) where there is nothing to name; a gauge's arc is left
unannounced beside the words laid over it.

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
  pointer — by how far it turned, so a trackpad's many small deltas zoom as far as a mouse's one notch — a drag moves it
  along, and a double press gives the whole of the data back — down the chart rather than across it where bars lie on their
  side, the shared tooltip's line with them. Zoomed in, bars widen to share the band among the places on show. The window
  starts where the server drew it, bound or written by the author. The window is bound
  (`BindVisibleRange`), so a controller hears where the viewer is reading and can move the chart itself;
  `OnWindowChange(command)` runs a command once the viewer has moved it, with the bound range already on the server;
  `FollowLatest` keeps a window standing at the far end on the newest point.
- **Click a legend entry** to put its series aside and bring it back; the range then follows what is left. The
  choice stays in the browser and is never sent.
- **Click a point** — a mark, a bar or a sector — where the author wired `OnPointClick(command)`: the command is
  handed the key of the row the point was read from as `point` and the key of its series as `series` — a sector's series
  being the pie's one series.
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

The framework's: **the Prosperity Public License 3.0.0** — free for noncommercial use, with a thirty-day trial
for commercial use. See [LICENSE.md](https://github.com/AkiEvansDev/NE.Standard.UI.Charts/blob/main/LICENSE.md).

## Contributing

This repository is a **read-only mirror**. Development happens in a private repository alongside the
framework — that is how the charts stay in step with the renderer they plug into — and everything here is
generated from it, so pull requests are switched off.

Issues are open and welcome.
