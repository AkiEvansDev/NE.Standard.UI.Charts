# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.9.0

- A chart whose data spans more than a double can hold — values near the largest double on both sides of zero — draws: its
  range's width overflowed to infinity, and the server's render and the tab hung marking it.
- A zoomed line draws only the pieces that reach the plot, and a curve's pieces are capped at what the plot can show: a spike
  beside a zoomed window cut its curve into countless pieces and froze the tab.
- `FollowLatest` keeps the window the width it was given — it narrowed to a whole narrower than it and stayed that narrow —,
  follows nothing on a reset or with no data, and sends no window that did not change; a window first drawn on an older stretch
  stays there. A window ending at the newest point stands at the far end and follows: the last ten minutes did not, short of the
  axis's rounded end past it. A followed window ends on the newest point, not on an empty stretch to that rounded end, and slides
  only for a point past its end, not for a replace or a removal. The wheel, a drag and a double press read the window as
  drawn: on a chart already showing the whole, a drag or a double press does nothing and sends nothing, where a drag turned the
  whole into a window.
- `OnWindowChange` runs only when the viewer moved the window: a slide following the newest point ran it too, as if the viewer
  had moved it. A window the controller pushes while the viewer's wheel is still settling stands: the settled window was sent
  after it and put back as the viewer's.
- **Breaking:** a logarithmic x axis on a chart that names no x path is refused when the chart renders: its rows are numbered by
  their place from 0, which a logarithmic axis cannot place, and the first row had no place on it. Read the x from a row property with
  `SetX`, or keep the axis linear.
- A gauge whose reading is no number — NaN or an infinity — shows no reading, and a `Min` or `Max` that is none reads as unset, a
  band with such an end not drawn: they reached the arc's arithmetic as `NaN` and broke the arc.
- On a logarithmic axis a value at or below zero is a gap and an x at or below zero is no point: they sat on the axis's floor and
  pushed the positive values under the plot.
- A category axis looks its names up rather than searching them for every row, and the shared tooltip no longer searches the
  chart at every pointer move.
