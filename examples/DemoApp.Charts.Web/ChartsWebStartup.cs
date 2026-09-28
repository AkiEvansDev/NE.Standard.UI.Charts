using System;
using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Charts.Web;

internal sealed class ChartsWebStartup : WebStartupBase<ChartsAppStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCodeInput();
        _ = services.AddCharts();
        // Only the glyphs the shell wears: registering a whole Material style costs megabytes.
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Outlined, ChartsDemoView.LightIcon, ChartsDemoView.DarkIcon, ChartsDemoView.CodeIcon, ChartsDemoView.CopyIcon);
    }
}
