# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 2.6.0

- Guarded `NaN` timestamps and clamped values to `[MinTime, MaxTime]` in `chart-moment.ts`, avoided passing X-axis categories when formatting Y-axis values in `chart-draw.ts` tooltips and columns, preserved `1 px` share-bar segments without negative width, and reused filtered `PartValues` in `RenderPie`.
- Built on the framework's 2.6.0 release.
