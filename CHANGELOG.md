# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 2.2.1

- `ShareBarComponent` renders its legend in a responsive multi-column CSS Grid (up to 4 columns by default) and adds
  `SetLegendColumns(int?)` / `LegendColumns` on `ChartComponentBase` to cap the column count (#274).
- `PieChartComponent` updates its rendered SVG when a bound `CentreCaption` changes at runtime (#279), and `ChartComponentRendererBase`
  hardens model and plot bounds. Built on the framework's 2.2.1.
