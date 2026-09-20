// The one thing a gauge needs the browser for: writing the reading in the page's culture. The arc itself is pure stylesheet,
// moved by the range the root carries with no script at all.

import type { ClientStrings, NumberFormatting } from "ne-standard-ui";

const FormatAttribute = "data-ui-gauge-format";
const UnitAttribute = "data-ui-gauge-unit";
/** What a gauge says where it has no reading at all — the page's own word, as the server writes it (ChartsStrings.NoReading). */
const NoReadingKey = "ui.chart.no-reading";

export type GaugeFormatting = {
    readonly numbers: NumberFormatting;
    readonly strings: ClientStrings;
};

/** Writes the reading into the gauge's own text: the number in the page's culture, then the unit the renderer left on it. */
export function applyGaugeValue(target: Element, value: unknown, formatting: GaugeFormatting): void {
    const format = target.getAttribute(FormatAttribute) ?? "N0";
    const unit = target.getAttribute(UnitAttribute) ?? "";
    const number = typeof value === "number" ? value : typeof value === "string" && value.length > 0 ? Number(value) : Number.NaN;
    const text = Number.isFinite(number)
        ? formatting.numbers.format(number, format, formatting.numbers.readCulture(target)) + unit
        : formatting.strings.text(NoReadingKey);

    if (target.textContent !== text)
        target.textContent = text;
}
