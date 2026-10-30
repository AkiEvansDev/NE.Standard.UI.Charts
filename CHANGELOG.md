# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 2.0.0

- **Breaking:** `GaugeComponent.Caption` and `ShareBarComponent.Caption` are `Title`, a component's own words; the gauge's element
  is `ui-gauge__title`.
- **Breaking:** a bar chart's `Horizontal` is `Orientation` (`UIOrientation`, `Vertical` unless set), the name a stack panel's and a
  list's use: `SetOrientation(UIOrientation.Horizontal)`.
- **Breaking:** the charts' switches and their legend are unset until set, as the core's are: `Stacked`, `ShowTooltip`,
  `SharedTooltip`, `Zoomable`, `FollowLatest`, `Stepped`, `Smooth`, `ShowMarkers`, `ShowLegendValues` and `Bars` are `bool?`,
  `Legend` a `UIChartLegendPlacement?`, a pie's `Donut` and a gauge's `Min` and `Max` `double?`; their defaults are unchanged.
- **Breaking:** the share bar's title is drawn as `ui-chart__title` (`TitleClassName`, `RenderTitle`; was `HeadingClassName`,
  `RenderHeading`), and a bar chart's way travels in the model as `orientation` (`"Horizontal"`/`"Vertical"`), not `horizontal`.
- **Breaking:** a chart's accessible-name word is `ui.chart.name` (`ChartsStrings.Chart`, was `ui.chart.label`).
- **Breaking:** the window is held on the server: `VisibleRange` takes the page's window only while the chart zooms or follows the
  latest, otherwise its binding is one-way, and a pie, a share bar and a radar never take one, even bound two-way by hand
  (`Bind(...)`); a window with its ends the wrong way round or not finite is refused. A zoomable sparkline moves no window, so it
  refuses the page's and binds its window one way, as its renderer never zooms it.
- A zoomable pie, share bar or radar (no window, so nothing to zoom) no longer counts as a chart with pressable parts: a link or a
  clickable card may hold one whose legend is off and that has no point click.
- A gauge fades on a bound `Hidden` as every root does; a chart removed while 0×0 lets go of its size watch.
- `ChartComponentBase<TSelf>` gains `BindVisibleRange<TSource>(Expression<Func<TSource, object?>>, scope, mode)`.
