function e(e, t) {
	let n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of r) e.x >= t.min && e.x <= t.max && n.add(e.x);
	return n.size;
}
function t(e, t) {
	return e / Math.max(1, t);
}
function n(e, t, n, r, i) {
	let a = t * .72;
	if (i || r <= 1) return {
		start: e - a / 2,
		thickness: Math.max(1, a)
	};
	let o = a / r;
	return {
		start: e - a / 2 + n * o,
		thickness: Math.max(1, o)
	};
}
function r(e) {
	return Math.max(e, 11);
}
function i(e, t, n) {
	if (e == null || !Number.isFinite(t) || !Number.isFinite(n)) return 4;
	if (n <= t) return 21 / 2;
	let r = Math.min(Math.max((e - t) / (n - t), 0), 1);
	return Math.sqrt(9 + r * 315);
}
//#endregion
//#region src/chart-names.ts
var a = {
	model: "data-ui-chart",
	rows: "data-ui-chart-rows",
	series: "data-ui-chart-series",
	window: "data-ui-chart-window",
	point: "data-ui-chart-point",
	sectorTooltip: "data-ui-chart-tooltip",
	total: "data-ui-chart-total",
	gaugeFormat: "data-ui-gauge-format"
}, o = {
	root: "ui-chart",
	area: "ui-chart__area",
	canvas: "ui-chart__canvas",
	window: "ui-chart__window",
	grid: "ui-chart__grid",
	gridLine: "ui-chart__grid-line",
	axes: "ui-chart__axes",
	axisLine: "ui-chart__axis-line",
	label: "ui-chart__label",
	ringLabel: "ui-chart__ring-label",
	caption: "ui-chart__caption",
	empty: "ui-chart__empty",
	plot: "ui-chart__plot",
	series: "ui-chart__series",
	line: "ui-chart__line",
	lineHit: "ui-chart__line-hit",
	bands: "ui-chart__bands",
	fill: "ui-chart__fill",
	point: "ui-chart__point",
	marker: "ui-chart__marker",
	bareMarker: "ui-chart__marker--bare",
	hit: "ui-chart__hit",
	bar: "ui-chart__bar",
	sector: "ui-chart__sector",
	sectorEdge: "ui-chart__sector-edge",
	sectorAnchor: "ui-chart__sector-anchor",
	centre: "ui-chart__centre",
	centreHidden: "ui-chart__centre--hidden",
	segment: "ui-chart__segment",
	rest: "ui-chart__rest",
	legend: "ui-chart__legend",
	legendEntry: "ui-chart__legend-entry",
	legendMark: "ui-chart__legend-mark",
	legendCaption: "ui-chart__legend-caption",
	legendValues: "ui-chart__legend--values",
	legendValue: "ui-chart__legend-value",
	legendShare: "ui-chart__legend-share",
	legendRest: "ui-chart__legend-rest",
	gauge: "ui-gauge",
	gaugeNumber: "ui-gauge__number",
	gaugeUnit: "ui-gauge__unit"
}, s = "ui-chart-clip-drawn", c = {
	seriesColor: "--ui-chart-series-color",
	arcStart: "--ui-arc-start",
	arcSweep: "--ui-arc-sweep",
	gaugeValue: "--ui-gauge-value"
}, l = {
	rule: "ui-chart__rule",
	ruleOn: "ui-chart__rule--on",
	dragging: "ui-chart--dragging",
	backSeries: "ui-chart__series--back",
	frontBar: "ui-chart__bar--front",
	backBar: "ui-chart__bar--back",
	pendingPoint: "ui-chart__point--pending",
	legendOff: "ui-chart__legend-entry--off",
	legendUnder: "ui-chart--legend-under",
	turnBeside: "ui-chart--turn-beside"
}, u = {
	line: "line",
	area: "area",
	bar: "bar",
	pie: "pie",
	scatter: "scatter",
	radar: "radar",
	share: "share"
}, d = {
	pointClick: "point-click",
	windowChange: "window-change"
}, f = {
	sink: "chart",
	window: "chart-window",
	gaugeValue: "chart-gauge-value",
	total: "chart-total"
}, p = {
	empty: "ui.chart.empty",
	label: "ui.chart.label",
	noReading: "ui.chart.no-reading",
	point: "ui.chart.point",
	reading: "ui.chart.reading",
	list: "ui.chart.list",
	rest: "ui.chart.rest"
};
//#endregion
//#region src/chart-model.ts
function m(e) {
	let t = e.getAttribute(a.model);
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return null;
	}
}
function h(e, t) {
	let n = (e) => e.caption === null ? e : {
		...e,
		caption: t(e.caption)
	};
	return {
		...e,
		x: n(e.x),
		y: n(e.y),
		remainderCaption: e.remainderCaption === null ? null : t(e.remainderCaption),
		series: e.series.map((e) => ({
			...e,
			caption: e.caption === null ? e.key : t(e.caption)
		}))
	};
}
function g(e, t, n) {
	return e.translate ? t.map(n) : t;
}
function _(e) {
	return e.seriesPath !== null && e.seriesPath.length > 0;
}
//#endregion
//#region src/chart-calendar.ts
var v = 864e5, y = 365 * v, b = -621355968e5, x = 0xe677d21fdbff;
function S(e) {
	return e < 30 * v ? 0 : e < 90 * v ? 1 : e < 180 * v ? 3 : e < y ? 6 : Math.max(12, Math.round(e / y) * 12);
}
function C(e) {
	let t = D(Math.floor(e / v));
	return t.year * 12 + t.month - 1;
}
function w(e) {
	let t = Math.floor(e / 12);
	return E(t, e - t * 12 + 1, 1) * v;
}
function T(e, t) {
	return Math.floor(e / t) * t;
}
function E(e, t, n) {
	let r = t <= 2 ? e - 1 : e, i = Math.floor(r / 400), a = r - i * 400, o = Math.floor((153 * (t > 2 ? t - 3 : t + 9) + 2) / 5) + n - 1, s = a * 365 + Math.floor(a / 4) - Math.floor(a / 100) + o;
	return i * 146097 + s - 719468;
}
function D(e) {
	let t = e + 719468, n = Math.floor(t / 146097), r = t - n * 146097, i = Math.floor((r - Math.floor(r / 1460) + Math.floor(r / 36524) - Math.floor(r / 146096)) / 365), a = r - (365 * i + Math.floor(i / 4) - Math.floor(i / 100)), o = Math.floor((5 * a + 2) / 153), s = o < 10 ? o + 3 : o - 9;
	return {
		year: i + n * 400 + +(s <= 2),
		month: s
	};
}
//#endregion
//#region src/chart-moment.ts
function O(e) {
	return E(e.year, e.month, e.day) * 864e5 + ((e.hour * 60 + e.minute) * 60 + e.second) * 1e3 + e.millisecond;
}
function k(e) {
	let t = new Date(e + new Date(e).getTimezoneOffset() * 6e4);
	return new Date(e + t.getTimezoneOffset() * 6e4);
}
//#endregion
//#region src/chart-legend.ts
var ee = 256;
function te(e, t, n, r, i, a) {
	let s = ne(e), c = s === null ? [] : [...s.children].filter((e) => !e.classList.contains(o.legendRest)), l = c.find((e) => e === document.activeElement) ?? null;
	if (t.length === 0 && n === null) {
		s?.remove(), l !== null && a(e)?.focus({ preventScroll: !0 });
		return;
	}
	s === null && (s = document.createElement("div"), s.className = o.legend, s.setAttribute(i.eventBoundary, ""), e.append(s));
	let u = re(c, t), d = s.firstElementChild;
	for (let e of t) {
		let t = u.get(e.key), n = r.has(e.key);
		u.delete(e.key), t === void 0 ? s.insertBefore(ae(e, n, i), d) : (ce(t, e, n), t === d ? d = t.nextElementSibling : s.insertBefore(t, d));
	}
	if (ie(s, n), l === null || l === document.activeElement) return;
	let f = l.isConnected ? l : s.children[Math.min(c.indexOf(l), s.children.length - 1)];
	f instanceof HTMLElement && f.focus({ preventScroll: !0 });
}
function ne(e) {
	for (let t of e.children) if (t.classList.contains(o.legend)) return t;
	return null;
}
function re(e, t) {
	let n = new Set(t.map((e) => e.key)), r = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.getAttribute(a.series);
		e !== null && n.has(e) && !r.has(e) ? r.set(e, t) : t.remove();
	}
	return r;
}
function ie(e, t) {
	let n = [...e.children].find((e) => e.classList.contains(o.legendRest)) ?? null;
	t === null ? n?.remove() : (n === null && (n = document.createElement("div"), n.className = o.legendRest, n.append(A())), oe(n, t), (n.parentElement !== e || n.nextElementSibling !== null) && e.append(n));
}
function ae(e, t, n) {
	let r = document.createElement("button");
	return r.className = `${o.legendEntry} ${n.buttonClass} ${n.ghostButtonClass} ${n.smallButtonClass}`, r.type = "button", r.setAttribute(a.series, e.key), r.setAttribute("aria-pressed", t ? "false" : "true"), r.classList.toggle(l.legendOff, t), r.style.setProperty(c.seriesColor, e.color), r.append(A()), oe(r, e), r;
}
function A() {
	let e = document.createElement("span");
	return e.className = o.legendMark, e;
}
function oe(e, t) {
	se(e, o.legendCaption, t.caption), se(e, o.legendValue, t.value), se(e, o.legendShare, t.share);
}
function se(e, t, n) {
	let r = [...e.children].find((e) => e.classList.contains(t)) ?? null;
	if (n === void 0) {
		r?.remove();
		return;
	}
	if (r !== null) {
		r.textContent !== n && (r.textContent = n);
		return;
	}
	let i = document.createElement("span");
	i.className = t, i.textContent = n, e.append(i);
}
function ce(e, t, n) {
	let r = n ? "false" : "true";
	oe(e, t), e instanceof HTMLElement && e.style.getPropertyValue(c.seriesColor) !== t.color && e.style.setProperty(c.seriesColor, t.color), e.getAttribute("aria-pressed") !== r && e.setAttribute("aria-pressed", r), e.classList.contains(l.legendOff) !== n && e.classList.toggle(l.legendOff, n);
}
function le(e, t) {
	let n = ne(e), r = e.clientWidth;
	if (r === 0) return;
	let i = !1;
	if (n !== null && (t === "Start" || t === "End")) {
		let t = getComputedStyle(n);
		i = ue(r, Math.max(0, ...[...n.children].map((e) => e instanceof HTMLElement ? e.offsetWidth : 0)) + (Number.parseFloat(t.paddingLeft) || 0) + (Number.parseFloat(t.paddingRight) || 0), Number.parseFloat(getComputedStyle(e).columnGap) || 0);
	}
	e.classList.contains(l.legendUnder) !== i && e.classList.toggle(l.legendUnder, i);
}
function ue(e, t, n) {
	return e - t - n < ee;
}
function de(e, t, n, r) {
	let i = r !== null && (n === "Start" || n === "End") && !e.classList.contains(l.legendUnder), a = i ? `${Math.max(0, Math.round(t.clientHeight + r))}px` : "";
	e.classList.contains(l.turnBeside) !== i && e.classList.toggle(l.turnBeside, i), t.style.width !== a && (t.style.width = a);
}
//#endregion
//#region src/chart-ticks.ts
var fe = 200, pe = 15, j = 1e3, M = 60 * j, N = 60 * M, P = 24 * N, me = 365 * P, he = [
	j,
	2 * j,
	5 * j,
	10 * j,
	15 * j,
	30 * j,
	M,
	2 * M,
	5 * M,
	10 * M,
	15 * M,
	30 * M,
	N,
	2 * N,
	3 * N,
	6 * N,
	12 * N,
	P,
	2 * P,
	7 * P,
	14 * P,
	30 * P,
	90 * P,
	180 * P,
	me
];
function ge(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n === Infinity ? (t / 2 - e.min / 2) / (e.max / 2 - e.min / 2) : n <= 0 ? 0 : (t - e.min) / n;
}
function _e(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	let n = e.max - e.min;
	return n === Infinity ? (1 - t) * e.min + t * e.max : e.min + t * n;
}
function ve(e, t) {
	return Math.min(Math.max(t, Math.min(e.min, e.max)), Math.max(e.min, e.max));
}
function F(e, t, n) {
	return e.left + ge(t, n) * e.width;
}
function I(e, t, n) {
	return e.top + (1 - ge(t, n)) * e.height;
}
function ye(e, t, n) {
	return e.top + ge(t, n) * e.height;
}
function be(e) {
	return e.left + e.width;
}
function xe(e) {
	return e.top + e.height;
}
function Se(e, t, n, r) {
	let i = Math.max(1, r), a = n - t, o = a === Infinity ? n / i - t / i : a / i;
	if (o <= 0 || !Number.isFinite(o) || e === "Category") return 1;
	if (e === "Logarithmic") return t > 0 ? 10 ** Math.floor(Math.log10(t)) : 1;
	if (e !== "Time") return ke(o);
	for (let e of he) if (e >= o) return e;
	return ke(o / me) * me;
}
function Ce(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return Ae(t);
	let r = Se(e, t.min, t.max, n), i = r * 1e-9, a = e === "Time" ? S(r) : 0;
	if (a > 0) return we(t, a, i);
	e === "Category" && (r = Math.max(1, Math.ceil((Math.floor(t.max) - Math.ceil(t.min) + 1) / fe)));
	let o = Math.ceil(t.min / r) * r, s = t.max - t.min === Infinity, c = [];
	for (let e = 0; e < fe; e++) {
		let n = s ? 2 * (o / 2 + r / 2 * e) : o + e * r;
		if (n > t.max + i || !Number.isFinite(n)) break;
		(c.length === 0 || n > c[c.length - 1]) && c.push(n === 0 ? 0 : n);
	}
	return c;
}
function we(e, t, n) {
	let r = T(C(e.min), t);
	w(r) < e.min - n && (r += t);
	let i = [];
	for (let a = w(r); a <= e.max + n && i.length < fe; a = w(r)) i.push(a === 0 ? 0 : a), r += t;
	return i;
}
function Te(e, t) {
	if (e === "Category") return null;
	if (e === "Time") return t < M ? "HH:mm:ss" : t < P ? "HH:mm" : t < 30 * P ? "dd MMM" : "MMM yyyy";
	if (t >= 1) return "N0";
	let n = -Math.floor(Math.log10(t) + 1e-9);
	return `N${Math.min(pe, n)}`;
}
function Ee(e, t, n, r, i = !1) {
	if (e.kind === "Category") return {
		min: -.5,
		max: Math.max(.5, r - .5),
		logarithmic: !1
	};
	let a = Number.isFinite(t) && Number.isFinite(n) && n >= t, o = e.min ?? (a ? t : 0), s = e.max ?? (a ? n : 1);
	if (i && e.kind !== "Logarithmic" && (o = e.min ?? Math.min(0, o), s = e.max ?? Math.max(0, s)), e.kind === "Logarithmic") {
		let t = e.min ?? 10 ** Math.floor(Math.log10(o > 0 ? o : 1)), n = e.max ?? 10 ** Math.ceil(Math.log10(s > 0 ? s : 10)), r = t > 0 ? t : 1;
		return {
			min: r,
			max: De(n > r ? n : r * 10),
			logarithmic: !0
		};
	}
	if (s - o <= 0) {
		let t = e.kind === "Time" ? P : Math.abs(o) > 0 ? Math.abs(o) / 8 : 1;
		return Oe(e.kind, e.min ?? Math.min(o, s) - t, e.max ?? Math.max(o, s) + t);
	}
	let c = Se(e.kind, o, s, e.ticks), l = e.kind === "Time" ? S(c) : 0;
	if (l === 0) return Oe(e.kind, e.min ?? Math.floor(o / c) * c, e.max ?? Math.ceil(s / c) * c);
	let u = T(C(s), l);
	return w(u) < s && (u += l), Oe(e.kind, e.min ?? w(T(C(o), l)), e.max ?? w(u));
}
function De(e) {
	return Math.min(Math.max(e, -Number.MAX_VALUE), Number.MAX_VALUE);
}
function Oe(e, t, n) {
	if (e !== "Time") return {
		min: De(t),
		max: De(n),
		logarithmic: !1
	};
	let r = Math.min(Math.max(t, b), x), i = Math.min(Math.max(n, b), x);
	return i > r ? {
		min: r,
		max: i,
		logarithmic: !1
	} : r > -621355968e5 ? {
		min: r - P,
		max: r,
		logarithmic: !1
	} : {
		min: r,
		max: r + P,
		logarithmic: !1
	};
}
function ke(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function Ae(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(fe, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
var je = 4;
function Me(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) c.y === null ? (o = He(o, s, i, a), s = []) : s.push({
		x: F(r, t, c.x),
		y: I(r, n, c.y)
	});
	return He(o, s, i, a);
}
function Ne(e, t, n, r, i, a) {
	let o = I(r, n, ve(n, 0)), s = "", c = -1;
	for (let l = 0; l <= e.length; l++) l < e.length && e[l].y !== null ? c < 0 && (c = l) : (c >= 0 && (s = Ke(s, e, c, l - 1, t, n, r, i, a, o)), c = -1);
	return s;
}
function Pe(e, t, n, r, i, a) {
	let o = [], s = [];
	for (let c of e) c.y === null ? (Fe(o, s, i, a, r), s = []) : s.push({
		x: F(r, t, c.x),
		y: I(r, n, c.y)
	});
	return Fe(o, s, i, a, r), o;
}
function Fe(e, t, n, r, i) {
	if (!(t.length < 2)) {
		if (n) Ie(e, t, i);
		else for (let n = 1; n < t.length; n++) r ? ze(e, t, n, i) : Le(e, i, t[n - 1].x, t[n - 1].y, t[n].x, t[n].y);
	}
}
function Ie(e, t, n) {
	let r = t[0].x, i = t[0].y;
	for (let a = 1; a < t.length; a++) {
		let o = (t[a - 1].x + t[a].x) / 2;
		Le(e, n, r, i, o, i), Le(e, n, o, i, o, t[a].y), r = o, i = t[a].y;
	}
	Le(e, n, r, i, t[t.length - 1].x, i);
}
function Le(e, t, n, r, i, a) {
	Re(t, Math.min(n, i), Math.max(n, i)) || Ve(e, n, r, i, a);
}
function Re(e, t, n) {
	return n < e.left || t > be(e);
}
function ze(e, t, n, r) {
	let i = Math.max(0, n - 2), a = Math.min(t.length - 1, n + 1), o = t[n - 1].x, s = t[n - 1].y, c = t[n].x, l = t[n].y, u = o + (c - t[i].x) / 6, d = s + (l - t[i].y) / 6, f = c - (t[a].x - o) / 6, p = l - (t[a].y - s) / 6;
	if (Re(r, Math.min(o, u, f, c), Math.max(o, u, f, c))) return;
	let m = Be(o, s, u, d) + Be(u, d, f, p) + Be(f, p, c, l), h = Math.max(1, Math.min(Math.ceil(m / je), Math.ceil(2 * (r.width + r.height) / je))), g = o, _ = s;
	for (let t = 1; t <= h; t++) {
		let n = t / h, r = 1 - n, i = r * r * r, a = 3 * r * r * n, m = 3 * r * n * n, v = n * n * n, y = i * o + a * u + m * f + v * c, b = i * s + a * d + m * p + v * l;
		Ve(e, g, _, y, b), g = y, _ = b;
	}
}
function Be(e, t, n, r) {
	return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t));
}
function Ve(e, t, n, r, i) {
	(t !== r || n !== i) && e.push({
		x1: t,
		y1: n,
		x2: r,
		y2: i
	});
}
function L(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 100) / 100;
	return String(t === 0 ? 0 : t);
}
function He(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${L(t[0].x)} ${L(t[0].y)}` + Ue(t, n, r);
}
function Ue(e, t, n) {
	if (t) return We(e);
	let r = "";
	for (let t = 1; t < e.length; t++) r += n ? Ge(e, t) : ` L${L(e[t].x)} ${L(e[t].y)}`;
	return r;
}
function We(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${L((e[n - 1].x + e[n].x) / 2)} V${L(e[n].y)}`;
	return t + ` H${L(e[e.length - 1].x)}`;
}
function Ge(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${L(i)} ${L(a)} ${L(o)} ${L(s)} ${L(e[t].x)} ${L(e[t].y)}`;
}
function Ke(e, t, n, r, i, a, o, s, c, l) {
	let u = [];
	for (let e = n; e <= r; e++) u.push({
		x: F(o, i, t[e].x),
		y: I(o, a, t[e].y)
	});
	let d = He(e, u, s, c);
	if (t[n].base === void 0 || t[n].base === null) return d + ` L${L(u[u.length - 1].x)} ${L(l)} L${L(u[0].x)} ${L(l)} Z`;
	let f = [];
	for (let e = r; e >= n; e--) f.push({
		x: F(o, i, t[e].x),
		y: I(o, a, t[e].base ?? 0)
	});
	return d += ` L${L(f[0].x)} ${L(f[0].y)}`, d + Ue(f, s, c) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var qe = Math.PI * 2, Je = -Math.PI / 2;
function Ye(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = Je;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * qe : 0;
		n.push({
			start: r,
			sweep: e
		}), r += e;
	}
	return n;
}
function R(e, t, n) {
	return {
		x: e.x + Math.cos(n) * t,
		y: e.y + Math.sin(n) * t
	};
}
//#endregion
//#region src/chart-share.ts
function Xe(e, t) {
	let n = 0;
	for (let t of e) t !== null && t > 0 && (n += t);
	return t !== null && t > n ? t : n;
}
function Ze(e, t) {
	let n = Xe(e, t), r = [], i = 0;
	for (let t of e) {
		let e = n > 0 && t !== null && t > 0 ? t / n : 0;
		r.push({
			start: i,
			length: e
		}), i += e;
	}
	return r;
}
//#endregion
//#region src/chart-radar.ts
var Qe = Math.PI * 2, $e = -Math.PI / 2;
function et(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of n) t.add(e.x);
	return [...t].sort((e, t) => e - t);
}
function z(e, t) {
	return t <= 0 ? $e : $e + e * Qe / t;
}
function tt(e, t, n) {
	return t === null ? 0 : n * Math.min(Math.max(ge(e, ve(e, t)), 0), 1);
}
function nt(e, t, n) {
	if (n < 3) return R(e, t, $e);
	let r = R(e, t, z(0, n)), i = R(e, t, z(1, n));
	return {
		x: (r.x + i.x) / 2,
		y: (r.y + i.y) / 2
	};
}
function rt(e, t, n, r) {
	return Math.max(0, Math.min(e / 2 - n, t / 2 - r));
}
function it(e) {
	if (e.length === 0) return "";
	let t = [`M${L(e[0].x)} ${L(e[0].y)}`];
	for (let n = 1; n < e.length; n++) t.push(`L${L(e[n].x)} ${L(e[n].y)}`);
	return `${t.join(" ")} Z`;
}
function at(e) {
	let t = [];
	for (let n = 0; n < e.length && e.length > 1; n++) {
		let r = e[n], i = e[(n + 1) % e.length];
		Ve(t, r.x, r.y, i.x, i.y);
	}
	return t;
}
function ot(e) {
	let t = Math.cos(e);
	return t > .3 ? "start" : t < -.3 ? "end" : "middle";
}
//#endregion
//#region src/chart-rows.ts
function st(e, t) {
	let n = e.getAttribute(a.rows);
	if (n === null || n.length === 0) return [];
	try {
		let e = JSON.parse(n), r = [];
		for (let n of e) {
			if (!Array.isArray(n)) {
				r.push(null);
				continue;
			}
			let e = Array.isArray(n[2]) ? n[2].map((e) => B(e, t)) : [], i = Array.isArray(n[4]) ? n[4].map((e) => B(e, t)) : [], a = n.length > 3 && n[3] !== null && n[3] !== void 0 ? String(n[3]) : null;
			r.push({
				key: String(n[0] ?? ""),
				x: String(n[1] ?? ""),
				values: e,
				series: a,
				sizes: i
			});
		}
		return r;
	} catch {
		return [];
	}
}
function ct(e) {
	let t = [];
	for (let n of e) n !== null && t.push(n);
	return t;
}
function lt(e, t, n, r, i) {
	let a = n.xPath === null ? null : r(e, n.xPath), o = a == null ? null : St(a);
	if (_(n)) {
		let a = St(r(e, n.seriesPath)), s = Ct(n, a), c = s?.valuePath ?? n.valuePath, l = s?.sizePath ?? null;
		return {
			key: t,
			x: o,
			values: [c === null ? null : B(r(e, c), i)],
			series: a,
			sizes: l === null ? [] : [B(r(e, l), i)]
		};
	}
	let s = [], c = [], l = !1;
	for (let t of n.series) {
		let a = t.valuePath ?? n.valuePath;
		s.push(a === null ? null : B(r(e, a), i)), c.push(t.sizePath === null ? null : B(r(e, t.sizePath), i)), l ||= t.sizePath !== null;
	}
	return {
		key: t,
		x: o,
		values: s,
		series: null,
		sizes: l ? c : []
	};
}
function ut(e, t, n, r, i, a, o) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	let s = /* @__PURE__ */ new Set();
	for (let t of e) t !== null && s.add(t.key);
	if (t === "Move") for (let t of r) mt(e, s, t.key, t.oldIndex, t.newIndex);
	else for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (t === "Remove") {
			let t = ft(e, s, n, r.index);
			t >= 0 && pt(s, e.splice(t, 1)[0]);
			continue;
		}
		let c = dt(r.item, r.key ?? n ?? "", i, a, o), l = t === "Replace" ? ft(e, s, r.oldKey ?? n, r.index) : ft(e, s, n, null);
		l >= 0 ? (pt(s, e[l]), e[l] = c) : r.index === null || r.index < 0 || r.index >= e.length ? e.push(c) : e.splice(r.index, 0, c), c !== null && s.add(c.key);
	}
}
function dt(e, t, n, r, i) {
	if (e == null) return null;
	let a = lt(e, t, n, r, i);
	return n.xPath !== null && a.x === null ? null : a;
}
function ft(e, t, n, r) {
	if (n !== null && t.has(n)) {
		for (let t = 0; t < e.length; t++) if (e[t]?.key === n) return t;
	}
	return r !== null && r >= 0 && r < e.length && e[r] === null ? r : -1;
}
function pt(e, t) {
	t != null && e.delete(t.key);
}
function mt(e, t, n, r, i) {
	let a = ft(e, t, n, r);
	if (a < 0) return;
	let [o] = e.splice(a, 1), s = i === null || i < 0 || i > e.length ? e.length : i;
	e.splice(s, 0, o);
}
function ht(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), o = _(t), s = t.x.kind === "Logarithmic", c = t.y.kind === "Logarithmic", l = vt(), u = vt(), d = vt();
	for (let f = 0; f < e.length; f++) {
		let p = e[f], m = t.xPath === null ? bt(f, t.x.kind, i) : p.x === null ? null : xt(p.x, t.x.kind, i, n, r);
		if (!(m === null || s && m <= 0)) {
			if (yt(l, m), o) _t(wt(a, p.series ?? ""), p, m, gt(p.values.length > 0 ? p.values[0] : null, c), p.sizes.length > 0 ? p.sizes[0] : null, u, d);
			else for (let e = 0; e < a.length; e++) _t(a[e], p, m, gt(e < p.values.length ? p.values[e] : null, c), e < p.sizes.length ? p.sizes[e] : null, u, d);
		}
	}
	for (let e of a) e.drawn = e.points;
	return {
		series: a,
		categories: [...i.keys()],
		xMin: l.min,
		xMax: l.max,
		yMin: u.min,
		yMax: u.max,
		sizeMin: d.min,
		sizeMax: d.max
	};
}
function gt(e, t) {
	return t && e !== null && e <= 0 ? null : e;
}
function _t(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && yt(a, r), i !== null && yt(o, i);
}
function vt() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function yt(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function bt(e, t, n) {
	return t === "Category" ? xt(String(e), t, n, () => null, () => null) ?? e : e;
}
function xt(e, t, n, r, i) {
	if (t === "Category") {
		let t = n.get(e);
		return t === void 0 ? (n.set(e, n.size), n.size - 1) : t;
	}
	let a = i(e);
	if (a !== null || t !== "Time") return a;
	let o = r(e);
	return o === null ? null : O(o);
}
function B(e, t) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "boolean" ? +!!e : typeof e == "string" ? t(e) : null;
}
function St(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function Ct(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function wt(e, t) {
	for (let n of e) if (n.series.key === t) return n;
	let n = {
		series: {
			key: t,
			caption: t,
			valuePath: null,
			sizePath: null,
			color: null,
			stepped: null,
			smooth: null,
			markers: null
		},
		index: e.length,
		points: [],
		drawn: []
	};
	return e.push(n), n;
}
//#endregion
//#region src/chart-stack.ts
function Tt(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = [];
		for (let i of r.points) {
			if (i.y === null) {
				e.push(i);
				continue;
			}
			let r = i.y < 0 ? n : t, a = r.get(i.x) ?? 0;
			r.set(i.x, a + i.y), e.push({
				...i,
				y: a + i.y,
				base: a
			});
		}
		r.drawn = e;
	}
}
//#endregion
//#region src/chart-window.ts
var Et = .002;
function V(e) {
	return e.to - e.from;
}
function H(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * Et, a = Math.min(Math.max(Number.isFinite(V(e)) && V(e) > 0 ? V(e) : r, i), r);
	if (a >= r) return {
		from: t,
		to: n
	};
	let o = Math.max(Math.min(Number.isFinite(e.from) ? e.from : t, n - a), t);
	return {
		from: o,
		to: o + a
	};
}
function Dt(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return H(e, r, i);
	let a = V(e) * n, o = V(e) > 0 ? Math.min(Math.max((t - e.from) / V(e), 0), 1) : .5;
	return H({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function Ot(e, t, n, r) {
	return H(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function kt(e, t, n) {
	return {
		from: n - (Number.isFinite(V(e)) && V(e) > 0 ? V(e) : n - t),
		to: n
	};
}
function At(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && jt(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function jt(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return Mt(r, r, n) || t + 1 < e.length && Mt(r, e[t + 1].x, n) || t > 0 && Mt(e[t - 1].x, r, n);
}
function Mt(e, t, n) {
	return Math.min(e, t) <= n.to && Math.max(e, t) >= n.from;
}
//#endregion
//#region src/chart-draw.ts
var Nt = "http://www.w3.org/2000/svg", U = 12, Pt = 22, Ft = 16, It = 8, Lt = 16, Rt = "P1", zt = `:scope > .${o.area} > .${o.centre}`;
function Bt(e, t) {
	let n = e.root.querySelector(`.${o.canvas}`);
	if (n === null) return null;
	let r = e.model, i = ht(e.rows, r, t.temporal.parse, t.numbers.parseInvariant), a = {
		...i,
		categories: g(r.x, i.categories, (e) => t.strings.resolveText(e))
	}, s = a.series.filter((t) => !e.hidden.has(t.series.key));
	r.stacked && Tt(s);
	let c = Ee(r.x, a.xMin, a.xMax, a.categories.length), l = a.xMin > a.xMax ? null : r.x.kind === "Category" ? c.max : a.xMax;
	e.follow && e.view !== null && l !== null && l > e.view.to && (e.view = kt(e.view, c.min, l)), e.follow = !1;
	let d = e.view === null ? null : H(e.view, c.min, c.max), f = At(s.map((e) => e.drawn), d), p = d === null ? c : {
		...c,
		min: d.from,
		max: d.to
	}, m = Ee(r.y, f.min, f.max, 0, r.kind === u.area || r.kind === u.bar || r.kind === u.radar), h = t.numbers.readCulture(e.root), _ = t.temporal.readCulture(e.root), v = {
		x: r.x.format ?? Te(r.x.kind, Se(r.x.kind, p.min, p.max, r.x.ticks)),
		y: r.y.format ?? Te(r.y.kind, Se(r.y.kind, m.min, m.max, r.y.ticks))
	}, y = t.colors.count(e.root), b = r.kind === u.pie || r.kind === u.share, x = r.kind === u.share ? Wt(e.root) : null, S = b ? Vt(r, a, e.hidden, x, v, h, _, t, y) : a.series.map((e) => ({
		key: e.series.key,
		caption: e.series.caption,
		color: En(e, y, t.colors)
	})), C = r.kind === u.share ? Ut(r, a, e.hidden, x, v, h, _, t) : null;
	r.legend !== "None" && te(e.root, S, C, e.hidden, t.names, t.focusReturn), le(e.root, r.legend);
	let w = r.kind === u.radar ? Qt(n, r, a, v, h, _, t) : null, T = n.parentElement;
	T !== null && de(e.root, T, r.legend, r.kind === u.pie ? 0 : w === null ? null : 2 * (w.across - w.down)), Gt(n, S, t);
	let E = n.getBoundingClientRect(), D = Math.round(E.width), O = Math.round(E.height);
	if (e.width = D, e.height = O, D < 2 || O < 2) return null;
	n.setAttribute("viewBox", `0 0 ${L(D)} ${L(O)}`);
	let k = document.createElementNS(Nt, "svg");
	if (r.kind === u.pie) return qt(k, e, a, D, O, v, h, _, t, y), n.replaceChildren(...k.childNodes), null;
	if (r.kind === u.share) return Jt(k, e, a, D, O, x, v, h, _, t, y), n.replaceChildren(...k.childNodes), null;
	if (w !== null) return $t(k, w, e, a, s, m, D, O, v, h, _, t, y), n.replaceChildren(...k.childNodes), null;
	if (r.bare) {
		let r = {
			left: 2,
			top: 2,
			width: D - 4,
			height: O - 4
		};
		return gn(k, e, s, r, p, m, a.categories, v, h, _, t, y), n.replaceChildren(...k.childNodes), {
			plot: r,
			x: p,
			whole: {
				from: c.min,
				to: c.max
			},
			newest: l,
			columns: [],
			canvas: n,
			rule: null
		};
	}
	let ee = cn(n), ne = e.rows.length > 0, re = sn(r.x, v.x, p, a.categories, h, _, t, ee.width, ne), ie = sn(r.y, v.y, m, a.categories, h, _, t, ee.width, ne), ae = (r.horizontal ? re : ie).reduce((e, t) => Math.max(e, t.width), 0);
	ee.release();
	let A = ln(r, D, O, ae);
	fn(k, r, A, p, m, re, ie), mn(k, r, A, p, m, re, ie, D, O), gn(k, e, s, A, p, m, a.categories, v, h, _, t, y, {
		min: a.sizeMin,
		max: a.sizeMax
	}), e.rows.length === 0 && Sn(k, A, t);
	let oe = r.sharedTooltip ? Cn(r, s, A, p, a.categories, v, h, _, t) : [], se = oe.length > 0 ? Tn(k, A, r.horizontal) : null;
	return n.replaceChildren(...k.childNodes), {
		plot: A,
		x: p,
		whole: {
			from: c.min,
			to: c.max
		},
		newest: l,
		columns: oe,
		canvas: n,
		rule: se
	};
}
function Vt(e, t, n, r, i, a, o, s, c) {
	let l = t.series.length > 0 ? t.series[0].points : [], u = Ze(Ht(l, n), r);
	return l.map((r, l) => {
		let d = {
			key: r.key,
			caption: W(e.x, i.x, r.x, t.categories, a, o, s),
			color: s.colors.color(l, c)
		};
		if (!e.legendValues) return d;
		if (r.y === null) return {
			...d,
			value: s.strings.text(p.noReading),
			share: s.strings.text(p.noReading)
		};
		let f = W(e.y, i.y, r.y, [], a, o, s);
		return n.has(r.key) ? {
			...d,
			value: f
		} : {
			...d,
			value: f,
			share: s.numbers.format(u[l].length, Rt, a)
		};
	});
}
function Ht(e, t) {
	return e.map((e) => t.has(e.key) ? null : e.y);
}
function Ut(e, t, n, r, i, a, o, s) {
	let c = Ht(t.series.length > 0 ? t.series[0].points : [], n), l = Xe(c, r), u = l - Xe(c, null);
	if (u <= 0) return null;
	let d = e.remainderCaption ?? s.strings.text(p.rest);
	return e.legendValues ? {
		caption: d,
		value: W(e.y, i.y, u, [], a, o, s),
		share: s.numbers.format(u / l, Rt, a)
	} : { caption: d };
}
function Wt(e) {
	let t = Number.parseFloat(e.getAttribute(a.total) ?? "");
	return Number.isFinite(t) ? t : null;
}
function Gt(e, t, n) {
	let r = t.length > 0 ? Kt(t.map((e) => e.caption), n.strings) : n.strings.text(p.label);
	e.getAttribute("aria-label") !== r && e.setAttribute("aria-label", r);
}
function Kt(e, t) {
	let n = e.length > 0 ? e[0] : "";
	for (let r = 1; r < e.length; r++) n = t.format(p.list, {
		list: n,
		next: e[r]
	});
	return n;
}
function qt(e, t, n, r, i, s, l, u, d, f) {
	let p = t.model, m = n.series.length > 0 ? n.series[0].points : [], h = [];
	for (let e = 0; e < m.length; e++) t.hidden.has(m[e].key) || h.push({
		point: m[e],
		index: e
	});
	let g = Ye(h.map((e) => e.point.y)), _ = {
		x: r / 2,
		y: i / 2
	}, v = Math.min(r, i) / 2 - U, y = v * p.donut, b = J(e, "g", o.plot);
	for (let e = 0; e < h.length; e++) {
		if (g[e].sweep <= 0 || v <= 0) continue;
		let t = h[e].point, r = J(b, "g", o.series);
		r.setAttribute(a.series, t.key), r.style.setProperty(c.seriesColor, d.colors.color(h[e].index, f));
		let i = J(r, "circle", o.sector);
		if (i.setAttribute("cx", L(_.x)), i.setAttribute("cy", L(_.y)), i.setAttribute("r", L((v + y) / 2)), i.setAttribute("stroke-width", L(v - y)), i.style.setProperty(c.arcStart, Xt(g[e].start)), i.style.setProperty(c.arcSweep, Xt(g[e].sweep)), i.setAttribute(a.point, t.key), i.setAttribute(a.series, n.series[0].series.key), !p.tooltip) continue;
		let m = R(_, (v + y) / 2, g[e].start + g[e].sweep / 2), x = J(r, "circle", o.sectorAnchor);
		i.setAttribute(a.sectorTooltip, q(p, n.series[0], t.x, t.y ?? 0, n.categories, s, l, u, d)), x.setAttribute("cx", L(m.x)), x.setAttribute("cy", L(m.y)), x.setAttribute("r", "1");
	}
	Zt(b, g, _, v, y);
	let x = t.root.querySelector(zt), S = `${L(Math.max(y, 0) * Math.SQRT2)}px`;
	x !== null && x.style.maxWidth !== S && (x.style.maxWidth = S), x?.classList.toggle(o.centreHidden, m.length === 0), m.length === 0 && Sn(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, d);
}
function Jt(e, t, n, r, i, s, l, u, d, f, p) {
	let m = t.model, h = n.series.length > 0 ? n.series[0].points : [], g = Ze(Ht(h, t.hidden), s), _ = Yt(g), v = _ < 0 ? 0 : Math.round((g[_].start + g[_].length) * r), y = J(e, "g", o.plot);
	for (let e = 0; e < h.length; e++) {
		if (g[e].length <= 0) continue;
		let t = h[e], s = Math.round(g[e].start * r), b = Math.max(1, Math.round((g[e].start + g[e].length) * r) - s - +(e < _ || v < r)), x = J(y, "g", o.series), S = J(x, "rect", o.segment);
		x.setAttribute(a.series, t.key), x.style.setProperty(c.seriesColor, f.colors.color(e, p)), S.setAttribute("x", L(s)), S.setAttribute("y", "0"), S.setAttribute("width", L(b)), S.setAttribute("height", L(i)), S.setAttribute(a.point, t.key), S.setAttribute(a.series, n.series[0].series.key), m.tooltip && S.setAttribute(f.names.tooltip, q(m, n.series[0], t.x, t.y ?? 0, n.categories, l, u, d, f));
	}
	if (v >= r) return;
	let b = J(y, "rect", o.rest);
	b.setAttribute("x", L(v)), b.setAttribute("y", "0"), b.setAttribute("width", L(r - v)), b.setAttribute("height", L(i));
}
function Yt(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].length > 0) return t;
	return -1;
}
function Xt(e) {
	return `${L(e * 180 / Math.PI)}deg`;
}
function Zt(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = R(n, i, t.start), s = R(n, r, t.start), c = J(e, "line", o.sectorEdge);
		c.setAttribute("x1", L(a.x)), c.setAttribute("y1", L(a.y)), c.setAttribute("x2", L(s.x)), c.setAttribute("y2", L(s.y));
	}
}
function Qt(e, t, n, r, i, a, o) {
	let s = et(n.series.map((e) => e.drawn)), c = s.map((e) => W(t.x, r.x, e, n.categories, i, a, o)), l = cn(e), u = c.reduce((e, t) => Math.max(e, l.width(t)), 0);
	return l.release(), {
		spokes: s,
		names: c,
		across: u + It + U,
		down: 36
	};
}
function $t(e, t, n, r, i, a, s, c, l, u, d, f, p) {
	let m = n.model, h = t.spokes, g = {
		x: s / 2,
		y: c / 2
	}, _ = rt(s, c, t.across, t.down), v = (n.rows.length > 0 || m.y.min !== null || m.y.max !== null ? Ce(m.y.kind, a, m.y.ticks) : []).map((e) => ({
		value: e,
		text: W(m.y, l.y, e, [], u, d, f)
	}));
	h.length > 0 && _ > 0 && en(e, m, t.names, v, a, g, _);
	let y = J(e, "g", o.plot), b = J(y, "g", o.bands);
	for (let e of i) rn(y, b, m, e, h, a, g, _, r.categories, l, u, d, f, p);
	h.length > 0 && _ > 0 && on(e, v, a, g, _, h.length), n.rows.length === 0 && Sn(e, {
		left: 0,
		top: 0,
		width: s,
		height: c
	}, f);
}
function en(e, t, n, r, i, a, s) {
	let c = n.length;
	if (t.y.grid) {
		let t = J(e, "g", o.grid);
		for (let e of r) {
			let n = tt(i, e.value, s);
			n > 0 && n < s && tn(t, o.gridLine, c, a, n);
		}
	}
	let l = J(e, "g", o.axes);
	tn(l, o.axisLine, c, a, s);
	for (let e = 0; e < c; e++) {
		let r = z(e, c), i = R(a, s, r), u = R(a, s + It, r);
		t.x.grid && Y(l, o.axisLine, a.x, a.y, i.x, i.y), X(l, o.label, n[e], u.x, nn(r, u.y), ot(r));
	}
}
function tn(e, t, n, r, i) {
	let a = [];
	for (let e = 0; e < n; e++) a.push(R(r, i, z(e, n)));
	Dn(e, t, at(a));
}
function nn(e, t) {
	let n = Math.sin(e);
	return n < -.3 ? t : n > .3 ? t + 12 : t + 4;
}
function rn(e, t, n, r, i, s, l, u, d, f, p, m, h, g) {
	let _ = r.series.markers ?? n.markers, v = /* @__PURE__ */ new Map();
	for (let e of r.drawn) v.has(e.x) || v.set(e.x, e);
	let y = i.map((e) => v.get(e) ?? null), b = y.map((e, t) => R(l, tt(s, e?.y ?? null, u), z(t, i.length))), x = J(e, "g", o.series), S = En(r, g, h.colors);
	if (x.setAttribute(a.series, r.series.key), x.style.setProperty(c.seriesColor, S), an(t, r.series.key, S, it(b)), Dn(x, o.line, at(b)), _ || n.tooltip) for (let e = 0; e < y.length; e++) {
		let t = y[e];
		if (t === null || t.y === null) continue;
		let i = n.tooltip ? q(n, r, t.x, t.y, d, f, p, m, h) : null;
		vn(x, t.key, b[e].x, b[e].y, _ ? 3 : 5, _, i, h.names);
	}
}
function an(e, t, n, r) {
	let i = J(e, "path", o.fill);
	i.setAttribute(a.series, t), i.style.setProperty(c.seriesColor, n), i.setAttribute("d", r);
}
function on(e, t, n, r, i, a) {
	let s = J(e, "g", o.axes), c = NaN;
	for (let e of t) {
		let t = tt(n, e.value, i), l = nt(r, t, a);
		t <= 0 || Number.isFinite(c) && Math.abs(l.y - c) < Lt || (c = l.y, X(s, `${o.label} ${o.ringLabel}`, e.text, l.x, l.y + 4, "middle"));
	}
}
function sn(e, t, n, r, i, a, o, s, c) {
	return !c && e.min === null && e.max === null ? [] : Ce(e.kind, n, e.ticks).map((n) => {
		let c = W(e, t, n, r, i, a, o);
		return {
			value: n,
			text: c,
			width: s(c)
		};
	});
}
function W(e, t, n, r, i, a, o) {
	if (e.kind === "Category") {
		let e = Math.round(n);
		return e >= 0 && e < r.length ? r[e] : "";
	}
	return e.kind === "Time" ? o.temporal.format(k(n), t, a) : o.numbers.format(n, t, i);
}
function cn(e) {
	let t = document.createElementNS(Nt, "text");
	return t.setAttribute("class", o.label), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function ln(e, t, n, r) {
	let i = r + 16 + (un(e).caption === null ? 0 : Ft), a = Pt + (dn(e).caption === null ? 0 : Ft);
	return {
		left: i,
		top: U,
		width: Math.max(1, t - i - U),
		height: Math.max(1, n - a - U)
	};
}
function un(e) {
	return e.horizontal ? e.x : e.y;
}
function dn(e) {
	return e.horizontal ? e.y : e.x;
}
function G(e, t, n, r) {
	return e.horizontal ? ye(t, n, r) : F(t, n, r);
}
function K(e, t, n, r) {
	return e.horizontal ? F(t, n, r) : I(t, n, r);
}
function fn(e, t, n, r, i, a, s) {
	if (!t.x.grid && !t.y.grid) return;
	let c = J(e, "g", o.grid);
	if (t.y.grid) for (let e of s) pn(c, n, K(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) pn(c, n, G(t, n, r, e.value), !t.horizontal);
}
function pn(e, t, n, r) {
	r ? Y(e, o.gridLine, n, t.top, n, xe(t)) : Y(e, o.gridLine, t.left, n, be(t), n);
}
function mn(e, t, n, r, i, a, s, c, l) {
	let u = J(e, "g", o.axes);
	Y(u, o.axisLine, n.left, xe(n), be(n), xe(n)), Y(u, o.axisLine, n.left, n.top, n.left, xe(n));
	let d = t.horizontal ? s : a, f = t.horizontal ? a : s, p = -Infinity;
	for (let e of d) {
		let a = e.width / 2, s = t.horizontal ? K(t, n, i, e.value) : G(t, n, r, e.value), l = Math.min(Math.max(s, a), c - a);
		l - a < p || (p = l + a + It, X(u, o.label, e.text, l, xe(n) + 16, "middle"));
	}
	let m = NaN;
	for (let e of f) {
		let a = t.horizontal ? G(t, n, r, e.value) : K(t, n, i, e.value);
		Number.isFinite(m) && Math.abs(a - m) < Lt || (m = a, X(u, o.label, e.text, n.left - It, a + 4, "end"));
	}
	let h = dn(t).caption, g = un(t).caption;
	if (h !== null && X(u, o.caption, h, n.left + n.width / 2, l - 2, "middle"), g !== null) {
		let e = n.top + n.height / 2;
		X(u, o.caption, g, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${L(e)})`);
	}
}
function hn(e, t, n, r, i) {
	let a = J(e, "clipPath", "");
	n.clip === null ? n.clip = i.ensureId(a, s) : a.setAttribute("id", n.clip);
	let o = J(a, "rect", "");
	o.setAttribute("x", L(r.left)), o.setAttribute("y", L(r.top)), o.setAttribute("width", L(r.width)), o.setAttribute("height", L(r.height)), t.setAttribute("clip-path", `url(#${n.clip})`);
}
function gn(n, r, s, l, d, f, p, m, h, g, _, v, y = {
	min: Infinity,
	max: -Infinity
}) {
	let b = J(n, "g", o.plot), x = r.model;
	r.view !== null && hn(n, b, r, l, _);
	let S = x.kind === u.area ? J(b, "g", o.bands) : null, C = x.kind === u.bar ? t(x.horizontal ? l.height : l.width, e(s.map((e) => e.drawn), d)) : 0;
	for (let e = 0; e < s.length; e++) {
		let t = s[e], n = t.series.stepped ?? x.stepped, r = t.series.smooth ?? x.smooth, w = t.series.markers ?? x.markers, T = J(b, "g", o.series), E = En(t, v, _.colors);
		if (T.setAttribute(a.series, t.series.key), T.style.setProperty(c.seriesColor, E), x.kind === u.bar) yn(T, t, e, s.length, l, d, f, C, p, m, h, g, _, x);
		else if (x.kind === u.scatter) for (let e = 0; e < t.drawn.length; e++) _n(T, t, e, l, d, f, i(t.drawn[e].size, y.min, y.max), !0, p, m, h, g, _, x);
		else if (S !== null && an(S, t.series.key, E, Ne(t.drawn, d, f, l, n, r)), Dn(T, o.line, Pe(t.drawn, d, f, l, n, r)), J(T, "path", o.lineHit).setAttribute("d", Me(t.drawn, d, f, l, n, r)), w || x.tooltip) for (let e = 0; e < t.drawn.length; e++) _n(T, t, e, l, d, f, w ? 3 : 5, w, p, m, h, g, _, x);
	}
}
function _n(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = t.drawn[n];
	if (m.y === null) return;
	let h = !p.tooltip || p.sharedTooltip ? null : q(p, t, m.x, bn(t, n), c, l, u, d, f);
	vn(e, m.key, F(r, i, m.x), I(r, a, m.y), o, s, h, f.names);
}
function vn(e, t, n, i, s, c, l, u) {
	let d = {
		x: L(n),
		y: L(i)
	}, f = J(e, "g", o.point);
	f.setAttribute(a.point, t);
	let p = J(f, "circle", c ? o.marker : `${o.marker} ${o.bareMarker}`);
	p.setAttribute("cx", d.x), p.setAttribute("cy", d.y), p.setAttribute("r", L(s));
	let m = J(f, "circle", o.hit);
	m.setAttribute("cx", d.x), m.setAttribute("cy", d.y), m.setAttribute("r", L(r(s))), l !== null && m.setAttribute(u.tooltip, l);
}
function yn(e, t, r, i, s, c, l, u, d, f, p, m, h, g) {
	let _ = g.horizontal;
	for (let v = 0; v < t.drawn.length; v++) {
		let y = t.drawn[v];
		if (y.y === null) continue;
		let b = n(G(g, s, c, y.x), u, r, i, g.stacked), x = K(g, s, l, y.y), S = K(g, s, l, ve(l, y.base ?? 0)), C = Math.min(x, S), w = Math.max(1, Math.abs(x - S)), T = J(e, "rect", o.bar);
		T.setAttribute("x", L(_ ? C : b.start)), T.setAttribute("y", L(_ ? b.start : C)), T.setAttribute("width", L(_ ? w : b.thickness)), T.setAttribute("height", L(_ ? b.thickness : w)), T.setAttribute(a.point, y.key), g.tooltip && !g.sharedTooltip && T.setAttribute(h.names.tooltip, q(g, t, y.x, bn(t, v), d, f, p, m, h));
	}
}
function bn(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function q(e, t, n, r, i, a, o, s, c) {
	let l = W(e.x, a.x, n, i, o, s, c), u = W(e.y, a.y, r, i, o, s, c);
	return xn(t.series.caption, l, u, c);
}
function xn(e, t, n, r) {
	return r.strings.format(p.point, {
		series: e,
		x: t,
		y: n
	}, !0);
}
function Sn(e, t, n) {
	let r = n.strings.text(p.empty);
	r.length !== 0 && X(e, o.empty, r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function Cn(e, t, n, r, i, a, o, s, c) {
	let l = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) for (let n of t[e].points) {
		if (n.y === null || n.x < r.min || n.x > r.max) continue;
		let i = l.get(n.x);
		i === void 0 && (i = Array(t.length).fill(null), l.set(n.x, i)), i[e] ??= n.y;
	}
	return [...l.keys()].sort((e, t) => e - t).map((u) => {
		let d = l.get(u) ?? [], f = null;
		return {
			at: G(e, n, r, u),
			get text() {
				if (f !== null) return f;
				let n = [c.escape(W(e.x, a.x, u, i, o, s, c))];
				for (let r = 0; r < t.length; r++) {
					let l = d[r];
					if (l == null) continue;
					let u = W(e.y, a.y, l, i, o, s, c);
					n.push(wn(t[r].series.caption, u, c));
				}
				return f = n.join("\n"), f;
			}
		};
	});
}
function wn(e, t, n) {
	return n.strings.format(p.reading, {
		series: e,
		value: t
	}, !0);
}
function Tn(e, t, n) {
	let r = J(e, "rect", l.rule);
	return r.setAttribute("x", n ? L(t.left) : "0"), r.setAttribute("y", n ? "0" : L(t.top)), r.setAttribute("width", n ? L(t.width) : "1"), r.setAttribute("height", n ? "1" : L(t.height)), r;
}
function En(e, t, n) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : n.color(e.index, t);
}
function J(e, t, n) {
	let r = document.createElementNS(Nt, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function Dn(e, t, n) {
	let r = J(e, "g", t);
	for (let e of n) {
		let t = document.createElementNS(Nt, "line");
		t.setAttribute("x1", L(e.x1)), t.setAttribute("y1", L(e.y1)), t.setAttribute("x2", L(e.x2)), t.setAttribute("y2", L(e.y2)), r.appendChild(t);
	}
}
function Y(e, t, n, r, i, a) {
	let o = J(e, "line", t);
	o.setAttribute("x1", L(n)), o.setAttribute("y1", L(r)), o.setAttribute("x2", L(i)), o.setAttribute("y2", L(a));
}
function X(e, t, n, r, i, a) {
	let o = J(e, "text", t);
	return o.setAttribute("x", L(r)), o.setAttribute("y", L(i)), o.setAttribute("text-anchor", a), o.textContent = n, o;
}
//#endregion
//#region src/chart-gauge.ts
var On = `.${o.gauge}`, kn = `.${o.gaugeNumber}`, An = `.${o.gaugeUnit}`;
function jn(e, t, n) {
	let r = e.getAttribute(a.gaugeFormat) ?? "N0", i = typeof t == "number" ? t : typeof t == "string" ? n.numbers.parseInvariant(t) ?? NaN : NaN, o = Number.isFinite(i), s = o ? n.numbers.format(i, r, n.numbers.readCulture(e)) : n.strings.text(p.noReading);
	e.textContent !== s && (e.textContent = s);
	let c = e.parentElement?.querySelector(An);
	c != null && c.hidden === o && (c.hidden = !o);
}
function Mn(e, t) {
	for (let n of e.querySelectorAll(On)) {
		let e = n.querySelector(kn);
		e !== null && jn(e, n.style.getPropertyValue(c.gaugeValue).trim(), t);
	}
}
//#endregion
//#region src/chart-press.ts
var Nn = `[${a.point}]`, Pn = `.${l.pendingPoint}`, Fn = `.${o.series}`, In = class {
	wait;
	timer = null;
	pending = null;
	constructor(e) {
		this.wait = e;
	}
	press(e, t) {
		if (e > 1) {
			this.cancel();
			return;
		}
		let n = this.pending;
		this.cancel(), n?.(), this.pending = t, this.timer = setTimeout(() => {
			this.timer = null, this.pending = null, t();
		}, this.wait);
	}
	cancel() {
		this.timer !== null && clearTimeout(this.timer), this.timer = null, this.pending = null;
	}
}, Ln = class {
	wait;
	held = null;
	constructor(e) {
		this.wait = new In(e);
	}
	press(e, t, n) {
		this.wait.press(e, () => {
			this.held === t && this.mark(null), n();
		}), this.mark(e > 1 ? null : t);
	}
	mark(e) {
		this.held !== null && Rn(this.held.root, null), this.held = e, e !== null && Rn(e.root, e);
	}
	cancel() {
		this.wait.cancel(), this.mark(null);
	}
	redrawn(e) {
		this.held?.root === e && Rn(e, this.held);
	}
};
function Rn(e, t) {
	if (t === null) for (let t of e.querySelectorAll(Pn)) t.classList.remove(l.pendingPoint);
	else for (let n of e.querySelectorAll(Nn)) n.classList.toggle(l.pendingPoint, n.getAttribute(a.point) === t.point && zn(n) === t.series);
}
function zn(e) {
	return e.getAttribute(a.series) ?? e.closest(Fn)?.getAttribute(a.series) ?? "";
}
//#endregion
//#region src/chart-wheel.ts
function Bn(e, t, n) {
	return !Number.isFinite(e.y) || Math.abs(e.x) > Math.abs(e.y) ? 0 : Math.min(Math.max(e.y / t, -n), n);
}
function Vn(e, t, n, r) {
	let i = e ?? t, a = Dt(i, n, r, t.from, t.to);
	return Math.abs(a.to - a.from - (i.to - i.from)) <= Wn(t) ? e : Un(a, t);
}
function Hn(e, t) {
	return e === null || t === null ? e === t : e.from === t.from && e.to === t.to;
}
function Un(e, t) {
	return e.to - e.from >= t.to - t.from - Wn(t) ? null : e;
}
function Wn(e) {
	return (e.to - e.from) * 1e-6;
}
//#endregion
//#region src/chart-words.ts
var Gn = `.${o.sector}`, Kn = `.${o.sectorAnchor}`;
function qn(e) {
	let t = e.closest(Gn), n = t?.getAttribute(a.sectorTooltip) ?? null, r = t?.parentElement?.querySelector(Kn) ?? null;
	return t === null || n === null || r === null ? null : {
		sector: t,
		anchor: r,
		words: n
	};
}
function Jn(e, t, n) {
	let r = qn(e);
	if (r !== null) return {
		anchor: r.anchor,
		words: r.words
	};
	let i = e.closest(`[${n}]`), a = i?.getAttribute(n)?.trim() ?? "";
	return i === null || !t.contains(i) || i === t || a.length === 0 ? null : {
		anchor: i,
		words: a
	};
}
//#endregion
//#region src/chart-engine.ts
var Z = `.${o.root}`, Yn = `.${o.canvas}`, Xn = `.${o.plot}`, Zn = `.${o.series}`, Qn = `.${o.fill}`, $n = `[${a.point}]`, er = `.${o.area}`, tr = `.${l.rule}`, nr = `.${o.window}`, rr = 250, ir = 1.2, ar = 800, or = 3, sr = 3, cr = `.${o.legendEntry}`, lr = `.${o.bar}`, ur = class {
	charts = /* @__PURE__ */ new WeakMap();
	formatting;
	tooltips;
	states;
	wheel;
	observeSize;
	readPath;
	tooltipAttribute;
	tapped = null;
	fingerTap = !1;
	shared = null;
	sharedColumn = null;
	sector = null;
	dirty = /* @__PURE__ */ new Set();
	frameRequested = !1;
	drag = null;
	dragged = !1;
	settling = /* @__PURE__ */ new Map();
	pointPress = new Ln(300);
	constructor(e) {
		let t = e.root;
		this.formatting = {
			numbers: e.numbers,
			temporal: e.temporal,
			strings: e.strings,
			names: e.names,
			focusReturn: e.popups.focusReturn,
			ensureId: e.dom.ensureId.bind(e.dom),
			colors: e.colors,
			escape: e.tooltips.escape
		}, this.tooltips = e.tooltips, this.states = e.states, this.wheel = e.wheel, this.observeSize = e.observeSize, this.readPath = e.rows.readPath, this.tooltipAttribute = e.names.tooltip;
		for (let e of t.querySelectorAll(Z)) this.adopt(e);
		e.observeComponents(t, Z, {
			childList: !0,
			attributeFilter: [a.model, a.rows]
		}, (e) => {
			for (let t of e) this.onMutated(t);
		}), e.strings.onChange(() => this.wordsChanged(t)), t.addEventListener("click", (e) => this.onPress(e), !0), t.addEventListener("pointerover", (e) => this.onReadingHover(e), !0), t.addEventListener("pointerout", (e) => this.onReadingHover(e), !0), t.addEventListener("pointerover", (e) => this.onSectorHover(e), !0), t.addEventListener("pointerout", (e) => this.onSectorHover(e), !0), t.addEventListener("wheel", (e) => this.onWheel(e), {
			capture: !0,
			passive: !1
		}), t.addEventListener("pointerdown", (e) => this.onDragStart(e), !0), t.addEventListener("dblclick", (e) => this.onReset(e), !0), t.addEventListener("pointermove", (e) => this.onSharedTooltip(e), !0), t.addEventListener("pointerout", (e) => this.onSharedTooltip(e), !0), t.addEventListener("pointerup", (e) => this.onTap(e), !0), t.addEventListener("pointercancel", (e) => this.onTapCancel(e), !0), t.addEventListener("click", (e) => this.onTapWords(e), !0);
	}
	wordsChanged(e) {
		for (let t of e.querySelectorAll(Z)) {
			let e = this.charts.get(t), n = e === void 0 ? null : m(t);
			e !== void 0 && n !== null && (e.model = h(n, (e) => this.formatting.strings.resolveText(e)), this.schedule(t));
		}
		Mn(e, this.formatting);
	}
	adopt(e) {
		let t = this.resolve(e);
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.schedule(e));
	}
	resolve(e) {
		let t = e.getAttribute(a.model) ?? "", n = e.getAttribute(a.rows) ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.slots.length = 0, r.slots.push(...st(e, this.formatting.numbers.parseInvariant)), r.rows = ct(r.slots), r.rowsText = n), r;
		let i = m(e);
		if (i === null) return null;
		let o = h(i, (e) => this.formatting.strings.resolveText(e)), s = st(e, this.formatting.numbers.parseInvariant), c = {
			root: e,
			model: o,
			slots: s,
			rows: ct(s),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r === void 0 ? fr(dr(e.querySelector(nr) ?? e)) : r.view,
			anchored: r?.anchored ?? !0,
			follow: !1,
			moved: r?.moved ?? !1,
			frame: null,
			width: 0,
			height: 0,
			clip: r?.clip ?? null,
			release: r?.release ?? null,
			front: r?.front ?? null,
			bar: r?.bar ?? null
		};
		return this.charts.set(e, c), c;
	}
	schedule(e) {
		this.dirty.add(e), !this.frameRequested && (this.frameRequested = !0, requestAnimationFrame(() => this.flush()));
	}
	flush() {
		this.frameRequested = !1;
		let e = [...this.dirty];
		this.dirty.clear();
		for (let t of e) try {
			this.redraw(t);
		} catch (e) {
			console.error("NE.Standard.UI.Web.Charts: a chart could not be drawn; its last frame stands.", t, e);
		}
	}
	redraw(e) {
		let t = this.charts.get(e);
		if (t === void 0 || !e.isConnected) return;
		let n = t.view, r = t.frame === null;
		t.frame = Bt(t, this.formatting), wr(t), this.pointPress.redrawn(e), r && gr(t), Hn(t.view, n) || this.settle(e);
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = br(e);
		(n.width !== t.width || n.height !== t.height) && this.schedule(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute(a.model) ?? "") || t.rowsText !== (e.getAttribute(a.rows) ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && (ut(t.slots, e.action, e.items, e.moves, t.model, this.readPath, this.formatting.numbers.parseInvariant), t.rows = ct(t.slots), t.model.followLatest && t.view !== null && t.anchored && e.action !== "Reset" && (t.follow = !0), this.schedule(e.component));
	}
	applyWindow(e, t, n) {
		let r = e.closest(Z), i = r === null ? void 0 : this.charts.get(r), o = fr(t);
		o === null ? e.removeAttribute(a.window) : e.setAttribute(a.window, JSON.stringify(o)), !(r === null || i === void 0 || n) && (this.cancelSettling(r), i.view = o === null ? null : {
			from: o.from,
			to: o.to
		}, i.follow = !1, i.moved = !1, this.schedule(r), gr(i));
	}
	cancelSettling(e) {
		let t = this.settling.get(e);
		t !== void 0 && (window.clearTimeout(t), this.settling.delete(e));
	}
	applyTotal(e, t) {
		let n = e.closest(Z), r = typeof t == "number" ? t : typeof t == "string" ? this.formatting.numbers.parseInvariant(t) ?? NaN : NaN;
		Number.isFinite(r) ? e.setAttribute(a.total, String(r)) : e.removeAttribute(a.total), n !== null && this.charts.has(n) && this.schedule(n);
	}
	applyGaugeValue(e, t) {
		jn(e, t, this.formatting);
	}
	answering(e) {
		return e instanceof Element && !this.states.isInert(e) ? e : null;
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element) || xr(e)) return;
		let t = e.target, n = t.closest(Z), r = n === null ? void 0 : this.charts.get(n);
		e.type === "pointerout" && n !== null && e.relatedTarget instanceof Element && e.relatedTarget.closest(er) !== null && n.contains(e.relatedTarget) || (e.type !== "pointermove" || n === null || r === void 0 || t.closest(er) === null || this.states.isInert(t) || !this.showColumn(n, r, e, !0)) && this.closeShared();
	}
	showColumn(e, t, n, r) {
		let i = t.frame, a = i?.rule ?? null;
		if (i === null || i.columns.length === 0 || a === null) return !1;
		let o = i.canvas.getBoundingClientRect();
		if (!mr(i, n.clientX - o.left, n.clientY - o.top)) return !1;
		let s = t.model.horizontal, c = hr(i.columns, s ? n.clientY - o.top : n.clientX - o.left);
		return this.shared === e && this.sharedColumn === c || (a.setAttribute(s ? "y" : "x", String(Math.round(c.at * 100) / 100)), a.classList.add(l.ruleOn), this.shared = e, this.sharedColumn = c, this.tooltips.show(a, c.text, { delay: r })), !0;
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(tr)?.classList.remove(l.ruleOn), this.shared = null, this.sharedColumn = null, this.tooltips.hide());
	}
	zoomable(e) {
		let t = this.answering(e.target), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (!(e instanceof MouseEvent) || t === null || n === null || r === void 0 || !r.model.zoomable || r.frame === null) return null;
		let i = r.frame.canvas.getBoundingClientRect();
		return t.closest(er) === null || !mr(r.frame, e.clientX - i.left, e.clientY - i.top) ? null : {
			root: n,
			entry: r,
			frame: r.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e);
		if (t === null || !(e instanceof WheelEvent)) return;
		let n = Bn(this.wheel.pixels(e, ar), this.wheel.notch, or);
		if (n === 0) return;
		let { entry: r, frame: i } = t, a = _r(r.view, i.whole), o = a ?? i.whole, s = _e({
			...i.x,
			min: o.from,
			max: o.to
		}, vr(e, i, r.model.horizontal)), c = Vn(a, i.whole, s, ir ** n);
		Hn(c, a) || (e.preventDefault(), r.view = c, r.follow = !1, r.moved = !0, this.schedule(t.root), gr(r), this.settle(t.root));
	}
	settle(e) {
		this.cancelSettling(e), this.settling.set(e, window.setTimeout(() => this.send(e), rr));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(nr);
		if (this.settling.delete(e), t === void 0) return;
		let r = t.moved;
		if (t.moved = !1, n === null || this.states.isInert(e)) return;
		let i = t.view === null ? "" : JSON.stringify({
			from: t.view.from,
			to: t.view.to
		});
		i.length === 0 ? n.removeAttribute(a.window) : n.setAttribute(a.window, i), n.dispatchEvent(new Event("change", { bubbles: !0 })), r && e.dispatchEvent(new CustomEvent(d.windowChange, { bubbles: !0 }));
	}
	onDragStart(e) {
		this.dragged = !1;
		let t = this.zoomable(e), n = t === null ? null : _r(t.entry.view, t.frame.whole);
		if (t === null || n === null || !(e instanceof PointerEvent) || e.button !== 0) return;
		this.drag = {
			root: t.root,
			start: yr(e, t.entry.model.horizontal),
			window: n,
			moved: 0
		};
		let r = (e) => this.onDragMove(e), i = () => {
			window.removeEventListener("pointermove", r, !0), window.removeEventListener("pointerup", i, !0), window.removeEventListener("pointercancel", i, !0), this.onDragEnd();
		};
		window.addEventListener("pointermove", r, !0), window.addEventListener("pointerup", i, !0), window.addEventListener("pointercancel", i, !0);
	}
	onDragMove(e) {
		let t = this.drag, n = t === null ? void 0 : this.charts.get(t.root);
		if (t === null || n === void 0 || n.frame === null || !(e instanceof PointerEvent) || this.states.isInert(t.root)) return;
		let r = n.model.horizontal, i = yr(e, r);
		if (t.moved = Math.max(t.moved, Math.abs(i - t.start)), t.moved <= sr) return;
		let a = r ? n.frame.plot.height : n.frame.plot.width, o = t.window.to - t.window.from, s = a > 0 ? (t.start - i) / a * o : 0;
		t.root.classList.add(l.dragging), n.view = Ot(t.window, s, n.frame.whole.from, n.frame.whole.to), n.follow = !1, n.moved = !0, this.schedule(t.root), gr(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > sr, this.drag !== null && (this.drag.root.classList.remove(l.dragging), this.dragged && this.send(this.drag.root)), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e);
		t !== null && (this.pointPress.cancel(), _r(t.entry.view, t.frame.whole) !== null && (t.entry.view = null, t.entry.anchored = !0, t.entry.follow = !1, t.entry.moved = !0, this.schedule(t.root), this.send(t.root)));
	}
	onReadingHover(e) {
		if (!(e.target instanceof Element) || xr(e)) return;
		let t = e.target.closest(Z), n = t === null ? void 0 : this.charts.get(t);
		t !== null && n !== void 0 && Sr(n, this.pointedAt(t, e));
	}
	pointedAt(e, t) {
		let n = t.type === "pointerover" ? t.target : t instanceof PointerEvent ? t.relatedTarget : null;
		return n instanceof Element && e.contains(n) ? this.answering(n) : null;
	}
	onSectorHover(e) {
		if (!(e.target instanceof Element) || xr(e)) return;
		if (e.type === "pointerout") {
			let t = e instanceof PointerEvent ? e.relatedTarget : null;
			this.sector !== null && this.sector.contains(e.target) && !(t instanceof Node && this.sector.contains(t)) && (this.sector = null, this.tooltips.hide());
			return;
		}
		let t = this.answering(e.target), n = t === null ? null : qn(t);
		n !== null && n.sector !== this.sector && (this.sector = n.sector, this.tooltips.show(n.anchor, n.words, { delay: !0 }));
	}
	onTap(e) {
		if (this.fingerTap = xr(e), !this.fingerTap) return;
		let t = this.dragged ? null : this.answering(e.target), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		this.closeShared(), this.tapped !== null && this.tapped !== n && this.letGo(this.tapped), this.tapped = r === void 0 ? null : n, r !== void 0 && Sr(r, t);
	}
	letGo(e) {
		let t = this.charts.get(e);
		t !== void 0 && Sr(t, null);
	}
	onTapCancel(e) {
		xr(e) && (this.fingerTap = !1, this.tapped !== null && this.letGo(this.tapped), this.tapped = null, this.closeShared());
	}
	onTapWords(e) {
		let t = this.fingerTap;
		if (this.fingerTap = !1, !t || !(e instanceof MouseEvent) || e.detail === 0) return;
		let n = this.answering(e.target), r = n?.closest(Z) ?? null, i = r === null ? void 0 : this.charts.get(r);
		if (n === null || r === null || i === void 0 || r !== this.tapped || n.closest(er) !== null && this.showColumn(r, i, e, !1)) return;
		let a = Jn(n, r, this.tooltipAttribute);
		a !== null && this.tooltips.show(a.anchor, a.words);
	}
	onPress(e) {
		if (e.defaultPrevented || this.answering(e.target) === null || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest($n), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (t === null || n === null) return;
		let i = {
			point: t.getAttribute(a.point) ?? "",
			series: zn(t)
		}, o = () => {
			n.isConnected && !this.states.isInert(n) && n.dispatchEvent(new CustomEvent(d.pointClick, {
				bubbles: !0,
				detail: i
			}));
		}, s = e instanceof MouseEvent ? e.detail : 0;
		r?.model.zoomable !== !0 || s === 0 ? o() : this.pointPress.press(s, {
			root: n,
			...i
		}, o);
	}
	onLegendPress(e) {
		if (!(e.target instanceof Element)) return !1;
		let t = e.target.closest(cr), n = t?.closest(Z) ?? null, r = t?.getAttribute(a.series) ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let o = i.hidden.has(r);
		return t.setAttribute("aria-pressed", o ? "false" : "true"), t.classList.toggle(l.legendOff, o), this.schedule(n), !0;
	}
};
function dr(e) {
	let t = e.getAttribute(a.window);
	return t === null || t.length === 0 ? null : pr(t);
}
function fr(e) {
	let t = typeof e == "string" && e.length > 0 ? pr(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function pr(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function mr(e, t, n) {
	let r = e.plot;
	return t >= r.left && t <= r.left + r.width && n >= r.top && n <= r.top + r.height;
}
function hr(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i].at < t ? n = i + 1 : r = i;
	}
	return n > 0 && Math.abs(e[n - 1].at - t) <= Math.abs(e[n].at - t) ? e[n - 1] : e[n];
}
function gr(e) {
	let t = e.frame, n = t === null ? null : _r(e.view, t.whole);
	e.anchored = t === null || n === null || t.newest === null || n.to >= t.newest - (t.whole.to - t.whole.from) * 1e-6;
}
function _r(e, t) {
	return e === null ? null : Un(H(e, t.from, t.to), t);
}
function vr(e, t, n) {
	let r = n ? t.plot.height : t.plot.width;
	if (r <= 0) return .5;
	let i = t.canvas.getBoundingClientRect(), a = n ? i.top + t.plot.top : i.left + t.plot.left;
	return Math.min(Math.max((yr(e, n) - a) / r, 0), 1);
}
function yr(e, t) {
	return t ? e.clientY : e.clientX;
}
function br(e) {
	let t = e.querySelector(Yn);
	if (t === null) return {
		width: 0,
		height: 0
	};
	let n = t.getBoundingClientRect();
	return {
		width: Math.round(n.width),
		height: Math.round(n.height)
	};
}
function xr(e) {
	return e instanceof PointerEvent && e.pointerType === "touch";
}
function Sr(e, t) {
	let n = t === null ? null : Cr(t), r = t?.closest(lr) ?? null, i = r === null ? null : {
		series: r.parentElement?.getAttribute(a.series) ?? "",
		point: r.getAttribute(a.point) ?? ""
	};
	if (n === e.front && i?.series === e.bar?.series && i?.point === e.bar?.point) return;
	let o = n !== e.front;
	e.front = n, e.bar = i, o ? wr(e) : Er(e);
}
function Cr(e) {
	let t = e.closest(cr);
	return t === null ? e.closest(Xn) === null || e.closest(lr) !== null ? null : e.closest(Qn)?.getAttribute(a.series) ?? e.closest(Zn)?.getAttribute(a.series) ?? null : t.getAttribute(a.series);
}
function wr(e) {
	let t = Tr(e);
	for (let n of e.root.querySelectorAll(`${Zn}, ${Qn}`)) n.classList.toggle(l.backSeries, t !== null && n.getAttribute(a.series) !== t && n.querySelector(lr) === null);
	Er(e);
}
function Tr(e) {
	return e.front !== null && !e.hidden.has(e.front) ? e.front : null;
}
function Er(e) {
	let t = Tr(e), n = e.bar;
	for (let r of e.root.querySelectorAll(lr)) {
		let e = r.parentElement?.getAttribute(a.series), i = n !== null && r.getAttribute(a.point) === n.point && e === n.series;
		r.classList.toggle(l.frontBar, i), r.classList.toggle(l.backBar, !i && (n !== null || t !== null && e !== t));
	}
}
//#endregion
//#region src/framework-api.ts
var Dr = 4;
function Or() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	if (e.contractVersion !== Dr) throw Error(`NE.Standard.UI.Web.Charts was built for plugin contract ${Dr}, but the framework's client on the page implements ${String(e.contractVersion ?? "an older one")}; install the package version that matches the framework.`);
	return e;
}
//#endregion
//#region src/charts.ts
var Q = Or(), $ = null;
Q.registerEngine((e) => {
	$ = new ur(e);
}), Q.registerCollectionSink({
	kind: f.sink,
	handler: (e) => $?.applyChange(e)
}), Q.registerValueReader({
	kind: f.window,
	read: dr
}), Q.registerDomOperation({
	kind: f.window,
	handler: (e) => $?.applyWindow(e.target, e.value, e.local)
}), Q.registerEvent(d.windowChange, { settlesValue: !0 }), Q.registerEvent(d.pointClick, { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), Q.registerDomOperation({
	kind: f.total,
	handler: (e) => $?.applyTotal(e.target, e.value)
}), Q.registerDomOperation({
	kind: f.gaugeValue,
	handler: (e) => $?.applyGaugeValue(e.target, e.value)
});
//#endregion
