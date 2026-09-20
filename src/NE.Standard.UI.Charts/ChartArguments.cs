using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Interaction;

namespace NE.Standard.UI.Charts;

/// <summary>
/// The keys a chart's click events pass to a command, addressed by position since charts have no item template.
/// </summary>
public static class ChartArguments
{
    /// <summary>The clicked point's key, which is the key of the row it was read from.</summary>
    public static KeyValuePair<string, UIActionArgument> Point(string name)
        => UIAction.ArgEventKey(name, 0);

    /// <summary>The clicked point's series, by the key the author gave it or the one the data named.</summary>
    public static KeyValuePair<string, UIActionArgument> Series(string name)
        => UIAction.ArgEventKey(name, 1);
}
