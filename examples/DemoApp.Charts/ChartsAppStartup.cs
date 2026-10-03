using System;

namespace DemoApp.Charts;

public sealed class ChartsAppStartup : UIStartupBase
{
    protected override void ConfigureApplication(UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _ = application.AddLocalizationSource(ChartsDemoWords.Build());

        // The framework's and its packages' own words in the demo's other languages, as they ship.
        _ = application.AddFrameworkWords("zh-Hans");

        // Only a string starting "charts." is a key: every other string on a translatable property is content, so the missing-word
        // report in Development names only words the demo has not translated.
        _ = application.ConfigureLocalization(options => options.KeyPrefixes.Add(ChartsDemoWords.KeyPrefix));

        // The focus ring in the brand's ink, as on every demo: the framework's default purple read 2.3:1 on the dark page.
        _ = application.ConfigureTheme(theme => theme
            .ConfigureLightPalette(static palette => palette with { FocusRing = palette.PrimaryInk })
            .ConfigureDarkPalette(static palette => palette with { FocusRing = palette.PrimaryInk }));

        _ = application.Route<LinesView, ChartsController>(ChartsDemoView.LinesRoute);
        _ = application.Route<AreasAndBarsView, ChartsController>(ChartsDemoView.AreasAndBarsRoute);
        _ = application.Route<PieAndScatterView, PlansController>(ChartsDemoView.PieAndScatterRoute);
        _ = application.Route<RadarView>(ChartsDemoView.RadarRoute);
        _ = application.Route<SparksAndGaugesView, ChartsController>(ChartsDemoView.SparksAndGaugesRoute);
    }
}
