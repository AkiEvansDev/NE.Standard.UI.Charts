// What a tap reads out of a chart: a sector's words at its arc's middle, a point's or a bar's own tooltip, nothing for a line or a
// band, and never a tooltip the chart's surroundings wrote.

import assert from "node:assert/strict";
import { test } from "node:test";

import { ChartAttributes, ChartClasses } from "../src/chart-names.ts";
import { spokenBy } from "../src/chart-words.ts";
import { element, real } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

const Tooltip = "data-ui-tooltip";

function chart(parent: StubElement | null = null): { root: StubElement; plot: StubElement } {
    const root = element("div", ChartClasses.root, {}, parent);
    const plot = element("g", ChartClasses.plot, {}, root);

    return { root, plot };
}

function read(target: StubElement, root: StubElement): { anchor: StubElement; words: string } | null {
    return spokenBy(real<Element>(target), real<Element>(root), Tooltip) as { anchor: StubElement; words: string } | null;
}

test("a sector speaks against the mark at its arc's middle, not the ring it is cut from", () => {
    const { root, plot } = chart();
    const series = element("g", ChartClasses.series, {}, plot);
    const sector = element("circle", ChartClasses.sector, { [ChartAttributes.sectorTooltip]: "Standard — 26.4" }, series);
    const mark = element("circle", ChartClasses.sectorAnchor, {}, series);

    assert.deepEqual(read(sector, root), { anchor: mark, words: "Standard — 26.4" });
});

test("a point's hit and a bar speak their own tooltip", () => {
    const { root, plot } = chart();
    const series = element("g", ChartClasses.series, {}, plot);
    const point = element("g", ChartClasses.point, {}, series);
    const hit = element("circle", ChartClasses.hit, { [Tooltip]: "Served — 09:00: 76" }, point);
    const bar = element("rect", ChartClasses.bar, { [Tooltip]: "Cached — 10:00: 38" }, series);

    assert.deepEqual(read(hit, root), { anchor: hit, words: "Served — 09:00: 76" });
    assert.deepEqual(read(bar, root), { anchor: bar, words: "Cached — 10:00: 38" });
});

test("a line or a band says nothing, though the tile around the chart has words of its own", () => {
    const tile = element("div", "tile", { [Tooltip]: "The tile" });
    const { root, plot } = chart(tile);
    const series = element("g", ChartClasses.series, {}, plot);
    const line = element("path", ChartClasses.lineHit, {}, series);
    const band = element("path", ChartClasses.fill, {}, plot);

    assert.equal(read(line, root), null);
    assert.equal(read(band, root), null);
});

test("a tooltip emptied of words says nothing", () => {
    const { root, plot } = chart();
    const bar = element("rect", ChartClasses.bar, { [Tooltip]: "  " }, plot);

    assert.equal(read(bar, root), null);
});
