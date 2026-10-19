# Changelog

This slice's changelog. It holds only what is not released yet, under `## X.Y.Z` (the tag is `charts/vX.Y.Z`): the release
workflow cuts that section out as the body of the GitHub release (a tag with no section fails the release), and the notes of every
released version live there — https://github.com/AkiEvansDev/NE.Standard.UI.Charts/releases.

## 1.13.0

- **Breaking:** a chart's captions are phrases, so a key with arguments fits where a string did: `UIChartSeries.Caption` and
  `AddSeries(key, caption, …)`, `UIChartAxis.Caption` and its `Linear`/`Time`/`Category`/`Logarithmic(caption, …)`, and
  `ShareBarComponent.RemainderCaption`. A string still converts as the author's text. The model on the page carries a text caption
  as before and a key as its phrase, which the page fills from its arguments again at every language switch (`strings.resolve`, so
  the add-on needs the framework's 1.13); the add-on's built script changes with it. Code reading a caption as a string reads its
  `Key` (the author's text where `IsText`, else the key to translate); a renderer overriding
  `ChartComponentRendererBase.ReadRemainderCaption` returns `UIPhrase?` where it returned `string?`.
- A chart's events take literal arguments as its other forms take bound ones: `OnPointClickLiteral(command, …)` — in place of the
  point's and its series' keys, for a command that needs no point — and `OnWindowChangeLiteral(command, …)`, the window still
  reaching the server through the bound `VisibleRange`.
- A chart whose own parts are presses — its legend, which hides and shows series, a zoom, a point's click — is a control a
  link (a card or a surface with `SetUrl`) may not hold, and the view refuses one when it compiles; a sparkline, with none, stands
  in a link as it did (`HasPressableParts`).
