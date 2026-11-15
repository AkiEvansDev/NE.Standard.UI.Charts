using System;

namespace DemoApp.Charts.Desktop;

internal static class Program
{
    [STAThread]
    private static int Main(string[] args)
        => DesktopStartupBuilder.Run<ChartsDesktopStartup, ChartsAppStartup>(args);
}
