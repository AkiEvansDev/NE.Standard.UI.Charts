// A chart's and a gauge's packs are the page's: the framework's language switch writes them again (`applyPageCultures`, ahead of
// every package's listener), so the redraw the switch asks for writes ticks, tooltips and a reading in the new language.

import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { NumberCulturePack, NumberFormatting, TemporalCulturePack, TemporalFormatting } from "ne-standard-ui";
import { element, installStubDom, real } from "./stub-dom.ts";

installStubDom();

const { applyGaugeValue } = await import("../src/chart-gauge.ts");
const { ChartClasses } = await import("../src/chart-names.ts");

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const frameworkRendering = resolve(repository, "src/Platforms/Web/NE.Standard.UI.Web/Client/src/rendering");
const { applyPageCultures } = await import(pathToFileURL(resolve(frameworkRendering, "page-culture.ts")).href) as {
    readonly applyPageCultures: (root: ParentNode, number: Partial<NumberCulturePack> | null, temporal: (TemporalCulturePack & { readonly date: string; readonly shortTime: string; readonly longTime: string }) | null) => void;
};
const { numberFormatting } = await import(pathToFileURL(resolve(frameworkRendering, "number-format.ts")).href) as { readonly numberFormatting: NumberFormatting };
const { temporalFormatting } = await import(pathToFileURL(resolve(frameworkRendering, "temporal-format.ts")).href) as { readonly temporalFormatting: TemporalFormatting };

// The attributes `ChartComponentRendererBase` and `GaugeComponentRenderer` write (`WebAttributes`).
const NumberCulture = "data-ui-number-culture";
const TemporalCulture = "data-ui-temporal-culture";
const PageCulture = "data-ui-page-culture";

const English = { decimalSeparator: ".", groupSeparator: ",", groupSizes: [3] };
const German = { decimalSeparator: ",", groupSeparator: ".", groupSizes: [3] };
const Russian = {
    monthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
    monthGenitiveNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    abbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
    dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    abbreviatedDayNames: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    amDesignator: "",
    pmDesignator: "",
    date: "dd.MM.yyyy",
    shortTime: "H:mm",
    longTime: "H:mm:ss"
};

function page(): { readonly page: ReturnType<typeof element>; readonly chart: ReturnType<typeof element>; readonly reading: ReturnType<typeof element> } {
    const root = element("div", "page");
    const chart = element("div", "ui-chart", { [NumberCulture]: JSON.stringify(English), [TemporalCulture]: "{}", [PageCulture]: "" }, root);
    const gauge = element("div", ChartClasses.gauge, { [NumberCulture]: JSON.stringify(English), [PageCulture]: "" }, root);
    const reading = element("span", ChartClasses.gaugeNumber, { "data-ui-gauge-format": "N1" }, gauge);

    return { page: root, chart, reading };
}

test("a language switch writes a chart's packs again, so its ticks and tooltips draw in the new language", () => {
    const { page: root, chart } = page();

    applyPageCultures(real<ParentNode>(root), German, Russian);

    assert.equal(numberFormatting.readCulture(real<Element>(chart)).decimalSeparator, ",");
    assert.equal(temporalFormatting.readCulture(real<Element>(chart)).monthGenitiveNames[8], "сентября");
});

test("a language switch writes a gauge's pack again, and the reading written anew is in the new language", () => {
    const { page: root, reading } = page();
    const formatting = { numbers: numberFormatting, strings: { text: (key: string) => key } } as unknown as Parameters<typeof applyGaugeValue>[2];

    applyGaugeValue(real<Element>(reading), 1234.5, formatting);
    assert.equal(reading.textContent, "1,234.5");

    applyPageCultures(real<ParentNode>(root), German, null);
    applyGaugeValue(real<Element>(reading), 1234.5, formatting);

    assert.equal(reading.textContent, "1.234,5");
});
