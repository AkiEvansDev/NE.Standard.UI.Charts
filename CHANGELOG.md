# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.10.0

- `UIChartAxis.Category(translate: true)` (`UIChartAxis.TranslateNames`) reads a category's names as keys of the page's words — a
  pie's sectors, a bar chart's places, a radar's spokes — translated as a series' caption is: in the ticks, the legend, the
  tooltips and the canvas's name, on the first frame and at every draw, so a language switch follows. Without it a name is written
  as the rows hold it, as before.
