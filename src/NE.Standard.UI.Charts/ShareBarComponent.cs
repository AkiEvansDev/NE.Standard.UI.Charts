using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Charts;

/// <summary>
/// One series as parts of a single bar: a row's x names the part, its value is its length, and what the parts leave of a total is
/// the bar's empty track.
/// </summary>
public abstract partial class ShareBarComponent<T>(string? id = null) : ChartComponentBase<T>(id), IShareChartComponent
    where T : ShareBarComponent<T>, IUIComponentDefinition
{
    /// <inheritdoc/>
    [UIComponentProperty(Contract = typeof(IShareChartComponent), IsBindable = false, DefaultValue = false)]
    public bool ShowLegendValues { get; set; }

    /// <summary>
    /// Gets or sets the whole the parts are shares of; unset, or less than the parts come to, their own sum. What they leave of it
    /// is the bar's empty track, named in the legend.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public double? Total { get; set; }

    /// <summary>
    /// Gets or sets the words over the bar — what it shares out, how much of it is taken.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public UIPhrase? Caption { get; set; }

    /// <summary>
    /// Gets or sets what the legend calls the part of <see cref="Total"/> the rows leave, translated as a series' caption is; unset,
    /// the package's word.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public string? RemainderCaption { get; set; }
}

/// <summary>
/// One series as parts of a single bar, with what they leave of a total as its empty track.
/// </summary>
public sealed class ShareBarComponent(string? id = null) : ShareBarComponent<ShareBarComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "charts.share-bar";
}
