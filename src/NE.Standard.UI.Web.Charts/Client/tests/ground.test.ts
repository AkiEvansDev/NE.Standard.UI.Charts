// A chart's cut-outs — a hollow marker, the stroke a hovered bare mark is ringed with, the edge between two sectors — paint the
// ground the chart stands on (the core's @ui-ground), so on a filled card they are not ringed in the page's surface.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/ui-charts.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const Ground = "var(--ui-ground, var(--ui-color-surface))";

/** The declarations of the first rule whose selector list starts with `selector`, or null. */
function declarations(selector: string): string | null {
    const start = css.indexOf(`\n${selector}`);

    return start < 0 ? null : css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
}

test("a hollow marker is filled with the ground the chart stands on", () => {
    assert.ok(declarations(".ui-chart__marker {")?.includes(`fill: ${Ground};`));
});

test("the edge between two sectors and a hovered bare mark's ring are drawn in the ground", () => {
    assert.ok(declarations(".ui-chart__sector-edge {")?.includes(`stroke: ${Ground};`));
    assert.ok(declarations(".ui-chart__point:hover > .ui-chart__marker--bare,")?.includes(`stroke: ${Ground};`));
});

test("no part of a chart paints the page's surface as a fixed colour", () => {
    assert.doesNotMatch(css.replaceAll(Ground, ""), /var\(--ui-color-surface\)/);
});
