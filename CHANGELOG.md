# Changelog

One section per release of this slice, headed `## X.Y.Z` and named by the tag — `charts/vX.Y.Z`. The release
workflow cuts the matching section out to become the body of the GitHub release, and a tag with no section
fails the release before anything is published.

## 1.2.0

- **`RadarChartComponent`, a new kind.** A row's x names a spoke, and each series' values along the spokes close into a
  filled outline: the y axis is the scale every spoke shares, its ticks the rings, its low end the centre. The legend puts a
  series aside, a corner answers the pointer with its value and a press reaches `OnPointClick`, as on a line chart; the
  arithmetic is `ChartRadar` and `chart-radar.ts`, held to the shared corpus. Built on the framework's 1.2.0.

## 1.1.0

- **Built on the framework's 1.1.0.** Nothing of this package's own changed; it moves with the framework, which now
  releases every package on the next minor version whenever it changes.

## 1.0.1

- **The first stable release.** No `--prerelease` is needed any more. Until 2.0.0 the public surface may still move
  between versions; every such change is marked **Breaking:** in this file.
- **A time axis marks months on the calendar.** A step of a month or more landed on multiples of days counted from 1970, which
  drift off the month; the marks and the rounded range now stand on the first of a month, a quarter or a year
  (`ChartCalendar`, `chart-calendar.ts`, the same arithmetic on both sides). The browser counts a moment's clock by hand, since
  `Date.UTC` reads the years 0 to 99 as 1900 to 1999.
- **A time axis stays inside the moments a `DateTime` can name**, so no mark is one the server cannot write, and **a single
  moment is drawn with a day either side of it** — an eighth of its number, as a value axis pads, was years.
- **A chart with no `SetX` places a row by where it stands, patches included.** The server numbered the rows by their place and
  the browser read the text the row came with; a row inserted or removed now moves the ones after it in the browser, as a
  render would.
- **A text `"NaN"` or `"Infinity"` is not a value** — nor a number too large to hold: they are a gap, as a null is. **Text is
  read as a moment only on a time axis**; on a value axis a date turned into a number no one wrote.
- **The legend follows the data.** The server wrote it for the first frame and the browser never touched it again, so a series
  or a sector that arrived later had no entry and one that left kept its own; it is kept in step now, left alone while it
  names the same entries, and an entry put aside stays aside. A series the legend put aside no longer holds a step in a stack
  or a gap among bars.
- **A chart's canvas is announced by what it draws.** It was a picture with no name; it is labelled with the series the legend
  names, a pie with its sectors, or the new `ui.chart.label` string (*Chart*) where there is nothing to name. A gauge's arc is
  hidden from a reader, beside the reading and caption laid over it.
- **The wheel zooms by how far it turned**, not once per event: a trackpad sent dozens of small deltas for one gesture and zoomed
  dozens of steps. No event zooms by more than three notches. A double press on a chart already showing the whole says
  nothing to the server.
- **A zoomable chart starts on the window the server drew it at** — bound, or written by the author — rather than the whole of
  the data at the first wheel; **the server's first frame of a narrowed window cuts the lines at the plot's edge**, as the
  browser's drawing already did, instead of drawing them over the axes.
- **A burst of changes draws once.** Every change, drag move and wheel notch redrew the chart at once; they are gathered to the
  next frame, the drawing is built off the page and put in place in one step, and a shared tooltip's words are written when
  the pointer first reaches a column. The nearest column is found by halving.
- **A category axis with more names than it carries marks thins them by a stride** rather than cutting them off after the two
  hundredth.
- **The package's stylesheet and script are served under `/_ne/css/` and `/_ne/js/`** with the framework's own paths (see the
  core's changelog).
- **A point's tooltip names its series as the legend does.** The per-point tooltip the server writes for a line, bar or
  scatter chart carried the raw caption; it is translated now, through the same read the legend uses.
- The README names every piece of arithmetic the two ports share, the pie, the bubbles and the window included.
- **The package checks the plugin contract it was built for.** The framework's client says which contract it implements
  (`GlobalApi.contractVersion`), and the package refuses to register against another one, with an error naming both
  numbers, instead of working in part.
- **Both packages bring their namespaces as global usings.** Installing the package is enough to write against it; a
  project that would rather write its own `using` lines sets `NEStandardUIImplicitUsings` to `false`.
- **The demo draws Orvane Cloud's revenue, plans and servers**, and every sample shows its source.
- **The mirror's demo builds against the framework's packages.** It reached this slice's own namespaces only through
  the monorepo's usings, and this slice's sources wrote `using` lines the framework's packages now bring, which is
  IDE0005; `Directory.Build.targets` travels to the mirror and a package's sources keep their own lines.
- The README's licence link names the mirror, so it resolves on nuget.org too.
- **The packages carry their symbols and sources inside their assemblies**, so a debugger steps into them.
- **A stacked part stands on everything under it.** A bar or a band started from the series just below, so where that series
  held nothing at an x the part dropped to zero and covered the ones under it; each point now carries where it starts
  (`ChartPoint.Base`). **Values below zero stack downward apart from those above it** rather than being drawn over by them.
- **A window as wide as the data no longer fails the server's render**, where the width's rounding put its start a hair before
  the data's; nor does an end the author fixed past all of the data — the open end is built from the fixed one rather than a
  range running backward — nor a category name wider than the first frame.
- **A logarithmic axis below one writes its marks with the decimals they need**: 0.001 read "0.0". A linear axis marked finer
  than a thousandth writes its decimals too.
- **Bars on their side zoom, pan and share a tooltip down the chart**, where the wheel, the drag and the shared tooltip's line
  read across it; **a zoomed bar chart widens its bars** to share the band among the places on show, not every place in the
  data.
- **A press on a sector names the pie's series as `series`**, as for every other point; it named the row twice.
- **An x reads the same on both sides.** The server read a value and the browser its text, so a blank, a hex, a flag or a date
  on a value axis placed a point on one side and not the other; both now read the x's text by .NET's invariant rule, a
  moment only on a time axis, and a number on a time axis as its milliseconds.

## 1.0.0-rc.3

The first version: `NE.Standard.UI.Charts` (the components) and `NE.Standard.UI.Web.Charts` (the web
rendering). The number lines up with the framework's, which goes out as a release candidate with everything that
plugs into it.

- `LineChartComponent`: one or more series drawn as SVG paths over an x axis, built on the server and patched
  like any other component — a point is an item of a keyed collection, and a collection sink hands the browser
  the values instead of rows.
- A series names either its own row property (a row is an x with a number per series) or the chart names the
  property that says which series a row belongs to (a row is one point of one series).
- Axes of four kinds — linear, time, category and logarithmic — with a caption, a range that follows the data
  unless it is given, grid lines and a tick format read in the page's culture.
- A legend that hides and shows a series in the browser, and a tooltip on a point through the framework's own
  tooltip engine.
- `AreaChartComponent` and `BarChartComponent`: a band from each line down to what it stands on, and a bar
  per series in every x's own band. `Stacked` on either puts the series on one another, so the top of the
  stack is the total and each part is what its own series added; a bar and a band are measured from zero,
  which the range takes in whether the data does or not.
- `PieChartComponent`: one series' points as sectors of a turn, a row to a sector, its x the sector's name and
  its value its share. `SetDonut(share)` leaves a hole in the middle and `CentreCaption` writes in it; the legend
  names the sectors, and a press there takes one out so the rest spread over the whole turn.
- `SparklineComponent`: one series with nothing around it — no axes, no grid, no legend, a line of text high —
  as a line or, with `Bars`, as a run of bars. For a cell of a table or the corner of a tile, where a shape is
  read rather than a number; a point still says what it is on hover.
- `ScatterChartComponent`: a cloud of points with no line between them, each sized by the third value its series
  names — by area, so twice the number is twice the ink.
- `GaugeComponent`: one reading on a three-quarter arc, the range it is read in, and the bands that say what it
  means — the one chart that binds a value rather than a collection. Its arc is worked out by the stylesheet from
  the reading and the range, so a value the server pushes moves it without a line of script.
- `SharedTooltip` names every series at the x under the pointer in one tooltip, with a line marking that x — what a
  line chart of several series is usually read by. A chart that shares its tooltip writes none per point.
- `Zoomable` lets the viewer read a stretch of the x axis: the wheel narrows the window about the pointer, a drag moves
  it along, and a double press gives the whole of the data back. It is off by default, so a page still scrolls under a
  chart that does not zoom.
- `VisibleRange` is the window, bound both ways: the viewer's own moves reach the controller (`OnWindowChange` runs
  once the value has landed), and a controller that sets it moves the chart — which is how a windowed source is asked
  for the detail a narrow stretch deserves. `FollowLatest` keeps a window standing at the far end on the newest point.
- `OnPointClick(command)` runs a command when a mark, a bar or a sector is pressed, handing it the key of the
  row the point was read from and the key of its series. `ChartArguments.Point`/`Series` name them for a command
  with parameter names of its own, and `UIAction.ArgCurrentItem` hands over the row itself.
- `Horizontal` on a bar chart lays the bars on their side: the values run across the box and every x owns a band
  down it, the names read down the left rather than turned on end, and everything else — the band, a series'
  share of it, the stack, the tooltip — is the same chart.
- A point answers the pointer through an unpainted circle of its own, wide enough to be easy to hit and never a
  different size from one moment to the next; the mark under it is what grows. One series under the pointer keeps
  its ink and the rest go back, in the plot and from the legend alike.
- A stepped line's jump falls halfway between two x's, so a value holds from halfway back to halfway on and a
  point's mark sits in the middle of its own step.
- The chart re-lays itself out at the size it is drawn at: the server writes a correct first frame with no
  measurement, and the browser re-places the ticks and their labels once it knows how wide they are.
- A moment is one number on both sides — the clock it is written with — so a time axis is marked at round clock
  readings wherever it is drawn, and the tick beside a point reads the same clock as the point's own tooltip.
