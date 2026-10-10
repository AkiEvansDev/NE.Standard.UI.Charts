// The legend kept in step by key: an entry that stays keeps its button, so the keyboard and the pointer on it outlive a redraw, and
// the keyboard on an entry that went moves to its neighbour, or to the chart when the legend itself goes.

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import type { DomNames } from "ne-standard-ui";

import { element, installStubDom, real, resetStubDom, stubDocument } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

installStubDom();

const { fitTurn, legendFallsUnder, syncLegend } = await import("../src/chart-legend.ts");
const { ChartAttributes, ChartClasses, ClientNames } = await import("../src/chart-names.ts");

type Entry = Parameters<typeof syncLegend>[1][number];

const names = { eventBoundary: "data-ui-event-boundary", buttonClass: "ui-button" } as unknown as DomNames;

/** The entries as a legend of these keys names them, each caption its key's upper case. */
function entries(...keys: string[]): Entry[] {
    return keys.map((key, index) => ({ key, caption: key.toUpperCase(), color: `var(--ui-series-${index})` }));
}

function chart(): StubElement {
    return element("div", ChartClasses.root, {}, stubDocument.body);
}

// The framework's return, as far as a legend asks it: the opener it is handed, made focusable.
const returned: HTMLElement[] = [];

function focusReturn(opener: HTMLElement | null): HTMLElement | null {
    if (opener !== null) {
        returned.push(opener);
        opener.tabIndex = -1;
    }

    return opener;
}

function sync(root: StubElement, keys: string[], hidden: readonly string[] = []): void {
    syncLegend(real<HTMLElement>(root), entries(...keys), new Set(hidden), names, focusReturn);
}

function buttons(root: StubElement): StubElement[] {
    return root.querySelector(`.${ChartClasses.legend}`)?.children ?? [];
}

function keys(root: StubElement): (string | null)[] {
    return buttons(root).map(button => button.getAttribute(ChartAttributes.series));
}

beforeEach(() => {
    resetStubDom();
    returned.length = 0;
});

test("the same keys keep their buttons, each written again in place", () => {
    const root = chart();

    sync(root, ["west", "east"]);

    const before = buttons(root);

    before[1].focus();
    syncLegend(real<HTMLElement>(root), [{ key: "west", caption: "西欧", color: "red" }, { key: "east", caption: "东部", color: "blue" }], new Set(["east"]), names, focusReturn);

    const after = buttons(root);

    assert.equal(after[0], before[0]);
    assert.equal(after[1], before[1]);
    assert.equal(after[0].querySelector(`.${ChartClasses.legendCaption}`)?.textContent, "西欧");
    assert.equal(after[1].getAttribute("aria-pressed"), "false");
    assert.equal(after[1].classList.contains(ClientNames.legendOff), true);
    assert.equal(stubDocument.activeElement, before[1]);
});

test("an entry that comes or goes leaves every other button where it was, and the focus on its own", () => {
    const root = chart();

    sync(root, ["west", "east"]);

    const [west, east] = buttons(root);

    east.focus();
    sync(root, ["west", "central", "east"]);

    assert.deepEqual(keys(root), ["west", "central", "east"]);
    assert.equal(buttons(root)[0], west);
    assert.equal(buttons(root)[2], east);
    assert.equal(stubDocument.activeElement, east);

    sync(root, ["central", "east"]);

    assert.deepEqual(keys(root), ["central", "east"]);
    assert.equal(buttons(root)[1], east);
    assert.equal(stubDocument.activeElement, east);
});

test("a reorder moves the buttons and gives the focus back to the one it moved", () => {
    const root = chart();

    sync(root, ["west", "central", "east"]);

    const west = buttons(root)[0];

    west.focus();
    sync(root, ["east", "central", "west"]);

    assert.deepEqual(keys(root), ["east", "central", "west"]);
    assert.equal(buttons(root)[2], west);
    assert.equal(stubDocument.activeElement, west);
});

test("the keyboard on an entry that went moves to the entry now in its place, or the last one", () => {
    const root = chart();

    sync(root, ["west", "central", "east"]);
    buttons(root)[1].focus();
    sync(root, ["west", "east"]);

    assert.equal(stubDocument.activeElement, buttons(root)[1]);
    assert.equal(stubDocument.activeElement?.getAttribute(ChartAttributes.series), "east");

    sync(root, ["west"]);

    assert.equal(stubDocument.activeElement?.getAttribute(ChartAttributes.series), "west");
});

test("a legend that goes whole gives the keyboard to the chart through the framework's return", () => {
    const root = chart();

    sync(root, ["west"]);
    buttons(root)[0].focus();
    sync(root, []);

    assert.equal(root.querySelector(`.${ChartClasses.legend}`), null);
    assert.deepEqual(returned, [real<HTMLElement>(root)]);
    assert.equal(stubDocument.activeElement, root);
});

test("a legend that goes with no focus in it takes the focus from nothing", () => {
    const root = chart();
    const elsewhere = element("button", "", {}, stubDocument.body);

    sync(root, ["west"]);
    elsewhere.focus();
    sync(root, []);

    assert.equal(stubDocument.activeElement, elsewhere);
    assert.equal(returned.length, 0);
});

test("a side legend stands beside a plot it leaves 256 px or more, and under one it would leave less", () => {
    // A desktop column: 1000 px less a 110 px legend and the 8 px gap leaves the plot plenty.
    assert.equal(legendFallsUnder(1000, 110, 8), false);
    // A phone's 342 px leaves 224: the legend goes under.
    assert.equal(legendFallsUnder(342, 110, 8), true);
    // The edge: exactly the floor stays beside.
    assert.equal(legendFallsUnder(374, 110, 8), false);
    assert.equal(legendFallsUnder(373, 110, 8), true);
});

/** A chart area as the fitting reads it: its height, and the width written on it. */
function area(height: number): { clientHeight: number; style: { width: string } } {
    return { clientHeight: height, style: { width: "" } };
}

test("a turn beside its legend stands on an area as wide as it needs, and takes the width it is given anywhere else", () => {
    const root = chart();
    const pie = area(300);
    const radar = area(360);

    // A pie's turn is as wide as the area is high; a radar's adds the room its spoke names want beside the rim.
    fitTurn(real<HTMLElement>(root), pie as unknown as HTMLElement, "End", 0);
    assert.equal(pie.style.width, "300px");
    assert.equal(root.classList.contains(ClientNames.turnBeside), true);

    fitTurn(real<HTMLElement>(root), radar as unknown as HTMLElement, "Start", 88);
    assert.equal(radar.style.width, "448px");

    // Under the plot, or anywhere but beside it, nothing is fitted.
    root.classList.add(ClientNames.legendUnder);
    fitTurn(real<HTMLElement>(root), pie as unknown as HTMLElement, "End", 0);
    assert.equal(pie.style.width, "");
    assert.equal(root.classList.contains(ClientNames.turnBeside), false);

    root.classList.remove(ClientNames.legendUnder);
    fitTurn(real<HTMLElement>(root), pie as unknown as HTMLElement, "Bottom", 0);
    assert.equal(pie.style.width, "");

    // A chart that is no turn is never fitted.
    fitTurn(real<HTMLElement>(root), pie as unknown as HTMLElement, "End", null);
    assert.equal(pie.style.width, "");
});
