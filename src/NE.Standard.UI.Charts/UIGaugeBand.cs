using NE.Standard.UI.Abstractions.Styling;

namespace NE.Standard.UI.Charts;

/// <summary>
/// A stretch of a gauge's arc painted in its own colour — what counts as low, as fair, as too much.
/// </summary>
public sealed record UIGaugeBand
{
    /// <summary>Where the band begins, in the gauge's own values.</summary>
    public required double From { get; init; }

    /// <summary>Where it ends.</summary>
    public required double To { get; init; }

    /// <summary>The band's colour; unset, the next of the theme's categorical run.</summary>
    public UIThemeColor? Color { get; init; }
}
