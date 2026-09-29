using System;

namespace DemoApp.Charts;

public sealed class ChartsAppStartup : UIStartupBase
{
    protected override void ConfigureApplication(UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _ = application.AddLocalizationSource(ChartsDemoWords.Build());

        // Only a string starting "charts." is a key: every other string on a translatable property is content, so the missing-word
        // report in Development names only words the demo has not translated.
        _ = application.ConfigureLocalization(options => options.KeyPrefixes.Add(ChartsDemoWords.KeyPrefix));

        _ = application.Route<LinesView, ChartsController>(ChartsDemoView.LinesRoute);
        _ = application.Route<AreasAndBarsView, ChartsController>(ChartsDemoView.AreasAndBarsRoute);
        _ = application.Route<PieAndScatterView, PlansController>(ChartsDemoView.PieAndScatterRoute);
        _ = application.Route<RadarView>(ChartsDemoView.RadarRoute);
        _ = application.Route<SparksAndGaugesView, ChartsController>(ChartsDemoView.SparksAndGaugesRoute);
    }
}
