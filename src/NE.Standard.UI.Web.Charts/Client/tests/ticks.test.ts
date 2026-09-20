import assert from "node:assert/strict";
import test from "node:test";

import type { ChartAxis } from "../src/chart-model.ts";
import { defaultFormat, fraction, plotDown, plotX, plotY, resolveRange, step, ticks, valueOf } from "../src/chart-ticks.ts";

function axis(values: Partial<ChartAxis>): ChartAxis {
    return { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption: null, ...values };
}

test("a linear step is one, two or five times a power of ten", () => {
    assert.equal(step("Linear", 0, 100, 5), 20);
    assert.equal(step("Linear", 0, 1, 5), 0.2);
    assert.equal(step("Linear", 0, 37, 5), 10);
    assert.equal(step("Linear", 0, 0, 5), 1);
});

test("a time step is an interval a clock is read at", () => {
    const minute = 60_000;

    assert.equal(step("Time", 0, 5 * minute, 5), minute);
    assert.equal(step("Time", 0, 90 * minute, 5), 30 * minute);
    assert.equal(step("Time", 0, 24 * 60 * minute, 5), 6 * 60 * minute);
});

test("a range the author left open follows the data, rounded outward to the step", () => {
    assert.deepEqual(resolveRange(axis({}), 3, 47, 0), { min: 0, max: 50, logarithmic: false });
    assert.deepEqual(resolveRange(axis({ min: 0 }), 3, 47, 0), { min: 0, max: 50, logarithmic: false });
    assert.deepEqual(resolveRange(axis({ min: 2, max: 48 }), 3, 47, 0), { min: 2, max: 48, logarithmic: false });
});

test("a range with no data at all, and one flattened to a point, still has width", () => {
    assert.deepEqual(resolveRange(axis({}), Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0), { min: 0, max: 1, logarithmic: false });
    assert.deepEqual(resolveRange(axis({}), 8, 8, 0), { min: 7, max: 9, logarithmic: false });
});

test("a category axis reaches half a place past its first and last name", () => {
    assert.deepEqual(resolveRange(axis({ kind: "Category" }), 0, 3, 4), { min: -0.5, max: 3.5, logarithmic: false });
    assert.deepEqual(resolveRange(axis({ kind: "Category" }), 0, 0, 0), { min: -0.5, max: 0.5, logarithmic: false });
});

test("a logarithmic axis runs between powers of ten and is marked at them", () => {
    const scale = resolveRange(axis({ kind: "Logarithmic" }), 3, 4_000, 0);

    assert.deepEqual(scale, { min: 1, max: 10_000, logarithmic: true });
    assert.deepEqual(ticks("Logarithmic", scale, 5), [1, 10, 100, 1_000, 10_000]);
    assert.equal(fraction(scale, 100), 0.5);
});

test("the marks of a range are the round numbers inside it", () => {
    assert.deepEqual(ticks("Linear", { min: 0, max: 100, logarithmic: false }, 5), [0, 20, 40, 60, 80, 100]);
    assert.deepEqual(ticks("Category", { min: -0.5, max: 2.5, logarithmic: false }, 5), [0, 1, 2]);
    assert.deepEqual(ticks("Linear", { min: 5, max: 5, logarithmic: false }, 5), []);
});

test("a value lands where its fraction of the range puts it, the low end at the bottom", () => {
    const plot = { left: 40, top: 10, width: 200, height: 100 };
    const scale = { min: 0, max: 10, logarithmic: false };

    assert.equal(plotX(plot, scale, 0), 40);
    assert.equal(plotX(plot, scale, 10), 240);
    assert.equal(plotY(plot, scale, 0), 110);
    assert.equal(plotY(plot, scale, 10), 10);
    assert.equal(plotY(plot, scale, 5), 60);
});

test("the value at a share of the range is the inverse of the share of a value", () => {
    const linear = { min: 10, max: 50, logarithmic: false };
    const logarithmic = { min: 1, max: 1000, logarithmic: true };

    assert.equal(valueOf(linear, 0), 10);
    assert.equal(valueOf(linear, 1), 50);
    assert.equal(valueOf(linear, 0.25), 20);
    assert.equal(fraction(linear, valueOf(linear, 0.4)), 0.4);
    assert.equal(valueOf(logarithmic, 1 / 3), 10);
    assert.equal(fraction(logarithmic, valueOf(logarithmic, 0.5)), 0.5);
});

test("a band axis runs down the plot, the low end of the range at the top", () => {
    const plot = { left: 40, top: 10, width: 200, height: 100 };
    const scale = { min: 0, max: 10, logarithmic: false };

    assert.equal(plotDown(plot, scale, 0), 10);
    assert.equal(plotDown(plot, scale, 10), 110);
    assert.equal(plotDown(plot, scale, 5), 60);
});

test("a format the author left open follows the step: the decimals a number needs, the part of a clock a moment moves", () => {
    assert.equal(defaultFormat("Linear", 20), "N0");
    assert.equal(defaultFormat("Linear", 0.2), "N1");
    assert.equal(defaultFormat("Linear", 0.02), "N2");
    assert.equal(defaultFormat("Time", 30_000), "HH:mm:ss");
    assert.equal(defaultFormat("Time", 3_600_000), "HH:mm");
    assert.equal(defaultFormat("Time", 7 * 86_400_000), "dd MMM");
    assert.equal(defaultFormat("Category", 1), null);
});
