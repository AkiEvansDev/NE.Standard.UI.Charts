# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.7.2

- The plugin stylesheet's `@ui-button-live` reads the client's `data-ui-popup-hover` mark rather than a `:has()`.
- The plugin stylesheet's `@ui-field-focus` and `.ui-entry-quiet()` read the client's `data-ui-focus-within` mark rather than a
  `:has()`; `.ui-entry-quiet()` goes on the list or an element below its component root.
- The plugin stylesheet's `@ui-row-live` and `.ui-row-bar()` read the rows' `data-ui-row-idle` and `data-ui-row-bar` marks rather
  than a `:has()`; `.ui-row-bar()` takes no `@bar`.
- A chart's read series, bars and a donut's centre under the empty word are marks the engine writes (`ui-chart__series--back`,
  `ui-chart__bar--back`, `ui-chart__centre--hidden`, the last from the first paint), not a `:hover` read through `:has()`.
- Needs the framework's plugin contract 4.
- **Breaking:** an axis's ticks and tooltips, a pie's labels and a gauge's reading are written on the server by the formatters the
  page redraws with (`WebNumberFormat`, `WebTemporalFormat`), so the first frame and every redraw agree; a format outside their
  subsets (`0.0`, `G3`, `E2`, `#,##0`, a quoted time literal) is refused when the chart renders, where it threw on the server or
  broke the page's redraw; `D` on a double, which threw on the server, writes the rounded whole number (#152).
- A chart that fails to draw keeps its last frame and is reported; the other charts of the frame still draw (#152).
- The shared tooltip stays while the pointer glides from one part of the plot to another, rather than flickering and waiting again
  (#152).
- A patched row whose x is null is no point, as on the server, rather than a blank band; a numeric text is read by the framework's
  invariant reading, so a no-break space before it is no number (#152).
- A series' colour cycles by one count in both modes, so the ninth of ten light colours is the same on the first frame, in the
  legend and after a redraw (#152).
- A chart's and a gauge's `MinWidth` apply, at every tier; a zoomable chart's labels are unselectable in Safari too (#153).
- **Breaking:** a pie's sector says a point's words (`ui.chart.point`), naming its series — "Revenue, €k — Standard: 26.4" — and
  `ChartsStrings.Sector` (`ui.chart.sector`) is gone.
- A radar's ring values stand on the middle of each ring's first side, off the spoke every series has a corner on, and over the
  series in a halo of the ground, so neither a mark nor an outline covers them.
- A pie or a radar with a start or end legend stands on a box as wide as its turn needs, the two centred together, rather than the
  turn in the middle of the chart and the legend at its far edge.
- On a touch screen a tap reads a point, a bar, a sector or a shared tooltip's x as a hover does: the rest go back and its words
  show, until the next tap elsewhere; a finger's release no longer takes the reading away, and a swipe reads nothing.
- A series' or a category's caption holding `*`, `_` or a backtick reads as written in a tooltip, on a hover and a tap alike:
  the server and the client escape the captions and values where a point's words are composed (`UIInlineMarkup.Escape`,
  `tooltips.escape`), the words' own template kept.
