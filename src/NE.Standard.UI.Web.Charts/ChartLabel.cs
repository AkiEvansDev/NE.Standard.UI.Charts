namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// One mark of an axis: where it stands, and the words under it.
/// </summary>
/// <param name="Value">The value the mark stands at.</param>
/// <param name="Text">The value as the page's culture writes it.</param>
internal readonly record struct ChartLabel(double Value, string Text);
