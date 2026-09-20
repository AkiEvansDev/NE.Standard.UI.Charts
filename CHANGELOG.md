# Changelog

One section per release of this slice, headed `## X.Y.Z` and named by the tag — `charts/vX.Y.Z`. The release
workflow cuts the matching section out to become the body of the GitHub release, and a tag with no section
fails the release before anything is published.

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
