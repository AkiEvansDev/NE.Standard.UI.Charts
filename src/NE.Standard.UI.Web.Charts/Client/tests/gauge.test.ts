// The gauge's reading as the client writes it: the number in the page's culture, or the word for none, and the unit beside it
// only while there is a number to stand after.

import assert from "node:assert/strict";
import test from "node:test";

import { applyGaugeValue } from "../src/chart-gauge.ts";
import type { GaugeFormatting } from "../src/chart-gauge.ts";
import { ChartWords } from "../src/chart-names.ts";

type Unit = { hidden: boolean };

/** The reading's number and its unit, as far as the client reads them: the format on the number, the unit beside it. */
function reading(format: string | null, unitHidden: boolean): { readonly number: Element; readonly unit: Unit } {
    const unit: Unit = { hidden: unitHidden };
    const number = { textContent: "", getAttribute: () => format, parentElement: { querySelector: () => unit } };

    return { number: number as unknown as Element, unit };
}

const formatting = {
    numbers: { format: (value: number, format: string) => `${format} ${value}`, readCulture: () => null },
    strings: { text: (key: string) => (key === ChartWords.noReading ? "none" : key) }
} as unknown as GaugeFormatting;

test("a reading is written in its format and shows the unit after it", () => {
    const { number, unit } = reading("P1", true);

    applyGaugeValue(number, 42, formatting);

    assert.equal(number.textContent, "P1 42");
    assert.equal(unit.hidden, false);
});

test("no reading writes the word for none and hides the unit, which a later reading shows again", () => {
    const { number, unit } = reading(null, false);

    applyGaugeValue(number, null, formatting);

    assert.equal(number.textContent, "none");
    assert.equal(unit.hidden, true);

    // The reading a language switch writes again is the arc's variable, read back as text.
    applyGaugeValue(number, "61", formatting);

    assert.equal(number.textContent, "N0 61");
    assert.equal(unit.hidden, false);
});

test("an empty or unreadable value is no reading", () => {
    for (const value of ["", "abc", undefined]) {
        const { number, unit } = reading(null, false);

        applyGaugeValue(number, value, formatting);

        assert.equal(number.textContent, "none");
        assert.equal(unit.hidden, true);
    }
});
