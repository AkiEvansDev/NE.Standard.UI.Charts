using System;
using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Charts.Desktop;

internal sealed class ChartsDesktopStartup : DesktopStartupBase<ChartsAppStartup>
{
    protected override void ConfigureHost(DesktopHostOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);
        options.WindowTitle = "NE.Standard — Charts";
        options.InitialWidth = 1400;
        options.InitialHeight = 880;
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddStandardRenderers();
        _ = services.AddCodeInput();
        _ = services.AddCharts();
        _ = services.AddMaterialWebIcons(MaterialIconStyle.Outlined, [ChartsDemoView.LightIcon, ChartsDemoView.DarkIcon, ChartsDemoView.CodeIcon, ChartsDemoView.CopyIcon, .. ChartsDemoView.PageIcons]);
    }
}
