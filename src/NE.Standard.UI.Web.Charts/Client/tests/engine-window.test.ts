// The engine's window over a live chart: what a drag, a double press and a point's arrival do to it, and when it is sent — read
// off the chart's window element, where the engine writes what it sends — and when the chart says the viewer moved it.

import assert from "node:assert/strict";
import test from "node:test";

import type { PluginEngineContext } from "ne-standard-ui";
import type { ChartModel } from "../src/chart-model.ts";
import { ChartAttributes, ChartClasses, ChartEvents } from "../src/chart-names.ts";
import type { Span } from "../src/chart-window.ts";
import { readNumber } from "./framework-numbers.ts";
import { element, installStubDom, real, resetStubDom, StubElement, stubDocument } from "./stub-dom.ts";

/** A pointer as the engine reads one: where it stands, what it pressed, and that it is a mouse's. */
class StubMouseEvent {
    public readonly type: string;
    public readonly target: StubElement;
    public readonly clientX: number;
    public readonly clientY = 100;
    public readonly button = 0;
    public readonly pointerType = "mouse";
    public defaultPrevented = false;

    public constructor(type: string, target: StubElement, clientX: number) {
        this.type = type;
        this.target = target;
        this.clientX = clientX;
    }

    public preventDefault(): void {
        this.defaultPrevented = true;
    }
}

class StubPointerEvent extends StubMouseEvent {}

class StubWheelEvent extends StubMouseEvent {}

type Listener = (domEvent: unknown) => void;

const frames: (() => void)[] = [];
const timers = new Map<number, () => void>();
const windowListeners = new Map<string, Listener[]>();
let nextTimer = 0;

installStubDom();
Object.assign(globalThis, {
    Element: StubElement,
    MouseEvent: StubMouseEvent,
    PointerEvent: StubPointerEvent,
    WheelEvent: StubWheelEvent,
    requestAnimationFrame: (callback: () => void) => frames.push(callback),
    window: {
        setTimeout: (callback: () => void) => {
            timers.set(++nextTimer, callback);

            return nextTimer;
        },
        clearTimeout: (timer: number) => timers.delete(timer),
        addEventListener: (type: string, listener: Listener) => windowListeners.set(type, [...(windowListeners.get(type) ?? []), listener]),
        removeEventListener: (type: string, listener: Listener) => windowListeners.set(type, (windowListeners.get(type) ?? []).filter(each => each !== listener))
    }
});

const { ChartEngine } = await import("../src/chart-engine.ts");

const axis = { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, translate: false, caption: null } as const;
const model: ChartModel = {
    kind: "line",
    x: axis,
    y: axis,
    series: [{ key: "value", caption: "value", valuePath: "Value", sizePath: null, color: null, stepped: null, smooth: null, markers: null }],
    xPath: "X",
    seriesPath: null,
    valuePath: null,
    legend: "None",
    tooltip: true,
    stepped: false,
    smooth: false,
    markers: false,
    stacked: false,
    sharedTooltip: false,
    zoomable: true,
    followLatest: true,
    horizontal: false,
    bare: false,
    donut: 0,
    legendValues: false,
    remainderCaption: null
};

/** A page holding one live line chart over x = 0, 10 … 100 (or the x's given), drawn on a 400 by 200 canvas, the engine running it. */
function livePage(view: Span | null, xs: readonly number[] = Array.from({ length: 11 }, (_, i) => i * 10)) {
    resetStubDom();
    frames.length = 0;
    timers.clear();
    windowListeners.clear();

    const listeners = new Map<string, Listener[]>();
    const page = element("div", "");

    Object.assign(page, { addEventListener: (type: string, listener: Listener) => listeners.set(type, [...(listeners.get(type) ?? []), listener]) });

    const rows = xs.map((x, i) => [`r${x}`, String(x), [i]]);
    const chart = element("div", ChartClasses.root, { [ChartAttributes.model]: JSON.stringify(model), [ChartAttributes.rows]: JSON.stringify(rows) }, page);
    const canvas = element("svg", ChartClasses.canvas, {}, element("div", ChartClasses.area, {}, chart));
    const windowElement = element("input", ChartClasses.window, view === null ? {} : { [ChartAttributes.window]: JSON.stringify(view) }, chart);
    let sent = 0;
    let raised = 0;
    let inert = false;

    Object.assign(canvas, { getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 200 }) });
    Object.assign(windowElement, {
        dispatchEvent: () => {
            sent++;

            return true;
        }
    });
    Object.assign(chart, {
        dispatchEvent: (domEvent: Event) => {
            if (domEvent.type === ChartEvents.windowChange)
                raised++;

            return true;
        }
    });
    stubDocument.body.append(page);

    const context = {
        root: page,
        numbers: { parseInvariant: readNumber, readCulture: () => ({}), format: (value: number) => String(value) },
        temporal: { parse: () => null, readCulture: () => ({}) },
        strings: { text: (key: string) => key, format: (key: string) => key, resolveText: (text: string) => text, resolve: (words: string) => words, onChange: () => {} },
        names: { tooltip: "data-tooltip" },
        popups: { focusReturn: () => null },
        dom: { ensureId: (_target: StubElement, prefix: string) => `${prefix}-1` },
        colors: { count: () => 8, color: () => "red" },
        tooltips: { escape: (text: string) => text, show: () => {}, hide: () => {} },
        states: { isInert: () => inert },
        // A notch towards the reader: the window narrows.
        wheel: { pixels: () => ({ x: 0, y: -100 }), notch: 100 },
        observeSize: () => () => {},
        rows: { readPath: (item: unknown, path: string) => (item as Record<string, unknown>)[path] },
        observeComponents: () => {}
    };
    const engine = new ChartEngine(context as unknown as PluginEngineContext);

    settle();

    return {
        /** A point arriving at the far end, its x past every other. */
        arrive: (x: number): void => {
            engine.applyChange({ component: real(chart), action: "Insert", items: [{ key: `r${x}`, oldKey: null, index: null, item: { X: x, Value: 1 } }], moves: [] } as unknown as Parameters<typeof engine.applyChange>[0]);
            settle();
        },
        /** The point of that x changed in place: no point arrives. */
        replace: (x: number): void => {
            engine.applyChange({ component: real(chart), action: "Replace", items: [{ key: `r${x}`, oldKey: `r${x}`, index: null, item: { X: x, Value: 2 } }], moves: [] } as unknown as Parameters<typeof engine.applyChange>[0]);
            settle();
        },
        /** The point of that x gone. */
        remove: (x: number): void => {
            engine.applyChange({ component: real(chart), action: "Remove", items: [{ key: `r${x}`, oldKey: `r${x}`, index: null, item: null }], moves: [] } as unknown as Parameters<typeof engine.applyChange>[0]);
            settle();
        },
        /** A press on the plot's middle, dragged across `by` pixels and let go — after `beforeRelease`, where one is given. */
        drag: (by: number, beforeRelease?: () => void): void => {
            fire(listeners, "pointerdown", new StubPointerEvent("pointerdown", canvas, 200));
            fire(windowListeners, "pointermove", new StubPointerEvent("pointermove", canvas, 200 + by));
            beforeRelease?.();
            fire(windowListeners, "pointerup", new StubPointerEvent("pointerup", canvas, 200 + by));
            settle();
        },
        /** A notch of the wheel over the plot's middle, drawn and left settling; whether the chart took it. */
        wheel: (): boolean => {
            const notch = new StubWheelEvent("wheel", canvas, 200);

            fire(listeners, "wheel", notch);

            for (const frame of frames.splice(0))
                frame();

            return notch.defaultPrevented;
        },
        /** Two presses on the plot's middle. */
        reset: (): void => {
            fire(listeners, "dblclick", new StubMouseEvent("dblclick", canvas, 200));
            settle();
        },
        /** A window the server pushed, as a bound range written by the controller. */
        push: (view: Span): void => {
            engine.applyWindow(real(windowElement), view, false);
            settle();
        },
        /** The chart turned disabled or loading, or back. */
        setInert: (value: boolean): void => {
            inert = value;
        },
        sent: () => sent,
        /** How many times the chart said the viewer moved its window. */
        raised: () => raised,
        window: () => windowElement.getAttribute(ChartAttributes.window)
    };
}

function fire(listeners: ReadonlyMap<string, Listener[]>, type: string, domEvent: StubMouseEvent): void {
    for (const listener of listeners.get(type) ?? [])
        listener(domEvent);
}

/** The frames the engine asked for drawn, then the windows it was settling sent. */
function settle(): void {
    for (const frame of frames.splice(0))
        frame();

    for (const [timer, callback] of [...timers]) {
        timers.delete(timer);
        callback();
    }
}

test("a drag over a window narrower than the whole moves it and sends it on the release", () => {
    const page = livePage({ from: 20, to: 60 });

    page.drag(-100);

    assert.equal(page.sent(), 1);
    assert.notEqual(page.window(), JSON.stringify({ from: 20, to: 60 }));
});

test("a drag over a chart showing the whole of its data moves nothing and sends nothing", () => {
    const page = livePage(null);

    page.drag(-100);

    assert.equal(page.sent(), 0);
    assert.equal(page.window(), null);
});

test("a drag over a window wider than the data, kept for the data to grow into, leaves it that wide and sends nothing", () => {
    const page = livePage({ from: -100, to: 100 });

    page.drag(-100);

    assert.equal(page.sent(), 0);
    assert.equal(page.window(), JSON.stringify({ from: -100, to: 100 }));
});

test("two presses on a chart showing the whole of its data say nothing, a window wider than the data included", () => {
    const page = livePage({ from: -100, to: 100 });

    page.reset();

    assert.equal(page.sent(), 0);
    assert.equal(page.window(), JSON.stringify({ from: -100, to: 100 }));
});

test("two presses on a window narrower than the whole give the whole back and say so", () => {
    const page = livePage({ from: 20, to: 60 });

    page.reset();

    assert.equal(page.sent(), 1);
    assert.equal(page.window(), null);
});

test("a followed window ends at the newest point, not at the axis's rounded end past it", () => {
    const page = livePage({ from: 60, to: 100 });

    // Past the axis' last step, the whole grows to 120; the window ends where the data does.
    page.arrive(101);
    assert.equal(page.sent(), 1);
    assert.equal(page.window(), JSON.stringify({ from: 61, to: 101 }));

    page.arrive(102);
    assert.equal(page.sent(), 2);
    assert.equal(page.window(), JSON.stringify({ from: 62, to: 102 }));
});

test("a change that brings no point past a followed window leaves it where it stood and sends nothing", () => {
    const page = livePage({ from: 87, to: 97 }, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 97]);

    page.replace(97);
    page.remove(90);

    assert.equal(page.sent(), 0);
    assert.equal(page.window(), JSON.stringify({ from: 87, to: 97 }));
});

test("a point arriving inside a window that reaches past the newest one slides nothing", () => {
    const page = livePage(null, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 97]);

    page.push({ from: 90, to: 100 });
    page.arrive(98);

    assert.equal(page.sent(), 0);
    assert.equal(page.window(), JSON.stringify({ from: 90, to: 100 }));
});

test("a window first drawn on an older stretch stays there as points arrive", () => {
    const page = livePage({ from: 10, to: 30 });

    page.arrive(101);

    assert.equal(page.sent(), 0);
});

test("a window wider than the data, first drawn as the whole, follows the points arriving though it ends short of the axis", () => {
    const page = livePage({ from: -100, to: 95 });

    page.arrive(101);

    const followed = JSON.parse(page.window() ?? "null") as Span;

    assert.equal(page.sent(), 1);
    assert.equal(followed.to - followed.from, 195);
    assert.ok(followed.to >= 101);
});

test("a window the chart slides along after the data writes the bound range and says nothing of the viewer", () => {
    const page = livePage({ from: 60, to: 100 });

    page.arrive(110);

    assert.equal(page.sent(), 1);
    assert.equal(page.raised(), 0);
});

test("a drag and two presses are the viewer's, said once each", () => {
    const page = livePage({ from: 50, to: 90 });

    // Dragged onto the far end, where the window follows the data.
    page.drag(-200);
    assert.equal(page.sent(), 1);
    assert.equal(page.raised(), 1);

    // A slide after it is the chart's own again.
    page.arrive(110);
    assert.equal(page.sent(), 2);
    assert.equal(page.raised(), 1);

    page.reset();
    assert.equal(page.sent(), 3);
    assert.equal(page.raised(), 2);
});

test("a drag the chart let go of as it turned inert is not the viewer's at the next slide", () => {
    const page = livePage({ from: 50, to: 90 });

    page.drag(-200, () => page.setInert(true));
    assert.equal(page.sent(), 0);

    page.setInert(false);
    page.arrive(110);

    assert.equal(page.sent(), 1);
    assert.equal(page.raised(), 0);
});

test("a window the server pushes while a wheel's settles is not sent back as the viewer's", () => {
    const page = livePage({ from: 20, to: 60 });

    assert.ok(page.wheel());

    page.push({ from: 30, to: 50 });

    assert.equal(page.sent(), 0);
    assert.equal(page.raised(), 0);
    assert.equal(page.window(), JSON.stringify({ from: 30, to: 50 }));
});

test("a window ending at the newest point follows the data, though the axis is rounded past it", () => {
    const page = livePage({ from: 87, to: 97 }, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 97]);

    page.arrive(105);

    const followed = JSON.parse(page.window() ?? "null") as Span;

    assert.equal(page.sent(), 1);
    assert.equal(page.raised(), 0);
    assert.ok(followed.to >= 105);
    assert.ok(Math.abs(followed.to - followed.from - 10) < 1e-9);
});

test("a window the server pushes to end at the newest point follows the data too", () => {
    const page = livePage(null, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 97]);

    page.push({ from: 87, to: 97 });
    page.arrive(105);

    assert.equal(page.sent(), 1);
    assert.equal(page.raised(), 0);
    assert.ok((JSON.parse(page.window() ?? "null") as Span).to >= 105);
});

test("a window ending short of the newest point stays where it was put", () => {
    const page = livePage({ from: 80, to: 90 }, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 97]);

    page.arrive(105);

    assert.equal(page.sent(), 0);
    assert.equal(page.window(), JSON.stringify({ from: 80, to: 90 }));
});
