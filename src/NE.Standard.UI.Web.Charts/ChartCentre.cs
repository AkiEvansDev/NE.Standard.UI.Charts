namespace NE.Standard.UI.Web.Charts;

/// <summary>
/// The middle of a chart with a hole: the donut's share of the radius, and the words written in it.
/// </summary>
/// <param name="Donut">How much of the radius the hole takes; none for a full pie.</param>
/// <param name="Caption">The words in the hole, already translated.</param>
public readonly record struct ChartCentre(double Donut, string? Caption);
