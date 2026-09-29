using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Charts.Web;

internal sealed class ChartsWebStartup : WebStartupBase<ChartsAppStartup>
{
    protected override void ConfigureServices(IServiceCollection services)
        => ChartsWebServices.Register(services);
}
