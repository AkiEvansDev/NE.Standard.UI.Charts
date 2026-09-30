// The plot's clip: every chart cuts at a frame of its own, however many copies of one component a list or a grid's details draw,
// since `url(#id)` takes the first element of that id in the document.

import assert from "node:assert/strict";
import test from "node:test";

import { element, installStubDom, real } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

installStubDom();

const { clipPlot } = await import("../src/chart-draw.ts");
const { ChartClasses } = await import("../src/chart-names.ts");

type State = Parameters<typeof clipPlot>[2];
type Formatting = Parameters<typeof clipPlot>[4];

const plot = { left: 40, top: 10, width: 200, height: 100 };

// The framework's run of ids, as far as a clip asks it.
let issued = 0;
const formatting = {
    ensureId: (target: StubElement, prefix: string): string => {
        target.setAttribute("id", `${prefix}-${++issued}`);

        return `${prefix}-${issued}`;
    }
} as unknown as Formatting;

/** One copy of a chart component: the same component id on every copy, as a list's rows draw it. */
function copy(): { canvas: StubElement; group: StubElement; state: State } {
    const root = element("div", ChartClasses.root, { "data-ui-id": "12" });

    return { canvas: element("svg", "", {}, root), group: element("g", ChartClasses.plot), state: { root, clip: null } as unknown as State };
}

function cut(chart: ReturnType<typeof copy>): string | null {
    clipPlot(real(chart.canvas), real(chart.group), chart.state, plot, formatting);

    return chart.group.getAttribute("clip-path");
}

test("two copies of one chart component cut at clips of their own, apart from the server's first frame", () => {
    const first = copy();
    const second = copy();
    const firstClip = cut(first);
    const secondClip = cut(second);

    assert.notEqual(firstClip, secondClip);
    assert.equal(firstClip, `url(#${first.canvas.children[0].getAttribute("id")})`);
    assert.equal(secondClip, `url(#${second.canvas.children[0].getAttribute("id")})`);
    assert.ok(!/^url\(#ui-chart-clip-\d/.test(firstClip ?? ""));
});

test("a chart drawn again keeps the id its clip first took", () => {
    const chart = copy();
    const before = cut(chart);

    chart.canvas.children[0].remove();

    assert.equal(cut(chart), before);
    assert.equal(chart.canvas.children[0].getAttribute("id"), chart.state.clip);
});
