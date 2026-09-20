import assert from "node:assert/strict";
import test from "node:test";

import { coord, linePath } from "../src/chart-path.ts";
import type { ChartPoint } from "../src/chart-path.ts";

const plot = { left: 0, top: 0, width: 100, height: 100 };
const scale = { min: 0, max: 10, logarithmic: false };

function point(key: string, x: number, y: number | null): ChartPoint {
    return { key, x, y };
}

test("a coordinate is two decimals at most, and never a negative zero", () => {
    assert.equal(coord(12), "12");
    assert.equal(coord(12.345), "12.35");
    assert.equal(coord(-0.001), "0");
    assert.equal(coord(Number.NaN), "0");
});

test("a line joins its points, the low end of the range at the bottom", () => {
    const points = [point("a", 0, 0), point("b", 5, 5), point("c", 10, 10)];

    assert.equal(linePath(points, scale, scale, plot, false, false), "M0 100 L50 50 L100 0");
});

test("a stepped line holds each value from halfway back to halfway on", () => {
    const points = [point("a", 0, 2), point("b", 5, 8)];

    assert.equal(linePath(points, scale, scale, plot, true, false), "M0 80 H25 V20 H50");
});

test("a step is centred on the point it holds, so the jump falls between two of them", () => {
    const points = [point("a", 0, 2), point("b", 5, 8), point("c", 10, 4)];

    assert.equal(linePath(points, scale, scale, plot, true, false), "M0 80 H25 V20 H75 V60 H100");
});

test("a smooth line passes through every point", () => {
    const points = [point("a", 0, 0), point("b", 5, 5), point("c", 10, 10)];

    assert.equal(linePath(points, scale, scale, plot, false, true), "M0 100 C8.33 91.67 33.33 66.67 50 50 C66.67 33.33 91.67 8.33 100 0");
});

test("a row with no value breaks the line, and a run of one point draws nothing but its own mark", () => {
    const points = [point("a", 0, 0), point("b", 2, null), point("c", 5, 5), point("d", 10, 10)];

    assert.equal(linePath(points, scale, scale, plot, false, false), "M0 100 M50 50 L100 0");
    assert.equal(linePath([point("a", 0, 0)], scale, scale, plot, false, false), "M0 100");
    assert.equal(linePath([], scale, scale, plot, false, false), "");
});
