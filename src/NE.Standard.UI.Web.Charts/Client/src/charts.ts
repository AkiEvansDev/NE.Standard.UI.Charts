import "./styles/ui-charts.less";
import { ChartEngine, readChartWindow } from "./chart-engine.ts";
import { frameworkApi } from "./framework-api.ts";
import { ChartEvents, ChartOperations } from "./chart-names.ts";

const api = frameworkApi();
const engines = new Map<ParentNode, ChartEngine>();

api.registerEngine(context => {
    const engine = new ChartEngine(context);

    engines.set(context.root, engine);

    return {
        dispose(): void {
            if (engines.get(context.root) === engine)
                engines.delete(context.root);

            engine.dispose();
        }
    };
});

// A chart takes its bound collection as values through the sink, including the initial reset and insert; no items host draws
// anything.
api.registerCollectionSink({ kind: ChartOperations.sink, handler: change => engineFor(change.component)?.applyChange(change) });

// The window the viewer moved to is the chart's one writable value, written on a hidden element; a window the server pushes
// arrives here too.
api.registerValueReader({ kind: ChartOperations.window, read: readChartWindow });

api.registerDomOperation({
    kind: ChartOperations.window,
    handler: context => engineFor(context.target)?.applyWindow(context.target, context.value, context.local)
});

// The viewer settled on a window: the value has reached the server by the time a command wired to this runs.
api.registerEvent(ChartEvents.windowChange, { settlesValue: true });

// A press on a point: the command's keys are the point's and its series', named by the chart rather than the `data-ui-key`
// chain, since a chart draws no rows to address by.
api.registerEvent<CustomEvent<{ point: string; series: string }>>(ChartEvents.pointClick, {
    dynamicParameters: context => [context.domEvent.detail?.point ?? "", context.domEvent.detail?.series ?? ""]
});

// A share bar's total is read at every draw off its root; a bound one's push writes it there and draws the bar again.
api.registerDomOperation({
    kind: ChartOperations.total,
    handler: context => engineFor(context.target)?.applyTotal(context.target, context.value)
});

// A gauge's arc is the stylesheet's own work; its reading is written here, in the page's culture and the page's words.
api.registerDomOperation({
    kind: ChartOperations.gaugeValue,
    handler: context => engineFor(context.target)?.applyGaugeValue(context.target, context.value)
});

function engineFor(element: Element): ChartEngine | undefined {
    for (let current: Element | null = element; current !== null; current = current.parentElement) {
        const found = engines.get(current);

        if (found !== undefined)
            return found;
    }

    const rootNode = typeof element.getRootNode === "function" ? (element.getRootNode() as ParentNode) : undefined;

    return (rootNode !== undefined ? engines.get(rootNode) : undefined) ?? engines.get(element.ownerDocument ?? document);
}
