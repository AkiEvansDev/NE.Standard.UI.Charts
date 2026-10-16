// A point's words and a shared tooltip's lines read a series' or a category's caption as written: the page's tooltip reads its words
// as inline markup, so the words are formatted for markup, a caption holding `*`, `_` or a backtick escaped, and hover and tap agree.

import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { installStubDom } from "./stub-dom.ts";

installStubDom();

const { pointWords, readingWords } = await import("../src/chart-draw.ts");

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const client = resolve(repository, "src/Platforms/Web/NE.Standard.UI.Web/Client/src");
const { escapeInlineMarkup, inlineMarkupToPlainText } = await import(pathToFileURL(resolve(client, "rendering/inline-markup.ts")).href) as {
    readonly escapeInlineMarkup: (text: string) => string;
    readonly inlineMarkupToPlainText: (text: string) => string;
};
// The framework's own filling, which `strings.format` runs: its `markup` flag escapes the arguments, not the package.
const { formatWords } = await import(pathToFileURL(resolve(client, "runtime/words.ts")).href) as {
    readonly formatWords: (template: string, args: Readonly<Record<string, unknown>>, translateNested?: undefined, writeMoment?: undefined, markup?: boolean) => string;
};

// The framework's words as the default table holds them.
const templates: Readonly<Record<string, string>> = { "ui.chart.point": "{series} — {x}: {y}", "ui.chart.reading": "{series}: {value}" };
const formatting = {
    strings: { format: (key: string, args: Readonly<Record<string, string>>, markup?: boolean) => formatWords(templates[key], args, undefined, undefined, markup) }
} as unknown as Parameters<typeof pointWords>[3];

test("a caption with markup's characters reads as written in a point's words", () => {
    const words = pointWords("a*b_c", "x`1`", "1.5", formatting);

    assert.equal(words, `${escapeInlineMarkup("a*b_c")} — ${escapeInlineMarkup("x`1`")}: 1.5`);
    assert.equal(inlineMarkupToPlainText(words), "a*b_c — x`1`: 1.5");
});

test("a caption with markup's characters reads as written in a shared tooltip's line", () => {
    const words = readingWords("a*b_c", "2", formatting);

    assert.equal(words, `${escapeInlineMarkup("a*b_c")}: 2`);
    assert.equal(inlineMarkupToPlainText(words), "a*b_c: 2");
});
