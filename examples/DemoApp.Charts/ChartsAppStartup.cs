using System;
using NE.Standard.UI.Application;
using NE.Standard.UI.Startup;

namespace DemoApp.Charts;

public sealed class ChartsAppStartup : UIStartupBase
{
    protected override void ConfigureApplication(UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _ = application.Route<LinesView, ChartsController>(ChartsDemoView.LinesRoute);
        _ = application.Route<AreasAndBarsView, ChartsController>(ChartsDemoView.AreasAndBarsRoute);
        _ = application.Route<PieAndScatterView>(ChartsDemoView.PieAndScatterRoute);
        _ = application.Route<SparksAndGaugesView, ChartsController>(ChartsDemoView.SparksAndGaugesRoute);
    }
}
