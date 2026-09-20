using System;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Web.Charts;
using NE.Standard.UI.Web.Icons.Material;
using NE.Standard.UI.Web.Renderers.DI;
using NE.Standard.UI.Web.Startup;

namespace DemoApp.Charts.Web;

internal sealed class ChartsWebStartup : WebStartupBase<ChartsAppStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCharts();
        // Only the two glyphs the theme switcher wears: registering a whole Material style costs megabytes.
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Outlined, ChartsDemoView.LightIcon, ChartsDemoView.DarkIcon);
    }
}
