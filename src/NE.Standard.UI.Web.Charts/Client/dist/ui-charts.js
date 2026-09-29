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
	clipPrefix: "ui-chart-clip-",
	gauge: "ui-gauge",
	gaugeNumber: "ui-gauge__number",
	gaugeUnit: "ui-gauge__unit"
}, y = {
	seriesColor: "--ui-chart-series-color",
	arcStart: "--ui-arc-start",
	arcSweep: "--ui-arc-sweep",
	gaugeValue: "--ui-gauge-value"
}, b = {
	rule: "ui-chart__rule",
	ruleOn: "ui-chart__rule--on",
	dragging: "ui-chart--dragging",
	backSeries: "ui-chart__series--back",
	frontBar: "ui-chart__bar--front",
	pendingPoint: "ui-chart__point--pending",
	legendOff: "ui-chart__legend-entry--off"
}, x = {
	line: "line",
	area: "area",
	bar: "bar",
	pie: "pie",
	scatter: "scatter",
	radar: "radar"
}, S = {
	pointClick: "point-click",
	windowChange: "window-change"
}, C = {
	sink: "chart",
	window: "chart-window",
	gaugeValue: "chart-gauge-value"
}, w = {
	empty: "ui.chart.empty",
	label: "ui.chart.label",
	noReading: "ui.chart.no-reading",
	point: "ui.chart.point",
	sector: "ui.chart.sector",
	reading: "ui.chart.reading",
	list: "ui.chart.list"
}, T = {
	ghostButtonClass: "ui-button--ghost",
	smallButtonClass: "ui-button--small",
	seriesColorCount: "--ui-color-series-count",
	seriesColorPrefix: "--ui-color-series-"
};
//#endregion
//#region src/chart-legend.ts
function ee(e, t, n, r, i) {
	let a = null;
	for (let t of e.children) t.classList.contains(v.legend) && (a = t);
	let o = a === null ? [] : [...a.children], s = o.find((e) => e === document.activeElement) ?? null;
	if (t.length === 0) {
		a?.remove(), s !== null && i(e)?.focus({ preventScroll: !0 });
		return;
	}
	a === null && (a = document.createElement("div"), a.className = v.legend, a.setAttribute(r.eventBoundary, ""), e.append(a));
	let c = te(o, t), l = a.firstElementChild;
	for (let e of t) {
		let t = c.get(e.key), i = n.has(e.key);
		if (c.delete(e.key), t === void 0) {
			a.insertBefore(E(e, i, r), l);
			continue;
		}
		ne(t, e, i), t === l ? l = t.nextElementSibling : a.insertBefore(t, l);
	}
	if (s === null || s === document.activeElement) return;
	let u = s.isConnected ? s : a.children[Math.min(o.indexOf(s), a.children.length - 1)];
	u instanceof HTMLElement && u.focus({ preventScroll: !0 });
}
function te(e, t) {
	let n = new Set(t.map((e) => e.key)), r = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.getAttribute(_.series);
		e !== null && n.has(e) && !r.has(e) ? r.set(e, t) : t.remove();
	}
	return r;
}
function E(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span"), a = document.createElement("span");
	return r.className = `${v.legendEntry} ${n.buttonClass} ${T.ghostButtonClass} ${T.smallButtonClass}`, r.type = "button", r.setAttribute(_.series, e.key), r.setAttribute("aria-pressed", t ? "false" : "true"), r.classList.toggle(b.legendOff, t), r.style.setProperty(y.seriesColor, e.color), i.className = v.legendMark, a.className = v.legendCaption, a.textContent = e.caption, r.append(i, a), r;
}
function ne(e, t, n) {
	let r = e.querySelector(`.${v.legendCaption}`), i = n ? "false" : "true";
	r !== null && r.textContent !== t.caption && (r.textContent = t.caption), e instanceof HTMLElement && e.style.getPropertyValue(y.seriesColor) !== t.color && e.style.setProperty(y.seriesColor, t.color), e.getAttribute("aria-pressed") !== i && e.setAttribute("aria-pressed", i), e.classList.contains(b.legendOff) !== n && e.classList.toggle(b.legendOff, n);
}
//#endregion
//#region src/chart-ticks.ts
var D = 200, re = 15, O = 1e3, k = 60 * O, A = 60 * k, j = 24 * A, ie = 365 * j, ae = [
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
	ie
];
function M(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n <= 0 ? 0 : (t - e.min) / n;
}
function oe(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	return e.min + t * (e.max - e.min);
}
function se(e, t) {
	return Math.min(Math.max(t, Math.min(e.min, e.max)), Math.max(e.min, e.max));
}
function N(e, t, n) {
	return e.left + M(t, n) * e.width;
}
function P(e, t, n) {
	return e.top + (1 - M(t, n)) * e.height;
}
function ce(e, t, n) {
	return e.top + M(t, n) * e.height;
}
function le(e) {
	return e.left + e.width;
}
function F(e) {
	return e.top + e.height;
}
function I(e, t, n, r) {
	let i = (n - t) / Math.max(1, r);
	if (i <= 0 || !Number.isFinite(i) || e === "Category") return 1;
	if (e === "Logarithmic") return t > 0 ? 10 ** Math.floor(Math.log10(t)) : 1;
	if (e !== "Time") return he(i);
	for (let e of ae) if (e >= i) return e;
	return he(i / ie) * ie;
}
function ue(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return ge(t);
	let r = I(e, t.min, t.max, n), i = r * 1e-9, a = e === "Time" ? l(r) : 0;
	if (a > 0) return de(t, a, i);
	e === "Category" && (r = Math.max(1, Math.ceil((Math.floor(t.max) - Math.ceil(t.min) + 1) / D)));
	let o = Math.ceil(t.min / r) * r, s = [];
	for (let e = o; e <= t.max + i && s.length < D; e += r) s.push(e === 0 ? 0 : e);
	return s;
}
function de(e, t, n) {
	let r = f(u(e.min), t);
	d(r) < e.min - n && (r += t);
	let i = [];
	for (let a = d(r); a <= e.max + n && i.length < D; a = d(r)) i.push(a === 0 ? 0 : a), r += t;
	return i;
}
function fe(e, t) {
	if (e === "Category") return null;
	if (e === "Time") return t < k ? "HH:mm:ss" : t < j ? "HH:mm" : t < 30 * j ? "dd MMM" : "MMM yyyy";
	if (t >= 1) return "N0";
	let n = -Math.floor(Math.log10(t) + 1e-9);
	return `N${Math.min(re, n)}`;
}
function pe(e, t, n, r, i = !1) {
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
		return me(e.kind, e.min ?? Math.min(o, s) - t, e.max ?? Math.max(o, s) + t);
	}
	let c = I(e.kind, o, s, e.ticks), p = e.kind === "Time" ? l(c) : 0;
	if (p === 0) return me(e.kind, e.min ?? Math.floor(o / c) * c, e.max ?? Math.ceil(s / c) * c);
	let m = f(u(s), p);
	return d(m) < s && (m += p), me(e.kind, e.min ?? d(f(u(o), p)), e.max ?? d(m));
}
function me(e, t, n) {
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
function he(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function ge(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(D, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
var _e = 4;
function ve(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: N(r, t, c.x),
				y: P(r, n, c.y)
			});
			continue;
		}
		o = Te(o, s, i, a), s = [];
	}
	return Te(o, s, i, a);
}
function ye(e, t, n, r, i, a) {
	let o = P(r, n, se(n, 0)), s = "", c = -1;
	for (let l = 0; l <= e.length; l++) {
		if (l < e.length && e[l].y !== null) {
			c < 0 && (c = l);
			continue;
		}
		c >= 0 && (s = ke(s, e, c, l - 1, t, n, r, i, a, o)), c = -1;
	}
	return s;
}
function be(e, t, n, r, i, a) {
	let o = [], s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: N(r, t, c.x),
				y: P(r, n, c.y)
			});
			continue;
		}
		xe(o, s, i, a), s = [];
	}
	return xe(o, s, i, a), o;
}
function xe(e, t, n, r) {
	if (!(t.length < 2)) {
		if (n) {
			Se(e, t);
			return;
		}
		for (let n = 1; n < t.length; n++) r ? Ce(e, t, n) : L(e, t[n - 1].x, t[n - 1].y, t[n].x, t[n].y);
	}
}
function Se(e, t) {
	let n = t[0].x, r = t[0].y;
	for (let i = 1; i < t.length; i++) {
		let a = (t[i - 1].x + t[i].x) / 2;
		L(e, n, r, a, r), L(e, a, r, a, t[i].y), n = a, r = t[i].y;
	}
	L(e, n, r, t[t.length - 1].x, r);
}
function Ce(e, t, n) {
	let r = Math.max(0, n - 2), i = Math.min(t.length - 1, n + 1), a = t[n - 1].x, o = t[n - 1].y, s = t[n].x, c = t[n].y, l = a + (s - t[r].x) / 6, u = o + (c - t[r].y) / 6, d = s - (t[i].x - a) / 6, f = c - (t[i].y - o) / 6, p = we(a, o, l, u) + we(l, u, d, f) + we(d, f, s, c), m = Math.max(1, Math.ceil(p / _e)), h = a, g = o;
	for (let t = 1; t <= m; t++) {
		let n = t / m, r = 1 - n, i = r * r * r, p = 3 * r * r * n, _ = 3 * r * n * n, v = n * n * n, y = i * a + p * l + _ * d + v * s, b = i * o + p * u + _ * f + v * c;
		L(e, h, g, y, b), h = y, g = b;
	}
}
function we(e, t, n, r) {
	return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t));
}
function L(e, t, n, r, i) {
	(t !== r || n !== i) && e.push({
		x1: t,
		y1: n,
		x2: r,
		y2: i
	});
}
function R(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 100) / 100;
	return String(t === 0 ? 0 : t);
}
function Te(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${R(t[0].x)} ${R(t[0].y)}` + Ee(t, n, r);
}
function Ee(e, t, n) {
	if (t) return De(e);
	let r = "";
	for (let t = 1; t < e.length; t++) {
		if (n) {
			r += Oe(e, t);
			continue;
		}
		r += ` L${R(e[t].x)} ${R(e[t].y)}`;
	}
	return r;
}
function De(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${R((e[n - 1].x + e[n].x) / 2)} V${R(e[n].y)}`;
	return t + ` H${R(e[e.length - 1].x)}`;
}
function Oe(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${R(i)} ${R(a)} ${R(o)} ${R(s)} ${R(e[t].x)} ${R(e[t].y)}`;
}
function ke(e, t, n, r, i, a, o, s, c, l) {
	let u = [];
	for (let e = n; e <= r; e++) u.push({
		x: N(o, i, t[e].x),
		y: P(o, a, t[e].y)
	});
	let d = Te(e, u, s, c);
	if (t[n].base === void 0 || t[n].base === null) return d + ` L${R(u[u.length - 1].x)} ${R(l)} L${R(u[0].x)} ${R(l)} Z`;
	let f = [];
	for (let e = r; e >= n; e--) f.push({
		x: N(o, i, t[e].x),
		y: P(o, a, t[e].base ?? 0)
	});
	return d += ` L${R(f[0].x)} ${R(f[0].y)}`, d + Ee(f, s, c) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var Ae = Math.PI * 2, je = -Math.PI / 2;
function Me(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = je;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * Ae : 0;
		n.push({
			start: r,
			sweep: e
		}), r += e;
	}
	return n;
}
function z(e, t, n) {
	return {
		x: e.x + Math.cos(n) * t,
		y: e.y + Math.sin(n) * t
	};
}
//#endregion
//#region src/chart-radar.ts
var Ne = Math.PI * 2, Pe = -Math.PI / 2;
function Fe(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of n) t.add(e.x);
	return [...t].sort((e, t) => e - t);
}
function Ie(e, t) {
	return t <= 0 ? Pe : Pe + e * Ne / t;
}
function Le(e, t, n) {
	return t === null ? 0 : n * Math.min(Math.max(M(e, se(e, t)), 0), 1);
}
function Re(e, t, n, r) {
	return Math.max(0, Math.min(e / 2 - n, t / 2 - r));
}
function ze(e) {
	if (e.length === 0) return "";
	let t = [`M${R(e[0].x)} ${R(e[0].y)}`];
	for (let n = 1; n < e.length; n++) t.push(`L${R(e[n].x)} ${R(e[n].y)}`);
	return `${t.join(" ")} Z`;
}
function Be(e) {
	let t = [];
	for (let n = 0; n < e.length && e.length > 1; n++) {
		let r = e[n], i = e[(n + 1) % e.length];
		L(t, r.x, r.y, i.x, i.y);
	}
	return t;
}
function Ve(e) {
	let t = Math.cos(e);
	return t > .3 ? "start" : t < -.3 ? "end" : "middle";
}
//#endregion
//#region src/chart-model.ts
function He(e) {
	let t = e.getAttribute(_.model);
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return null;
	}
}
function Ue(e, t) {
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
function We(e) {
	return e.seriesPath !== null && e.seriesPath.length > 0;
}
//#endregion
//#region src/chart-rows.ts
function Ge(e) {
	let t = e.getAttribute(_.rows);
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t), n = [];
		for (let t of e) {
			if (!Array.isArray(t)) continue;
			let e = Array.isArray(t[2]) ? t[2].map((e) => B(e)) : [], r = Array.isArray(t[4]) ? t[4].map((e) => B(e)) : [], i = t.length > 3 && t[3] !== null && t[3] !== void 0 ? String(t[3]) : null;
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
function Ke(e, t, n, r) {
	let i = nt(n.xPath === null ? null : r(e, n.xPath));
	if (We(n)) {
		let a = nt(r(e, n.seriesPath)), o = rt(n, a), s = o?.valuePath ?? n.valuePath, c = o?.sizePath ?? null;
		return {
			key: t,
			x: i,
			values: [s === null ? null : B(r(e, s))],
			series: a,
			sizes: c === null ? [] : [B(r(e, c))]
		};
	}
	let a = [], o = [], s = !1;
	for (let t of n.series) {
		let i = t.valuePath ?? n.valuePath;
		a.push(i === null ? null : B(r(e, i))), o.push(t.sizePath === null ? null : B(r(e, t.sizePath))), s ||= t.sizePath !== null;
	}
	return {
		key: t,
		x: i,
		values: a,
		series: null,
		sizes: s ? o : []
	};
}
function qe(e, t, n, r, i, a) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	if (t === "Move") {
		for (let t of r) ot(e, t.key, t.oldIndex, t.newIndex);
		return;
	}
	let o = /* @__PURE__ */ new Set();
	for (let t of e) o.add(t.key);
	for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (n === null) continue;
		if (t === "Remove") {
			let t = o.has(n) ? at(e, n) : -1;
			t >= 0 && (e.splice(t, 1), o.delete(n));
			continue;
		}
		let s = Ke(r.item, r.key ?? n, i, a), c = t === "Replace" ? r.oldKey ?? n : n, l = o.has(c) ? at(e, c) : -1;
		if (l >= 0) {
			e[l] = s, o.delete(c), o.add(s.key);
			continue;
		}
		let u = r.index;
		u === null || u < 0 || u >= e.length ? e.push(s) : e.splice(u, 0, s), o.add(s.key);
	}
}
function Je(e, t, n) {
	let r = [], i = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), a = We(t), o = Xe(), s = Xe(), c = Xe();
	for (let l = 0; l < e.length; l++) {
		let u = e[l], d = t.xPath === null ? Qe(l, t.x.kind, r) : $e(u.x, t.x.kind, r, n);
		if (d !== null) {
			if (Ze(o, d), a) {
				Ye(it(i, u.series ?? ""), u, d, u.values.length > 0 ? u.values[0] : null, u.sizes.length > 0 ? u.sizes[0] : null, s, c);
				continue;
			}
			for (let e = 0; e < i.length; e++) Ye(i[e], u, d, e < u.values.length ? u.values[e] : null, e < u.sizes.length ? u.sizes[e] : null, s, c);
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
function Ye(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && Ze(a, r), i !== null && Ze(o, i);
}
function Xe() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function Ze(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function Qe(e, t, n) {
	return t === "Category" ? $e(String(e), t, n, () => null) ?? e : e;
}
function $e(e, t, n, r) {
	if (t === "Category") {
		let t = n.indexOf(e);
		return t >= 0 ? t : (n.push(e), n.length - 1);
	}
	let i = tt(e);
	if (i !== null || t !== "Time") return i;
	let a = r(e);
	return a === null ? null : h(a);
}
var et = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function tt(e) {
	if (!et.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function B(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "boolean" ? +!!e : typeof e == "string" ? tt(e) : null;
}
function nt(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function rt(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function it(e, t) {
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
function at(e, t) {
	for (let n = 0; n < e.length; n++) if (e[n].key === t) return n;
	return -1;
}
function ot(e, t, n, r) {
	let i = t === null ? n ?? -1 : at(e, t);
	if (i < 0 || i >= e.length) return;
	let [a] = e.splice(i, 1), o = r === null || r < 0 || r > e.length ? e.length : r;
	e.splice(o, 0, a);
}
//#endregion
//#region src/chart-stack.ts
function st(e) {
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
var ct = .002;
function V(e) {
	return e.to - e.from;
}
function H(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * ct, a = Math.min(Math.max(Number.isFinite(V(e)) && V(e) > 0 ? V(e) : r, i), r);
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
function lt(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return H(e, r, i);
	let a = V(e) * n, o = V(e) > 0 ? Math.min(Math.max((t - e.from) / V(e), 0), 1) : .5;
	return H({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function ut(e, t, n, r) {
	return H(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function dt(e, t, n) {
	return H({
		from: n - V(e),
		to: n
	}, t, n);
}
function ft(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && pt(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function pt(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return r >= n.from && r <= n.to || t + 1 < e.length && e[t + 1].x >= n.from && e[t + 1].x <= n.to || t > 0 && e[t - 1].x >= n.from && e[t - 1].x <= n.to;
}
//#endregion
//#region src/chart-draw.ts
var U = "http://www.w3.org/2000/svg", W = 12, mt = 22, ht = 16, G = 8, gt = 16, _t = 8, vt = `:scope > .${v.area} > .${v.centre}`;
function yt(e, t) {
	let n = e.root.querySelector(`.${v.canvas}`);
	if (n === null) return null;
	let r = e.model, i = Je(e.rows, r, t.temporal.parse), a = i.series.filter((t) => !e.hidden.has(t.series.key));
	r.stacked && st(a);
	let o = pe(r.x, i.xMin, i.xMax, i.categories.length);
	e.follow && e.view !== null && (e.view = dt(e.view, o.min, o.max)), e.follow = !1;
	let s = e.view === null ? null : H(e.view, o.min, o.max), c = ft(a.map((e) => e.drawn), s), l = s === null ? o : {
		...o,
		min: s.from,
		max: s.to
	}, u = pe(r.y, c.min, c.max, 0, r.kind === x.area || r.kind === x.bar || r.kind === x.radar), d = t.numbers.readCulture(e.root), f = t.temporal.readCulture(e.root), p = {
		x: r.x.format ?? fe(r.x.kind, I(r.x.kind, l.min, l.max, r.x.ticks)),
		y: r.y.format ?? fe(r.y.kind, I(r.y.kind, u.min, u.max, r.y.ticks))
	}, m = Qt(e.root), h = r.kind === x.pie ? bt(r, i, p, d, f, t, m) : i.series.map((e) => ({
		key: e.series.key,
		caption: e.series.caption,
		color: Xt(e, m)
	}));
	r.legend !== "None" && ee(e.root, h, e.hidden, t.names, t.focusReturn), xt(n, h, t);
	let g = n.getBoundingClientRect(), _ = Math.round(g.width), y = Math.round(g.height);
	if (e.width = _, e.height = y, _ < 2 || y < 2) return null;
	n.setAttribute("viewBox", `0 0 ${R(_)} ${R(y)}`);
	let b = document.createElementNS(U, "svg");
	if (r.kind === x.pie) return Ct(b, e, i, _, y, p, d, f, t, m), n.replaceChildren(...b.childNodes), null;
	if (r.kind === x.radar) return Et(b, n, e, i, a, u, _, y, p, d, f, t, m), n.replaceChildren(...b.childNodes), null;
	if (r.bare) {
		let r = {
			left: 2,
			top: 2,
			width: _ - 4,
			height: y - 4
		};
		return Vt(b, e, a, r, l, u, i.categories, p, d, f, t, m), n.replaceChildren(...b.childNodes), {
			plot: r,
			x: l,
			whole: {
				from: o.min,
				to: o.max
			},
			columns: []
		};
	}
	let S = Nt(n), C = e.rows.length > 0, w = Mt(r.x, p.x, l, i.categories, d, f, t, S.width, C), T = Mt(r.y, p.y, u, i.categories, d, f, t, S.width, C), te = (r.horizontal ? w : T).reduce((e, t) => Math.max(e, t.width), 0);
	S.release();
	let E = Pt(r, _, y, te);
	Lt(b, r, E, l, u, w, T), zt(b, r, E, l, u, w, T, _, y), Vt(b, e, a, E, l, u, i.categories, p, d, f, t, m, {
		min: i.sizeMin,
		max: i.sizeMax
	}), e.rows.length === 0 && qt(b, E, t);
	let ne = r.sharedTooltip ? Jt(r, a, E, l, i.categories, p, d, f, t) : [];
	return ne.length > 0 && Yt(b, E, r.horizontal), n.replaceChildren(...b.childNodes), {
		plot: E,
		x: l,
		whole: {
			from: o.min,
			to: o.max
		},
		columns: ne
	};
}
function bt(e, t, n, r, i, a, o) {
	return (t.series.length > 0 ? t.series[0].points : []).map((s, c) => ({
		key: s.key,
		caption: K(e.x, n.x, s.x, t.categories, r, i, a),
		color: Zt(c, o)
	}));
}
function xt(e, t, n) {
	let r = t.length > 0 ? St(t.map((e) => e.caption), n.strings) : n.strings.text(w.label);
	e.getAttribute("aria-label") !== r && e.setAttribute("aria-label", r);
}
function St(e, t) {
	let n = e.length > 0 ? e[0] : "";
	for (let r = 1; r < e.length; r++) n = t.format(w.list, {
		list: n,
		next: e[r]
	});
	return n;
}
function Ct(e, t, n, r, i, a, o, s, c, l) {
	let u = t.model, d = n.series.length > 0 ? n.series[0].points : [], f = [];
	for (let e = 0; e < d.length; e++) t.hidden.has(d[e].key) || f.push({
		point: d[e],
		index: e
	});
	let p = Me(f.map((e) => e.point.y)), m = {
		x: r / 2,
		y: i / 2
	}, h = Math.min(r, i) / 2 - W, g = h * u.donut, b = Y(e, "g", v.plot);
	for (let e = 0; e < f.length; e++) {
		if (p[e].sweep <= 0 || h <= 0) continue;
		let t = f[e].point, r = Y(b, "g", v.series);
		r.setAttribute(_.series, t.key), r.style.setProperty(y.seriesColor, Zt(f[e].index, l));
		let i = Y(r, "circle", v.sector);
		if (i.setAttribute("cx", R(m.x)), i.setAttribute("cy", R(m.y)), i.setAttribute("r", R((h + g) / 2)), i.setAttribute("stroke-width", R(h - g)), i.style.setProperty(y.arcStart, wt(p[e].start)), i.style.setProperty(y.arcSweep, wt(p[e].sweep)), i.setAttribute(_.point, t.key), i.setAttribute(_.series, n.series[0].series.key), !u.tooltip) continue;
		let d = K(u.x, a.x, t.x, n.categories, o, s, c), x = K(u.y, a.y, t.y ?? 0, n.categories, o, s, c), S = z(m, (h + g) / 2, p[e].start + p[e].sweep / 2), C = Y(r, "circle", v.sectorAnchor);
		i.setAttribute(_.sectorTooltip, c.strings.format(w.sector, {
			label: d,
			value: x
		})), C.setAttribute("cx", R(S.x)), C.setAttribute("cy", R(S.y)), C.setAttribute("r", "1");
	}
	Tt(b, p, m, h, g);
	let x = t.root.querySelector(vt), S = `${R(Math.max(g, 0) * Math.SQRT2)}px`;
	x !== null && x.style.maxWidth !== S && (x.style.maxWidth = S), d.length === 0 && qt(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, c);
}
function wt(e) {
	return `${R(e * 180 / Math.PI)}deg`;
}
function Tt(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = z(n, i, t.start), o = z(n, r, t.start), s = Y(e, "line", v.sectorEdge);
		s.setAttribute("x1", R(a.x)), s.setAttribute("y1", R(a.y)), s.setAttribute("x2", R(o.x)), s.setAttribute("y2", R(o.y));
	}
}
function Et(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	let p = n.model, m = Fe(r.series.map((e) => e.drawn)), h = m.map((e) => K(p.x, c.x, e, r.categories, l, u, d)), g = Nt(t), _ = h.reduce((e, t) => Math.max(e, g.width(t)), 0);
	g.release();
	let y = {
		x: o / 2,
		y: s / 2
	}, b = Re(o, s, _ + G + W, 36), x = n.rows.length > 0 || p.y.min !== null || p.y.max !== null ? ue(p.y.kind, a, p.y.ticks) : [];
	m.length > 0 && b > 0 && Dt(e, p, h, x.map((e) => ({
		value: e,
		text: K(p.y, c.y, e, [], l, u, d)
	})), a, y, b);
	let S = Y(e, "g", v.plot), C = Y(S, "g", v.bands);
	for (let e of i) At(S, C, p, e, m, a, y, b, r.categories, c, l, u, d, f);
	n.rows.length === 0 && qt(e, {
		left: 0,
		top: 0,
		width: o,
		height: s
	}, d);
}
function Dt(e, t, n, r, i, a, o) {
	let s = n.length;
	if (t.y.grid) {
		let t = Y(e, "g", v.grid);
		for (let e of r) {
			let n = Le(i, e.value, o);
			n > 0 && n < o && Ot(t, v.gridLine, s, a, n);
		}
	}
	let c = Y(e, "g", v.axes);
	Ot(c, v.axisLine, s, a, o);
	for (let e = 0; e < s; e++) {
		let r = Ie(e, s), i = z(a, o, r), l = z(a, o + G, r);
		t.x.grid && X(c, v.axisLine, a.x, a.y, i.x, i.y), Z(c, v.label, n[e], l.x, kt(r, l.y), Ve(r));
	}
	let l = NaN;
	for (let e of r) {
		let t = Le(i, e.value, o);
		t <= 0 || Number.isFinite(l) && Math.abs(t - l) < gt || (l = t, Z(c, v.label, e.text, a.x + G, a.y - t + 12, "start"));
	}
}
function Ot(e, t, n, r, i) {
	let a = [];
	for (let e = 0; e < n; e++) a.push(z(r, i, Ie(e, n)));
	$t(e, t, Be(a));
}
function kt(e, t) {
	let n = Math.sin(e);
	return n < -.3 ? t : n > .3 ? t + 12 : t + 4;
}
function At(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = r.series.markers ?? n.markers, h = /* @__PURE__ */ new Map();
	for (let e of r.drawn) h.has(e.x) || h.set(e.x, e);
	let g = i.map((e) => h.get(e) ?? null), b = g.map((e, t) => z(o, Le(a, e?.y ?? null, s), Ie(t, i.length))), x = Y(e, "g", v.series), S = Xt(r, p);
	if (x.setAttribute(_.series, r.series.key), x.style.setProperty(y.seriesColor, S), jt(t, r.series.key, S, ze(b)), $t(x, v.line, Be(b)), m || n.tooltip) for (let e = 0; e < g.length; e++) {
		let t = g[e];
		if (t === null || t.y === null) continue;
		let i = n.tooltip ? Kt(n, r, t.x, t.y, c, l, u, d, f) : null;
		Ut(x, t.key, b[e].x, b[e].y, m ? 3 : 5, m, i, f.names);
	}
}
function jt(e, t, n, r) {
	let i = Y(e, "path", v.fill);
	i.setAttribute(_.series, t), i.style.setProperty(y.seriesColor, n), i.setAttribute("d", r);
}
function Mt(e, t, n, r, i, a, o, s, c) {
	return !c && e.min === null && e.max === null ? [] : ue(e.kind, n, e.ticks).map((n) => {
		let c = K(e, t, n, r, i, a, o);
		return {
			value: n,
			text: c,
			width: s(c)
		};
	});
}
function K(e, t, n, r, i, a, o) {
	if (e.kind === "Category") {
		let e = Math.round(n);
		return e >= 0 && e < r.length ? r[e] : "";
	}
	return e.kind === "Time" ? o.temporal.format(g(n), t, a) : o.numbers.format(n, t, i);
}
function Nt(e) {
	let t = document.createElementNS(U, "text");
	return t.setAttribute("class", v.label), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function Pt(e, t, n, r) {
	let i = r + 16 + (Ft(e).caption === null ? 0 : ht), a = mt + (It(e).caption === null ? 0 : ht);
	return {
		left: i,
		top: W,
		width: Math.max(1, t - i - W),
		height: Math.max(1, n - a - W)
	};
}
function Ft(e) {
	return e.horizontal ? e.x : e.y;
}
function It(e) {
	return e.horizontal ? e.y : e.x;
}
function q(e, t, n, r) {
	return e.horizontal ? ce(t, n, r) : N(t, n, r);
}
function J(e, t, n, r) {
	return e.horizontal ? N(t, n, r) : P(t, n, r);
}
function Lt(e, t, n, r, i, a, o) {
	if (!t.x.grid && !t.y.grid) return;
	let s = Y(e, "g", v.grid);
	if (t.y.grid) for (let e of o) Rt(s, n, J(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) Rt(s, n, q(t, n, r, e.value), !t.horizontal);
}
function Rt(e, t, n, r) {
	r ? X(e, v.gridLine, n, t.top, n, F(t)) : X(e, v.gridLine, t.left, n, le(t), n);
}
function zt(e, t, n, r, i, a, o, s, c) {
	let l = Y(e, "g", v.axes);
	X(l, v.axisLine, n.left, F(n), le(n), F(n)), X(l, v.axisLine, n.left, n.top, n.left, F(n));
	let u = t.horizontal ? o : a, d = t.horizontal ? a : o, f = -Infinity;
	for (let e of u) {
		let a = e.width / 2, o = t.horizontal ? J(t, n, i, e.value) : q(t, n, r, e.value), c = Math.min(Math.max(o, a), s - a);
		c - a < f || (f = c + a + G, Z(l, v.label, e.text, c, F(n) + 16, "middle"));
	}
	let p = NaN;
	for (let e of d) {
		let a = t.horizontal ? q(t, n, r, e.value) : J(t, n, i, e.value);
		Number.isFinite(p) && Math.abs(a - p) < gt || (p = a, Z(l, v.label, e.text, n.left - G, a + 4, "end"));
	}
	let m = It(t).caption, h = Ft(t).caption;
	if (m !== null && Z(l, v.caption, m, n.left + n.width / 2, c - 2, "middle"), h !== null) {
		let e = n.top + n.height / 2;
		Z(l, v.caption, h, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${R(e)})`);
	}
}
function Bt(e, t, n, r, i) {
	let a = `${v.clipPrefix}${n.getAttribute(i.componentId) ?? "0"}`, o = Y(e, "clipPath", "");
	o.setAttribute("id", a);
	let s = Y(o, "rect", "");
	s.setAttribute("x", R(r.left)), s.setAttribute("y", R(r.top)), s.setAttribute("width", R(r.width)), s.setAttribute("height", R(r.height)), t.setAttribute("clip-path", `url(#${a})`);
}
function Vt(n, r, a, o, s, c, l, u, d, f, p, m, h = {
	min: Infinity,
	max: -Infinity
}) {
	let g = Y(n, "g", v.plot), b = r.model;
	r.view !== null && Bt(n, g, r.root, o, p.names);
	let S = b.kind === x.area ? Y(g, "g", v.bands) : null, C = b.kind === x.bar ? t(b.horizontal ? o.height : o.width, e(a.map((e) => e.drawn), s)) : 0;
	for (let e = 0; e < a.length; e++) {
		let t = a[e], n = t.series.stepped ?? b.stepped, r = t.series.smooth ?? b.smooth, w = t.series.markers ?? b.markers, T = Y(g, "g", v.series), ee = Xt(t, m);
		if (T.setAttribute(_.series, t.series.key), T.style.setProperty(y.seriesColor, ee), b.kind === x.bar) {
			Wt(T, t, e, a.length, o, s, c, C, l, u, d, f, p, b);
			continue;
		}
		if (b.kind === x.scatter) {
			for (let e = 0; e < t.drawn.length; e++) Ht(T, t, e, o, s, c, i(t.drawn[e].size, h.min, h.max), !0, l, u, d, f, p, b);
			continue;
		}
		if (S !== null && jt(S, t.series.key, ee, ye(t.drawn, s, c, o, n, r)), $t(T, v.line, be(t.drawn, s, c, o, n, r)), Y(T, "path", v.lineHit).setAttribute("d", ve(t.drawn, s, c, o, n, r)), w || b.tooltip) for (let e = 0; e < t.drawn.length; e++) Ht(T, t, e, o, s, c, w ? 3 : 5, w, l, u, d, f, p, b);
	}
}
function Ht(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = t.drawn[n];
	if (m.y === null) return;
	let h = !p.tooltip || p.sharedTooltip ? null : Kt(p, t, m.x, Gt(t, n), c, l, u, d, f);
	Ut(e, m.key, N(r, i, m.x), P(r, a, m.y), o, s, h, f.names);
}
function Ut(e, t, n, i, a, o, s, c) {
	let l = {
		x: R(n),
		y: R(i)
	}, u = Y(e, "g", v.point);
	u.setAttribute(_.point, t);
	let d = Y(u, "circle", o ? v.marker : `${v.marker} ${v.bareMarker}`);
	d.setAttribute("cx", l.x), d.setAttribute("cy", l.y), d.setAttribute("r", R(a));
	let f = Y(u, "circle", v.hit);
	f.setAttribute("cx", l.x), f.setAttribute("cy", l.y), f.setAttribute("r", R(r(a))), s !== null && f.setAttribute(c.tooltip, s);
}
function Wt(e, t, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h = m.horizontal;
	for (let g = 0; g < t.drawn.length; g++) {
		let y = t.drawn[g];
		if (y.y === null) continue;
		let b = n(q(m, a, o, y.x), c, r, i, m.stacked), x = J(m, a, s, y.y), S = J(m, a, s, se(s, y.base ?? 0)), C = Math.min(x, S), w = Math.max(1, Math.abs(x - S)), T = Y(e, "rect", v.bar);
		T.setAttribute("x", R(h ? C : b.start)), T.setAttribute("y", R(h ? b.start : C)), T.setAttribute("width", R(h ? w : b.thickness)), T.setAttribute("height", R(h ? b.thickness : w)), T.setAttribute(_.point, y.key), m.tooltip && !m.sharedTooltip && T.setAttribute(p.names.tooltip, Kt(m, t, y.x, Gt(t, g), l, u, d, f, p));
	}
}
function Gt(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function Kt(e, t, n, r, i, a, o, s, c) {
	let l = K(e.x, a.x, n, i, o, s, c), u = K(e.y, a.y, r, i, o, s, c);
	return c.strings.format(w.point, {
		series: t.series.caption,
		x: l,
		y: u
	});
}
function qt(e, t, n) {
	let r = n.strings.text(w.empty);
	r.length !== 0 && Z(e, v.empty, r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function Jt(e, t, n, r, i, a, o, s, c) {
	let l = /* @__PURE__ */ new Map();
	for (let e = 0; e < t.length; e++) for (let n of t[e].points) {
		if (n.y === null || n.x < r.min || n.x > r.max) continue;
		let i = l.get(n.x);
		i === void 0 && (i = Array(t.length).fill(null), l.set(n.x, i)), i[e] ??= n.y;
	}
	return [...l.keys()].sort((e, t) => e - t).map((u) => {
		let d = l.get(u) ?? [], f = null;
		return {
			at: q(e, n, r, u),
			get text() {
				if (f !== null) return f;
				let n = [K(e.x, a.x, u, i, o, s, c)];
				for (let r = 0; r < t.length; r++) {
					let l = d[r];
					if (l == null) continue;
					let u = K(e.y, a.y, l, i, o, s, c);
					n.push(c.strings.format(w.reading, {
						series: t[r].series.caption,
						value: u
					}));
				}
				return f = n.join("\n"), f;
			}
		};
	});
}
function Yt(e, t, n) {
	let r = Y(e, "rect", b.rule);
	r.setAttribute("x", n ? R(t.left) : "0"), r.setAttribute("y", n ? "0" : R(t.top)), r.setAttribute("width", n ? R(t.width) : "1"), r.setAttribute("height", n ? "1" : R(t.height));
}
function Xt(e, t) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : Zt(e.index, t);
}
function Zt(e, t) {
	return `var(${T.seriesColorPrefix}${e % t + 1})`;
}
function Qt(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(T.seriesColorCount));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : _t;
}
function Y(e, t, n) {
	let r = document.createElementNS(U, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function $t(e, t, n) {
	let r = Y(e, "g", t);
	for (let e of n) {
		let t = document.createElementNS(U, "line");
		t.setAttribute("x1", R(e.x1)), t.setAttribute("y1", R(e.y1)), t.setAttribute("x2", R(e.x2)), t.setAttribute("y2", R(e.y2)), r.appendChild(t);
	}
}
function X(e, t, n, r, i, a) {
	let o = Y(e, "line", t);
	o.setAttribute("x1", R(n)), o.setAttribute("y1", R(r)), o.setAttribute("x2", R(i)), o.setAttribute("y2", R(a));
}
function Z(e, t, n, r, i, a) {
	let o = Y(e, "text", t);
	return o.setAttribute("x", R(r)), o.setAttribute("y", R(i)), o.setAttribute("text-anchor", a), o.textContent = n, o;
}
//#endregion
//#region src/chart-gauge.ts
var en = `.${v.gauge}`, tn = `.${v.gaugeNumber}`, nn = `.${v.gaugeUnit}`;
function rn(e, t, n) {
	let r = e.getAttribute(_.gaugeFormat) ?? "N0", i = typeof t == "number" ? t : typeof t == "string" && t.length > 0 ? Number(t) : NaN, a = Number.isFinite(i), o = a ? n.numbers.format(i, r, n.numbers.readCulture(e)) : n.strings.text(w.noReading);
	e.textContent !== o && (e.textContent = o);
	let s = e.parentElement?.querySelector(nn);
	s != null && s.hidden === a && (s.hidden = !a);
}
function an(e, t) {
	for (let n of e.querySelectorAll(en)) {
		let e = n.querySelector(tn);
		e !== null && rn(e, n.style.getPropertyValue(y.gaugeValue).trim(), t);
	}
}
//#endregion
//#region src/chart-press.ts
var on = `[${_.point}]`, sn = `.${b.pendingPoint}`, cn = `.${v.series}`, ln = class {
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
}, un = class {
	wait;
	held = null;
	constructor(e) {
		this.wait = new ln(e);
	}
	press(e, t, n) {
		this.wait.press(e, () => {
			this.held === t && this.mark(null), n();
		}), this.mark(e > 1 ? null : t);
	}
	mark(e) {
		this.held !== null && dn(this.held.root, null), this.held = e, e !== null && dn(e.root, e);
	}
	cancel() {
		this.wait.cancel(), this.mark(null);
	}
	redrawn(e) {
		this.held?.root === e && dn(e, this.held);
	}
};
function dn(e, t) {
	if (t === null) {
		for (let t of e.querySelectorAll(sn)) t.classList.remove(b.pendingPoint);
		return;
	}
	for (let n of e.querySelectorAll(on)) n.classList.toggle(b.pendingPoint, n.getAttribute(_.point) === t.point && fn(n) === t.series);
}
function fn(e) {
	return e.getAttribute(_.series) ?? e.closest(cn)?.getAttribute(_.series) ?? "";
}
//#endregion
//#region src/chart-wheel.ts
function pn(e, t, n) {
	return !Number.isFinite(e.y) || Math.abs(e.x) > Math.abs(e.y) ? 0 : Math.min(Math.max(e.y / t, -n), n);
}
function mn(e, t, n, r) {
	let i = e ?? t, a = lt(i, n, r, t.from, t.to);
	return Math.abs(a.to - a.from - (i.to - i.from)) <= _n(t) ? e : gn(a, t);
}
function hn(e, t) {
	return e === null || t === null ? e === t : e.from === t.from && e.to === t.to;
}
function gn(e, t) {
	return e.to - e.from >= t.to - t.from - _n(t) ? null : e;
}
function _n(e) {
	return (e.to - e.from) * 1e-6;
}
//#endregion
//#region src/chart-engine.ts
var Q = `.${v.root}`, vn = `.${v.canvas}`, yn = `.${v.plot}`, bn = `.${v.series}`, xn = `:scope > .${v.bands}`, Sn = `.${v.fill}`, Cn = `[${_.point}]`, wn = `.${v.area}`, Tn = `.${b.rule}`, En = `.${v.window}`, Dn = 250, On = 1.2, kn = 800, An = 3, jn = 3, Mn = `.${v.legendEntry}`, Nn = `.${v.bar}`, Pn = `.${v.sector}`, Fn = `.${v.sectorAnchor}`, In = class {
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
	pointPress = new un(300);
	constructor(e) {
		let t = e.root;
		this.formatting = {
			numbers: e.numbers,
			temporal: e.temporal,
			strings: e.strings,
			names: e.names,
			focusReturn: e.popups.focusReturn
		}, this.tooltips = e.tooltips, this.states = e.states, this.wheel = e.wheel, this.observeSize = e.observeSize, this.readPath = e.rows.readPath;
		for (let e of t.querySelectorAll(Q)) this.adopt(e);
		e.observeComponents(t, Q, {
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
		for (let t of e.querySelectorAll(Q)) {
			let e = this.charts.get(t), n = e === void 0 ? null : He(t);
			e !== void 0 && n !== null && (e.model = Ue(n, (e) => this.formatting.strings.resolveText(e)), this.schedule(t));
		}
		an(e, this.formatting);
	}
	adopt(e) {
		let t = this.resolve(e);
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.schedule(e));
	}
	resolve(e) {
		let t = e.getAttribute(_.model) ?? "", n = e.getAttribute(_.rows) ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.rows.length = 0, r.rows.push(...Ge(e)), r.rowsText = n), r;
		let i = He(e);
		if (i === null) return null;
		let a = {
			root: e,
			model: Ue(i, (e) => this.formatting.strings.resolveText(e)),
			rows: Ge(e),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r === void 0 ? Rn(Ln(e.querySelector(En) ?? e)) : r.view,
			anchored: r?.anchored ?? !0,
			follow: !1,
			frame: null,
			width: 0,
			height: 0,
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
		t.frame = yt(t, this.formatting), qn(t), Jn(e, t.bar), this.pointPress.redrawn(e), n && this.settle(e);
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = Gn(e);
		(n.width !== t.width || n.height !== t.height) && this.schedule(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute(_.model) ?? "") || t.rowsText !== (e.getAttribute(_.rows) ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && (qe(t.rows, e.action, e.items, e.moves, t.model, this.readPath), t.model.followLatest && t.view !== null && t.anchored && (t.follow = !0), this.schedule(e.component));
	}
	applyWindow(e, t, n) {
		let r = e.closest(Q), i = r === null ? void 0 : this.charts.get(r), a = Rn(t);
		a === null ? e.removeAttribute(_.window) : e.setAttribute(_.window, JSON.stringify(a)), !(r === null || i === void 0 || n) && (i.view = a === null ? null : {
			from: a.from,
			to: a.to
		}, i.follow = !1, this.schedule(r), Hn(i));
	}
	applyGaugeValue(e, t) {
		rn(e, t, this.formatting);
	}
	answering(e) {
		return e instanceof Element && !this.states.isInert(e) ? e : null;
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element)) return;
		let t = e.target, n = t.closest(Q), r = n === null ? void 0 : this.charts.get(n), i = r?.frame ?? null;
		if (e.type !== "pointermove" || n === null || r === void 0 || i === null || i.columns.length === 0 || t.closest(wn) === null || this.states.isInert(t)) {
			this.closeShared();
			return;
		}
		let a = n.querySelector(vn), o = n.querySelector(Tn);
		if (a === null || o === null) return;
		let s = a.getBoundingClientRect();
		if (!Bn(i, e.clientX - s.left, e.clientY - s.top)) {
			this.closeShared();
			return;
		}
		let c = r.model.horizontal, l = Vn(i.columns, c ? e.clientY - s.top : e.clientX - s.left);
		(this.shared !== n || this.sharedColumn !== l) && (o.setAttribute(c ? "y" : "x", String(Math.round(l.at * 100) / 100)), o.classList.add(b.ruleOn), this.shared = n, this.sharedColumn = l, this.tooltips.show(o, l.text, { delay: !0 }));
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(Tn)?.classList.remove(b.ruleOn), this.shared = null, this.sharedColumn = null, this.tooltips.hide());
	}
	zoomable(e) {
		let t = this.answering(e.target), n = t?.closest(Q) ?? null, r = n === null ? void 0 : this.charts.get(n), i = n?.querySelector(vn) ?? null;
		if (!(e instanceof MouseEvent) || t === null || n === null || r === void 0 || !r.model.zoomable || r.frame === null || i === null) return null;
		let a = i.getBoundingClientRect();
		return t.closest(wn) === null || !Bn(r.frame, e.clientX - a.left, e.clientY - a.top) ? null : {
			root: n,
			entry: r,
			frame: r.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e);
		if (t === null || !(e instanceof WheelEvent)) return;
		let n = pn(this.wheel.pixels(e, kn), this.wheel.notch, An);
		if (n === 0) return;
		let { entry: r, frame: i } = t, a = r.view ?? i.whole, o = oe({
			...i.x,
			min: a.from,
			max: a.to
		}, Un(e, t.root, i, r.model.horizontal)), s = mn(r.view, i.whole, o, On ** n);
		hn(s, r.view) || (e.preventDefault(), r.view = s, r.follow = !1, this.schedule(t.root), Hn(r), this.settle(t.root));
	}
	settle(e) {
		let t = this.settling.get(e);
		t !== void 0 && window.clearTimeout(t), this.settling.set(e, window.setTimeout(() => this.send(e), Dn));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(En);
		if (this.settling.delete(e), t === void 0 || n === null || this.states.isInert(e)) return;
		let r = t.view === null ? "" : JSON.stringify({
			from: t.view.from,
			to: t.view.to
		});
		r.length === 0 ? n.removeAttribute(_.window) : n.setAttribute(_.window, r), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent(S.windowChange, { bubbles: !0 }));
	}
	onDragStart(e) {
		this.dragged = !1;
		let t = this.zoomable(e);
		if (t === null || !(e instanceof PointerEvent) || e.button !== 0) return;
		this.drag = {
			root: t.root,
			start: Wn(e, t.entry.model.horizontal),
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
		let r = n.model.horizontal, i = Wn(e, r);
		if (t.moved = Math.max(t.moved, Math.abs(i - t.start)), t.moved <= jn) return;
		let a = r ? n.frame.plot.height : n.frame.plot.width, o = t.window.to - t.window.from, s = a > 0 ? (t.start - i) / a * o : 0;
		t.root.classList.add(b.dragging), n.view = ut(t.window, s, n.frame.whole.from, n.frame.whole.to), n.follow = !1, this.schedule(t.root), Hn(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > jn, this.drag !== null && (this.drag.root.classList.remove(b.dragging), this.dragged && this.send(this.drag.root)), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e);
		t !== null && (this.pointPress.cancel(), t.entry.view !== null && (t.entry.view = null, t.entry.anchored = !0, t.entry.follow = !1, this.schedule(t.root), this.send(t.root)));
	}
	onSeriesHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Q), n = t === null ? void 0 : this.charts.get(t);
		if (n === void 0) return;
		let r = e.type === "pointerover" ? this.answering(e.target) : null, i = r === null ? null : Kn(r);
		i !== n.front && (n.front = i, qn(n));
	}
	onBarHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Q), n = t === null ? void 0 : this.charts.get(t);
		if (t === null || n === void 0) return;
		let r = e.type === "pointerover" ? this.answering(e.target)?.closest(Nn) ?? null : null;
		n.bar = r === null ? null : {
			series: r.parentElement?.getAttribute(_.series) ?? "",
			point: r.getAttribute(_.point) ?? ""
		}, Jn(t, n.bar);
	}
	onSectorHover(e) {
		if (!(e.target instanceof Element)) return;
		if (e.type === "pointerout") {
			let t = e instanceof PointerEvent ? e.relatedTarget : null;
			this.sector !== null && this.sector.contains(e.target) && !(t instanceof Node && this.sector.contains(t)) && (this.sector = null, this.tooltips.hide());
			return;
		}
		let t = this.answering(e.target)?.closest(Pn) ?? null, n = t?.getAttribute(_.sectorTooltip) ?? null, r = t?.parentElement?.querySelector(Fn) ?? null;
		t !== null && n !== null && r !== null && t !== this.sector && (this.sector = t, this.tooltips.show(r, n, { delay: !0 }));
	}
	onPress(e) {
		if (e.defaultPrevented || this.answering(e.target) === null || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest(Cn), n = t?.closest(Q) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (t === null || n === null) return;
		let i = {
			point: t.getAttribute(_.point) ?? "",
			series: fn(t)
		}, a = () => {
			n.isConnected && !this.states.isInert(n) && n.dispatchEvent(new CustomEvent(S.pointClick, {
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
		let t = e.target.closest(Mn), n = t?.closest(Q) ?? null, r = t?.getAttribute(_.series) ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let a = i.hidden.has(r);
		return t.setAttribute("aria-pressed", a ? "false" : "true"), t.classList.toggle(b.legendOff, a), this.schedule(n), !0;
	}
};
function Ln(e) {
	let t = e.getAttribute(_.window);
	return t === null || t.length === 0 ? null : zn(t);
}
function Rn(e) {
	let t = typeof e == "string" && e.length > 0 ? zn(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function zn(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function Bn(e, t, n) {
	let r = e.plot;
	return t >= r.left && t <= r.left + r.width && n >= r.top && n <= r.top + r.height;
}
function Vn(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i].at < t ? n = i + 1 : r = i;
	}
	return n > 0 && Math.abs(e[n - 1].at - t) <= Math.abs(e[n].at - t) ? e[n - 1] : e[n];
}
function Hn(e) {
	let t = e.frame?.whole ?? null;
	e.anchored = e.view === null || t === null || e.view.to >= t.to - (t.to - t.from) * 1e-6;
}
function Un(e, t, n, r) {
	let i = t.querySelector(vn), a = r ? n.plot.height : n.plot.width;
	if (i === null || a <= 0) return .5;
	let o = i.getBoundingClientRect(), s = r ? o.top + n.plot.top : o.left + n.plot.left;
	return Math.min(Math.max((Wn(e, r) - s) / a, 0), 1);
}
function Wn(e, t) {
	return t ? e.clientY : e.clientX;
}
function Gn(e) {
	let t = e.querySelector(vn);
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
function Kn(e) {
	let t = e.closest(Mn);
	if (t !== null) return t.getAttribute(_.series);
	let n = e.closest(yn);
	return n === null || n.querySelector(xn) === null ? null : e.closest(Sn)?.getAttribute(_.series) ?? e.closest(bn)?.getAttribute(_.series) ?? null;
}
function qn(e) {
	let t = e.front !== null && !e.hidden.has(e.front) ? e.front : null;
	for (let n of e.root.querySelectorAll(`${bn}, ${Sn}`)) n.classList.toggle(b.backSeries, t !== null && n.getAttribute(_.series) !== t);
}
function Jn(e, t) {
	for (let n of e.querySelectorAll(Nn)) {
		let e = t !== null && n.getAttribute(_.point) === t.point && n.parentElement?.getAttribute(_.series) === t.series;
		n.classList.toggle(b.frontBar, e);
	}
}
//#endregion
//#region src/framework-api.ts
var Yn = 2;
function Xn() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	if (e.contractVersion !== Yn) throw Error(`NE.Standard.UI.Web.Charts was built for plugin contract ${Yn}, but the framework's client on the page implements ${String(e.contractVersion ?? "an older one")}; install the package version that matches the framework.`);
	return e;
}
//#endregion
//#region src/charts.ts
var $ = Xn(), Zn = null;
$.registerEngine((e) => {
	Zn = new In(e);
}), $.registerCollectionSink({
	kind: C.sink,
	handler: (e) => Zn?.applyChange(e)
}), $.registerValueReader({
	kind: C.window,
	read: Ln
}), $.registerDomOperation({
	kind: C.window,
	handler: (e) => Zn?.applyWindow(e.target, e.value, e.local)
}), $.registerEvent(S.windowChange, { settlesValue: !0 }), $.registerEvent(S.pointClick, { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), $.registerDomOperation({
	kind: C.gaugeValue,
	handler: (e) => Zn?.applyGaugeValue(e.target, e.value)
});
//#endregion
