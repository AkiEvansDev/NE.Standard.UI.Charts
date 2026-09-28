using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Charts;

/// <summary>Registers the charts' web rendering.</summary>
public static class ChartsWebExtensions
{
    private const string AssemblyName = "NE.Standard.UI.Web.Charts";

    /// <summary>
    /// Renders the charts: their renderers, the words their chrome writes, and the script and stylesheet the package embeds.
    /// Calling it twice registers nothing more.
    /// </summary>
    public static IServiceCollection AddCharts(this IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, LineChartComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, AreaChartComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, BarChartComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, PieChartComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, SparklineComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, ScatterChartComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, RadarChartComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IWebComponentRenderer, GaugeComponentRenderer>());
        services.TryAddEnumerable(ServiceDescriptor.Singleton<IUIStringsSource, ChartsStrings>());

        return services.AddPackageClient(AssemblyName, "ui-charts");
    }
}
