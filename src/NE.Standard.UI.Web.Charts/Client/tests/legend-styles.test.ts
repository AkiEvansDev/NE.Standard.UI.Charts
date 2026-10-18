// A legend down a chart's side is a column of entries stretched to the widest, each read from its start, so the marks line up.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/ui-charts.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("a side legend's entries start at the column's edge rather than centring their marks", () => {
    assert.ok(css.includes(`.ui-chart--legend-start > .ui-chart__legend > .ui-chart__legend-entry,
.ui-chart--legend-end > .ui-chart__legend > .ui-chart__legend-entry {
  justify-content: flex-start;
}`));
});
