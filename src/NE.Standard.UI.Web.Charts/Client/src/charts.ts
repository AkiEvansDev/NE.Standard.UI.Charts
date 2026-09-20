import "./styles/ui-charts.less";
import { ChartEngine, readChartWindow } from "./chart-engine.ts";
import { frameworkApi } from "./framework-api.ts";

const api = frameworkApi();

// The engine is what every registration below reaches into; it starts after every built-in one and before the page's first changes.
let engine: ChartEngine | null = null;

api.registerEngine(context => {
    engine = new ChartEngine(context);
});

// A chart takes its bound collection as values through the sink, including the initial reset and insert; no items host draws
// anything.
api.registerCollectionSink({ kind: "chart", handler: change => engine?.applyChange(change) });

// The window the viewer moved to is the chart's one writable value, written on a hidden element; a window the server pushes
// arrives here too.
api.registerValueReader({ kind: "chart-window", read: readChartWindow });

api.registerDomOperation({
    kind: "chart-window",
    handler: context => engine?.applyWindow(context.target, context.value, context.local)
});

// The viewer settled on a window: the value has reached the server by the time a command wired to this runs.
api.registerEvent("window-change", { settlesValue: true });

// A press on a point: the command's keys are the point's and its series', named by the chart rather than the `data-ui-key`
// chain, since a chart draws no rows to address by.
api.registerEvent<CustomEvent<{ point: string; series: string }>>("point-click", {
    dynamicParameters: context => [context.domEvent.detail?.point ?? "", context.domEvent.detail?.series ?? ""]
});

// A gauge's arc is the stylesheet's own work; its reading is written here, in the page's culture and the page's words.
api.registerDomOperation({
    kind: "chart-gauge-value",
    handler: context => engine?.applyGaugeValue(context.target, context.value)
});
