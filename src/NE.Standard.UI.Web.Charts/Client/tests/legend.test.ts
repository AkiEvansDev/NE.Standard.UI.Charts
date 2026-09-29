// The legend kept in step by key: an entry that stays keeps its button, so the keyboard and the pointer on it outlive a redraw, and
// the keyboard on an entry that went moves to its neighbour, or to the chart when the legend itself goes.

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import type { DomNames } from "ne-standard-ui";

import { element, installStubDom, real, resetStubDom, stubDocument } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

installStubDom();

const { syncLegend } = await import("../src/chart-legend.ts");
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
