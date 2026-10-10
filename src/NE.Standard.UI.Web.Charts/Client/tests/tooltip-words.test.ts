// A point's words and a shared tooltip's lines read a series' or a category's caption as written: the page's tooltip reads its words
// as inline markup, so a caption holding `*`, `_` or a backtick is escaped where the words are composed, and hover and tap agree.

import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { installStubDom } from "./stub-dom.ts";

installStubDom();

const { pointWords, readingWords } = await import("../src/chart-draw.ts");

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const markup = resolve(repository, "src/Platforms/Web/NE.Standard.UI.Web/Client/src/rendering/inline-markup.ts");
const { escapeInlineMarkup, inlineMarkupToPlainText } = await import(pathToFileURL(markup).href) as {
    readonly escapeInlineMarkup: (text: string) => string;
    readonly inlineMarkupToPlainText: (text: string) => string;
};

// The framework's words as the default table holds them, filled in place.
const templates: Readonly<Record<string, string>> = { "ui.chart.point": "{series} — {x}: {y}", "ui.chart.reading": "{series}: {value}" };
const formatting = {
    strings: { format: (key: string, args: Readonly<Record<string, string>>) => templates[key].replace(/\{(\w+)\}/g, (_, name: string) => args[name]) },
    escape: escapeInlineMarkup
} as unknown as Parameters<typeof pointWords>[3];

test("a caption with markup's characters reads as written in a point's words", () => {
    assert.equal(inlineMarkupToPlainText(pointWords("a*b_c", "x`1`", "1.5", formatting)), "a*b_c — x`1`: 1.5");
});

test("a caption with markup's characters reads as written in a shared tooltip's line", () => {
    assert.equal(inlineMarkupToPlainText(readingWords("a*b_c", "2", formatting)), "a*b_c: 2");
});
