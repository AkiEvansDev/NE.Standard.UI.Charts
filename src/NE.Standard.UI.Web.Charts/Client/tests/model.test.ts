// The chart's model as the server writes it — captions as the author wrote them — and in the page's words, as a draw reads it.

import assert from "node:assert/strict";
import test from "node:test";

import { translateModel } from "../src/chart-model.ts";
import type { ChartAxis, WrittenModel } from "../src/chart-model.ts";

function axis(caption: string | null): ChartAxis {
    return { kind: "Linear", min: null, max: null, format: null, grid: true, ticks: 5, caption };
}

function written(): WrittenModel {
    return {
        kind: "line",
        x: axis("sales.month"),
        y: axis(null),
        series: [
            { key: "revenue", caption: "sales.revenue", valuePath: null, sizePath: null, color: null, stepped: null, smooth: null, markers: null },
            { key: "cost", caption: null, valuePath: null, sizePath: null, color: null, stepped: null, smooth: null, markers: null }
        ],
        xPath: null,
        seriesPath: null,
        valuePath: null,
        legend: "Bottom",
        tooltip: true,
        stepped: false,
        smooth: false,
        markers: false,
        stacked: false,
        sharedTooltip: false,
        zoomable: false,
        followLatest: false,
        horizontal: false,
        bare: false,
        donut: 0
    };
}

test("every caption the author wrote is translated, and a series with none is named by its key untranslated", () => {
    const words: Readonly<Record<string, string>> = { "sales.month": "月份", "sales.revenue": "收入", cost: "成本" };
    const model = translateModel(written(), text => words[text] ?? text);

    assert.equal(model.x.caption, "月份");
    assert.equal(model.y.caption, null);
    assert.deepEqual(model.series.map(series => series.caption), ["收入", "cost"]);
});

test("the model the server wrote is left as it was, so a language switch translates it again", () => {
    const model = written();

    translateModel(model, () => "x");

    assert.equal(model.series[0].caption, "sales.revenue");
    assert.equal(model.x.caption, "sales.month");
});
