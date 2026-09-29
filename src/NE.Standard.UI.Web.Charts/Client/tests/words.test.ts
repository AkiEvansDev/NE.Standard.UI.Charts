// The canvas's name: the legend's captions joined by the package's own word, so a language writes its own separator.

import assert from "node:assert/strict";
import test from "node:test";

import { wordList } from "../src/chart-draw.ts";
import { ChartWords } from "../src/chart-names.ts";

type Strings = Parameters<typeof wordList>[1];

/** The list word as a language might write it, bracketed so the order of the joins shows. */
const strings = {
    format: (key: string, values: Readonly<Record<string, string>>) => (key === ChartWords.list ? `(${values.list}、${values.next})` : key)
} as unknown as Strings;

test("no captions are an empty list, and one is itself", () => {
    assert.equal(wordList([], strings), "");
    assert.equal(wordList(["西欧"], strings), "西欧");
});

test("each caption is joined onto the list so far by the list word", () => {
    assert.equal(wordList(["西欧", "中欧", "美国东部"], strings), "((西欧、中欧)、美国东部)");
});
