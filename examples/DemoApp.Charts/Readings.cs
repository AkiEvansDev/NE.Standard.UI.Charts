using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Charts;

/// <summary>
/// One reading of the machine: a moment with a number per series, which is the shape a chart reads when its series each name a
/// property of the row.
/// </summary>
internal sealed partial class Sample(string id, DateTime time, double cpu, double memory) : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; } = id;

    [RecursiveMember]
    public partial DateTime Time { get; set; } = time;

    [RecursiveMember]
    public partial double Cpu { get; set; } = cpu;

    [RecursiveMember]
    public partial double Memory { get; set; } = memory;
}

/// <summary>
/// One point of one series: the shape a chart reads when the series come from the data and a row names the one it belongs to.
/// </summary>
internal sealed partial class Reading(string id, int hour, string metric, double value) : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; } = id;

    [RecursiveMember]
    public partial int Hour { get; set; } = hour;

    [RecursiveMember]
    public partial string Metric { get; set; } = metric;

    [RecursiveMember]
    public partial double Value { get; set; } = value;
}

/// <summary>
/// A quarter's revenue by region: a row of a chart the page holds whole, with a name along the x axis rather than a number.
/// </summary>
internal sealed class Quarter : IBindableItem
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required double North { get; init; }

    public required double South { get; init; }
}

/// <summary>
/// One share of a whole: a row of a pie, named by its own words.
/// </summary>
internal sealed class Share : IBindableItem
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required double Visits { get; init; }
}

/// <summary>
/// A country as a bubble: two numbers to place it and a third to size it.
/// </summary>
internal sealed class Country : IBindableItem
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required double Income { get; init; }

    public required double Life { get; init; }

    public required double People { get; init; }
}

/// <summary>
/// The numbers the demo draws: a day of machine readings, a day of requests by kind, two years of revenue by quarter, and a
/// day's visits by where they came from.
/// </summary>
internal static class Catalogue
{
    private static readonly string[] Metrics = ["Served", "Cached", "Refused"];

    /// <summary>A reading a minute, the last <paramref name="count"/> of them, ending now.</summary>
    public static List<Sample> Samples(int count)
    {
        DateTime start = DateTime.Now.AddMinutes(-count);
        List<Sample> samples = new(count);

        for (var i = 0; i < count; i++)
            samples.Add(new Sample($"s{i}", start.AddMinutes(i), CpuAt(i), MemoryAt(i)));

        return samples;
    }

    /// <summary>The next reading after the last one the page holds.</summary>
    public static Sample NextSample(int index, DateTime after)
        => new($"s{index}", after.AddMinutes(1), CpuAt(index), MemoryAt(index));

    /// <summary>A day of requests, one row per hour and kind — the long form, where the series are the data's own.</summary>
    public static List<Reading> Requests()
    {
        List<Reading> readings = [];

        for (var hour = 0; hour < 24; hour++)
        {
            for (var metric = 0; metric < Metrics.Length; metric++)
            {
                // A working day's shape: a morning climb, a dip at noon, an afternoon peak.
                var load = 200 + (Math.Sin((hour - 6) / 3.4) * 160) + (hour > 12 ? 90 : 0);

                readings.Add(new Reading($"r{hour}-{metric}", hour, Metrics[metric], Math.Round(Math.Max(0, load / (metric + 1)))));
            }
        }

        return readings;
    }

    /// <summary>Eight quarters of revenue in two regions, in millions.</summary>
    public static List<Quarter> Quarters()
    {
        List<Quarter> quarters = [];

        for (var i = 0; i < 8; i++)
        {
            var year = 2024 + (i / 4);
            var quarter = (i % 4) + 1;

            quarters.Add(new Quarter
            {
                Id = $"q{i}",
                Name = $"Q{quarter} {year}",
                North = Math.Round(12 + (i * 1.8) + (quarter == 4 ? 6 : 0), 1),
                South = Math.Round(9 + (i * 1.1) + (quarter == 1 ? 4 : 0), 1)
            });
        }

        return quarters;
    }

    /// <summary>Where a day's visits came from — five sources that add up to a round number.</summary>
    public static List<Share> Sources()
        =>
        [
            new Share { Id = "search", Name = "Search", Visits = 4_820 },
            new Share { Id = "direct", Name = "Direct", Visits = 2_640 },
            new Share { Id = "social", Name = "Social", Visits = 1_310 },
            new Share { Id = "mail", Name = "Mail", Visits = 780 },
            new Share { Id = "other", Name = "Elsewhere", Visits = 450 }
        ];

    /// <summary>A dozen countries: income across, years of life up, and how many people in the size of the bubble.</summary>
    public static List<Country> Countries()
        =>
        [
            new Country { Id = "no", Name = "Norway", Income = 78_000, Life = 83.2, People = 5_400_000 },
            new Country { Id = "de", Name = "Germany", Income = 53_000, Life = 81.1, People = 83_200_000 },
            new Country { Id = "pl", Name = "Poland", Income = 35_000, Life = 78.0, People = 37_800_000 },
            new Country { Id = "pt", Name = "Portugal", Income = 34_000, Life = 81.6, People = 10_300_000 },
            new Country { Id = "jp", Name = "Japan", Income = 42_000, Life = 84.6, People = 125_700_000 },
            new Country { Id = "kr", Name = "Korea", Income = 44_000, Life = 83.4, People = 51_700_000 },
            new Country { Id = "br", Name = "Brazil", Income = 15_000, Life = 75.9, People = 214_300_000 },
            new Country { Id = "in", Name = "India", Income = 7_000, Life = 70.1, People = 1_407_600_000 },
            new Country { Id = "za", Name = "South Africa", Income = 13_000, Life = 64.9, People = 59_400_000 },
            new Country { Id = "mx", Name = "Mexico", Income = 19_000, Life = 75.1, People = 126_700_000 },
            new Country { Id = "us", Name = "United States", Income = 64_000, Life = 77.2, People = 331_900_000 },
            new Country { Id = "vn", Name = "Viet Nam", Income = 11_000, Life = 75.4, People = 97_500_000 }
        ];

    private static double CpuAt(int index)
        => Math.Round(Math.Clamp(42 + (Math.Sin(index / 5.0) * 22) + (index % 7 * 1.5), 0, 100), 1);

    private static double MemoryAt(int index)
        => Math.Round(Math.Clamp(61 + (Math.Cos(index / 8.0) * 9) + (index % 4), 0, 100), 1);
}
