# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 2.1.1

- Guard non-finite (`NaN` / `Infinity`) and degenerate domain, share, pie, bubble and window arithmetic across server renderers and
  client chart engines. Built on the framework's 2.1.1.
