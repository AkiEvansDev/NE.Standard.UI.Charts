# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 2.1.0

- `SetSeriesPath(path, translate: true)` translates uncaptioned data-keyed series names as phrase keys without altering series
  keys, and `SetHideEmptySeries()` omits series with no placed readings from the legend and spoken canvas label while keeping their
  colour slots.
- Stacked `BarChartComponent` omits zero-valued `<rect>` bars and zero lines from `SharedTooltip` (an all-zero column shows no
  shared tooltip); side-by-side bars keep their 1 px baseline hairline.
- Typed `Expression<Func<TRow, object?>>` path overloads on `SetX`, `SetSeriesPath`, `SetValuePath` and `AddSeries`. Built on the
  framework's 2.1.0.
