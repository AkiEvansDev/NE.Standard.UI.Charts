# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.11.0

- `ShareBarComponent`: one series' points as parts of a single thin bar — a drive's storage, a budget, a context window. A
  bindable `Total` leaves what the parts do not take as the bar's empty track, named in the legend by `RemainderCaption` (else
  the package's *Remaining*, in Russian and Chinese too); a bindable `Caption` stands over the bar. The legend, the tooltip, the
  hover and `OnPointClick` are a pie's.
- `ShowLegendValues` on a pie and a share bar: the legend becomes a table of each part's value and its share of the whole.
- A category's name read off a decimal, a NaN or a large number is the page's text (`1.5`, not `1.50`): a chart drawn again in
  the browser put such a row at another place than the first frame.
- A legend beside the plot lines its entries up at their start: each was centred in a column as wide as the longest name, so
  the colour marks stood off one another's (a radar's by up to 12 px).
- A bar rests at 0.9 and presses at 0.75, as a sector and a share bar's segment do (0.85 and 0.7); the axis lines are a tooltip
  rule's 30 % ink (28 %); the gauge's ring is a progress track's 18 % (12 %).
