// A document just big enough for the legend, the pending mark and the plot's clip: elements in a tree, their classes and
// attributes, the focus, and the simple selectors the client asks with (`.class`, `[attribute]`). Installed on globalThis before a
// module under test runs.

type Listener = (domEvent: { readonly target: StubElement }) => void;

export class StubElement {
    public readonly tagName: string;
    public parentElement: StubElement | null = null;
    public readonly childList: StubElement[] = [];
    public textContent = "";
    public type = "";
    public readonly classList: StubClassList;
    public readonly style = new StubStyle();
    private readonly attributes = new Map<string, string>();
    private readonly listeners = new Map<string, Listener[]>();

    public constructor(tagName: string) {
        this.tagName = tagName.toUpperCase();
        this.classList = new StubClassList();
    }

    public get className(): string {
        return this.classList.value();
    }

    public set className(value: string) {
        this.classList.set(value);
    }

    public get children(): StubElement[] {
        return [...this.childList];
    }

    public get firstElementChild(): StubElement | null {
        return this.childList[0] ?? null;
    }

    public get nextElementSibling(): StubElement | null {
        const siblings = this.parentElement?.childList ?? [];

        return siblings[siblings.indexOf(this) + 1] ?? null;
    }

    public get isConnected(): boolean {
        return stubDocument.body.contains(this);
    }

    public set tabIndex(value: number) {
        this.setAttribute("tabindex", String(value));
    }

    public getAttribute(name: string): string | null {
        return this.attributes.get(name) ?? null;
    }

    public setAttribute(name: string, value: string): void {
        this.attributes.set(name, value);
    }

    public hasAttribute(name: string): boolean {
        return this.attributes.has(name);
    }

    public removeAttribute(name: string): void {
        this.attributes.delete(name);
    }

    public appendChild(child: StubElement): StubElement {
        this.insertBefore(child, null);

        return child;
    }

    public append(...children: StubElement[]): void {
        for (const child of children)
            this.insertBefore(child, null);
    }

    /** Moves a live element as the browser does: out first, which takes the focus off it. */
    public insertBefore(child: StubElement, before: StubElement | null): void {
        child.remove();
        child.parentElement = this;

        const at = before === null ? -1 : this.childList.indexOf(before);

        if (at < 0)
            this.childList.push(child);
        else
            this.childList.splice(at, 0, child);
    }

    public remove(): void {
        if (this.parentElement === null)
            return;

        if (stubDocument.activeElement !== null && this.contains(stubDocument.activeElement))
            stubDocument.activeElement = null;

        this.parentElement.childList.splice(this.parentElement.childList.indexOf(this), 1);
        this.parentElement = null;
    }

    public contains(other: StubElement): boolean {
        for (let current: StubElement | null = other; current !== null; current = current.parentElement) {
            if (current === this)
                return true;
        }

        return false;
    }

    public focus(): void {
        const previous = stubDocument.activeElement;

        stubDocument.activeElement = this;
        previous?.dispatch("focusout");
    }

    public addEventListener(type: string, listener: Listener): void {
        this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
    }

    public removeEventListener(type: string, listener: Listener): void {
        this.listeners.set(type, (this.listeners.get(type) ?? []).filter(each => each !== listener));
    }

    public dispatch(type: string): void {
        for (const listener of this.listeners.get(type) ?? [])
            listener({ target: this });
    }

    public matches(selector: string): boolean {
        if (selector.startsWith("."))
            return this.classList.contains(selector.slice(1));

        if (selector.startsWith("[") && selector.endsWith("]"))
            return this.hasAttribute(selector.slice(1, -1));

        throw new Error(`The stub reads no selector like ${selector}.`);
    }

    public querySelectorAll(selector: string): StubElement[] {
        const found: StubElement[] = [];

        for (const child of this.childList) {
            if (child.matches(selector))
                found.push(child);

            found.push(...child.querySelectorAll(selector));
        }

        return found;
    }

    public querySelector(selector: string): StubElement | null {
        return this.querySelectorAll(selector)[0] ?? null;
    }

    public closest(selector: string): StubElement | null {
        return this.matches(selector) ? this : (this.parentElement?.closest(selector) ?? null);
    }
}

class StubClassList {
    private names = new Set<string>();

    public value(): string {
        return [...this.names].join(" ");
    }

    public set(value: string): void {
        this.names = new Set(value.split(" ").filter(name => name.length > 0));
    }

    public contains(name: string): boolean {
        return this.names.has(name);
    }

    public add(name: string): void {
        this.names.add(name);
    }

    public remove(name: string): void {
        this.names.delete(name);
    }

    public toggle(name: string, force?: boolean): boolean {
        const on = force ?? !this.names.has(name);

        if (on)
            this.names.add(name);
        else
            this.names.delete(name);

        return on;
    }
}

class StubStyle {
    private readonly values = new Map<string, string>();

    public getPropertyValue(name: string): string {
        return this.values.get(name) ?? "";
    }

    public setProperty(name: string, value: string): void {
        this.values.set(name, value);
    }
}

export const stubDocument = {
    body: new StubElement("body"),
    activeElement: null as StubElement | null,
    createElement: (tagName: string): StubElement => new StubElement(tagName),
    createElementNS: (_namespace: string, tagName: string): StubElement => new StubElement(tagName)
};

/** Stands the stub in for the browser's document, and its elements for `HTMLElement`, so `instanceof` reads them as the page's. */
export function installStubDom(): void {
    Object.assign(globalThis, { document: stubDocument, HTMLElement: StubElement });
}

/** A fresh page: the body emptied and nothing focused. */
export function resetStubDom(): void {
    for (const child of stubDocument.body.children)
        child.remove();

    stubDocument.activeElement = null;
}

/** An element with its classes and attributes, under `parent` where one is given. */
export function element(tagName: string, className: string, attributes: Readonly<Record<string, string>> = {}, parent: StubElement | null = null): StubElement {
    const created = new StubElement(tagName);

    created.className = className;

    for (const [name, value] of Object.entries(attributes))
        created.setAttribute(name, value);

    parent?.append(created);

    return created;
}

/** A stub as the DOM type a module under test takes. */
export function real<T>(stub: StubElement): T {
    return stub as unknown as T;
}
