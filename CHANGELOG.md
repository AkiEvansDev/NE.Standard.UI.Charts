# Changelog

One section per release of this slice, headed `## X.Y.Z` and named by the tag — `charts/vX.Y.Z`. The release
workflow cuts the matching section out to become the body of the GitHub release, and a tag with no section
fails the release before anything is published.

## 1.4.0-rc.3

- **A gauge's caption and unit, and a pie's centre caption, take a phrase**, as every text of the framework's now does.
  **Breaking:** `GaugeComponent.Caption`, `GaugeComponent.Unit` and `PieChartComponent.CentreCaption` are `UIPhrase?`; a string
  still assigns, and code reading one as a string reads `.Key` or `.ToString()`. A gauge's `Format` stays a string.
- **A category or series name read off a phrase is written as its key**; an author's text is the plain text it stands for.
- **Built on the framework's 1.4.0-rc.3.** Its copy of the plugin
  stylesheet carries the framework's field actions: `.ui-field-actions()` compacts a split button and a flyout's button as
  it does a plain one (`.ui-field-action-button()`), and the eight file-kind glyphs' variables (`@ui-glyph-draft`,
  `@ui-glyph-picture-as-pdf`, …).

## 1.4.0-rc.2

- **Built on the framework's 1.4.0-rc.2.** Nothing of this package's own changed. Its copy of the plugin contract carries the
  framework's new `Moment` type: `strings.format` takes a moment among its values and writes it in the reader's time zone.

## 1.4.0-rc.1

- **A chart and a gauge follow a language switch in their numbers and dates.** Their culture packs stayed the language the page
  was rendered in, so after a switch the ticks, tooltips and a gauge's reading kept the old separators and month names until the
  next render; the packs are now marked the page's (`data-ui-page-culture`), which the framework writes again from the new
  language's words before the chart draws itself anew.
- **Zooming into the gap between two points keeps the line in view.** The y axis followed only the points inside the window and
  the one either side of a point inside it, so a window lying between two points reached none and read 0 to 1 with the line off
  the plot; the piece of line the window lies inside counts now, on the server's first frame and in the browser (`ChartWindow`,
  `chart-window.ts`, held together by the corpus).
- **A text x on a time axis is read the same on both sides.** The server read it through `DateTimeOffset.TryParse`, so
  `09/29/2026 10:00`, `Sep 29 2026` or a bare `10:30` (today's date on the server) were placed on the first frame and dropped by
  the browser's first redraw; the server now reads only the wire's shape, as the browser does. **Breaking** for an application
  that fed a time axis text in another shape, and for a caller of `ChartValues.TryToNumber`: pass a `DateTime`, or text in the
  wire's shape — `yyyy-MM-dd`, then a clock after a `T` or a space, then a zone, the last two optional.
- **A moment in a year under a hundred is placed on both sides.** The browser's reader took the years 1 to 99 for 1901 to 1999
  and dropped the point the server had placed; the framework's reader is fixed, and the server reads a moment through the
  framework's `UIWrittenMoment` rather than a copy of its own, both held to the framework's written-moment corpus.
- **Every chart cuts at a clip of its own.** A narrowed chart repeated down a list, or in a grid's details, named its clip by its
  component id alone, and every copy took the first copy's frame. The server's first frame now names a clip by the component id
  only where the chart stands once, and writes none in a row, a template or a copy — the framework's own rule for an id — so such a
  chart's first frame is drawn uncut until the browser's redraw, which takes an id from the page's run.
- **An axis over values too large for its step marks each value once.** A step below the precision of values like `1e17` left a
  running sum standing still, and the axis wrote one mark two hundred times; each mark is counted from the first, and one that
  rounds onto the one before is left out, in both ports.
- **The charts' words ship in Russian and Simplified Chinese.** `ChartsStrings.Translations` carries `ru` and `zh-Hans`, and an
  application turns them on with the framework's `application.AddFrameworkWords("ru", "zh-Hans")`: a registered chart package
  brings its table along, ranked below the application's own words. The Russian is new; the Chinese is the demo's. The demo keeps
  only its own `charts.*` words.

## 1.3.0

- **Needs the framework's plugin contract 2**, which this version is built against: the wheel's reading, the delayed
  tooltip, the disabled predicate, the framework's attribute names and the focus return a gone legend hands the chart
  (`popups.focusReturn`) now come from the framework rather than from copies.
- **A chart's words switch in place with the page.** The model carries the author's captions by their keys — an axis's and a
  series' (none where the series has none, the client naming it by its key) — and the client translates them at every draw,
  and draws every chart and gauge again when the page's words change. A gauge's unit and its caption, and a donut's centre
  caption, are drawn through the properties' own render, each on an element of its own — the unit in a span after the
  reading's number, the centre in a span over the hole — so a static one is written again at a switch and a bound one follows
  its pushes (a bound unit was read once at render). `CentreCaption` is bindable (`BindCentreCaption`), for a live total in the
  hole. This holds for a page rendered in any language and under `KeyPrefixes`. **Breaking**:
  `GaugeComponentRenderer.UnitAttribute` (`data-ui-gauge-unit`) is gone, and the reading's number is `.ui-gauge__number`
  inside `.ui-gauge__value`, the unit `.ui-gauge__unit` beside it. **Breaking**: `.ui-chart__centre` is an HTML span in
  `.ui-chart__area` laid over the hole in the page's own type, wrapped inside the square the hole holds, not an SVG `text` in
  the canvas (a stylesheet that set its `fill` sets `color`), and the model carries no `centreCaption`;
  `ChartComponentRendererBase.ReadCentre` and `ChartCentre` are gone — a renderer with a hole overrides `ReadDonut` and
  `RenderCentre`. **Breaking** for a script reading `data-ui-chart`: its captions are no longer the words shown.
- **A tooltip's and the canvas name's separators are words.** `ui.chart.point` (`{series} — {x}: {y}`), `ui.chart.sector`
  (`{label} — {value}`), `ui.chart.reading` (`{series}: {value}`, a shared tooltip's line) and `ui.chart.list`
  (`{list}, {next}`, the canvas's name) join the parts on both sides, so a language punctuates its own.
- **A wheel with nothing to change is the page's.** Over a zoomable chart already showing the whole, a wheel turned to widen
  it — or a swipe mostly sideways — no longer takes the page's scroll, redraws nothing and sends no window change; the new
  window is worked out before the event is taken. A notch is read through the framework's wheel (`context.wheel.pixels`);
  a page still counts 800 pixels here.
- **A double press on a zoomable chart is the zoom's gesture only.** It resets the window and runs no point command: on a
  zoomable chart a press on a point answers once no second press followed it (300 ms); on one that is not zoomable it
  answers at once.
- **A press that stays within the drag's slack is a press.** The window no longer moves by the few pixels a press wobbled,
  unsent, before the point's command ran.
- **Every band lies under every series' line and marks.** An area's bands and a radar's shapes are drawn in one layer,
  `g.ui-chart__bands`, under the series; a later series' band no longer takes an earlier one's points from the pointer. A
  band still answers the hover, the engine matching it to its series by key. **Breaking** for a stylesheet that reached a
  band as `.ui-chart__series > .ui-chart__fill`: it is `.ui-chart__bands > .ui-chart__fill`, carrying
  `data-ui-chart-series` and the series' colour itself.
- **The legend's hover keeps its word.** Hovering an entry whose series is put aside dims nothing, and the series being read
  through the legend, a band or a bar stays forward through a redraw.
- **A sector's tooltip stands by the sector**, at the middle of its own arc, rather than above the whole ring. **Breaking**
  for anything that read a sector's words: they are `data-ui-chart-tooltip`, shown by the engine, not `data-ui-tooltip`.
- **The shared tooltip waits as a hover does**, so a pointer only crossing the plot shows none, and it answers the plot
  alone, not the axes' labels around it — as the wheel, the drag and the double press now do. Its line no longer takes the
  pointer from the points it stands over, which made a point blink as the pointer crossed its x.
- **A press gives under it.** A pressable point's mark sinks back, and a bar or a sector thins, on the hover's own
  transitions. On a zoomable chart the point keeps that look from the release until its command runs or a second press calls
  it off (`ui-chart__point--pending`, the engine's mark, painted as under the pointer), so the double press's wait reads as
  taken rather than ending with the press.
- **A chart that turns disabled or loading lets go.** A press still waiting for a second answers nothing and its point
  drops the pressed look at once, a drag in hand stops moving the window, and a window still settling is not sent.
- **The legend is in step before the canvas is measured**, so a legend that changes width — a language switch, a series
  arriving — no longer paints one frame of the old drawing stretched into the new box.
- **The legend keeps the keyboard.** The legend is kept in step by key: an entry that stays keeps its button, written again
  in place — a language switch, a colour, another entry arriving or going — so a press, a hover or the keyboard on it
  survives the redraw. A keyboard on an entry whose series or sector went moves to the entry now in its place, and to the
  chart itself where the whole legend went, rather than falling to the page's body.
- **The pointer says what a press does.** `ui-chart--pressable` (a wired `OnPointClick`) gives a point, a bar and a sector
  the hand; `ui-chart--zoomable` gives the plot a grip — grabbing during a drag, over bars too — with no text selection and
  the browser's own pan left to the other axis (`ui-chart--horizontal` for bars on their side).
- **A press stays the chart's.** The legend, and a canvas that takes presses of its own, are event boundaries, so a
  clickable component around the chart no longer runs its command too; a canvas that takes none lets the press through.
- **A gauge with no reading draws no arc**, and one at its low end draws nothing either — the progress ring's rule. It said
  *no reading* over an arc drawn at zero, half full on a range around it.
- **Forced colours.** A series' colour is data: the series, their bands, the legend's key and a gauge's bands keep their
  own ink; the frame, its words and the rule take the system's text colour.
- The bare mark's outline and the legend mark's colour ease in with the rest instead of snapping.
- The legend's button classes are the framework's (`WebClassNames`; the client's base one `names.buttonClass`), a tooltip's
  attribute the framework's own name, and the engine refuses a disabled or loading chart through the framework's one
  predicate. Every name the client spells is in one module, `chart-names.ts`, held to the renderers' constants and
  `ChartsStrings` by a test, and every name the renderers write is a constant (`GaugeComponentRenderer.MinVariable`/
  `MaxVariable`, `ChartComponentRendererBase.LegendClassPrefix`). A gauge's reading of none draws nothing through the core's
  `.ui-arc-share()`.
- **The demo speaks Chinese whole.** Everything in it that is not data is a `charts.*` word — its page names and
  descriptions, the source button's *Code* and *Copy*, the sample buttons, the sparks' captions and the status lines, which
  carry their readings as arguments — and its zh-Hans table carries every framework, code field and chart word it registers,
  so the missing-word report in Development names only a real gap (`DemoWordsCoverageTests`). A section's title and note stay
  the author's prose, as the framework demo's samples do.
- **The demo shows what is bound.** The donut's centre caption is bound and changed by two buttons (a month's revenue, a
  year's); the processor gauge's caption names the reading's minute and its unit whether the load rose or fell, both bound
  and pushed with each reading; the dozen servers' bars on their side zoom, so a bar's pending look can be seen.
- **The demo's rows wrap.** The sparks, the gauges and the live line's three buttons stand in rows that wrap, so a phone or a
  tablet shows every gauge and button under one another rather than cutting the second and third off at the page's edge.

- **A line is drawn smooth at 100% scale.** Chrome's GPU rasteriser antialiases an SVG path at four samples a pixel, so a
  series' slope read as a staircase; a series' line, and a radar's outline, rim and rings, are now straight `<line>` pieces
  under one group, which it antialiases smoothly. A curve is cut into pieces about four pixels long. The arithmetic is
  `ChartPath.Segments` / `ChartRadar.Edges` and `lineSegments` / `radarEdges`, held to the shared corpus. A band's fill and a
  line's pointer reach stay paths. **Breaking** for a stylesheet that styled `path.ui-chart__line`: `.ui-chart__line` is now a
  `<g>` of `<line>`s, and its ends are square.
- **A chart and a gauge read in the ink of the ground they stand on.** In a component given a theme `Background` — a filled card —
  the axes, grid, tooltip rule, labels, captions, a switched-off legend key, a donut's centre and a gauge's reading, track and
  caption take that colour's on-colour, their muted words the framework's muted share of it, where they kept the page's ink and
  read dark on a dark fill. On the page's own ground nothing changes. The legend's entries, the framework's ghost buttons, take
  the on-colour with the framework (2.5:1 on a Primary card before).
- **A hollow marker and a sector's edge are cut out of the ground the chart stands on.** They painted the page's surface
  colour, so in a filled card every marker wore a surface-coloured ring and a pie's sectors were parted by surface-coloured
  lines; they now paint the framework's ground (`@ui-ground`, the `--ui-ground` a `Background` or a surface of its own writes).
  Beside a framework that writes no ground they fall back to the surface, as before.

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
