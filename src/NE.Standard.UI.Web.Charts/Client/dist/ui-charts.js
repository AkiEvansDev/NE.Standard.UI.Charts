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
	backBar: "ui-chart__bar--back",
	pendingPoint: "ui-chart__point--pending",
	legendOff: "ui-chart__legend-entry--off",
	legendUnder: "ui-chart--legend-under",
	turnBeside: "ui-chart--turn-beside"
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
	reading: "ui.chart.reading",
	list: "ui.chart.list"
}, E = {
	ghostButtonClass: "ui-button--ghost",
	smallButtonClass: "ui-button--small"
}, ee = 256;
function te(e, t, n, r, i) {
	let a = D(e), o = a === null ? [] : [...a.children], s = o.find((e) => e === document.activeElement) ?? null;
	if (t.length === 0) {
		a?.remove(), s !== null && i(e)?.focus({ preventScroll: !0 });
		return;
	}
	a === null && (a = document.createElement("div"), a.className = v.legend, a.setAttribute(r.eventBoundary, ""), e.append(a));
	let c = ne(o, t), l = a.firstElementChild;
	for (let e of t) {
		let t = c.get(e.key), i = n.has(e.key);
		if (c.delete(e.key), t === void 0) {
			a.insertBefore(O(e, i, r), l);
			continue;
		}
		re(t, e, i), t === l ? l = t.nextElementSibling : a.insertBefore(t, l);
	}
	if (s === null || s === document.activeElement) return;
	let u = s.isConnected ? s : a.children[Math.min(o.indexOf(s), a.children.length - 1)];
	u instanceof HTMLElement && u.focus({ preventScroll: !0 });
}
function D(e) {
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
function O(e, t, n) {
	let r = document.createElement("button"), i = document.createElement("span"), a = document.createElement("span");
	return r.className = `${v.legendEntry} ${n.buttonClass} ${E.ghostButtonClass} ${E.smallButtonClass}`, r.type = "button", r.setAttribute(_.series, e.key), r.setAttribute("aria-pressed", t ? "false" : "true"), r.classList.toggle(x.legendOff, t), r.style.setProperty(b.seriesColor, e.color), i.className = v.legendMark, a.className = v.legendCaption, a.textContent = e.caption, r.append(i, a), r;
}
function re(e, t, n) {
	let r = e.querySelector(`.${v.legendCaption}`), i = n ? "false" : "true";
	r !== null && r.textContent !== t.caption && (r.textContent = t.caption), e instanceof HTMLElement && e.style.getPropertyValue(b.seriesColor) !== t.color && e.style.setProperty(b.seriesColor, t.color), e.getAttribute("aria-pressed") !== i && e.setAttribute("aria-pressed", i), e.classList.contains(x.legendOff) !== n && e.classList.toggle(x.legendOff, n);
}
function ie(e, t) {
	let n = D(e), r = e.clientWidth;
	if (r === 0) return;
	let i = !1;
	if (n !== null && (t === "Start" || t === "End")) {
		let t = getComputedStyle(n);
		i = ae(r, Math.max(0, ...[...n.children].map((e) => e instanceof HTMLElement ? e.offsetWidth : 0)) + (Number.parseFloat(t.paddingLeft) || 0) + (Number.parseFloat(t.paddingRight) || 0), Number.parseFloat(getComputedStyle(e).columnGap) || 0);
	}
	e.classList.contains(x.legendUnder) !== i && e.classList.toggle(x.legendUnder, i);
}
function ae(e, t, n) {
	return e - t - n < ee;
}
function oe(e, t, n, r) {
	let i = r !== null && (n === "Start" || n === "End") && !e.classList.contains(x.legendUnder), a = i ? `${Math.max(0, Math.round(t.clientHeight + r))}px` : "";
	e.classList.contains(x.turnBeside) !== i && e.classList.toggle(x.turnBeside, i), t.style.width !== a && (t.style.width = a);
}
//#endregion
//#region src/chart-ticks.ts
var se = 200, ce = 15, k = 1e3, A = 60 * k, j = 60 * A, M = 24 * j, le = 365 * M, ue = [
	k,
	2 * k,
	5 * k,
	10 * k,
	15 * k,
	30 * k,
	A,
	2 * A,
	5 * A,
	10 * A,
	15 * A,
	30 * A,
	j,
	2 * j,
	3 * j,
	6 * j,
	12 * j,
	M,
	2 * M,
	7 * M,
	14 * M,
	30 * M,
	90 * M,
	180 * M,
	le
];
function de(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n === Infinity ? (t / 2 - e.min / 2) / (e.max / 2 - e.min / 2) : n <= 0 ? 0 : (t - e.min) / n;
}
function fe(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	let n = e.max - e.min;
	return n === Infinity ? (1 - t) * e.min + t * e.max : e.min + t * n;
}
function pe(e, t) {
	return Math.min(Math.max(t, Math.min(e.min, e.max)), Math.max(e.min, e.max));
}
function N(e, t, n) {
	return e.left + de(t, n) * e.width;
}
function P(e, t, n) {
	return e.top + (1 - de(t, n)) * e.height;
}
function me(e, t, n) {
	return e.top + de(t, n) * e.height;
}
function he(e) {
	return e.left + e.width;
}
function F(e) {
	return e.top + e.height;
}
function I(e, t, n, r) {
	let i = Math.max(1, r), a = n - t, o = a === Infinity ? n / i - t / i : a / i;
	if (o <= 0 || !Number.isFinite(o) || e === "Category") return 1;
	if (e === "Logarithmic") return t > 0 ? 10 ** Math.floor(Math.log10(t)) : 1;
	if (e !== "Time") return Se(o);
	for (let e of ue) if (e >= o) return e;
	return Se(o / le) * le;
}
function ge(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return Ce(t);
	let r = I(e, t.min, t.max, n), i = r * 1e-9, a = e === "Time" ? l(r) : 0;
	if (a > 0) return _e(t, a, i);
	e === "Category" && (r = Math.max(1, Math.ceil((Math.floor(t.max) - Math.ceil(t.min) + 1) / se)));
	let o = Math.ceil(t.min / r) * r, s = t.max - t.min === Infinity, c = [];
	for (let e = 0; e < se; e++) {
		let n = s ? 2 * (o / 2 + r / 2 * e) : o + e * r;
		if (n > t.max + i || !Number.isFinite(n)) break;
		(c.length === 0 || n > c[c.length - 1]) && c.push(n === 0 ? 0 : n);
	}
	return c;
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
	if (e === "Time") return t < A ? "HH:mm:ss" : t < M ? "HH:mm" : t < 30 * M ? "dd MMM" : "MMM yyyy";
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
			max: be(n > r ? n : r * 10),
			logarithmic: !0
		};
	}
	if (s - o <= 0) {
		let t = e.kind === "Time" ? M : Math.abs(o) > 0 ? Math.abs(o) / 8 : 1;
		return xe(e.kind, e.min ?? Math.min(o, s) - t, e.max ?? Math.max(o, s) + t);
	}
	let c = I(e.kind, o, s, e.ticks), p = e.kind === "Time" ? l(c) : 0;
	if (p === 0) return xe(e.kind, e.min ?? Math.floor(o / c) * c, e.max ?? Math.ceil(s / c) * c);
	let m = f(u(s), p);
	return d(m) < s && (m += p), xe(e.kind, e.min ?? d(f(u(o), p)), e.max ?? d(m));
}
function be(e) {
	return Math.min(Math.max(e, -Number.MAX_VALUE), Number.MAX_VALUE);
}
function xe(e, t, n) {
	if (e !== "Time") return {
		min: be(t),
		max: be(n),
		logarithmic: !1
	};
	let r = Math.min(Math.max(t, s), c), i = Math.min(Math.max(n, s), c);
	return i > r ? {
		min: r,
		max: i,
		logarithmic: !1
	} : r > -621355968e5 ? {
		min: r - M,
		max: r,
		logarithmic: !1
	} : {
		min: r,
		max: r + M,
		logarithmic: !1
	};
}
function Se(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function Ce(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(se, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
var we = 4;
function Te(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: N(r, t, c.x),
				y: P(r, n, c.y)
			});
			continue;
		}
		o = Fe(o, s, i, a), s = [];
	}
	return Fe(o, s, i, a);
}
function Ee(e, t, n, r, i, a) {
	let o = P(r, n, pe(n, 0)), s = "", c = -1;
	for (let l = 0; l <= e.length; l++) {
		if (l < e.length && e[l].y !== null) {
			c < 0 && (c = l);
			continue;
		}
		c >= 0 && (s = ze(s, e, c, l - 1, t, n, r, i, a, o)), c = -1;
	}
	return s;
}
function De(e, t, n, r, i, a) {
	let o = [], s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: N(r, t, c.x),
				y: P(r, n, c.y)
			});
			continue;
		}
		Oe(o, s, i, a, r), s = [];
	}
	return Oe(o, s, i, a, r), o;
}
function Oe(e, t, n, r, i) {
	if (!(t.length < 2)) {
		if (n) {
			ke(e, t, i);
			return;
		}
		for (let n = 1; n < t.length; n++) r ? Me(e, t, n, i) : Ae(e, i, t[n - 1].x, t[n - 1].y, t[n].x, t[n].y);
	}
}
function ke(e, t, n) {
	let r = t[0].x, i = t[0].y;
	for (let a = 1; a < t.length; a++) {
		let o = (t[a - 1].x + t[a].x) / 2;
		Ae(e, n, r, i, o, i), Ae(e, n, o, i, o, t[a].y), r = o, i = t[a].y;
	}
	Ae(e, n, r, i, t[t.length - 1].x, i);
}
function Ae(e, t, n, r, i, a) {
	je(t, Math.min(n, i), Math.max(n, i)) || Pe(e, n, r, i, a);
}
function je(e, t, n) {
	return n < e.left || t > he(e);
}
function Me(e, t, n, r) {
	let i = Math.max(0, n - 2), a = Math.min(t.length - 1, n + 1), o = t[n - 1].x, s = t[n - 1].y, c = t[n].x, l = t[n].y, u = o + (c - t[i].x) / 6, d = s + (l - t[i].y) / 6, f = c - (t[a].x - o) / 6, p = l - (t[a].y - s) / 6;
	if (je(r, Math.min(o, u, f, c), Math.max(o, u, f, c))) return;
	let m = Ne(o, s, u, d) + Ne(u, d, f, p) + Ne(f, p, c, l), h = Math.max(1, Math.min(Math.ceil(m / we), Math.ceil(2 * (r.width + r.height) / we))), g = o, _ = s;
	for (let t = 1; t <= h; t++) {
		let n = t / h, r = 1 - n, i = r * r * r, a = 3 * r * r * n, m = 3 * r * n * n, v = n * n * n, y = i * o + a * u + m * f + v * c, b = i * s + a * d + m * p + v * l;
		Pe(e, g, _, y, b), g = y, _ = b;
	}
}
function Ne(e, t, n, r) {
	return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t));
}
function Pe(e, t, n, r, i) {
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
function Fe(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${L(t[0].x)} ${L(t[0].y)}` + Ie(t, n, r);
}
function Ie(e, t, n) {
	if (t) return Le(e);
	let r = "";
	for (let t = 1; t < e.length; t++) {
		if (n) {
			r += Re(e, t);
			continue;
		}
		r += ` L${L(e[t].x)} ${L(e[t].y)}`;
	}
	return r;
}
function Le(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${L((e[n - 1].x + e[n].x) / 2)} V${L(e[n].y)}`;
	return t + ` H${L(e[e.length - 1].x)}`;
}
function Re(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${L(i)} ${L(a)} ${L(o)} ${L(s)} ${L(e[t].x)} ${L(e[t].y)}`;
}
function ze(e, t, n, r, i, a, o, s, c, l) {
	let u = [];
	for (let e = n; e <= r; e++) u.push({
		x: N(o, i, t[e].x),
		y: P(o, a, t[e].y)
	});
	let d = Fe(e, u, s, c);
	if (t[n].base === void 0 || t[n].base === null) return d + ` L${L(u[u.length - 1].x)} ${L(l)} L${L(u[0].x)} ${L(l)} Z`;
	let f = [];
	for (let e = r; e >= n; e--) f.push({
		x: N(o, i, t[e].x),
		y: P(o, a, t[e].base ?? 0)
	});
	return d += ` L${L(f[0].x)} ${L(f[0].y)}`, d + Ie(f, s, c) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var Be = Math.PI * 2, Ve = -Math.PI / 2;
function He(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = Ve;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * Be : 0;
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
var Ue = Math.PI * 2, We = -Math.PI / 2;
function Ge(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of n) t.add(e.x);
	return [...t].sort((e, t) => e - t);
}
function z(e, t) {
	return t <= 0 ? We : We + e * Ue / t;
}
function Ke(e, t, n) {
	return t === null ? 0 : n * Math.min(Math.max(de(e, pe(e, t)), 0), 1);
}
function qe(e, t, n) {
	if (n < 3) return R(e, t, We);
	let r = R(e, t, z(0, n)), i = R(e, t, z(1, n));
	return {
		x: (r.x + i.x) / 2,
		y: (r.y + i.y) / 2
	};
}
function Je(e, t, n, r) {
	return Math.max(0, Math.min(e / 2 - n, t / 2 - r));
}
function Ye(e) {
	if (e.length === 0) return "";
	let t = [`M${L(e[0].x)} ${L(e[0].y)}`];
	for (let n = 1; n < e.length; n++) t.push(`L${L(e[n].x)} ${L(e[n].y)}`);
	return `${t.join(" ")} Z`;
}
function Xe(e) {
	let t = [];
	for (let n = 0; n < e.length && e.length > 1; n++) {
		let r = e[n], i = e[(n + 1) % e.length];
		Pe(t, r.x, r.y, i.x, i.y);
	}
	return t;
}
function Ze(e) {
	let t = Math.cos(e);
	return t > .3 ? "start" : t < -.3 ? "end" : "middle";
}
//#endregion
//#region src/chart-model.ts
function Qe(e) {
	let t = e.getAttribute(_.model);
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return null;
	}
}
function $e(e, t) {
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
function et(e) {
	return e.seriesPath !== null && e.seriesPath.length > 0;
}
//#endregion
//#region src/chart-rows.ts
function tt(e, t) {
	let n = e.getAttribute(_.rows);
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
function nt(e) {
	let t = [];
	for (let n of e) n !== null && t.push(n);
	return t;
}
function rt(e, t, n, r, i) {
	let a = n.xPath === null ? null : r(e, n.xPath), o = a == null ? null : gt(a);
	if (et(n)) {
		let a = gt(r(e, n.seriesPath)), s = _t(n, a), c = s?.valuePath ?? n.valuePath, l = s?.sizePath ?? null;
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
function it(e, t, n, r, i, a, o) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	let s = /* @__PURE__ */ new Set();
	for (let t of e) t !== null && s.add(t.key);
	if (t === "Move") {
		for (let t of r) ct(e, s, t.key, t.oldIndex, t.newIndex);
		return;
	}
	for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (t === "Remove") {
			let t = ot(e, s, n, r.index);
			t >= 0 && st(s, e.splice(t, 1)[0]);
			continue;
		}
		let c = at(r.item, r.key ?? n ?? "", i, a, o), l = t === "Replace" ? ot(e, s, r.oldKey ?? n, r.index) : ot(e, s, n, null);
		l >= 0 ? (st(s, e[l]), e[l] = c) : r.index === null || r.index < 0 || r.index >= e.length ? e.push(c) : e.splice(r.index, 0, c), c !== null && s.add(c.key);
	}
}
function at(e, t, n, r, i) {
	if (e == null) return null;
	let a = rt(e, t, n, r, i);
	return n.xPath !== null && a.x === null ? null : a;
}
function ot(e, t, n, r) {
	if (n !== null && t.has(n)) {
		for (let t = 0; t < e.length; t++) if (e[t]?.key === n) return t;
	}
	return r !== null && r >= 0 && r < e.length && e[r] === null ? r : -1;
}
function st(e, t) {
	t != null && e.delete(t.key);
}
function ct(e, t, n, r, i) {
	let a = ot(e, t, n, r);
	if (a < 0) return;
	let [o] = e.splice(a, 1), s = i === null || i < 0 || i > e.length ? e.length : i;
	e.splice(s, 0, o);
}
function lt(e, t, n, r) {
	let i = /* @__PURE__ */ new Map(), a = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), o = et(t), s = t.x.kind === "Logarithmic", c = t.y.kind === "Logarithmic", l = ft(), u = ft(), d = ft();
	for (let f = 0; f < e.length; f++) {
		let p = e[f], m = t.xPath === null ? mt(f, t.x.kind, i) : p.x === null ? null : ht(p.x, t.x.kind, i, n, r);
		if (!(m === null || s && m <= 0)) {
			if (pt(l, m), o) {
				dt(vt(a, p.series ?? ""), p, m, ut(p.values.length > 0 ? p.values[0] : null, c), p.sizes.length > 0 ? p.sizes[0] : null, u, d);
				continue;
			}
			for (let e = 0; e < a.length; e++) dt(a[e], p, m, ut(e < p.values.length ? p.values[e] : null, c), e < p.sizes.length ? p.sizes[e] : null, u, d);
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
function ut(e, t) {
	return t && e !== null && e <= 0 ? null : e;
}
function dt(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && pt(a, r), i !== null && pt(o, i);
}
function ft() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function pt(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function mt(e, t, n) {
	return t === "Category" ? ht(String(e), t, n, () => null, () => null) ?? e : e;
}
function ht(e, t, n, r, i) {
	if (t === "Category") {
		let t = n.get(e);
		return t === void 0 ? (n.set(e, n.size), n.size - 1) : t;
	}
	let a = i(e);
	if (a !== null || t !== "Time") return a;
	let o = r(e);
	return o === null ? null : h(o);
}
function B(e, t) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "boolean" ? +!!e : typeof e == "string" ? t(e) : null;
}
function gt(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function _t(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function vt(e, t) {
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
function yt(e) {
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
var bt = .002;
function V(e) {
	return e.to - e.from;
}
function H(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * bt, a = Math.min(Math.max(Number.isFinite(V(e)) && V(e) > 0 ? V(e) : r, i), r);
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
function xt(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return H(e, r, i);
	let a = V(e) * n, o = V(e) > 0 ? Math.min(Math.max((t - e.from) / V(e), 0), 1) : .5;
	return H({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function St(e, t, n, r) {
	return H(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function Ct(e, t, n) {
	return {
		from: n - (Number.isFinite(V(e)) && V(e) > 0 ? V(e) : n - t),
		to: n
	};
}
function wt(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && Tt(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function Tt(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return Et(r, r, n) || t + 1 < e.length && Et(r, e[t + 1].x, n) || t > 0 && Et(e[t - 1].x, r, n);
}
function Et(e, t, n) {
	return Math.min(e, t) <= n.to && Math.max(e, t) >= n.from;
}
//#endregion
//#region src/chart-draw.ts
var Dt = "http://www.w3.org/2000/svg", U = 12, Ot = 22, kt = 16, W = 8, At = 16, jt = `:scope > .${v.area} > .${v.centre}`;
function Mt(e, t) {
	let n = e.root.querySelector(`.${v.canvas}`);
	if (n === null) return null;
	let r = e.model, i = lt(e.rows, r, t.temporal.parse, t.numbers.parseInvariant), a = i.series.filter((t) => !e.hidden.has(t.series.key));
	r.stacked && yt(a);
	let o = ye(r.x, i.xMin, i.xMax, i.categories.length), s = i.xMin > i.xMax ? null : r.x.kind === "Category" ? o.max : i.xMax;
	e.follow && e.view !== null && s !== null && s > e.view.to && (e.view = Ct(e.view, o.min, s)), e.follow = !1;
	let c = e.view === null ? null : H(e.view, o.min, o.max), l = wt(a.map((e) => e.drawn), c), u = c === null ? o : {
		...o,
		min: c.from,
		max: c.to
	}, d = ye(r.y, l.min, l.max, 0, r.kind === S.area || r.kind === S.bar || r.kind === S.radar), f = t.numbers.readCulture(e.root), p = t.temporal.readCulture(e.root), m = {
		x: r.x.format ?? ve(r.x.kind, I(r.x.kind, u.min, u.max, r.x.ticks)),
		y: r.y.format ?? ve(r.y.kind, I(r.y.kind, d.min, d.max, r.y.ticks))
	}, h = t.colors.count(e.root), g = r.kind === S.pie ? Nt(r, i, m, f, p, t, h) : i.series.map((e) => ({
		key: e.series.key,
		caption: e.series.caption,
		color: mn(e, h, t.colors)
	}));
	r.legend !== "None" && te(e.root, g, e.hidden, t.names, t.focusReturn), ie(e.root, r.legend);
	let _ = r.kind === S.radar ? zt(n, r, i, m, f, p, t) : null, y = n.parentElement;
	y !== null && oe(e.root, y, r.legend, r.kind === S.pie ? 0 : _ === null ? null : 2 * (_.across - _.down)), Pt(n, g, t);
	let b = n.getBoundingClientRect(), x = Math.round(b.width), C = Math.round(b.height);
	if (e.width = x, e.height = C, x < 2 || C < 2) return null;
	n.setAttribute("viewBox", `0 0 ${L(x)} ${L(C)}`);
	let w = document.createElementNS(Dt, "svg");
	if (r.kind === S.pie) return It(w, e, i, x, C, m, f, p, t, h), n.replaceChildren(...w.childNodes), null;
	if (_ !== null) return Bt(w, _, e, i, a, d, x, C, m, f, p, t, h), n.replaceChildren(...w.childNodes), null;
	if (r.bare) {
		let r = {
			left: 2,
			top: 2,
			width: x - 4,
			height: C - 4
		};
		return nn(w, e, a, r, u, d, i.categories, m, f, p, t, h), n.replaceChildren(...w.childNodes), {
			plot: r,
			x: u,
			whole: {
				from: o.min,
				to: o.max
			},
			newest: s,
			columns: [],
			canvas: n,
			rule: null
		};
	}
	let T = Jt(n), E = e.rows.length > 0, ee = qt(r.x, m.x, u, i.categories, f, p, t, T.width, E), D = qt(r.y, m.y, d, i.categories, f, p, t, T.width, E), ne = (r.horizontal ? ee : D).reduce((e, t) => Math.max(e, t.width), 0);
	T.release();
	let O = Yt(r, x, C, ne);
	Qt(w, r, O, u, d, ee, D), en(w, r, O, u, d, ee, D, x, C), nn(w, e, a, O, u, d, i.categories, m, f, p, t, h, {
		min: i.sizeMin,
		max: i.sizeMax
	}), e.rows.length === 0 && un(w, O, t);
	let re = r.sharedTooltip ? dn(r, a, O, u, i.categories, m, f, p, t) : [], ae = re.length > 0 ? pn(w, O, r.horizontal) : null;
	return n.replaceChildren(...w.childNodes), {
		plot: O,
		x: u,
		whole: {
			from: o.min,
			to: o.max
		},
		newest: s,
		columns: re,
		canvas: n,
		rule: ae
	};
}
function Nt(e, t, n, r, i, a, o) {
	return (t.series.length > 0 ? t.series[0].points : []).map((s, c) => ({
		key: s.key,
		caption: G(e.x, n.x, s.x, t.categories, r, i, a),
		color: a.colors.color(c, o)
	}));
}
function Pt(e, t, n) {
	let r = t.length > 0 ? Ft(t.map((e) => e.caption), n.strings) : n.strings.text(T.label);
	e.getAttribute("aria-label") !== r && e.setAttribute("aria-label", r);
}
function Ft(e, t) {
	let n = e.length > 0 ? e[0] : "";
	for (let r = 1; r < e.length; r++) n = t.format(T.list, {
		list: n,
		next: e[r]
	});
	return n;
}
function It(e, t, n, r, i, a, o, s, c, l) {
	let u = t.model, d = n.series.length > 0 ? n.series[0].points : [], f = [];
	for (let e = 0; e < d.length; e++) t.hidden.has(d[e].key) || f.push({
		point: d[e],
		index: e
	});
	let p = He(f.map((e) => e.point.y)), m = {
		x: r / 2,
		y: i / 2
	}, h = Math.min(r, i) / 2 - U, g = h * u.donut, y = J(e, "g", v.plot);
	for (let e = 0; e < f.length; e++) {
		if (p[e].sweep <= 0 || h <= 0) continue;
		let t = f[e].point, r = J(y, "g", v.series);
		r.setAttribute(_.series, t.key), r.style.setProperty(b.seriesColor, c.colors.color(f[e].index, l));
		let i = J(r, "circle", v.sector);
		if (i.setAttribute("cx", L(m.x)), i.setAttribute("cy", L(m.y)), i.setAttribute("r", L((h + g) / 2)), i.setAttribute("stroke-width", L(h - g)), i.style.setProperty(b.arcStart, Lt(p[e].start)), i.style.setProperty(b.arcSweep, Lt(p[e].sweep)), i.setAttribute(_.point, t.key), i.setAttribute(_.series, n.series[0].series.key), !u.tooltip) continue;
		let d = R(m, (h + g) / 2, p[e].start + p[e].sweep / 2), x = J(r, "circle", v.sectorAnchor);
		i.setAttribute(_.sectorTooltip, cn(u, n.series[0], t.x, t.y ?? 0, n.categories, a, o, s, c)), x.setAttribute("cx", L(d.x)), x.setAttribute("cy", L(d.y)), x.setAttribute("r", "1");
	}
	Rt(y, p, m, h, g);
	let x = t.root.querySelector(jt), S = `${L(Math.max(g, 0) * Math.SQRT2)}px`;
	x !== null && x.style.maxWidth !== S && (x.style.maxWidth = S), x?.classList.toggle(v.centreHidden, d.length === 0), d.length === 0 && un(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, c);
}
function Lt(e) {
	return `${L(e * 180 / Math.PI)}deg`;
}
function Rt(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = R(n, i, t.start), o = R(n, r, t.start), s = J(e, "line", v.sectorEdge);
		s.setAttribute("x1", L(a.x)), s.setAttribute("y1", L(a.y)), s.setAttribute("x2", L(o.x)), s.setAttribute("y2", L(o.y));
	}
}
function zt(e, t, n, r, i, a, o) {
	let s = Ge(n.series.map((e) => e.drawn)), c = s.map((e) => G(t.x, r.x, e, n.categories, i, a, o)), l = Jt(e), u = c.reduce((e, t) => Math.max(e, l.width(t)), 0);
	return l.release(), {
		spokes: s,
		names: c,
		across: u + W + U,
		down: 36
	};
}
function Bt(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	let p = n.model, m = t.spokes, h = {
		x: o / 2,
		y: s / 2
	}, g = Je(o, s, t.across, t.down), _ = (n.rows.length > 0 || p.y.min !== null || p.y.max !== null ? ge(p.y.kind, a, p.y.ticks) : []).map((e) => ({
		value: e,
		text: G(p.y, c.y, e, [], l, u, d)
	}));
	m.length > 0 && g > 0 && Vt(e, p, t.names, _, a, h, g);
	let y = J(e, "g", v.plot), b = J(y, "g", v.bands);
	for (let e of i) Wt(y, b, p, e, m, a, h, g, r.categories, c, l, u, d, f);
	m.length > 0 && g > 0 && Kt(e, _, a, h, g, m.length), n.rows.length === 0 && un(e, {
		left: 0,
		top: 0,
		width: o,
		height: s
	}, d);
}
function Vt(e, t, n, r, i, a, o) {
	let s = n.length;
	if (t.y.grid) {
		let t = J(e, "g", v.grid);
		for (let e of r) {
			let n = Ke(i, e.value, o);
			n > 0 && n < o && Ht(t, v.gridLine, s, a, n);
		}
	}
	let c = J(e, "g", v.axes);
	Ht(c, v.axisLine, s, a, o);
	for (let e = 0; e < s; e++) {
		let r = z(e, s), i = R(a, o, r), l = R(a, o + W, r);
		t.x.grid && Y(c, v.axisLine, a.x, a.y, i.x, i.y), X(c, v.label, n[e], l.x, Ut(r, l.y), Ze(r));
	}
}
function Ht(e, t, n, r, i) {
	let a = [];
	for (let e = 0; e < n; e++) a.push(R(r, i, z(e, n)));
	hn(e, t, Xe(a));
}
function Ut(e, t) {
	let n = Math.sin(e);
	return n < -.3 ? t : n > .3 ? t + 12 : t + 4;
}
function Wt(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = r.series.markers ?? n.markers, h = /* @__PURE__ */ new Map();
	for (let e of r.drawn) h.has(e.x) || h.set(e.x, e);
	let g = i.map((e) => h.get(e) ?? null), y = g.map((e, t) => R(o, Ke(a, e?.y ?? null, s), z(t, i.length))), x = J(e, "g", v.series), S = mn(r, p, f.colors);
	if (x.setAttribute(_.series, r.series.key), x.style.setProperty(b.seriesColor, S), Gt(t, r.series.key, S, Ye(y)), hn(x, v.line, Xe(y)), m || n.tooltip) for (let e = 0; e < g.length; e++) {
		let t = g[e];
		if (t === null || t.y === null) continue;
		let i = n.tooltip ? cn(n, r, t.x, t.y, c, l, u, d, f) : null;
		an(x, t.key, y[e].x, y[e].y, m ? 3 : 5, m, i, f.names);
	}
}
function Gt(e, t, n, r) {
	let i = J(e, "path", v.fill);
	i.setAttribute(_.series, t), i.style.setProperty(b.seriesColor, n), i.setAttribute("d", r);
}
function Kt(e, t, n, r, i, a) {
	let o = J(e, "g", v.axes), s = NaN;
	for (let e of t) {
		let t = Ke(n, e.value, i), c = qe(r, t, a);
		t <= 0 || Number.isFinite(s) && Math.abs(c.y - s) < At || (s = c.y, X(o, `${v.label} ${v.ringLabel}`, e.text, c.x, c.y + 4, "middle"));
	}
}
function qt(e, t, n, r, i, a, o, s, c) {
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
function Jt(e) {
	let t = document.createElementNS(Dt, "text");
	return t.setAttribute("class", v.label), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function Yt(e, t, n, r) {
	let i = r + 16 + (Xt(e).caption === null ? 0 : kt), a = Ot + (Zt(e).caption === null ? 0 : kt);
	return {
		left: i,
		top: U,
		width: Math.max(1, t - i - U),
		height: Math.max(1, n - a - U)
	};
}
function Xt(e) {
	return e.horizontal ? e.x : e.y;
}
function Zt(e) {
	return e.horizontal ? e.y : e.x;
}
function K(e, t, n, r) {
	return e.horizontal ? me(t, n, r) : N(t, n, r);
}
function q(e, t, n, r) {
	return e.horizontal ? N(t, n, r) : P(t, n, r);
}
function Qt(e, t, n, r, i, a, o) {
	if (!t.x.grid && !t.y.grid) return;
	let s = J(e, "g", v.grid);
	if (t.y.grid) for (let e of o) $t(s, n, q(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) $t(s, n, K(t, n, r, e.value), !t.horizontal);
}
function $t(e, t, n, r) {
	r ? Y(e, v.gridLine, n, t.top, n, F(t)) : Y(e, v.gridLine, t.left, n, he(t), n);
}
function en(e, t, n, r, i, a, o, s, c) {
	let l = J(e, "g", v.axes);
	Y(l, v.axisLine, n.left, F(n), he(n), F(n)), Y(l, v.axisLine, n.left, n.top, n.left, F(n));
	let u = t.horizontal ? o : a, d = t.horizontal ? a : o, f = -Infinity;
	for (let e of u) {
		let a = e.width / 2, o = t.horizontal ? q(t, n, i, e.value) : K(t, n, r, e.value), c = Math.min(Math.max(o, a), s - a);
		c - a < f || (f = c + a + W, X(l, v.label, e.text, c, F(n) + 16, "middle"));
	}
	let p = NaN;
	for (let e of d) {
		let a = t.horizontal ? K(t, n, r, e.value) : q(t, n, i, e.value);
		Number.isFinite(p) && Math.abs(a - p) < At || (p = a, X(l, v.label, e.text, n.left - W, a + 4, "end"));
	}
	let m = Zt(t).caption, h = Xt(t).caption;
	if (m !== null && X(l, v.caption, m, n.left + n.width / 2, c - 2, "middle"), h !== null) {
		let e = n.top + n.height / 2;
		X(l, v.caption, h, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${L(e)})`);
	}
}
function tn(e, t, n, r, i) {
	let a = J(e, "clipPath", "");
	n.clip === null ? n.clip = i.ensureId(a, y) : a.setAttribute("id", n.clip);
	let o = J(a, "rect", "");
	o.setAttribute("x", L(r.left)), o.setAttribute("y", L(r.top)), o.setAttribute("width", L(r.width)), o.setAttribute("height", L(r.height)), t.setAttribute("clip-path", `url(#${n.clip})`);
}
function nn(n, r, a, o, s, c, l, u, d, f, p, m, h = {
	min: Infinity,
	max: -Infinity
}) {
	let g = J(n, "g", v.plot), y = r.model;
	r.view !== null && tn(n, g, r, o, p);
	let x = y.kind === S.area ? J(g, "g", v.bands) : null, C = y.kind === S.bar ? t(y.horizontal ? o.height : o.width, e(a.map((e) => e.drawn), s)) : 0;
	for (let e = 0; e < a.length; e++) {
		let t = a[e], n = t.series.stepped ?? y.stepped, r = t.series.smooth ?? y.smooth, w = t.series.markers ?? y.markers, T = J(g, "g", v.series), E = mn(t, m, p.colors);
		if (T.setAttribute(_.series, t.series.key), T.style.setProperty(b.seriesColor, E), y.kind === S.bar) {
			on(T, t, e, a.length, o, s, c, C, l, u, d, f, p, y);
			continue;
		}
		if (y.kind === S.scatter) {
			for (let e = 0; e < t.drawn.length; e++) rn(T, t, e, o, s, c, i(t.drawn[e].size, h.min, h.max), !0, l, u, d, f, p, y);
			continue;
		}
		if (x !== null && Gt(x, t.series.key, E, Ee(t.drawn, s, c, o, n, r)), hn(T, v.line, De(t.drawn, s, c, o, n, r)), J(T, "path", v.lineHit).setAttribute("d", Te(t.drawn, s, c, o, n, r)), w || y.tooltip) for (let e = 0; e < t.drawn.length; e++) rn(T, t, e, o, s, c, w ? 3 : 5, w, l, u, d, f, p, y);
	}
}
function rn(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = t.drawn[n];
	if (m.y === null) return;
	let h = !p.tooltip || p.sharedTooltip ? null : cn(p, t, m.x, sn(t, n), c, l, u, d, f);
	an(e, m.key, N(r, i, m.x), P(r, a, m.y), o, s, h, f.names);
}
function an(e, t, n, i, a, o, s, c) {
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
function on(e, t, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h = m.horizontal;
	for (let g = 0; g < t.drawn.length; g++) {
		let y = t.drawn[g];
		if (y.y === null) continue;
		let b = n(K(m, a, o, y.x), c, r, i, m.stacked), x = q(m, a, s, y.y), S = q(m, a, s, pe(s, y.base ?? 0)), C = Math.min(x, S), w = Math.max(1, Math.abs(x - S)), T = J(e, "rect", v.bar);
		T.setAttribute("x", L(h ? C : b.start)), T.setAttribute("y", L(h ? b.start : C)), T.setAttribute("width", L(h ? w : b.thickness)), T.setAttribute("height", L(h ? b.thickness : w)), T.setAttribute(_.point, y.key), m.tooltip && !m.sharedTooltip && T.setAttribute(p.names.tooltip, cn(m, t, y.x, sn(t, g), l, u, d, f, p));
	}
}
function sn(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function cn(e, t, n, r, i, a, o, s, c) {
	let l = G(e.x, a.x, n, i, o, s, c), u = G(e.y, a.y, r, i, o, s, c);
	return ln(t.series.caption, l, u, c);
}
function ln(e, t, n, r) {
	return r.strings.format(T.point, {
		series: e,
		x: t,
		y: n
	}, !0);
}
function un(e, t, n) {
	let r = n.strings.text(T.empty);
	r.length !== 0 && X(e, v.empty, r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function dn(e, t, n, r, i, a, o, s, c) {
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
				let n = [c.escape(G(e.x, a.x, u, i, o, s, c))];
				for (let r = 0; r < t.length; r++) {
					let l = d[r];
					if (l == null) continue;
					let u = G(e.y, a.y, l, i, o, s, c);
					n.push(fn(t[r].series.caption, u, c));
				}
				return f = n.join("\n"), f;
			}
		};
	});
}
function fn(e, t, n) {
	return n.strings.format(T.reading, {
		series: e,
		value: t
	}, !0);
}
function pn(e, t, n) {
	let r = J(e, "rect", x.rule);
	return r.setAttribute("x", n ? L(t.left) : "0"), r.setAttribute("y", n ? "0" : L(t.top)), r.setAttribute("width", n ? L(t.width) : "1"), r.setAttribute("height", n ? "1" : L(t.height)), r;
}
function mn(e, t, n) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : n.color(e.index, t);
}
function J(e, t, n) {
	let r = document.createElementNS(Dt, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function hn(e, t, n) {
	let r = J(e, "g", t);
	for (let e of n) {
		let t = document.createElementNS(Dt, "line");
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
var gn = `.${v.gauge}`, _n = `.${v.gaugeNumber}`, vn = `.${v.gaugeUnit}`;
function yn(e, t, n) {
	let r = e.getAttribute(_.gaugeFormat) ?? "N0", i = typeof t == "number" ? t : typeof t == "string" ? n.numbers.parseInvariant(t) ?? NaN : NaN, a = Number.isFinite(i), o = a ? n.numbers.format(i, r, n.numbers.readCulture(e)) : n.strings.text(T.noReading);
	e.textContent !== o && (e.textContent = o);
	let s = e.parentElement?.querySelector(vn);
	s != null && s.hidden === a && (s.hidden = !a);
}
function bn(e, t) {
	for (let n of e.querySelectorAll(gn)) {
		let e = n.querySelector(_n);
		e !== null && yn(e, n.style.getPropertyValue(b.gaugeValue).trim(), t);
	}
}
//#endregion
//#region src/chart-press.ts
var xn = `[${_.point}]`, Sn = `.${x.pendingPoint}`, Cn = `.${v.series}`, wn = class {
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
}, Tn = class {
	wait;
	held = null;
	constructor(e) {
		this.wait = new wn(e);
	}
	press(e, t, n) {
		this.wait.press(e, () => {
			this.held === t && this.mark(null), n();
		}), this.mark(e > 1 ? null : t);
	}
	mark(e) {
		this.held !== null && En(this.held.root, null), this.held = e, e !== null && En(e.root, e);
	}
	cancel() {
		this.wait.cancel(), this.mark(null);
	}
	redrawn(e) {
		this.held?.root === e && En(e, this.held);
	}
};
function En(e, t) {
	if (t === null) {
		for (let t of e.querySelectorAll(Sn)) t.classList.remove(x.pendingPoint);
		return;
	}
	for (let n of e.querySelectorAll(xn)) n.classList.toggle(x.pendingPoint, n.getAttribute(_.point) === t.point && Dn(n) === t.series);
}
function Dn(e) {
	return e.getAttribute(_.series) ?? e.closest(Cn)?.getAttribute(_.series) ?? "";
}
//#endregion
//#region src/chart-wheel.ts
function On(e, t, n) {
	return !Number.isFinite(e.y) || Math.abs(e.x) > Math.abs(e.y) ? 0 : Math.min(Math.max(e.y / t, -n), n);
}
function kn(e, t, n, r) {
	let i = e ?? t, a = xt(i, n, r, t.from, t.to);
	return Math.abs(a.to - a.from - (i.to - i.from)) <= Mn(t) ? e : jn(a, t);
}
function An(e, t) {
	return e === null || t === null ? e === t : e.from === t.from && e.to === t.to;
}
function jn(e, t) {
	return e.to - e.from >= t.to - t.from - Mn(t) ? null : e;
}
function Mn(e) {
	return (e.to - e.from) * 1e-6;
}
//#endregion
//#region src/chart-words.ts
var Nn = `.${v.sector}`, Pn = `.${v.sectorAnchor}`;
function Fn(e) {
	let t = e.closest(Nn), n = t?.getAttribute(_.sectorTooltip) ?? null, r = t?.parentElement?.querySelector(Pn) ?? null;
	return t === null || n === null || r === null ? null : {
		sector: t,
		anchor: r,
		words: n
	};
}
function In(e, t, n) {
	let r = Fn(e);
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
var Z = `.${v.root}`, Ln = `.${v.canvas}`, Rn = `.${v.plot}`, zn = `.${v.series}`, Bn = `.${v.fill}`, Vn = `[${_.point}]`, Hn = `.${v.area}`, Un = `.${x.rule}`, Wn = `.${v.window}`, Gn = 250, Kn = 1.2, qn = 800, Jn = 3, Yn = 3, Xn = `.${v.legendEntry}`, Zn = `.${v.bar}`, Qn = class {
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
	pointPress = new Tn(300);
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
			attributeFilter: [_.model, _.rows]
		}, (e) => {
			for (let t of e) this.onMutated(t);
		}), e.strings.onChange(() => this.wordsChanged(t)), t.addEventListener("click", (e) => this.onPress(e), !0), t.addEventListener("pointerover", (e) => this.onReadingHover(e), !0), t.addEventListener("pointerout", (e) => this.onReadingHover(e), !0), t.addEventListener("pointerover", (e) => this.onSectorHover(e), !0), t.addEventListener("pointerout", (e) => this.onSectorHover(e), !0), t.addEventListener("wheel", (e) => this.onWheel(e), {
			capture: !0,
			passive: !1
		}), t.addEventListener("pointerdown", (e) => this.onDragStart(e), !0), t.addEventListener("dblclick", (e) => this.onReset(e), !0), t.addEventListener("pointermove", (e) => this.onSharedTooltip(e), !0), t.addEventListener("pointerout", (e) => this.onSharedTooltip(e), !0), t.addEventListener("pointerup", (e) => this.onTap(e), !0), t.addEventListener("pointercancel", (e) => this.onTapCancel(e), !0), t.addEventListener("click", (e) => this.onTapWords(e), !0);
	}
	wordsChanged(e) {
		for (let t of e.querySelectorAll(Z)) {
			let e = this.charts.get(t), n = e === void 0 ? null : Qe(t);
			e !== void 0 && n !== null && (e.model = $e(n, (e) => this.formatting.strings.resolveText(e)), this.schedule(t));
		}
		bn(e, this.formatting);
	}
	adopt(e) {
		let t = this.resolve(e);
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.schedule(e));
	}
	resolve(e) {
		let t = e.getAttribute(_.model) ?? "", n = e.getAttribute(_.rows) ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.slots.length = 0, r.slots.push(...tt(e, this.formatting.numbers.parseInvariant)), r.rows = nt(r.slots), r.rowsText = n), r;
		let i = Qe(e);
		if (i === null) return null;
		let a = $e(i, (e) => this.formatting.strings.resolveText(e)), o = tt(e, this.formatting.numbers.parseInvariant), s = {
			root: e,
			model: a,
			slots: o,
			rows: nt(o),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r === void 0 ? er($n(e.querySelector(Wn) ?? e)) : r.view,
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
		return this.charts.set(e, s), s;
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
		t.frame = Mt(t, this.formatting), dr(t), this.pointPress.redrawn(e), r && ir(t), An(t.view, n) || this.settle(e);
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = cr(e);
		(n.width !== t.width || n.height !== t.height) && this.schedule(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute(_.model) ?? "") || t.rowsText !== (e.getAttribute(_.rows) ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && (it(t.slots, e.action, e.items, e.moves, t.model, this.readPath, this.formatting.numbers.parseInvariant), t.rows = nt(t.slots), t.model.followLatest && t.view !== null && t.anchored && e.action !== "Reset" && (t.follow = !0), this.schedule(e.component));
	}
	applyWindow(e, t, n) {
		let r = e.closest(Z), i = r === null ? void 0 : this.charts.get(r), a = er(t);
		a === null ? e.removeAttribute(_.window) : e.setAttribute(_.window, JSON.stringify(a)), !(r === null || i === void 0 || n) && (this.cancelSettling(r), i.view = a === null ? null : {
			from: a.from,
			to: a.to
		}, i.follow = !1, i.moved = !1, this.schedule(r), ir(i));
	}
	cancelSettling(e) {
		let t = this.settling.get(e);
		t !== void 0 && (window.clearTimeout(t), this.settling.delete(e));
	}
	applyGaugeValue(e, t) {
		yn(e, t, this.formatting);
	}
	answering(e) {
		return e instanceof Element && !this.states.isInert(e) ? e : null;
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element) || Q(e)) return;
		let t = e.target, n = t.closest(Z), r = n === null ? void 0 : this.charts.get(n);
		e.type === "pointerout" && n !== null && e.relatedTarget instanceof Element && e.relatedTarget.closest(Hn) !== null && n.contains(e.relatedTarget) || (e.type !== "pointermove" || n === null || r === void 0 || t.closest(Hn) === null || this.states.isInert(t) || !this.showColumn(n, r, e, !0)) && this.closeShared();
	}
	showColumn(e, t, n, r) {
		let i = t.frame, a = i?.rule ?? null;
		if (i === null || i.columns.length === 0 || a === null) return !1;
		let o = i.canvas.getBoundingClientRect();
		if (!nr(i, n.clientX - o.left, n.clientY - o.top)) return !1;
		let s = t.model.horizontal, c = rr(i.columns, s ? n.clientY - o.top : n.clientX - o.left);
		return this.shared === e && this.sharedColumn === c || (a.setAttribute(s ? "y" : "x", String(Math.round(c.at * 100) / 100)), a.classList.add(x.ruleOn), this.shared = e, this.sharedColumn = c, this.tooltips.show(a, c.text, { delay: r }), !0);
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(Un)?.classList.remove(x.ruleOn), this.shared = null, this.sharedColumn = null, this.tooltips.hide());
	}
	zoomable(e) {
		let t = this.answering(e.target), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (!(e instanceof MouseEvent) || t === null || n === null || r === void 0 || !r.model.zoomable || r.frame === null) return null;
		let i = r.frame.canvas.getBoundingClientRect();
		return t.closest(Hn) === null || !nr(r.frame, e.clientX - i.left, e.clientY - i.top) ? null : {
			root: n,
			entry: r,
			frame: r.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e);
		if (t === null || !(e instanceof WheelEvent)) return;
		let n = On(this.wheel.pixels(e, qn), this.wheel.notch, Jn);
		if (n === 0) return;
		let { entry: r, frame: i } = t, a = ar(r.view, i.whole), o = a ?? i.whole, s = fe({
			...i.x,
			min: o.from,
			max: o.to
		}, or(e, i, r.model.horizontal)), c = kn(a, i.whole, s, Kn ** n);
		An(c, a) || (e.preventDefault(), r.view = c, r.follow = !1, r.moved = !0, this.schedule(t.root), ir(r), this.settle(t.root));
	}
	settle(e) {
		this.cancelSettling(e), this.settling.set(e, window.setTimeout(() => this.send(e), Gn));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(Wn);
		if (this.settling.delete(e), t === void 0) return;
		let r = t.moved;
		if (t.moved = !1, n === null || this.states.isInert(e)) return;
		let i = t.view === null ? "" : JSON.stringify({
			from: t.view.from,
			to: t.view.to
		});
		i.length === 0 ? n.removeAttribute(_.window) : n.setAttribute(_.window, i), n.dispatchEvent(new Event("change", { bubbles: !0 })), r && e.dispatchEvent(new CustomEvent(C.windowChange, { bubbles: !0 }));
	}
	onDragStart(e) {
		this.dragged = !1;
		let t = this.zoomable(e), n = t === null ? null : ar(t.entry.view, t.frame.whole);
		if (t === null || n === null || !(e instanceof PointerEvent) || e.button !== 0) return;
		this.drag = {
			root: t.root,
			start: sr(e, t.entry.model.horizontal),
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
		let r = n.model.horizontal, i = sr(e, r);
		if (t.moved = Math.max(t.moved, Math.abs(i - t.start)), t.moved <= Yn) return;
		let a = r ? n.frame.plot.height : n.frame.plot.width, o = t.window.to - t.window.from, s = a > 0 ? (t.start - i) / a * o : 0;
		t.root.classList.add(x.dragging), n.view = St(t.window, s, n.frame.whole.from, n.frame.whole.to), n.follow = !1, n.moved = !0, this.schedule(t.root), ir(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > Yn, this.drag !== null && (this.drag.root.classList.remove(x.dragging), this.dragged && this.send(this.drag.root)), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e);
		t !== null && (this.pointPress.cancel(), ar(t.entry.view, t.frame.whole) !== null && (t.entry.view = null, t.entry.anchored = !0, t.entry.follow = !1, t.entry.moved = !0, this.schedule(t.root), this.send(t.root)));
	}
	onReadingHover(e) {
		if (!(e.target instanceof Element) || Q(e)) return;
		let t = e.target.closest(Z), n = t === null ? void 0 : this.charts.get(t);
		t !== null && n !== void 0 && lr(n, this.pointedAt(t, e));
	}
	pointedAt(e, t) {
		let n = t.type === "pointerover" ? t.target : t instanceof PointerEvent ? t.relatedTarget : null;
		return n instanceof Element && e.contains(n) ? this.answering(n) : null;
	}
	onSectorHover(e) {
		if (!(e.target instanceof Element) || Q(e)) return;
		if (e.type === "pointerout") {
			let t = e instanceof PointerEvent ? e.relatedTarget : null;
			this.sector !== null && this.sector.contains(e.target) && !(t instanceof Node && this.sector.contains(t)) && (this.sector = null, this.tooltips.hide());
			return;
		}
		let t = this.answering(e.target), n = t === null ? null : Fn(t);
		n !== null && n.sector !== this.sector && (this.sector = n.sector, this.tooltips.show(n.anchor, n.words, { delay: !0 }));
	}
	onTap(e) {
		if (this.fingerTap = Q(e), !this.fingerTap) return;
		let t = this.dragged ? null : this.answering(e.target), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		this.closeShared(), this.tapped !== null && this.tapped !== n && this.letGo(this.tapped), this.tapped = r === void 0 ? null : n, r !== void 0 && lr(r, t);
	}
	letGo(e) {
		let t = this.charts.get(e);
		t !== void 0 && lr(t, null);
	}
	onTapCancel(e) {
		Q(e) && (this.fingerTap = !1, this.tapped !== null && this.letGo(this.tapped), this.tapped = null, this.closeShared());
	}
	onTapWords(e) {
		let t = this.fingerTap;
		if (this.fingerTap = !1, !t || !(e instanceof MouseEvent) || e.detail === 0) return;
		let n = this.answering(e.target), r = n?.closest(Z) ?? null, i = r === null ? void 0 : this.charts.get(r);
		if (n === null || r === null || i === void 0 || r !== this.tapped || n.closest(Hn) !== null && this.showColumn(r, i, e, !1)) return;
		let a = In(n, r, this.tooltipAttribute);
		a !== null && this.tooltips.show(a.anchor, a.words);
	}
	onPress(e) {
		if (e.defaultPrevented || this.answering(e.target) === null || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest(Vn), n = t?.closest(Z) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (t === null || n === null) return;
		let i = {
			point: t.getAttribute(_.point) ?? "",
			series: Dn(t)
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
		let t = e.target.closest(Xn), n = t?.closest(Z) ?? null, r = t?.getAttribute(_.series) ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let a = i.hidden.has(r);
		return t.setAttribute("aria-pressed", a ? "false" : "true"), t.classList.toggle(x.legendOff, a), this.schedule(n), !0;
	}
};
function $n(e) {
	let t = e.getAttribute(_.window);
	return t === null || t.length === 0 ? null : tr(t);
}
function er(e) {
	let t = typeof e == "string" && e.length > 0 ? tr(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function tr(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function nr(e, t, n) {
	let r = e.plot;
	return t >= r.left && t <= r.left + r.width && n >= r.top && n <= r.top + r.height;
}
function rr(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i].at < t ? n = i + 1 : r = i;
	}
	return n > 0 && Math.abs(e[n - 1].at - t) <= Math.abs(e[n].at - t) ? e[n - 1] : e[n];
}
function ir(e) {
	let t = e.frame, n = t === null ? null : ar(e.view, t.whole);
	e.anchored = t === null || n === null || t.newest === null || n.to >= t.newest - (t.whole.to - t.whole.from) * 1e-6;
}
function ar(e, t) {
	return e === null ? null : jn(H(e, t.from, t.to), t);
}
function or(e, t, n) {
	let r = n ? t.plot.height : t.plot.width;
	if (r <= 0) return .5;
	let i = t.canvas.getBoundingClientRect(), a = n ? i.top + t.plot.top : i.left + t.plot.left;
	return Math.min(Math.max((sr(e, n) - a) / r, 0), 1);
}
function sr(e, t) {
	return t ? e.clientY : e.clientX;
}
function cr(e) {
	let t = e.querySelector(Ln);
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
function Q(e) {
	return e instanceof PointerEvent && e.pointerType === "touch";
}
function lr(e, t) {
	let n = t === null ? null : ur(t), r = t?.closest(Zn) ?? null, i = r === null ? null : {
		series: r.parentElement?.getAttribute(_.series) ?? "",
		point: r.getAttribute(_.point) ?? ""
	};
	if (n === e.front && i?.series === e.bar?.series && i?.point === e.bar?.point) return;
	let a = n !== e.front;
	e.front = n, e.bar = i, a ? dr(e) : pr(e);
}
function ur(e) {
	let t = e.closest(Xn);
	return t === null ? e.closest(Rn) === null || e.closest(Zn) !== null ? null : e.closest(Bn)?.getAttribute(_.series) ?? e.closest(zn)?.getAttribute(_.series) ?? null : t.getAttribute(_.series);
}
function dr(e) {
	let t = fr(e);
	for (let n of e.root.querySelectorAll(`${zn}, ${Bn}`)) n.classList.toggle(x.backSeries, t !== null && n.getAttribute(_.series) !== t && n.querySelector(Zn) === null);
	pr(e);
}
function fr(e) {
	return e.front !== null && !e.hidden.has(e.front) ? e.front : null;
}
function pr(e) {
	let t = fr(e), n = e.bar;
	for (let r of e.root.querySelectorAll(Zn)) {
		let e = r.parentElement?.getAttribute(_.series), i = n !== null && r.getAttribute(_.point) === n.point && e === n.series;
		r.classList.toggle(x.frontBar, i), r.classList.toggle(x.backBar, !i && (n !== null || t !== null && e !== t));
	}
}
//#endregion
//#region src/framework-api.ts
var mr = 4;
function hr() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	if (e.contractVersion !== mr) throw Error(`NE.Standard.UI.Web.Charts was built for plugin contract ${mr}, but the framework's client on the page implements ${String(e.contractVersion ?? "an older one")}; install the package version that matches the framework.`);
	return e;
}
//#endregion
//#region src/charts.ts
var $ = hr(), gr = null;
$.registerEngine((e) => {
	gr = new Qn(e);
}), $.registerCollectionSink({
	kind: w.sink,
	handler: (e) => gr?.applyChange(e)
}), $.registerValueReader({
	kind: w.window,
	read: $n
}), $.registerDomOperation({
	kind: w.window,
	handler: (e) => gr?.applyWindow(e.target, e.value, e.local)
}), $.registerEvent(C.windowChange, { settlesValue: !0 }), $.registerEvent(C.pointClick, { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), $.registerDomOperation({
	kind: w.gaugeValue,
	handler: (e) => gr?.applyGaugeValue(e.target, e.value)
});
//#endregion
