# Changelog — Charts

Each section below becomes the GitHub release body for that tag (`v<version>` in `NE.Standard.UI.Charts`) and is removed from this file after the release is cut.

## 2.13.0

- **Content-marked series, axis, and share-bar remainder captions**: `UIChartSeries` and `UIChartAxis` add `.AsContent(bool)` (`IsContent`), and `ShareBarComponent.RemainderCaption` preserves `.AsContent(...)` across server rendering and client updates so literal user data captions are never looked up as translation keys.
- **Finite range validation on `GaugeComponent`**: `SetRange` and `AddBand` reject `NaN` and `±Infinity` bounds with `ArgumentOutOfRangeException`.
- Built on the framework's 2.13.0 release.
