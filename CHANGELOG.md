# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.8.5

- A bound collection holding a null item, or one whose x cannot be read, no longer shifts a later change onto the wrong point.
- A gauge's value given as text is read as an invariant number, as the server writes it.
