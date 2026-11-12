# Changelog — Charts

Each section below becomes the GitHub release body for that tag (`v<version>` in `NE.Standard.UI.Charts`) and is removed from this file after the release is cut.

## 2.7.0

- **Breaking:** targets `.NET 11` (`net11.0`; building requires the `.NET 11` SDK).
- Replaced intermediate string allocations with `stackalloc` coordinate formatting and non-finite `NaN`/`Infinity` guards in `ChartPath`, culled off-viewport markers and path subruns while zoomed (`visibleSubruns` preserving Catmull-Rom tangents), and indexed live chart rows by key for linear row removals.
- Built on the framework's 2.7.0 release.
