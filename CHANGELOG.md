# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.5.0

- **Built on the framework's 1.5.0.** Nothing of this package's own changed; it moves with the framework. Its copy of the plugin
  contract carries `validation.judge`, `validation.refuses`, `shortcuts.words` and `PopupOptions.boundary`/`surface`, and a row's
  item arrives without its nulls (`rows.readPath` answers null for them).
