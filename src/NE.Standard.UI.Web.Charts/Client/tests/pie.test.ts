import assert from "node:assert/strict";
import test from "node:test";

import { sectorsOf, spotAt } from "../src/chart-pie.ts";

const centre = { x: 0, y: 0 };

test("the values share the turn out between them, clockwise from twelve o'clock", () => {
    const sectors = sectorsOf([1, 1, 2]);

    assert.deepEqual(sectors.map(sector => Math.round((sector.sweep / (Math.PI * 2)) * 100)), [25, 25, 50]);
    assert.equal(sectors[0].start, -Math.PI / 2);
    assert.equal(sectors[1].start, sectors[0].start + sectors[0].sweep);
    assert.equal(sectors[2].start + sectors[2].sweep, sectors[0].start + Math.PI * 2);
});

test("a value of nothing, one below zero, and a set that adds up to nothing take no angle", () => {
    assert.deepEqual(sectorsOf([null, 3]).map(sector => sector.sweep), [0, Math.PI * 2]);
    assert.deepEqual(sectorsOf([-5, 3]).map(sector => sector.sweep), [0, Math.PI * 2]);
    assert.deepEqual(sectorsOf([0, 0]).map(sector => sector.sweep), [0, 0]);
    assert.deepEqual(sectorsOf([]), []);
});

test("a place on the turn is read from its angle", () => {
    assert.deepEqual(spotAt(centre, 10, -Math.PI / 2).y, -10);
    assert.deepEqual(spotAt(centre, 10, 0).x, 10);
});
