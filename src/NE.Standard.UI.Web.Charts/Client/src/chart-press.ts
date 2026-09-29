// A press that has to wait for a second one: on a zoomable chart a double press is the zoom's own gesture, so a press on a
// point there answers only once no second press followed it.

import { ChartAttributes, ChartClasses, ClientNames } from "./chart-names.ts";

/**
 * How long a press on a point of a zoomable chart waits for a second. Shorter than most systems' double-click time, so a
 * single press is not held back long; a slower double press runs the point's command once before it resets the window.
 */
export const DoublePressWait = 300;

const PointSelector = `[${ChartAttributes.point}]`;
const PendingSelector = `.${ClientNames.pendingPoint}`;
const SeriesSelector = `.${ChartClasses.series}`;

/** A pressed point as its chart names it again after a redraw replaced the element: the chart, the point's key and its series'. */
export type PressedPoint = {
    readonly root: HTMLElement;
    readonly point: string;
    readonly series: string;
};

/** A press held back for the double-press wait: the first of a run answers once the wait is over, a second within it answers nothing. */
export class PressWait {
    private readonly wait: number;
    private timer: ReturnType<typeof setTimeout> | null = null;
    private pending: (() => void) | null = null;

    public constructor(wait: number) {
        this.wait = wait;
    }

    /** A press by its click's `detail`: a second calls the waiting press off; a new first one answers the waiting press and waits in its place. */
    public press(count: number, answer: () => void): void {
        if (count > 1) {
            this.cancel();
            return;
        }

        const earlier = this.pending;

        this.cancel();
        earlier?.();
        this.pending = answer;
        this.timer = setTimeout(() => {
            this.timer = null;
            this.pending = null;
            answer();
        }, this.wait);
    }

    /** Calls off a press still waiting, which then answers nothing. */
    public cancel(): void {
        if (this.timer !== null)
            clearTimeout(this.timer);

        this.timer = null;
        this.pending = null;
    }
}

/**
 * A press on a point of a zoomable chart, held for the double-press wait, with the point marked as taken (`--pending`) from the
 * release until its command runs or a second press calls it off.
 */
export class PointPress {
    private readonly wait: PressWait;
    private held: PressedPoint | null = null;

    public constructor(wait: number) {
        this.wait = new PressWait(wait);
    }

    /** A press by its click's `detail`: a first marks the point and answers once the wait is over; a second calls it off. */
    public press(count: number, point: PressedPoint, answer: () => void): void {
        this.wait.press(count, () => {
            if (this.held === point)
                this.mark(null);

            answer();
        });
        this.mark(count > 1 ? null : point);
    }

    /** Marks the point a press waits on, taking the mark off the one before; none takes it off. */
    private mark(next: PressedPoint | null): void {
        if (this.held !== null)
            markPending(this.held.root, null);

        this.held = next;

        if (next !== null)
            markPending(next.root, next);
    }

    /** Calls off a press still waiting: it answers nothing, and its point lets go of the mark. */
    public cancel(): void {
        this.wait.cancel();
        this.mark(null);
    }

    /** A redraw replaced `root`'s points: the one still waiting is marked again on its new element. */
    public redrawn(root: HTMLElement): void {
        if (this.held?.root === root)
            markPending(root, this.held);
    }
}

/** Marks the point `pending` names as waiting on its press, a redraw's new element included; none takes the mark off the chart. */
function markPending(root: HTMLElement, pending: PressedPoint | null): void {
    if (pending === null) {
        for (const each of root.querySelectorAll(PendingSelector))
            each.classList.remove(ClientNames.pendingPoint);

        return;
    }

    for (const each of root.querySelectorAll(PointSelector))
        each.classList.toggle(ClientNames.pendingPoint, each.getAttribute(ChartAttributes.point) === pending.point && seriesOf(each) === pending.series);
}

/** The series a point belongs to: a sector names its own, its group being named by its row; a mark or a bar is its group's. */
export function seriesOf(point: Element): string {
    return point.getAttribute(ChartAttributes.series) ?? point.closest<Element>(SeriesSelector)?.getAttribute(ChartAttributes.series) ?? "";
}
