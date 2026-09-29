// The one thing a gauge needs the browser for: writing the reading in the page's culture. The arc itself is pure stylesheet,
// moved by the range the root carries with no script at all.

import type { ClientStrings, NumberFormatting } from "ne-standard-ui";
import { ChartAttributes, ChartClasses, ChartVariables, ChartWords } from "./chart-names.ts";

const GaugeSelector = `.${ChartClasses.gauge}`;
const NumberSelector = `.${ChartClasses.gaugeNumber}`;
const UnitSelector = `.${ChartClasses.gaugeUnit}`;

export type GaugeFormatting = {
    readonly numbers: NumberFormatting;
    readonly strings: ClientStrings;
};

/**
 * Writes the reading's number in the page's culture, or the word for none; the unit after it is a property of its own, written by
 * the framework, and shows only beside a number.
 */
export function applyGaugeValue(target: Element, value: unknown, formatting: GaugeFormatting): void {
    const format = target.getAttribute(ChartAttributes.gaugeFormat) ?? "N0";
    const number = typeof value === "number" ? value : typeof value === "string" && value.length > 0 ? Number(value) : Number.NaN;
    const reads = Number.isFinite(number);
    const text = reads
        ? formatting.numbers.format(number, format, formatting.numbers.readCulture(target))
        : formatting.strings.text(ChartWords.noReading);

    if (target.textContent !== text)
        target.textContent = text;

    const unit = target.parentElement?.querySelector<HTMLElement>(UnitSelector);

    if (unit !== null && unit !== undefined && unit.hidden === reads)
        unit.hidden = !reads;
}

/** Writes every gauge's reading under `root` again in the page's words — the word for none — from the value its arc holds. */
export function rewriteGauges(root: ParentNode, formatting: GaugeFormatting): void {
    for (const gauge of root.querySelectorAll<HTMLElement>(GaugeSelector)) {
        const reading = gauge.querySelector(NumberSelector);

        if (reading !== null)
            applyGaugeValue(reading, gauge.style.getPropertyValue(ChartVariables.gaugeValue).trim(), formatting);
    }
}
