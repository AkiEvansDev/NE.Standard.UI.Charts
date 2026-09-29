import assert from "node:assert/strict";
import { mock, test } from "node:test";

import { ChartAttributes, ChartClasses, ClientNames } from "../src/chart-names.ts";
import { PointPress, PressWait } from "../src/chart-press.ts";
import { element, real } from "./stub-dom.ts";
import type { StubElement } from "./stub-dom.ts";

test("a single press answers once the wait is over, not before", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const wait = new PressWait(300);
    const answer = mock.fn();

    wait.press(1, answer);
    t.mock.timers.tick(299);
    assert.equal(answer.mock.callCount(), 0);

    t.mock.timers.tick(1);
    assert.equal(answer.mock.callCount(), 1);
});

test("a second press within the wait is a double press, and answers nothing", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const wait = new PressWait(300);
    const answer = mock.fn();

    wait.press(1, answer);
    t.mock.timers.tick(150);
    wait.press(2, answer);
    t.mock.timers.tick(1000);

    assert.equal(answer.mock.callCount(), 0);
});

test("a new single press lets the one still waiting answer at once, and waits in its place", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const wait = new PressWait(300);
    const first = mock.fn();
    const next = mock.fn();

    wait.press(1, first);
    t.mock.timers.tick(100);
    wait.press(1, next);
    assert.equal(first.mock.callCount(), 1);
    assert.equal(next.mock.callCount(), 0);

    t.mock.timers.tick(300);
    assert.equal(first.mock.callCount(), 1);
    assert.equal(next.mock.callCount(), 1);
});

test("a press called off answers nothing, and the next one waits afresh", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const wait = new PressWait(300);
    const first = mock.fn();
    const next = mock.fn();

    wait.press(1, first);
    wait.cancel();
    wait.press(1, next);
    t.mock.timers.tick(300);

    assert.equal(first.mock.callCount(), 0);
    assert.equal(next.mock.callCount(), 1);
});

/** A chart of two series of marks, each point keyed by its row, as the drawing writes them. */
function drawn(root: StubElement): void {
    for (const series of ["cpu", "memory"]) {
        const group = element("g", ChartClasses.series, { [ChartAttributes.series]: series }, root);

        for (const point of ["a", "b"])
            element("g", ChartClasses.point, { [ChartAttributes.point]: point }, group);
    }
}

function pendingOf(root: StubElement): string[] {
    return root.querySelectorAll(`.${ClientNames.pendingPoint}`).map(each => `${each.closest(`.${ChartClasses.series}`)?.getAttribute(ChartAttributes.series)}/${each.getAttribute(ChartAttributes.point)}`);
}

function chartOf(): { readonly stub: StubElement; readonly root: HTMLElement } {
    const stub = element("div", ChartClasses.root);

    drawn(stub);

    return { stub, root: real<HTMLElement>(stub) };
}

test("a first press marks its point of its own series until the command runs", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const { stub, root } = chartOf();
    const press = new PointPress(300);
    const answer = mock.fn(() => assert.deepEqual(pendingOf(stub), []));

    press.press(1, { root, point: "b", series: "memory" }, answer);
    assert.deepEqual(pendingOf(stub), ["memory/b"]);

    t.mock.timers.tick(300);
    assert.equal(answer.mock.callCount(), 1);
    assert.deepEqual(pendingOf(stub), []);
});

test("a second press takes the mark off and answers nothing", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const { stub, root } = chartOf();
    const press = new PointPress(300);
    const answer = mock.fn();

    press.press(1, { root, point: "a", series: "cpu" }, answer);
    press.press(2, { root, point: "a", series: "cpu" }, answer);
    assert.deepEqual(pendingOf(stub), []);

    t.mock.timers.tick(1000);
    assert.equal(answer.mock.callCount(), 0);
});

test("a reset calls the press off and takes its mark off", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const { stub, root } = chartOf();
    const press = new PointPress(300);
    const answer = mock.fn();

    press.press(1, { root, point: "a", series: "cpu" }, answer);
    press.cancel();
    t.mock.timers.tick(1000);

    assert.deepEqual(pendingOf(stub), []);
    assert.equal(answer.mock.callCount(), 0);
});

test("a new first press answers the earlier one, whose mark moves to the new point", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const { stub, root } = chartOf();
    const press = new PointPress(300);
    const first = mock.fn();

    press.press(1, { root, point: "a", series: "cpu" }, first);
    press.press(1, { root, point: "b", series: "cpu" }, mock.fn());

    assert.equal(first.mock.callCount(), 1);
    assert.deepEqual(pendingOf(stub), ["cpu/b"]);
});

test("a redraw's new elements are marked again by point and series, and another chart's are not", t => {
    t.mock.timers.enable({ apis: ["setTimeout"] });

    const { stub, root } = chartOf();
    const other = chartOf();
    const press = new PointPress(300);

    press.press(1, { root, point: "a", series: "memory" }, mock.fn());

    for (const child of stub.children)
        child.remove();

    drawn(stub);
    assert.deepEqual(pendingOf(stub), []);

    press.redrawn(other.root);
    press.redrawn(root);

    assert.deepEqual(pendingOf(stub), ["memory/a"]);
    assert.deepEqual(pendingOf(other.stub), []);
});
