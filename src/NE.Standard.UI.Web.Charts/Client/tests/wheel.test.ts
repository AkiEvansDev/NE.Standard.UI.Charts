import assert from "node:assert/strict";
import test from "node:test";

import { sameWindow, wheelWindow, zoomNotches } from "../src/chart-wheel.ts";

const Whole = { from: 0, to: 100 };

test("a wheel zooms by how far it turned, and no event by more than the most", () => {
    assert.equal(zoomNotches({ x: 0, y: 100 }, 100, 3), 1);
    assert.equal(zoomNotches({ x: 0, y: -40 }, 100, 3), -0.4);
    assert.equal(zoomNotches({ x: 0, y: 2400 }, 100, 3), 3);
    assert.equal(zoomNotches({ x: 0, y: -2400 }, 100, 3), -3);
});

test("a turn mostly sideways zooms nothing", () => {
    assert.equal(zoomNotches({ x: 120, y: 30 }, 100, 3), 0);
    assert.equal(zoomNotches({ x: -50, y: 49 }, 100, 3), 0);
    // Mostly downward, with a little drift across: still a zoom.
    assert.equal(zoomNotches({ x: 10, y: 100 }, 100, 3), 1);
    assert.equal(zoomNotches({ x: 0, y: Number.NaN }, 100, 3), 0);
});

test("widening a chart already showing the whole changes nothing", () => {
    const view = wheelWindow(null, Whole, 50, 1.2);

    assert.equal(view, null);
    assert.ok(sameWindow(view, null));
});

test("narrowing the whole gives a window about the value under the pointer", () => {
    const view = wheelWindow(null, Whole, 25, 0.5);

    assert.deepEqual(view, { from: 12.5, to: 62.5 });
    assert.ok(!sameWindow(view, null));
});

test("widening a window past the ends gives the whole back as no window", () => {
    const view = wheelWindow({ from: 20, to: 80 }, Whole, 50, 2);

    assert.equal(view, null);
    assert.ok(!sameWindow(view, { from: 20, to: 80 }));
});

test("narrowing a window already as narrow as one goes neither changes nor slides it", () => {
    const deepest = { from: 40, to: 40.2 };
    const view = wheelWindow(deepest, Whole, 40.19, 1 / 1.2);

    assert.equal(view, deepest);
    assert.ok(sameWindow(view, deepest));
});

test("two windows are the same when both are none or both have the same ends", () => {
    assert.ok(sameWindow(null, null));
    assert.ok(sameWindow({ from: 1, to: 2 }, { from: 1, to: 2 }));
    assert.ok(!sameWindow({ from: 1, to: 2 }, null));
    assert.ok(!sameWindow({ from: 1, to: 2 }, { from: 1, to: 3 }));
});
