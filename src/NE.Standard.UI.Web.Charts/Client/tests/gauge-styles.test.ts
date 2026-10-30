// A gauge's root animates its reading and still fades as every root does when a bound Hidden turns it off.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/ui-charts.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;

test("a gauge's transition starts with the root's own list, then its reading", () => {
    const rule = /\.ui-gauge \{[^}]*\}/.exec(css)?.[0] ?? "";

    assert.match(rule, /transition: opacity [^;]*, visibility [^;]*allow-discrete, --ui-gauge-share /);
});
