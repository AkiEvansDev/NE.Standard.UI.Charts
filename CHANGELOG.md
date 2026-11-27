# Changelog — Charts

Each section below becomes the GitHub release body for that tag (`v<version>` in `NE.Standard.UI.Charts`) and is removed from this file after the release is cut.

## 2.15.2

- Scopes the `ui-charts` stylesheet and script bundle per view via `WebPackageClient.AddPackageClient` required component types so pages without chart components omit the bundle, and builds on the framework's 2.15.2 release.
