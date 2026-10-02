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
//#region src/chart-calendar.ts
var a = 864e5, o = 365 * a, s = -621355968e5, c = 0xe677d21fdbff;
function l(e) {
	return e < 30 * a ? 0 : e < 90 * a ? 1 : e < 180 * a ? 3 : e < o ? 6 : Math.max(12, Math.round(e / o) * 12);
}
function u(e) {
	let t = m(Math.floor(e / a));
	return t.year * 12 + t.month - 1;
}
function d(e) {
	let t = Math.floor(e / 12);
	return p(t, e - t * 12 + 1, 1) * a;
}
function f(e, t) {
	return Math.floor(e / t) * t;
}
function p(e, t, n) {
	let r = t <= 2 ? e - 1 : e, i = Math.floor(r / 400), a = r - i * 400, o = Math.floor((153 * (t > 2 ? t - 3 : t + 9) + 2) / 5) + n - 1, s = a * 365 + Math.floor(a / 4) - Math.floor(a / 100) + o;
	return i * 146097 + s - 719468;
}
function m(e) {
	let t = e + 719468, n = Math.floor(t / 146097), r = t - n * 146097, i = Math.floor((r - Math.floor(r / 1460) + Math.floor(r / 36524) - Math.floor(r / 146096)) / 365), a = r - (365 * i + Math.floor(i / 4) - Math.floor(i / 100)), o = Math.floor((5 * a + 2) / 153), s = o < 10 ? o + 3 : o - 9;
	return {
		year: i + n * 400 + +(s <= 2),
		month: s
	};
}
//#endregion
//#region src/chart-moment.ts
function h(e) {
	return p(e.year, e.month, e.day) * 864e5 + ((e.hour * 60 + e.minute) * 60 + e.second) * 1e3 + e.millisecond;
}
function g(e) {
	let t = new Date(e + new Date(e).getTimezoneOffset() * 6e4);
	return new Date(e + t.getTimezoneOffset() * 6e4);
}
//#endregion
//#region src/chart-names.ts
var _ = {
	model: "data-ui-chart",
	rows: "data-ui-chart-rows",
	series: "data-ui-chart-series",
	window: "data-ui-chart-window",
	point: "data-ui-chart-point",
	sectorTooltip: "data-ui-chart-tooltip",
	gaugeFormat: "data-ui-gauge-format"
}, v = {
	root: "ui-chart",
	area: "ui-chart__area",
	canvas: "ui-chart__canvas",
	window: "ui-chart__window",
	grid: "ui-chart__grid",
	gridLine: "ui-chart__grid-line",
	axes: "ui-chart__axes",
	axisLine: "ui-chart__axis-line",
	label: "ui-chart__label",
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
	legend: "ui-chart__legend",
	legendEntry: "ui-chart__legend-entry",
	legendMark: "ui-chart__legend-mark",
	legendCaption: "ui-chart__legend-caption",
	gauge: "ui-gauge",
	gaugeNumber: "ui-gauge__number",
	gaugeUnit: "ui-gauge__unit"
}, y = "ui-chart-clip-drawn", b = {
	seriesColor: "--ui-chart-series-color",
	arcStart: "--ui-arc-start",
	arcSweep: "--ui-arc-sweep",
	gaugeValue: "--ui-gauge-value"
}, x = {
	rule: "ui-chart__rule",
	ruleOn: "ui-chart__rule--on",
	dragging: "ui-chart--dragging",
	backSeries: "ui-chart__series--back",
	frontBar: "ui-chart__bar--front",
	pendingPoint: "ui-chart__point--pending",
	legendOff: "ui-chart__legend-entry--off",
	legendUnder: "ui-chart--legend-under"
}, S = {
	line: "line",
	area: "area",
	bar: "bar",
	pie: "pie",
	scatter: "scatter",
	radar: "radar"
}, C = {
	pointClick: "point-click",
	windowChange: "window-change"
}, w = {
	sink: "chart",
	window: "chart-window",
	gaugeValue: "chart-gauge-value"
}, T = {
	empty: "ui.chart.empty",
	label: "ui.chart.label",
	noReading: "ui.chart.no-reading",
	point: "ui.chart.point",
	sector: "ui.chart.sector",
	reading: "ui.chart.reading",
	list: "ui.chart.list"
}, E = {
	ghostButtonClass: "ui-button--ghost",
	smallButtonClass: "ui-button--small",
	seriesColorCount: "--ui-color-series-count",
	seriesColorPrefix: "--ui-color-series-"
}, D = 256;
function ee(e, t, n, r, i) {
	let a = te(e), o = a === null ? [] : [...a.children], s = o.find((e) => e === document.activeElement) ?? null;
	if (t.length === 0) {
		a?.remove(), s !== null && i(e)?.focus({ preventScroll: !0 });
		return;
	}
	a === null && (a = document.createElement("div"), a.className = v.legend, a.setAttribute(r.eventBoundary, ""), e.append(a));
	let c = ne(o, t), l = a.firstElementChild;
	for (let e of t) {
		let t = c.get(e.key), i = n.has(e.key);
		if (c.delete(e.key), t === void 0) {
			a.insertBefore(re(e, i, r), l);
			continue;
		}
		ie(t, e, i), t === l ? l = t.nextElementSibling : a.insertBefore(t, l);
	}
	if (s === null || s === document.activeElement) return;
	let u = s.isConnected ? s : a.children[Math.min(o.indexOf(s), a.children.length - 1)];
	u instanceof HTMLElement && u.focus({ preventScroll: !0 });
}
function te(e) {
	for (let t of e.children) if (t.classList.contains(v.legend)) return t;
	return null;
}
function ne(e, t) {
	let n = new Set(t.map((e) => e.key)), r = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.getAttribute(_.series);
		e !== null && n.has(e) && !r.has(e) ? r.set(e, t) : t.remove();
	}
	return r;
}
function re(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span"), a = document.createElement("span");
	return r.className = `${v.legendEntry} ${n.buttonClass} ${E.ghostButtonClass} ${E.smallButtonClass}`, r.type = "button", r.setAttribute(_.series, e.key), r.setAttribute("aria-pressed", t ? "false" : "true"), r.classList.toggle(x.legendOff, t), r.style.setProperty(b.seriesColor, e.color), i.className = v.legendMark, a.className = v.legendCaption, a.textContent = e.caption, r.append(i, a), r;
}
function ie(e, t, n) {
	let r = e.querySelector(`.${v.legendCaption}`), i = n ? "false" : "true";
	r !== null && r.textContent !== t.caption && (r.textContent = t.caption), e instanceof HTMLElement && e.style.getPropertyValue(b.seriesColor) !== t.color && e.style.setProperty(b.seriesColor, t.color), e.getAttribute("aria-pressed") !== i && e.setAttribute("aria-pressed", i), e.classList.contains(x.legendOff) !== n && e.classList.toggle(x.legendOff, n);
}
function ae(e, t) {
	let n = te(e), r = e.clientWidth;
	if (r === 0) return;
	let i = !1;
	if (n !== null && (t === "Start" || t === "End")) {
		let t = getComputedStyle(n);
		i = oe(r, Math.max(0, ...[...n.children].map((e) => e instanceof HTMLElement ? e.offsetWidth : 0)) + (Number.parseFloat(t.paddingLeft) || 0) + (Number.parseFloat(t.paddingRight) || 0), Number.parseFloat(getComputedStyle(e).columnGap) || 0);
	}
	e.classList.contains(x.legendUnder) !== i && e.classList.toggle(x.legendUnder, i);
}
function oe(e, t, n) {
	return e - t - n < D;
}
//#endregion
//#region src/chart-ticks.ts
var se = 200, ce = 15, O = 1e3, k = 60 * O, A = 60 * k, j = 24 * A, le = 365 * j, ue = [
	O,
	2 * O,
	5 * O,
	10 * O,
	15 * O,
	30 * O,
	k,
	2 * k,
	5 * k,
	10 * k,
	15 * k,
	30 * k,
	A,
	2 * A,
	3 * A,
	6 * A,
	12 * A,
	j,
	2 * j,
	7 * j,
	14 * j,
	30 * j,
	90 * j,
	180 * j,
	le
];
function de(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n <= 0 ? 0 : (t - e.min) / n;
}
function fe(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	return e.min + t * (e.max - e.min);
}
function pe(e, t) {
	return Math.min(Math.max(t, Math.min(e.min, e.max)), Math.max(e.min, e.max));
}
function M(e, t, n) {
	return e.left + de(t, n) * e.width;
}
function N(e, t, n) {
	return e.top + (1 - de(t, n)) * e.height;
}
function me(e, t, n) {
	return e.top + de(t, n) * e.height;
}
function he(e) {
	return e.left + e.width;
}
function P(e) {
	return e.top + e.height;
}
function F(e, t, n, r) {
	let i = (n - t) / Math.max(1, r);
	if (i <= 0 || !Number.isFinite(i) || e === "Category") return 1;
	if (e === "Logarithmic") return t > 0 ? 10 ** Math.floor(Math.log10(t)) : 1;
	if (e !== "Time") return xe(i);
	for (let e of ue) if (e >= i) return e;
	return xe(i / le) * le;
}
function ge(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return Se(t);
	let r = F(e, t.min, t.max, n), i = r * 1e-9, a = e === "Time" ? l(r) : 0;
	if (a > 0) return _e(t, a, i);
	e === "Category" && (r = Math.max(1, Math.ceil((Math.floor(t.max) - Math.ceil(t.min) + 1) / se)));
	let o = Math.ceil(t.min / r) * r, s = [];
	for (let e = 0; s.length < se; e++) {
		let n = o + e * r;
		if (n > t.max + i || !Number.isFinite(n)) break;
		(s.length === 0 || n > s[s.length - 1]) && s.push(n === 0 ? 0 : n);
	}
	return s;
}
function _e(e, t, n) {
	let r = f(u(e.min), t);
	d(r) < e.min - n && (r += t);
	let i = [];
	for (let a = d(r); a <= e.max + n && i.length < se; a = d(r)) i.push(a === 0 ? 0 : a), r += t;
	return i;
}
function ve(e, t) {
	if (e === "Category") return null;
	if (e === "Time") return t < k ? "HH:mm:ss" : t < j ? "HH:mm" : t < 30 * j ? "dd MMM" : "MMM yyyy";
	if (t >= 1) return "N0";
	let n = -Math.floor(Math.log10(t) + 1e-9);
	return `N${Math.min(ce, n)}`;
}
function ye(e, t, n, r, i = !1) {
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
			max: n > r ? n : r * 10,
			logarithmic: !0
		};
	}
	if (s - o <= 0) {
		let t = e.kind === "Time" ? j : Math.abs(o) > 0 ? Math.abs(o) / 8 : 1;
		return be(e.kind, e.min ?? Math.min(o, s) - t, e.max ?? Math.max(o, s) + t);
	}
	let c = F(e.kind, o, s, e.ticks), p = e.kind === "Time" ? l(c) : 0;
	if (p === 0) return be(e.kind, e.min ?? Math.floor(o / c) * c, e.max ?? Math.ceil(s / c) * c);
	let m = f(u(s), p);
	return d(m) < s && (m += p), be(e.kind, e.min ?? d(f(u(o), p)), e.max ?? d(m));
}
function be(e, t, n) {
	if (e !== "Time") return {
		min: t,
		max: n,
		logarithmic: !1
	};
	let r = Math.min(Math.max(t, s), c), i = Math.min(Math.max(n, s), c);
	return i > r ? {
		min: r,
		max: i,
		logarithmic: !1
	} : r > -621355968e5 ? {
		min: r - j,
		max: r,
		logarithmic: !1
	} : {
		min: r,
		max: r + j,
		logarithmic: !1
	};
}
function xe(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function Se(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(se, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
var Ce = 4;
function we(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: M(r, t, c.x),
				y: N(r, n, c.y)
			});
			continue;
		}
		o = je(o, s, i, a), s = [];
	}
	return je(o, s, i, a);
}
function Te(e, t, n, r, i, a) {
	let o = N(r, n, pe(n, 0)), s = "", c = -1;
	for (let l = 0; l <= e.length; l++) {
		if (l < e.length && e[l].y !== null) {
			c < 0 && (c = l);
			continue;
		}
		c >= 0 && (s = Fe(s, e, c, l - 1, t, n, r, i, a, o)), c = -1;
	}
	return s;
}
function Ee(e, t, n, r, i, a) {
	let o = [], s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: M(r, t, c.x),
				y: N(r, n, c.y)
			});
			continue;
		}
		De(o, s, i, a), s = [];
	}
	return De(o, s, i, a), o;
}
function De(e, t, n, r) {
	if (!(t.length < 2)) {
		if (n) {
			Oe(e, t);
			return;
		}
		for (let n = 1; n < t.length; n++) r ? ke(e, t, n) : I(e, t[n - 1].x, t[n - 1].y, t[n].x, t[n].y);
	}
}
function Oe(e, t) {
	let n = t[0].x, r = t[0].y;
	for (let i = 1; i < t.length; i++) {
		let a = (t[i - 1].x + t[i].x) / 2;
		I(e, n, r, a, r), I(e, a, r, a, t[i].y), n = a, r = t[i].y;
	}
	I(e, n, r, t[t.length - 1].x, r);
}
function ke(e, t, n) {
	let r = Math.max(0, n - 2), i = Math.min(t.length - 1, n + 1), a = t[n - 1].x, o = t[n - 1].y, s = t[n].x, c = t[n].y, l = a + (s - t[r].x) / 6, u = o + (c - t[r].y) / 6, d = s - (t[i].x - a) / 6, f = c - (t[i].y - o) / 6, p = Ae(a, o, l, u) + Ae(l, u, d, f) + Ae(d, f, s, c), m = Math.max(1, Math.ceil(p / Ce)), h = a, g = o;
	for (let t = 1; t <= m; t++) {
		let n = t / m, r = 1 - n, i = r * r * r, p = 3 * r * r * n, _ = 3 * r * n * n, v = n * n * n, y = i * a + p * l + _ * d + v * s, b = i * o + p * u + _ * f + v * c;
		I(e, h, g, y, b), h = y, g = b;
	}
}
function Ae(e, t, n, r) {
	return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t));
}
function I(e, t, n, r, i) {
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
function je(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${L(t[0].x)} ${L(t[0].y)}` + Me(t, n, r);
}
function Me(e, t, n) {
	if (t) return Ne(e);
	let r = "";
	for (let t = 1; t < e.length; t++) {
		if (n) {
			r += Pe(e, t);
			continue;
		}
		r += ` L${L(e[t].x)} ${L(e[t].y)}`;
	}
	return r;
}
function Ne(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${L((e[n - 1].x + e[n].x) / 2)} V${L(e[n].y)}`;
	return t + ` H${L(e[e.length - 1].x)}`;
}
function Pe(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${L(i)} ${L(a)} ${L(o)} ${L(s)} ${L(e[t].x)} ${L(e[t].y)}`;
}
function Fe(e, t, n, r, i, a, o, s, c, l) {
	let u = [];
	for (let e = n; e <= r; e++) u.push({
		x: M(o, i, t[e].x),
		y: N(o, a, t[e].y)
	});
	let d = je(e, u, s, c);
	if (t[n].base === void 0 || t[n].base === null) return d + ` L${L(u[u.length - 1].x)} ${L(l)} L${L(u[0].x)} ${L(l)} Z`;
	let f = [];
	for (let e = r; e >= n; e--) f.push({
		x: M(o, i, t[e].x),
		y: N(o, a, t[e].base ?? 0)
	});
	return d += ` L${L(f[0].x)} ${L(f[0].y)}`, d + Me(f, s, c) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var Ie = Math.PI * 2, Le = -Math.PI / 2;
function Re(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = Le;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * Ie : 0;
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
//#region src/chart-radar.ts
var ze = Math.PI * 2, Be = -Math.PI / 2;
function Ve(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of n) t.add(e.x);
	return [...t].sort((e, t) => e - t);
}
function He(e, t) {
	return t <= 0 ? Be : Be + e * ze / t;
}
function Ue(e, t, n) {
	return t === null ? 0 : n * Math.min(Math.max(de(e, pe(e, t)), 0), 1);
}
function We(e, t, n, r) {
	return Math.max(0, Math.min(e / 2 - n, t / 2 - r));
}
function Ge(e) {
	if (e.length === 0) return "";
	let t = [`M${L(e[0].x)} ${L(e[0].y)}`];
	for (let n = 1; n < e.length; n++) t.push(`L${L(e[n].x)} ${L(e[n].y)}`);
	return `${t.join(" ")} Z`;
}
function Ke(e) {
	let t = [];
	for (let n = 0; n < e.length && e.length > 1; n++) {
		let r = e[n], i = e[(n + 1) % e.length];
		I(t, r.x, r.y, i.x, i.y);
	}
	return t;
}
function qe(e) {
	let t = Math.cos(e);
	return t > .3 ? "start" : t < -.3 ? "end" : "middle";
}
//#endregion
//#region src/chart-model.ts
function Je(e) {
	let t = e.getAttribute(_.model);
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return null;
	}
}
function Ye(e, t) {
	let n = (e) => e.caption === null ? e : {
		...e,
		caption: t(e.caption)
	};
	return {
		...e,
		x: n(e.x),
		y: n(e.y),
		series: e.series.map((e) => ({
			...e,
			caption: e.caption === null ? e.key : t(e.caption)
		}))
	};
}
function Xe(e) {
	return e.seriesPath !== null && e.seriesPath.length > 0;
}
//#endregion
//#region src/chart-rows.ts
function Ze(e) {
	let t = e.getAttribute(_.rows);
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t), n = [];
		for (let t of e) {
			if (!Array.isArray(t)) continue;
			let e = Array.isArray(t[2]) ? t[2].map((e) => z(e)) : [], r = Array.isArray(t[4]) ? t[4].map((e) => z(e)) : [], i = t.length > 3 && t[3] !== null && t[3] !== void 0 ? String(t[3]) : null;
			n.push({
				key: String(t[0] ?? ""),
				x: String(t[1] ?? ""),
				values: e,
				series: i,
				sizes: r
			});
		}
		return n;
	} catch {
		return [];
	}
}
function Qe(e, t, n, r) {
	let i = ct(n.xPath === null ? null : r(e, n.xPath));
	if (Xe(n)) {
		let a = ct(r(e, n.seriesPath)), o = lt(n, a), s = o?.valuePath ?? n.valuePath, c = o?.sizePath ?? null;
		return {
			key: t,
			x: i,
			values: [s === null ? null : z(r(e, s))],
			series: a,
			sizes: c === null ? [] : [z(r(e, c))]
		};
	}
	let a = [], o = [], s = !1;
	for (let t of n.series) {
		let i = t.valuePath ?? n.valuePath;
		a.push(i === null ? null : z(r(e, i))), o.push(t.sizePath === null ? null : z(r(e, t.sizePath))), s ||= t.sizePath !== null;
	}
	return {
		key: t,
		x: i,
		values: a,
		series: null,
		sizes: s ? o : []
	};
}
function $e(e, t, n, r, i, a) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	if (t === "Move") {
		for (let t of r) ft(e, t.key, t.oldIndex, t.newIndex);
		return;
	}
	let o = /* @__PURE__ */ new Set();
	for (let t of e) o.add(t.key);
	for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (n === null) continue;
		if (t === "Remove") {
			let t = o.has(n) ? dt(e, n) : -1;
			t >= 0 && (e.splice(t, 1), o.delete(n));
			continue;
		}
		let s = Qe(r.item, r.key ?? n, i, a), c = t === "Replace" ? r.oldKey ?? n : n, l = o.has(c) ? dt(e, c) : -1;
		if (l >= 0) {
			e[l] = s, o.delete(c), o.add(s.key);
			continue;
		}
		let u = r.index;
		u === null || u < 0 || u >= e.length ? e.push(s) : e.splice(u, 0, s), o.add(s.key);
	}
}
function et(e, t, n) {
	let r = [], i = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), a = Xe(t), o = nt(), s = nt(), c = nt();
	for (let l = 0; l < e.length; l++) {
		let u = e[l], d = t.xPath === null ? it(l, t.x.kind, r) : at(u.x, t.x.kind, r, n);
		if (d !== null) {
			if (rt(o, d), a) {
				tt(ut(i, u.series ?? ""), u, d, u.values.length > 0 ? u.values[0] : null, u.sizes.length > 0 ? u.sizes[0] : null, s, c);
				continue;
			}
			for (let e = 0; e < i.length; e++) tt(i[e], u, d, e < u.values.length ? u.values[e] : null, e < u.sizes.length ? u.sizes[e] : null, s, c);
		}
	}
	for (let e of i) e.drawn = e.points;
	return {
		series: i,
		categories: r,
		xMin: o.min,
		xMax: o.max,
		yMin: s.min,
		yMax: s.max,
		sizeMin: c.min,
		sizeMax: c.max
	};
}
function tt(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && rt(a, r), i !== null && rt(o, i);
}
function nt() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function rt(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function it(e, t, n) {
	return t === "Category" ? at(String(e), t, n, () => null) ?? e : e;
}
function at(e, t, n, r) {
	if (t === "Category") {
		let t = n.indexOf(e);
		return t >= 0 ? t : (n.push(e), n.length - 1);
	}
	let i = st(e);
	if (i !== null || t !== "Time") return i;
	let a = r(e);
	return a === null ? null : h(a);
}
var ot = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function st(e) {
	if (!ot.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function z(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "boolean" ? +!!e : typeof e == "string" ? st(e) : null;
}
function ct(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function lt(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function ut(e, t) {
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
function dt(e, t) {
	for (let n = 0; n < e.length; n++) if (e[n].key === t) return n;
	return -1;
}
function ft(e, t, n, r) {
	let i = t === null ? n ?? -1 : dt(e, t);
	if (i < 0 || i >= e.length) return;
	let [a] = e.splice(i, 1), o = r === null || r < 0 || r > e.length ? e.length : r;
	e.splice(o, 0, a);
}
//#endregion
//#region src/chart-stack.ts
function pt(e) {
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
var mt = .002;
function B(e) {
	return e.to - e.from;
}
function V(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * mt, a = Math.min(Math.max(Number.isFinite(B(e)) && B(e) > 0 ? B(e) : r, i), r);
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
function ht(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return V(e, r, i);
	let a = B(e) * n, o = B(e) > 0 ? Math.min(Math.max((t - e.from) / B(e), 0), 1) : .5;
	return V({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function gt(e, t, n, r) {
	return V(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function _t(e, t, n) {
	return V({
		from: n - B(e),
		to: n
	}, t, n);
}
function vt(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && yt(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function yt(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return bt(r, r, n) || t + 1 < e.length && bt(r, e[t + 1].x, n) || t > 0 && bt(e[t - 1].x, r, n);
}
function bt(e, t, n) {
	return Math.min(e, t) <= n.to && Math.max(e, t) >= n.from;
}
//#endregion
//#region src/chart-draw.ts
var H = "http://www.w3.org/2000/svg", U = 12, xt = 22, St = 16, W = 8, Ct = 16, wt = 8, Tt = `:scope > .${v.area} > .${v.centre}`;
function Et(e, t) {
	let n = e.root.querySelector(`.${v.canvas}`);
	if (n === null) return null;
	let r = e.model, i = et(e.rows, r, t.temporal.parse), a = i.series.filter((t) => !e.hidden.has(t.series.key));
	r.stacked && pt(a);
	let o = ye(r.x, i.xMin, i.xMax, i.categories.length);
	e.follow && e.view !== null && (e.view = _t(e.view, o.min, o.max)), e.follow = !1;
	let s = e.view === null ? null : V(e.view, o.min, o.max), c = vt(a.map((e) => e.drawn), s), l = s === null ? o : {
		...o,
		min: s.from,
		max: s.to
	}, u = ye(r.y, c.min, c.max, 0, r.kind === S.area || r.kind === S.bar || r.kind === S.radar), d = t.numbers.readCulture(e.root), f = t.temporal.readCulture(e.root), p = {
		x: r.x.format ?? ve(r.x.kind, F(r.x.kind, l.min, l.max, r.x.ticks)),
		y: r.y.format ?? ve(r.y.kind, F(r.y.kind, u.min, u.max, r.y.ticks))
	}, m = on(e.root), h = r.kind === S.pie ? Dt(r, i, p, d, f, t, m) : i.series.map((e) => ({
		key: e.series.key,
		caption: e.series.caption,
		color: rn(e, m)
	}));
	r.legend !== "None" && ee(e.root, h, e.hidden, t.names, t.focusReturn), ae(e.root, r.legend), Ot(n, h, t);
	let g = n.getBoundingClientRect(), _ = Math.round(g.width), y = Math.round(g.height);
	if (e.width = _, e.height = y, _ < 2 || y < 2) return null;
	n.setAttribute("viewBox", `0 0 ${L(_)} ${L(y)}`);
	let b = document.createElementNS(H, "svg");
	if (r.kind === S.pie) return At(b, e, i, _, y, p, d, f, t, m), n.replaceChildren(...b.childNodes), null;
	if (r.kind === S.radar) return Nt(b, n, e, i, a, u, _, y, p, d, f, t, m), n.replaceChildren(...b.childNodes), null;
	if (r.bare) {
		let r = {
			left: 2,
			top: 2,
			width: _ - 4,
			height: y - 4
		};
		return Jt(b, e, a, r, l, u, i.categories, p, d, f, t, m), n.replaceChildren(...b.childNodes), {
			plot: r,
			x: l,
			whole: {
				from: o.min,
				to: o.max
			},
			columns: []
		};
	}
	let x = Bt(n), C = e.rows.length > 0, w = zt(r.x, p.x, l, i.categories, d, f, t, x.width, C), T = zt(r.y, p.y, u, i.categories, d, f, t, x.width, C), E = (r.horizontal ? w : T).reduce((e, t) => Math.max(e, t.width), 0);
	x.release();
	let D = Vt(r, _, y, E);
	Wt(b, r, D, l, u, w, T), Kt(b, r, D, l, u, w, T, _, y), Jt(b, e, a, D, l, u, i.categories, p, d, f, t, m, {
		min: i.sizeMin,
		max: i.sizeMax
	}), e.rows.length === 0 && en(b, D, t);
	let te = r.sharedTooltip ? tn(r, a, D, l, i.categories, p, d, f, t) : [];
	return te.length > 0 && nn(b, D, r.horizontal), n.replaceChildren(...b.childNodes), {
		plot: D,
		x: l,
		whole: {
			from: o.min,
			to: o.max
		},
		columns: te
	};
}
function Dt(e, t, n, r, i, a, o) {
	return (t.series.length > 0 ? t.series[0].points : []).map((s, c) => ({
		key: s.key,
		caption: G(e.x, n.x, s.x, t.categories, r, i, a),
		color: an(c, o)
	}));
}
function Ot(e, t, n) {
	let r = t.length > 0 ? kt(t.map((e) => e.caption), n.strings) : n.strings.text(T.label);
	e.getAttribute("aria-label") !== r && e.setAttribute("aria-label", r);
}
function kt(e, t) {
	let n = e.length > 0 ? e[0] : "";
	for (let r = 1; r < e.length; r++) n = t.format(T.list, {
		list: n,
		next: e[r]
	});
	return n;
}
function At(e, t, n, r, i, a, o, s, c, l) {
	let u = t.model, d = n.series.length > 0 ? n.series[0].points : [], f = [];
	for (let e = 0; e < d.length; e++) t.hidden.has(d[e].key) || f.push({
		point: d[e],
		index: e
	});
	let p = Re(f.map((e) => e.point.y)), m = {
		x: r / 2,
		y: i / 2
	}, h = Math.min(r, i) / 2 - U, g = h * u.donut, y = J(e, "g", v.plot);
	for (let e = 0; e < f.length; e++) {
		if (p[e].sweep <= 0 || h <= 0) continue;
		let t = f[e].point, r = J(y, "g", v.series);
		r.setAttribute(_.series, t.key), r.style.setProperty(b.seriesColor, an(f[e].index, l));
		let i = J(r, "circle", v.sector);
		if (i.setAttribute("cx", L(m.x)), i.setAttribute("cy", L(m.y)), i.setAttribute("r", L((h + g) / 2)), i.setAttribute("stroke-width", L(h - g)), i.style.setProperty(b.arcStart, jt(p[e].start)), i.style.setProperty(b.arcSweep, jt(p[e].sweep)), i.setAttribute(_.point, t.key), i.setAttribute(_.series, n.series[0].series.key), !u.tooltip) continue;
		let d = G(u.x, a.x, t.x, n.categories, o, s, c), x = G(u.y, a.y, t.y ?? 0, n.categories, o, s, c), S = R(m, (h + g) / 2, p[e].start + p[e].sweep / 2), C = J(r, "circle", v.sectorAnchor);
		i.setAttribute(_.sectorTooltip, c.strings.format(T.sector, {
			label: d,
			value: x
		})), C.setAttribute("cx", L(S.x)), C.setAttribute("cy", L(S.y)), C.setAttribute("r", "1");
	}
	Mt(y, p, m, h, g);
	let x = t.root.querySelector(Tt), S = `${L(Math.max(g, 0) * Math.SQRT2)}px`;
	x !== null && x.style.maxWidth !== S && (x.style.maxWidth = S), d.length === 0 && en(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, c);
}
function jt(e) {
	return `${L(e * 180 / Math.PI)}deg`;
}
function Mt(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = R(n, i, t.start), o = R(n, r, t.start), s = J(e, "line", v.sectorEdge);
		s.setAttribute("x1", L(a.x)), s.setAttribute("y1", L(a.y)), s.setAttribute("x2", L(o.x)), s.setAttribute("y2", L(o.y));
	}
}
function Nt(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	let p = n.model, m = Ve(r.series.map((e) => e.drawn)), h = m.map((e) => G(p.x, c.x, e, r.categories, l, u, d)), g = Bt(t), _ = h.reduce((e, t) => Math.max(e, g.width(t)), 0);
	g.release();
	let y = {
		x: o / 2,
		y: s / 2
	}, b = We(o, s, _ + W + U, 36), x = n.rows.length > 0 || p.y.min !== null || p.y.max !== null ? ge(p.y.kind, a, p.y.ticks) : [];
	m.length > 0 && b > 0 && Pt(e, p, h, x.map((e) => ({
		value: e,
		text: G(p.y, c.y, e, [], l, u, d)
	})), a, y, b);
	let S = J(e, "g", v.plot), C = J(S, "g", v.bands);
	for (let e of i) Lt(S, C, p, e, m, a, y, b, r.categories, c, l, u, d, f);
	n.rows.length === 0 && en(e, {
		left: 0,
		top: 0,
		width: o,
		height: s
	}, d);
}
function Pt(e, t, n, r, i, a, o) {
	let s = n.length;
	if (t.y.grid) {
		let t = J(e, "g", v.grid);
		for (let e of r) {
			let n = Ue(i, e.value, o);
			n > 0 && n < o && Ft(t, v.gridLine, s, a, n);
		}
	}
	let c = J(e, "g", v.axes);
	Ft(c, v.axisLine, s, a, o);
	for (let e = 0; e < s; e++) {
		let r = He(e, s), i = R(a, o, r), l = R(a, o + W, r);
		t.x.grid && Y(c, v.axisLine, a.x, a.y, i.x, i.y), X(c, v.label, n[e], l.x, It(r, l.y), qe(r));
	}
	let l = NaN;
	for (let e of r) {
		let t = Ue(i, e.value, o);
		t <= 0 || Number.isFinite(l) && Math.abs(t - l) < Ct || (l = t, X(c, v.label, e.text, a.x + W, a.y - t + 12, "start"));
	}
}
function Ft(e, t, n, r, i) {
	let a = [];
	for (let e = 0; e < n; e++) a.push(R(r, i, He(e, n)));
	sn(e, t, Ke(a));
}
function It(e, t) {
	let n = Math.sin(e);
	return n < -.3 ? t : n > .3 ? t + 12 : t + 4;
}
function Lt(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = r.series.markers ?? n.markers, h = /* @__PURE__ */ new Map();
	for (let e of r.drawn) h.has(e.x) || h.set(e.x, e);
	let g = i.map((e) => h.get(e) ?? null), y = g.map((e, t) => R(o, Ue(a, e?.y ?? null, s), He(t, i.length))), x = J(e, "g", v.series), S = rn(r, p);
	if (x.setAttribute(_.series, r.series.key), x.style.setProperty(b.seriesColor, S), Rt(t, r.series.key, S, Ge(y)), sn(x, v.line, Ke(y)), m || n.tooltip) for (let e = 0; e < g.length; e++) {
		let t = g[e];
		if (t === null || t.y === null) continue;
		let i = n.tooltip ? $t(n, r, t.x, t.y, c, l, u, d, f) : null;
		Xt(x, t.key, y[e].x, y[e].y, m ? 3 : 5, m, i, f.names);
	}
}
function Rt(e, t, n, r) {
	let i = J(e, "path", v.fill);
	i.setAttribute(_.series, t), i.style.setProperty(b.seriesColor, n), i.setAttribute("d", r);
}
function zt(e, t, n, r, i, a, o, s, c) {
	return !c && e.min === null && e.max === null ? [] : ge(e.kind, n, e.ticks).map((n) => {
		let c = G(e, t, n, r, i, a, o);
		return {
			value: n,
			text: c,
			width: s(c)
		};
	});
}
function G(e, t, n, r, i, a, o) {
	if (e.kind === "Category") {
		let e = Math.round(n);
		return e >= 0 && e < r.length ? r[e] : "";
	}
	return e.kind === "Time" ? o.temporal.format(g(n), t, a) : o.numbers.format(n, t, i);
}
function Bt(e) {
	let t = document.createElementNS(H, "text");
	return t.setAttribute("class", v.label), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function Vt(e, t, n, r) {
	let i = r + 16 + (Ht(e).caption === null ? 0 : St), a = xt + (Ut(e).caption === null ? 0 : St);
	return {
		left: i,
		top: U,
		width: Math.max(1, t - i - U),
		height: Math.max(1, n - a - U)
	};
}
function Ht(e) {
	return e.horizontal ? e.x : e.y;
}
function Ut(e) {
	return e.horizontal ? e.y : e.x;
}
function K(e, t, n, r) {
	return e.horizontal ? me(t, n, r) : M(t, n, r);
}
function q(e, t, n, r) {
	return e.horizontal ? M(t, n, r) : N(t, n, r);
}
function Wt(e, t, n, r, i, a, o) {
	if (!t.x.grid && !t.y.grid) return;
	let s = J(e, "g", v.grid);
	if (t.y.grid) for (let e of o) Gt(s, n, q(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) Gt(s, n, K(t, n, r, e.value), !t.horizontal);
}
function Gt(e, t, n, r) {
	r ? Y(e, v.gridLine, n, t.top, n, P(t)) : Y(e, v.gridLine, t.left, n, he(t), n);
}
function Kt(e, t, n, r, i, a, o, s, c) {
	let l = J(e, "g", v.axes);
	Y(l, v.axisLine, n.left, P(n), he(n), P(n)), Y(l, v.axisLine, n.left, n.top, n.left, P(n));
	let u = t.horizontal ? o : a, d = t.horizontal ? a : o, f = -Infinity;
	for (let e of u) {
		let a = e.width / 2, o = t.horizontal ? q(t, n, i, e.value) : K(t, n, r, e.value), c = Math.min(Math.max(o, a), s - a);
		c - a < f || (f = c + a + W, X(l, v.label, e.text, c, P(n) + 16, "middle"));
	}
	let p = NaN;
	for (let e of d) {
		let a = t.horizontal ? K(t, n, r, e.value) : q(t, n, i, e.value);
		Number.isFinite(p) && Math.abs(a - p) < Ct || (p = a, X(l, v.label, e.text, n.left - W, a + 4, "end"));
	}
	let m = Ut(t).caption, h = Ht(t).caption;
	if (m !== null && X(l, v.caption, m, n.left + n.width / 2, c - 2, "middle"), h !== null) {
		let e = n.top + n.height / 2;
		X(l, v.caption, h, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${L(e)})`);
	}
}
function qt(e, t, n, r, i) {
	let a = J(e, "clipPath", "");
	n.clip === null ? n.clip = i.ensureId(a, y) : a.setAttribute("id", n.clip);
	let o = J(a, "rect", "");
	o.setAttribute("x", L(r.left)), o.setAttribute("y", L(r.top)), o.setAttribute("width", L(r.width)), o.setAttribute("height", L(r.height)), t.setAttribute("clip-path", `url(#${n.clip})`);
}
function Jt(n, r, a, o, s, c, l, u, d, f, p, m, h = {
	min: Infinity,
	max: -Infinity
}) {
	let g = J(n, "g", v.plot), y = r.model;
	r.view !== null && qt(n, g, r, o, p);
	let x = y.kind === S.area ? J(g, "g", v.bands) : null, C = y.kind === S.bar ? t(y.horizontal ? o.height : o.width, e(a.map((e) => e.drawn), s)) : 0;
	for (let e = 0; e < a.length; e++) {
		let t = a[e], n = t.series.stepped ?? y.stepped, r = t.series.smooth ?? y.smooth, w = t.series.markers ?? y.markers, T = J(g, "g", v.series), E = rn(t, m);
		if (T.setAttribute(_.series, t.series.key), T.style.setProperty(b.seriesColor, E), y.kind === S.bar) {
			Zt(T, t, e, a.length, o, s, c, C, l, u, d, f, p, y);
			continue;
		}
		if (y.kind === S.scatter) {
			for (let e = 0; e < t.drawn.length; e++) Yt(T, t, e, o, s, c, i(t.drawn[e].size, h.min, h.max), !0, l, u, d, f, p, y);
			continue;
		}
		if (x !== null && Rt(x, t.series.key, E, Te(t.drawn, s, c, o, n, r)), sn(T, v.line, Ee(t.drawn, s, c, o, n, r)), J(T, "path", v.lineHit).setAttribute("d", we(t.drawn, s, c, o, n, r)), w || y.tooltip) for (let e = 0; e < t.drawn.length; e++) Yt(T, t, e, o, s, c, w ? 3 : 5, w, l, u, d, f, p, y);
	}
}
function Yt(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = t.drawn[n];
	if (m.y === null) return;
	let h = !p.tooltip || p.sharedTooltip ? null : $t(p, t, m.x, Qt(t, n), c, l, u, d, f);
	Xt(e, m.key, M(r, i, m.x), N(r, a, m.y), o, s, h, f.names);
}
function Xt(e, t, n, i, a, o, s, c) {
	let l = {
		x: L(n),
		y: L(i)
	}, u = J(e, "g", v.point);
	u.setAttribute(_.point, t);
	let d = J(u, "circle", o ? v.marker : `${v.marker} ${v.bareMarker}`);
	d.setAttribute("cx", l.x), d.setAttribute("cy", l.y), d.setAttribute("r", L(a));
	let f = J(u, "circle", v.hit);
	f.setAttribute("cx", l.x), f.setAttribute("cy", l.y), f.setAttribute("r", L(r(a))), s !== null && f.setAttribute(c.tooltip, s);
}
function Zt(e, t, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h = m.horizontal;
	for (let g = 0; g < t.drawn.length; g++) {
		let y = t.drawn[g];
		if (y.y === null) continue;
		let b = n(K(m, a, o, y.x), c, r, i, m.stacked), x = q(m, a, s, y.y), S = q(m, a, s, pe(s, y.base ?? 0)), C = Math.min(x, S), w = Math.max(1, Math.abs(x - S)), T = J(e, "rect", v.bar);
		T.setAttribute("x", L(h ? C : b.start)), T.setAttribute("y", L(h ? b.start : C)), T.setAttribute("width", L(h ? w : b.thickness)), T.setAttribute("height", L(h ? b.thickness : w)), T.setAttribute(_.point, y.key), m.tooltip && !m.sharedTooltip && T.setAttribute(p.names.tooltip, $t(m, t, y.x, Qt(t, g), l, u, d, f, p));
	}
}
function Qt(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function $t(e, t, n, r, i, a, o, s, c) {
	let l = G(e.x, a.x, n, i, o, s, c), u = G(e.y, a.y, r, i, o, s, c);
	return c.strings.format(T.point, {
		series: t.series.caption,
		x: l,
		y: u
	});
}
function en(e, t, n) {
	let r = n.strings.text(T.empty);
	r.length !== 0 && X(e, v.empty, r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function tn(e, t, n, r, i, a, o, s, c) {
	let l = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) for (let n of t[e].points) {
		if (n.y === null || n.x < r.min || n.x > r.max) continue;
		let i = l.get(n.x);
		i === void 0 && (i = Array(t.length).fill(null), l.set(n.x, i)), i[e] ??= n.y;
	}
	return [...l.keys()].sort((e, t) => e - t).map((u) => {
		let d = l.get(u) ?? [], f = null;
		return {
			at: K(e, n, r, u),
			get text() {
				if (f !== null) return f;
				let n = [G(e.x, a.x, u, i, o, s, c)];
				for (let r = 0; r < t.length; r++) {
					let l = d[r];
					if (l == null) continue;
					let u = G(e.y, a.y, l, i, o, s, c);
					n.push(c.strings.format(T.reading, {
						series: t[r].series.caption,
						value: u
					}));
				}
				return f = n.join("\n"), f;
			}
		};
	});
}
function nn(e, t, n) {
	let r = J(e, "rect", x.rule);
	r.setAttribute("x", n ? L(t.left) : "0"), r.setAttribute("y", n ? "0" : L(t.top)), r.setAttribute("width", n ? L(t.width) : "1"), r.setAttribute("height", n ? "1" : L(t.height));
}
function rn(e, t) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : an(e.index, t);
}
function an(e, t) {
	return `var(${E.seriesColorPrefix}${e % t + 1})`;
}
function on(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(E.seriesColorCount));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : wt;
}
function J(e, t, n) {
	let r = document.createElementNS(H, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function sn(e, t, n) {
	let r = J(e, "g", t);
	for (let e of n) {
		let t = document.createElementNS(H, "line");
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
var cn = `.${v.gauge}`, ln = `.${v.gaugeNumber}`, un = `.${v.gaugeUnit}`;
function dn(e, t, n) {
	let r = e.getAttribute(_.gaugeFormat) ?? "N0", i = typeof t == "number" ? t : typeof t == "string" && t.length > 0 ? Number(t) : NaN, a = Number.isFinite(i), o = a ? n.numbers.format(i, r, n.numbers.readCulture(e)) : n.strings.text(T.noReading);
	e.textContent !== o && (e.textContent = o);
	let s = e.parentElement?.querySelector(un);
	s != null && s.hidden === a && (s.hidden = !a);
}
function fn(e, t) {
	for (let n of e.querySelectorAll(cn)) {
		let e = n.querySelector(ln);
		e !== null && dn(e, n.style.getPropertyValue(b.gaugeValue).trim(), t);
	}
}
//#endregion
//#region src/chart-press.ts
var pn = `[${_.point}]`, mn = `.${x.pendingPoint}`, hn = `.${v.series}`, gn = class {
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
}, _n = class {
	wait;
	held = null;
	constructor(e) {
		this.wait = new gn(e);
	}
	press(e, t, n) {
		this.wait.press(e, () => {
			this.held === t && this.mark(null), n();
		}), this.mark(e > 1 ? null : t);
	}
	mark(e) {
		this.held !== null && vn(this.held.root, null), this.held = e, e !== null && vn(e.root, e);
	}
	cancel() {
		this.wait.cancel(), this.mark(null);
	}
	redrawn(e) {
		this.held?.root === e && vn(e, this.held);
	}
};
function vn(e, t) {
	if (t === null) {
		for (let t of e.querySelectorAll(mn)) t.classList.remove(x.pendingPoint);
		return;
	}
	for (let n of e.querySelectorAll(pn)) n.classList.toggle(x.pendingPoint, n.getAttribute(_.point) === t.point && yn(n) === t.series);
}
function yn(e) {
	return e.getAttribute(_.series) ?? e.closest(hn)?.getAttribute(_.series) ?? "";
}
//#endregion
//#region src/chart-wheel.ts
function bn(e, t, n) {
	return !Number.isFinite(e.y) || Math.abs(e.x) > Math.abs(e.y) ? 0 : Math.min(Math.max(e.y / t, -n), n);
}
function xn(e, t, n, r) {
	let i = e ?? t, a = ht(i, n, r, t.from, t.to);
	return Math.abs(a.to - a.from - (i.to - i.from)) <= wn(t) ? e : Cn(a, t);
}
function Sn(e, t) {
	return e === null || t === null ? e === t : e.from === t.from && e.to === t.to;
}
function Cn(e, t) {
	return e.to - e.from >= t.to - t.from - wn(t) ? null : e;
}
function wn(e) {
	return (e.to - e.from) * 1e-6;
}
//#endregion
//#region src/chart-engine.ts
var Z = `.${v.root}`, Q = `.${v.canvas}`, Tn = `.${v.plot}`, En = `.${v.series}`, Dn = `:scope > .${v.bands}`, On = `.${v.fill}`, kn = `[${_.point}]`, An = `.${v.area}`, jn = `.${x.rule}`, Mn = `.${v.window}`, Nn = 250, Pn = 1.2, Fn = 800, In = 3, Ln = 3, Rn = `.${v.legendEntry}`, zn = `.${v.bar}`, Bn = `.${v.sector}`, Vn = `.${v.sectorAnchor}`, Hn = class {
	charts = /* @__PURE__ */ new WeakMap();
	formatting;
	tooltips;
	states;
	wheel;
	observeSize;
	readPath;
	shared = null;
	sharedColumn = null;
	sector = null;
	dirty = /* @__PURE__ */ new Set();
	frameRequested = !1;
	drag = null;
	dragged = !1;
	settling = /* @__PURE__ */ new Map();
	pointPress = new _n(300);
	constructor(e) {
		let t = e.root;
		this.formatting = {
			numbers: e.numbers,
			temporal: e.temporal,
			strings: e.strings,
			names: e.names,
			focusReturn: e.popups.focusReturn,
			ensureId: e.dom.ensureId.bind(e.dom)
		}, this.tooltips = e.tooltips, this.states = e.states, this.wheel = e.wheel, this.observeSize = e.observeSize, this.readPath = e.rows.readPath;
		for (let e of t.querySelectorAll(Z)) this.adopt(e);
		e.observeComponents(t, Z, {
			childList: !0,
			attributeFilter: [_.model, _.rows]
		}, (e) => {
			for (let t of e) this.onMutated(t);
		}), e.strings.onChange(() => this.wordsChanged(t)), t.addEventListener("click", (e) => this.onPress(e), !0), t.addEventListener("pointerover", (e) => this.onSeriesHover(e), !0), t.addEventListener("pointerout", (e) => this.onSeriesHover(e), !0), t.addEventListener("pointerover", (e) => this.onBarHover(e), !0), t.addEventListener("pointerout", (e) => this.onBarHover(e), !0), t.addEventListener("pointerover", (e) => this.onSectorHover(e), !0), t.addEventListener("pointerout", (e) => this.onSectorHover(e), !0), t.addEventListener("wheel", (e) => this.onWheel(e), {
			capture: !0,
			passive: !1
		}), t.addEventListener("pointerdown", (e) => this.onDragStart(e), !0), t.addEventListener("dblclick", (e) => this.onReset(e), !0), t.addEventListener("pointermove", (e) => this.onSharedTooltip(e), !0), t.addEventListener("pointerout", (e) => this.onSharedTooltip(e), !0);
	}
	wordsChanged(e) {
		for (let t of e.querySelectorAll(Z)) {
			let e = this.charts.get(t), n = e === void 0 ? null : Je(t);
			e !== void 0 && n !== null && (e.model = Ye(n, (e) => this.formatting.strings.resolveText(e)), this.schedule(t));
		}
		fn(e, this.formatting);
	}
	adopt(e) {
		let t = this.resolve(e);
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.schedule(e));
	}
	resolve(e) {
		let t = e.getAttribute(_.model) ?? "", n = e.getAttribute(_.rows) ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.rows.length = 0, r.rows.push(...Ze(e)), r.rowsText = n), r;
		let i = Je(e);
		if (i === null) return null;
		let a = {
			root: e,
			model: Ye(i, (e) => this.formatting.strings.resolveText(e)),
			rows: Ze(e),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r === void 0 ? Wn(Un(e.querySelector(Mn) ?? e)) : r.view,
			anchored: r?.anchored ?? !0,
			follow: !1,
			frame: null,
			width: 0,
			height: 0,
			clip: r?.clip ?? null,
			release: r?.release ?? null,
			front: r?.front ?? null,
			bar: r?.bar ?? null
		};
		return this.charts.set(e, a), a;
	}
	schedule(e) {
		this.dirty.add(e), !this.frameRequested && (this.frameRequested = !0, requestAnimationFrame(() => this.flush()));
	}
	flush() {
		this.frameRequested = !1;
		let e = [...this.dirty];
		this.dirty.clear();
		for (let t of e) this.redraw(t);
	}
	redraw(e) {
		let t = this.charts.get(e);
		if (t === void 0 || !e.isConnected) return;
		let n = t.follow && t.view !== null;
		t.frame = Et(t, this.formatting), $n(t), er(e, t.bar), this.pointPress.redrawn(e), n && this.settle(e);
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = Zn(e);
		(n.width !== t.width || n.height !== t.height) && this.schedule(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute(_.model) ?? "") || t.rowsText !== (e.getAttribute(_.rows) ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && ($e(t.rows, e.action, e.items, e.moves, t.model, this.readPath), t.model.followLatest && t.view !== null && t.anchored && (t.follow = !0), this.schedule(e.component));
	}
	applyWindow(e, t, n) {
		let r = e.closest(Z), i = r === null ? void 0 : this.charts.get(r), a = Wn(t);
		a === null ? e.removeAttribute(_.window) : e.setAttribute(_.window, JSON.stringify(a)), !(r === null || i === void 0 || n) && (i.view = a === null ? null : {
			from: a.from,
			to: a.to
		}, i.follow = !1, this.schedule(r), Jn(i));
	}
	applyGaugeValue(e, t) {
		dn(e, t, this.formatting);
	}
	answering(e) {
		return e instanceof Element && !this.states.isInert(e) ? e : null;
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element)) return;
		let t = e.target, n = t.closest(Z), r = n === null ? void 0 : this.charts.get(n), i = r?.frame ?? null;
		if (e.type !== "pointermove" || n === null || r === void 0 || i === null || i.columns.length === 0 || t.closest(An) === null || this.states.isInert(t)) {
			this.closeShared();
			return;
		}
		let a = n.querySelector(Q), o = n.querySelector(jn);
		if (a === null || o === null) return;
		let s = a.getBoundingClientRect();
		if (!Kn(i, e.clientX - s.left, e.clientY - s.top)) {
			this.closeShared();
			return;
		}
		let c = r.model.horizontal, l = qn(i.columns, c ? e.clientY - s.top : e.clientX - s.left);
		(this.shared !== n || this.sharedColumn !== l) && (o.setAttribute(c ? "y" : "x", String(Math.round(l.at * 100) / 100)), o.classList.add(x.ruleOn), this.shared = n, this.sharedColumn = l, this.tooltips.show(o, l.text, { delay: !0 }));
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(jn)?.classList.remove(x.ruleOn), this.shared = null, this.sharedColumn = null, this.tooltips.hide());
	}
	zoomable(e) {
		let t = this.answering(e.target), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n), i = n?.querySelector(Q) ?? null;
		if (!(e instanceof MouseEvent) || t === null || n === null || r === void 0 || !r.model.zoomable || r.frame === null || i === null) return null;
		let a = i.getBoundingClientRect();
		return t.closest(An) === null || !Kn(r.frame, e.clientX - a.left, e.clientY - a.top) ? null : {
			root: n,
			entry: r,
			frame: r.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e);
		if (t === null || !(e instanceof WheelEvent)) return;
		let n = bn(this.wheel.pixels(e, Fn), this.wheel.notch, In);
		if (n === 0) return;
		let { entry: r, frame: i } = t, a = r.view ?? i.whole, o = fe({
			...i.x,
			min: a.from,
			max: a.to
		}, Yn(e, t.root, i, r.model.horizontal)), s = xn(r.view, i.whole, o, Pn ** n);
		Sn(s, r.view) || (e.preventDefault(), r.view = s, r.follow = !1, this.schedule(t.root), Jn(r), this.settle(t.root));
	}
	settle(e) {
		let t = this.settling.get(e);
		t !== void 0 && window.clearTimeout(t), this.settling.set(e, window.setTimeout(() => this.send(e), Nn));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(Mn);
		if (this.settling.delete(e), t === void 0 || n === null || this.states.isInert(e)) return;
		let r = t.view === null ? "" : JSON.stringify({
			from: t.view.from,
			to: t.view.to
		});
		r.length === 0 ? n.removeAttribute(_.window) : n.setAttribute(_.window, r), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent(C.windowChange, { bubbles: !0 }));
	}
	onDragStart(e) {
		this.dragged = !1;
		let t = this.zoomable(e);
		if (t === null || !(e instanceof PointerEvent) || e.button !== 0) return;
		this.drag = {
			root: t.root,
			start: Xn(e, t.entry.model.horizontal),
			window: t.entry.view ?? t.frame.whole,
			moved: 0
		};
		let n = (e) => this.onDragMove(e), r = () => {
			window.removeEventListener("pointermove", n, !0), window.removeEventListener("pointerup", r, !0), window.removeEventListener("pointercancel", r, !0), this.onDragEnd();
		};
		window.addEventListener("pointermove", n, !0), window.addEventListener("pointerup", r, !0), window.addEventListener("pointercancel", r, !0);
	}
	onDragMove(e) {
		let t = this.drag, n = t === null ? void 0 : this.charts.get(t.root);
		if (t === null || n === void 0 || n.frame === null || !(e instanceof PointerEvent) || this.states.isInert(t.root)) return;
		let r = n.model.horizontal, i = Xn(e, r);
		if (t.moved = Math.max(t.moved, Math.abs(i - t.start)), t.moved <= Ln) return;
		let a = r ? n.frame.plot.height : n.frame.plot.width, o = t.window.to - t.window.from, s = a > 0 ? (t.start - i) / a * o : 0;
		t.root.classList.add(x.dragging), n.view = gt(t.window, s, n.frame.whole.from, n.frame.whole.to), n.follow = !1, this.schedule(t.root), Jn(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > Ln, this.drag !== null && (this.drag.root.classList.remove(x.dragging), this.dragged && this.send(this.drag.root)), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e);
		t !== null && (this.pointPress.cancel(), t.entry.view !== null && (t.entry.view = null, t.entry.anchored = !0, t.entry.follow = !1, this.schedule(t.root), this.send(t.root)));
	}
	onSeriesHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Z), n = t === null ? void 0 : this.charts.get(t);
		if (n === void 0) return;
		let r = e.type === "pointerover" ? this.answering(e.target) : null, i = r === null ? null : Qn(r);
		i !== n.front && (n.front = i, $n(n));
	}
	onBarHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Z), n = t === null ? void 0 : this.charts.get(t);
		if (t === null || n === void 0) return;
		let r = e.type === "pointerover" ? this.answering(e.target)?.closest(zn) ?? null : null;
		n.bar = r === null ? null : {
			series: r.parentElement?.getAttribute(_.series) ?? "",
			point: r.getAttribute(_.point) ?? ""
		}, er(t, n.bar);
	}
	onSectorHover(e) {
		if (!(e.target instanceof Element)) return;
		if (e.type === "pointerout") {
			let t = e instanceof PointerEvent ? e.relatedTarget : null;
			this.sector !== null && this.sector.contains(e.target) && !(t instanceof Node && this.sector.contains(t)) && (this.sector = null, this.tooltips.hide());
			return;
		}
		let t = this.answering(e.target)?.closest(Bn) ?? null, n = t?.getAttribute(_.sectorTooltip) ?? null, r = t?.parentElement?.querySelector(Vn) ?? null;
		t !== null && n !== null && r !== null && t !== this.sector && (this.sector = t, this.tooltips.show(r, n, { delay: !0 }));
	}
	onPress(e) {
		if (e.defaultPrevented || this.answering(e.target) === null || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest(kn), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (t === null || n === null) return;
		let i = {
			point: t.getAttribute(_.point) ?? "",
			series: yn(t)
		}, a = () => {
			n.isConnected && !this.states.isInert(n) && n.dispatchEvent(new CustomEvent(C.pointClick, {
				bubbles: !0,
				detail: i
			}));
		}, o = e instanceof MouseEvent ? e.detail : 0;
		if (r?.model.zoomable !== !0 || o === 0) {
			a();
			return;
		}
		this.pointPress.press(o, {
			root: n,
			...i
		}, a);
	}
	onLegendPress(e) {
		if (!(e.target instanceof Element)) return !1;
		let t = e.target.closest(Rn), n = t?.closest(Z) ?? null, r = t?.getAttribute(_.series) ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let a = i.hidden.has(r);
		return t.setAttribute("aria-pressed", a ? "false" : "true"), t.classList.toggle(x.legendOff, a), this.schedule(n), !0;
	}
};
function Un(e) {
	let t = e.getAttribute(_.window);
	return t === null || t.length === 0 ? null : Gn(t);
}
function Wn(e) {
	let t = typeof e == "string" && e.length > 0 ? Gn(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function Gn(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function Kn(e, t, n) {
	let r = e.plot;
	return t >= r.left && t <= r.left + r.width && n >= r.top && n <= r.top + r.height;
}
function qn(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i].at < t ? n = i + 1 : r = i;
	}
	return n > 0 && Math.abs(e[n - 1].at - t) <= Math.abs(e[n].at - t) ? e[n - 1] : e[n];
}
function Jn(e) {
	let t = e.frame?.whole ?? null;
	e.anchored = e.view === null || t === null || e.view.to >= t.to - (t.to - t.from) * 1e-6;
}
function Yn(e, t, n, r) {
	let i = t.querySelector(Q), a = r ? n.plot.height : n.plot.width;
	if (i === null || a <= 0) return .5;
	let o = i.getBoundingClientRect(), s = r ? o.top + n.plot.top : o.left + n.plot.left;
	return Math.min(Math.max((Xn(e, r) - s) / a, 0), 1);
}
function Xn(e, t) {
	return t ? e.clientY : e.clientX;
}
function Zn(e) {
	let t = e.querySelector(Q);
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
function Qn(e) {
	let t = e.closest(Rn);
	if (t !== null) return t.getAttribute(_.series);
	let n = e.closest(Tn);
	return n === null || n.querySelector(Dn) === null ? null : e.closest(On)?.getAttribute(_.series) ?? e.closest(En)?.getAttribute(_.series) ?? null;
}
function $n(e) {
	let t = e.front !== null && !e.hidden.has(e.front) ? e.front : null;
	for (let n of e.root.querySelectorAll(`${En}, ${On}`)) n.classList.toggle(x.backSeries, t !== null && n.getAttribute(_.series) !== t);
}
function er(e, t) {
	for (let n of e.querySelectorAll(zn)) {
		let e = t !== null && n.getAttribute(_.point) === t.point && n.parentElement?.getAttribute(_.series) === t.series;
		n.classList.toggle(x.frontBar, e);
	}
}
//#endregion
//#region src/framework-api.ts
var tr = 2;
function nr() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	if (e.contractVersion !== tr) throw Error(`NE.Standard.UI.Web.Charts was built for plugin contract ${tr}, but the framework's client on the page implements ${String(e.contractVersion ?? "an older one")}; install the package version that matches the framework.`);
	return e;
}
//#endregion
//#region src/charts.ts
var $ = nr(), rr = null;
$.registerEngine((e) => {
	rr = new Hn(e);
}), $.registerCollectionSink({
	kind: w.sink,
	handler: (e) => rr?.applyChange(e)
}), $.registerValueReader({
	kind: w.window,
	read: Un
}), $.registerDomOperation({
	kind: w.window,
	handler: (e) => rr?.applyWindow(e.target, e.value, e.local)
}), $.registerEvent(C.windowChange, { settlesValue: !0 }), $.registerEvent(C.pointClick, { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), $.registerDomOperation({
	kind: w.gaugeValue,
	handler: (e) => rr?.applyGaugeValue(e.target, e.value)
});
//#endregion
