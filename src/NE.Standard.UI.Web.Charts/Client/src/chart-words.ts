// What a part of a chart says when it is read, and where its words stand: the hover and the tap ask the same.

import { ChartAttributes, ChartClasses } from "./chart-names.ts";

const SectorSelector = `.${ChartClasses.sector}`;
const SectorAnchorSelector = `.${ChartClasses.sectorAnchor}`;

/** Words and the element they stand against. */
export type SpokenWords = {
    readonly anchor: Element;
    readonly words: string;
};

/** A sector's words, against the mark at its own arc's middle, since the framework places a tooltip by its target's box and a sector's is the whole ring's. */
export function sectorWords(target: Element): (SpokenWords & { readonly sector: Element }) | null {
    const sector = target.closest(SectorSelector);
    const words = sector?.getAttribute(ChartAttributes.sectorTooltip) ?? null;
    const anchor = sector?.parentElement?.querySelector(SectorAnchorSelector) ?? null;

    return sector === null || words === null || anchor === null ? null : { sector, anchor, words };
}

/**
 * What a tap on the target reads out: a sector's words at its arc, else a point's or a bar's own tooltip; none for a line, a band,
 * or a tooltip the chart's surroundings wrote.
 */
export function spokenBy(target: Element, chart: Element, tooltipAttribute: string): SpokenWords | null {
    const sector = sectorWords(target);

    if (sector !== null)
        return { anchor: sector.anchor, words: sector.words };

    const anchor = target.closest(`[${tooltipAttribute}]`);
    const words = anchor?.getAttribute(tooltipAttribute)?.trim() ?? "";

    return anchor === null || !chart.contains(anchor) || anchor === chart || words.length === 0 ? null : { anchor, words };
}
