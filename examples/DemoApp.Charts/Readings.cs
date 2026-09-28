using System;
using System.Collections.Generic;

namespace DemoApp.Charts;

/// <summary>
/// One reading of a server: a moment with a number per series, which is the shape a chart reads when its series each name a
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
/// A quarter's revenue in the three largest regions: a row of a chart the page holds whole, with a name along the x axis rather
/// than a number.
/// </summary>
internal sealed class Quarter : IBindableItem
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required double EuropeWest { get; init; }

    public required double EuropeCentral { get; init; }

    public required double UsEast { get; init; }
}

/// <summary>
/// One plan's share of a month's revenue: a row of a pie, named by its own words.
/// </summary>
internal sealed class PlanShare : IBindableItem
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required double Revenue { get; init; }
}

/// <summary>
/// One measure of a region's quarter, scored out of a hundred for three of the regions: a spoke of a radar, named by its own words.
/// </summary>
internal sealed class RegionScore : IBindableItem
{
    public required string Id { get; init; }

    public required string Measure { get; init; }

    public required double EuWest { get; init; }

    public required double UsEast { get; init; }

    public required double ApSouth { get; init; }
}

/// <summary>
/// A server as a bubble or a bar: the requests it serves and how busy it is to place it, and what it costs a month to size it.
/// </summary>
internal sealed class Server : IBindableItem
{
    public required string Id { get; init; }

    public required string Name { get; init; }

    public required double Cost { get; init; }

    public required double Cpu { get; init; }

    public required double Requests { get; init; }
}

/// <summary>
/// The numbers the demo draws, after <c>docs/DEMO-THEME.md</c>: a server's readings, a day of requests by kind, two years of
/// revenue by quarter, a month's revenue by plan, a dozen servers, and three regions' scorecards.
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

    /// <summary>The eight quarters up to the present one, in thousands of euros: about forty in all at the start, a hundred and sixty now.</summary>
    public static List<Quarter> Quarters()
    {
        List<Quarter> quarters = [];

        for (var i = 0; i < 8; i++)
        {
            // From the last quarter of 2024 to the third of 2026.
            var year = 2024 + ((i + 3) / 4);
            var quarter = ((i + 3) % 4) + 1;

            quarters.Add(new Quarter
            {
                Id = $"q{i}",
                Name = $"Q{quarter} {year}",
                // Europe West the largest, and the end of a year its busiest quarter.
                EuropeWest = Math.Round(20 + (i * 7.6) + (quarter == 4 ? 3 : 0), 1),
                EuropeCentral = Math.Round(14 + (i * 5.1), 1),
                UsEast = Math.Round(6 + (i * 4.3) + (quarter == 1 ? 1.5 : 0), 1)
            });
        }

        return quarters;
    }

    /// <summary>What the four plans brought in this month, in thousands of euros: Standard the most, Starter the least.</summary>
    public static List<PlanShare> Plans()
        =>
        [
            new PlanShare { Id = "starter", Name = "Starter", Revenue = 9.8 },
            new PlanShare { Id = "standard", Name = "Standard", Revenue = 26.4 },
            new PlanShare { Id = "pro", Name = "Pro", Revenue = 21.1 },
            new PlanShare { Id = "dedicated", Name = "Dedicated", Revenue = 11.6 }
        ];

    /// <summary>A dozen of the fleet's servers: the plan's price a month, the average CPU over the day, and the requests a minute.</summary>
    public static List<Server> Servers()
        =>
        [
            new Server { Id = "api-eu-west-1", Name = "api-eu-west-1", Cost = 64, Cpu = 58, Requests = 4_200 },
            new Server { Id = "api-eu-west-2", Name = "api-eu-west-2", Cost = 64, Cpu = 46, Requests = 3_600 },
            new Server { Id = "web-eu-west-1", Name = "web-eu-west-1", Cost = 18, Cpu = 34, Requests = 2_900 },
            new Server { Id = "db-eu-west-1", Name = "db-eu-west-1", Cost = 290, Cpu = 71, Requests = 1_800 },
            new Server { Id = "cache-eu-west-1", Name = "cache-eu-west-1", Cost = 18, Cpu = 22, Requests = 5_100 },
            new Server { Id = "api-eu-central-1", Name = "api-eu-central-1", Cost = 64, Cpu = 52, Requests = 3_100 },
            new Server { Id = "db-eu-central-1", Name = "db-eu-central-1", Cost = 290, Cpu = 63, Requests = 1_200 },
            new Server { Id = "queue-eu-central-1", Name = "queue-eu-central-1", Cost = 18, Cpu = 28, Requests = 900 },
            new Server { Id = "web-eu-north-1", Name = "web-eu-north-1", Cost = 6, Cpu = 17, Requests = 640 },
            new Server { Id = "api-us-east-1", Name = "api-us-east-1", Cost = 64, Cpu = 67, Requests = 3_900 },
            new Server { Id = "storage-us-east-1", Name = "storage-us-east-1", Cost = 18, Cpu = 12, Requests = 1_500 },
            new Server { Id = "api-ap-south-1", Name = "api-ap-south-1", Cost = 18, Cpu = 81, Requests = 2_200 }
        ];

    /// <summary>
    /// Three regions' quarter, each measure scored out of a hundred: Europe West the steady one, US East the busiest, Asia South
    /// the newest — cheap and roomy, not yet as quick to answer.
    /// </summary>
    public static List<RegionScore> Scores()
        =>
        [
            new RegionScore { Id = "uptime", Measure = "Uptime", EuWest = 96, UsEast = 91, ApSouth = 88 },
            new RegionScore { Id = "latency", Measure = "Latency", EuWest = 84, UsEast = 78, ApSouth = 62 },
            new RegionScore { Id = "headroom", Measure = "Headroom", EuWest = 58, UsEast = 34, ApSouth = 90 },
            new RegionScore { Id = "cost", Measure = "Cost per seat", EuWest = 72, UsEast = 66, ApSouth = 85 },
            new RegionScore { Id = "support", Measure = "Support", EuWest = 88, UsEast = 80, ApSouth = 70 },
            new RegionScore { Id = "growth", Measure = "Growth", EuWest = 40, UsEast = 64, ApSouth = 94 }
        ];

    private static double CpuAt(int index)
        => Math.Round(Math.Clamp(42 + (Math.Sin(index / 5.0) * 22) + (index % 7 * 1.5), 0, 100), 1);

    private static double MemoryAt(int index)
        => Math.Round(Math.Clamp(61 + (Math.Cos(index / 8.0) * 9) + (index % 4), 0, 100), 1);
}
