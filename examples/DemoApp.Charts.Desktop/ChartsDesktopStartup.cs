using System;
using DemoApp.Charts.Web;
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
        => ChartsWebServices.Register(services);
}
