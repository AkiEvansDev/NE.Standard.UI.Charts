// One value per meaning: a part of a whole (a bar, a sector, a share bar's segment) rests and presses at one opacity each, what goes
// back while another is read goes back as far, the frame's firm lines are one ink, and every track — a share bar's rest, the gauge's
// ring — is the core's progress track share.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import less from "less";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/ui-charts.less");
const css = (await less.render(readFileSync(source, "utf8"), { filename: source })).css;
const plugin = resolve(dirname(fileURLToPath(import.meta.url)), "../plugin/ne-standard-ui.less");
// The probe is a file of its own: named as the plugin, it imported nothing where the paths match (Linux), the file taken as read.
const trackShare = (await less.render(`@import (reference) "${plugin.replaceAll("\\", "/")}";\n.t { --share: @ui-track-share; }`, { filename: fileURLToPath(import.meta.url) })).css;

/** The value of `property` in every rule whose selector, as compiled, is exactly `selector`. */
function values(selector: string, property: string): string[] {
    return [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
        .filter(match => match[1].trim() === selector)
        .flatMap(match => [...match[2].matchAll(new RegExp(`(?:^|;)\\s*${property}: ([^;]+);`, "g"))].map(value => value[1]));
}

function one(found: string[]): string {
    assert.ok(found.length > 0);
    assert.equal(new Set(found).size, 1, found.join(" | "));

    return found[0];
}

test("a bar, a sector and a segment rest at one opacity and press at another", () => {
    const rest = one([...values(".ui-chart__bar", "fill-opacity"), ...values(".ui-chart__sector", "stroke-opacity"), ...values(".ui-chart__segment", "fill-opacity")]);

    assert.equal(rest, "0.9");

    const press = one([...css.matchAll(/:active[^{]*\{\s*(?:fill|stroke)-opacity: ([^;]+);/g)].map(match => match[1]));

    assert.equal(press, "0.75");
});

test("what goes back goes back as far, and the frame's firm lines are one ink", () => {
    one([...values(".ui-chart__series--back", "opacity"), ...values(".ui-chart__bar--back", "opacity")]);
    one([...values(".ui-chart__axis-line", "stroke"), ...values(".ui-chart__rule", "fill")]);
});

test("a share bar's rest and the gauge's ring are the core's track share", () => {
    const share = /--share: ([^;]+);/.exec(trackShare)?.[1] ?? assert.fail("no @ui-track-share");

    assert.deepEqual(values(".ui-gauge__track", "opacity"), [share]);
    // The first is the screen's; forced colours paint it in the system's own.
    assert.equal(values(".ui-chart__rest", "fill")[0], `color-mix(in srgb, var(--ui-faint-base, var(--ui-color-on-surface)) ${Number(share) * 100}%, transparent)`);
});
