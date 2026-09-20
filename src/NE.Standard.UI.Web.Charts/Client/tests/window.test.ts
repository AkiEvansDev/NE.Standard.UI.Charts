import assert from "node:assert/strict";
import test from "node:test";

import type { ChartPoint } from "../src/chart-path.ts";
import { clampWindow, followWindow, panWindow, windowExtent, zoomWindow } from "../src/chart-window.ts";

function point(key: string, x: number, y: number | null): ChartPoint {
    return { key, x, y, size: null };
}

test("a window is no wider than the whole and no narrower than a fraction of it", () => {
    assert.deepEqual(clampWindow({ from: -20, to: 200 }, 0, 100), { from: 0, to: 100 });
    // A window with no width is no window: it falls back to the whole rather than to a singularity.
    assert.deepEqual(clampWindow({ from: 50, to: 50 }, 0, 100), { from: 0, to: 100 });
    assert.deepEqual(clampWindow({ from: 10, to: 10.05 }, 0, 100), { from: 10, to: 10.2 });
});

test("a window pushed past an end is slid back rather than stretched", () => {
    assert.deepEqual(clampWindow({ from: 90, to: 130 }, 0, 100), { from: 60, to: 100 });
    assert.deepEqual(clampWindow({ from: -30, to: 10 }, 0, 100), { from: 0, to: 40 });
});

test("a wheel zooms about the value under the pointer, which stays where it was", () => {
    const narrowed = zoomWindow({ from: 0, to: 100 }, 25, 0.5, 0, 100);

    assert.deepEqual(narrowed, { from: 12.5, to: 62.5 });
    // The value under the pointer sits at the same share of the narrower window.
    assert.equal((25 - narrowed.from) / (narrowed.to - narrowed.from), 0.25);
    assert.deepEqual(zoomWindow(narrowed, 25, 2, 0, 100), { from: 0, to: 100 });
});

test("a drag moves the window along, and following keeps it on the far end", () => {
    assert.deepEqual(panWindow({ from: 20, to: 40 }, 10, 0, 100), { from: 30, to: 50 });
    assert.deepEqual(panWindow({ from: 20, to: 40 }, -40, 0, 100), { from: 0, to: 20 });
    assert.deepEqual(followWindow({ from: 20, to: 40 }, 0, 120), { from: 100, to: 120 });
});

test("the extent inside a window takes in the point either side of it", () => {
    const points = [point("a", 0, 10), point("b", 10, 50), point("c", 20, 90), point("d", 30, 20)];

    assert.deepEqual(windowExtent([points], null), { min: 10, max: 90 });
    assert.deepEqual(windowExtent([points], { from: 9, to: 11 }), { min: 10, max: 90 });
    assert.deepEqual(windowExtent([points], { from: 29, to: 31 }), { min: 20, max: 90 });
});

test("a row with no value counts for nothing in the extent", () => {
    assert.deepEqual(windowExtent([[point("a", 0, null), point("b", 1, 5)]], null), { min: 5, max: 5 });
});
