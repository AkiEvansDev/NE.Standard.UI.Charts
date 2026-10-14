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
	let a = ne(e), o = a === null ? [] : [...a.children], s = o.find((e) => e === document.activeElement) ?? null;
	if (t.length === 0) {
		a?.remove(), s !== null && i(e)?.focus({ preventScroll: !0 });
		return;
	}
	a === null && (a = document.createElement("div"), a.className = v.legend, a.setAttribute(r.eventBoundary, ""), e.append(a));
	let c = D(o, t), l = a.firstElementChild;
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
function ne(e) {
	for (let t of e.children) if (t.classList.contains(v.legend)) return t;
	return null;
}
function D(e, t) {
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
	let n = ne(e), r = e.clientWidth;
	if (r === 0) return;
	let i = !1;
	if (n !== null && (t === "Start" || t === "End")) {
		let t = getComputedStyle(n);
		i = oe(r, Math.max(0, ...[...n.children].map((e) => e instanceof HTMLElement ? e.offsetWidth : 0)) + (Number.parseFloat(t.paddingLeft) || 0) + (Number.parseFloat(t.paddingRight) || 0), Number.parseFloat(getComputedStyle(e).columnGap) || 0);
	}
	e.classList.contains(x.legendUnder) !== i && e.classList.toggle(x.legendUnder, i);
}
function oe(e, t, n) {
	return e - t - n < ee;
}
function se(e, t, n, r) {
	let i = r !== null && (n === "Start" || n === "End") && !e.classList.contains(x.legendUnder), a = i ? `${Math.max(0, Math.round(t.clientHeight + r))}px` : "";
	e.classList.contains(x.turnBeside) !== i && e.classList.toggle(x.turnBeside, i), t.style.width !== a && (t.style.width = a);
}
//#endregion
//#region src/chart-ticks.ts
var ce = 200, le = 15, O = 1e3, k = 60 * O, A = 60 * k, j = 24 * A, ue = 365 * j, de = [
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
	ue
];
function fe(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n <= 0 ? 0 : (t - e.min) / n;
}
function pe(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	return e.min + t * (e.max - e.min);
}
function me(e, t) {
	return Math.min(Math.max(t, Math.min(e.min, e.max)), Math.max(e.min, e.max));
}
function M(e, t, n) {
	return e.left + fe(t, n) * e.width;
}
function N(e, t, n) {
	return e.top + (1 - fe(t, n)) * e.height;
}
function he(e, t, n) {
	return e.top + fe(t, n) * e.height;
}
function ge(e) {
	return e.left + e.width;
}
function P(e) {
	return e.top + e.height;
}
function _e(e, t, n, r) {
	let i = (n - t) / Math.max(1, r);
	if (i <= 0 || !Number.isFinite(i) || e === "Category") return 1;
	if (e === "Logarithmic") return t > 0 ? 10 ** Math.floor(Math.log10(t)) : 1;
	if (e !== "Time") return Ce(i);
	for (let e of de) if (e >= i) return e;
	return Ce(i / ue) * ue;
}
function ve(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return we(t);
	let r = _e(e, t.min, t.max, n), i = r * 1e-9, a = e === "Time" ? l(r) : 0;
	if (a > 0) return ye(t, a, i);
	e === "Category" && (r = Math.max(1, Math.ceil((Math.floor(t.max) - Math.ceil(t.min) + 1) / ce)));
	let o = Math.ceil(t.min / r) * r, s = [];
	for (let e = 0; s.length < ce; e++) {
		let n = o + e * r;
		if (n > t.max + i || !Number.isFinite(n)) break;
		(s.length === 0 || n > s[s.length - 1]) && s.push(n === 0 ? 0 : n);
	}
	return s;
}
function ye(e, t, n) {
	let r = f(u(e.min), t);
	d(r) < e.min - n && (r += t);
	let i = [];
	for (let a = d(r); a <= e.max + n && i.length < ce; a = d(r)) i.push(a === 0 ? 0 : a), r += t;
	return i;
}
function be(e, t) {
	if (e === "Category") return null;
	if (e === "Time") return t < k ? "HH:mm:ss" : t < j ? "HH:mm" : t < 30 * j ? "dd MMM" : "MMM yyyy";
	if (t >= 1) return "N0";
	let n = -Math.floor(Math.log10(t) + 1e-9);
	return `N${Math.min(le, n)}`;
}
function xe(e, t, n, r, i = !1) {
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
		return Se(e.kind, e.min ?? Math.min(o, s) - t, e.max ?? Math.max(o, s) + t);
	}
	let c = _e(e.kind, o, s, e.ticks), p = e.kind === "Time" ? l(c) : 0;
	if (p === 0) return Se(e.kind, e.min ?? Math.floor(o / c) * c, e.max ?? Math.ceil(s / c) * c);
	let m = f(u(s), p);
	return d(m) < s && (m += p), Se(e.kind, e.min ?? d(f(u(o), p)), e.max ?? d(m));
}
function Se(e, t, n) {
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
function Ce(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function we(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(ce, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
var Te = 4;
function Ee(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: M(r, t, c.x),
				y: N(r, n, c.y)
			});
			continue;
		}
		o = Ne(o, s, i, a), s = [];
	}
	return Ne(o, s, i, a);
}
function De(e, t, n, r, i, a) {
	let o = N(r, n, me(n, 0)), s = "", c = -1;
	for (let l = 0; l <= e.length; l++) {
		if (l < e.length && e[l].y !== null) {
			c < 0 && (c = l);
			continue;
		}
		c >= 0 && (s = Le(s, e, c, l - 1, t, n, r, i, a, o)), c = -1;
	}
	return s;
}
function Oe(e, t, n, r, i, a) {
	let o = [], s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: M(r, t, c.x),
				y: N(r, n, c.y)
			});
			continue;
		}
		ke(o, s, i, a), s = [];
	}
	return ke(o, s, i, a), o;
}
function ke(e, t, n, r) {
	if (!(t.length < 2)) {
		if (n) {
			Ae(e, t);
			return;
		}
		for (let n = 1; n < t.length; n++) r ? je(e, t, n) : F(e, t[n - 1].x, t[n - 1].y, t[n].x, t[n].y);
	}
}
function Ae(e, t) {
	let n = t[0].x, r = t[0].y;
	for (let i = 1; i < t.length; i++) {
		let a = (t[i - 1].x + t[i].x) / 2;
		F(e, n, r, a, r), F(e, a, r, a, t[i].y), n = a, r = t[i].y;
	}
	F(e, n, r, t[t.length - 1].x, r);
}
function je(e, t, n) {
	let r = Math.max(0, n - 2), i = Math.min(t.length - 1, n + 1), a = t[n - 1].x, o = t[n - 1].y, s = t[n].x, c = t[n].y, l = a + (s - t[r].x) / 6, u = o + (c - t[r].y) / 6, d = s - (t[i].x - a) / 6, f = c - (t[i].y - o) / 6, p = Me(a, o, l, u) + Me(l, u, d, f) + Me(d, f, s, c), m = Math.max(1, Math.ceil(p / Te)), h = a, g = o;
	for (let t = 1; t <= m; t++) {
		let n = t / m, r = 1 - n, i = r * r * r, p = 3 * r * r * n, _ = 3 * r * n * n, v = n * n * n, y = i * a + p * l + _ * d + v * s, b = i * o + p * u + _ * f + v * c;
		F(e, h, g, y, b), h = y, g = b;
	}
}
function Me(e, t, n, r) {
	return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t));
}
function F(e, t, n, r, i) {
	(t !== r || n !== i) && e.push({
		x1: t,
		y1: n,
		x2: r,
		y2: i
	});
}
function I(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 100) / 100;
	return String(t === 0 ? 0 : t);
}
function Ne(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${I(t[0].x)} ${I(t[0].y)}` + Pe(t, n, r);
}
function Pe(e, t, n) {
	if (t) return Fe(e);
	let r = "";
	for (let t = 1; t < e.length; t++) {
		if (n) {
			r += Ie(e, t);
			continue;
		}
		r += ` L${I(e[t].x)} ${I(e[t].y)}`;
	}
	return r;
}
function Fe(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${I((e[n - 1].x + e[n].x) / 2)} V${I(e[n].y)}`;
	return t + ` H${I(e[e.length - 1].x)}`;
}
function Ie(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${I(i)} ${I(a)} ${I(o)} ${I(s)} ${I(e[t].x)} ${I(e[t].y)}`;
}
function Le(e, t, n, r, i, a, o, s, c, l) {
	let u = [];
	for (let e = n; e <= r; e++) u.push({
		x: M(o, i, t[e].x),
		y: N(o, a, t[e].y)
	});
	let d = Ne(e, u, s, c);
	if (t[n].base === void 0 || t[n].base === null) return d + ` L${I(u[u.length - 1].x)} ${I(l)} L${I(u[0].x)} ${I(l)} Z`;
	let f = [];
	for (let e = r; e >= n; e--) f.push({
		x: M(o, i, t[e].x),
		y: N(o, a, t[e].base ?? 0)
	});
	return d += ` L${I(f[0].x)} ${I(f[0].y)}`, d + Pe(f, s, c) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var Re = Math.PI * 2, ze = -Math.PI / 2;
function Be(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = ze;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * Re : 0;
		n.push({
			start: r,
			sweep: e
		}), r += e;
	}
	return n;
}
function L(e, t, n) {
	return {
		x: e.x + Math.cos(n) * t,
		y: e.y + Math.sin(n) * t
	};
}
//#endregion
//#region src/chart-radar.ts
var Ve = Math.PI * 2, He = -Math.PI / 2;
function Ue(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of n) t.add(e.x);
	return [...t].sort((e, t) => e - t);
}
function R(e, t) {
	return t <= 0 ? He : He + e * Ve / t;
}
function We(e, t, n) {
	return t === null ? 0 : n * Math.min(Math.max(fe(e, me(e, t)), 0), 1);
}
function Ge(e, t, n) {
	if (n < 3) return L(e, t, He);
	let r = L(e, t, R(0, n)), i = L(e, t, R(1, n));
	return {
		x: (r.x + i.x) / 2,
		y: (r.y + i.y) / 2
	};
}
function Ke(e, t, n, r) {
	return Math.max(0, Math.min(e / 2 - n, t / 2 - r));
}
function qe(e) {
	if (e.length === 0) return "";
	let t = [`M${I(e[0].x)} ${I(e[0].y)}`];
	for (let n = 1; n < e.length; n++) t.push(`L${I(e[n].x)} ${I(e[n].y)}`);
	return `${t.join(" ")} Z`;
}
function Je(e) {
	let t = [];
	for (let n = 0; n < e.length && e.length > 1; n++) {
		let r = e[n], i = e[(n + 1) % e.length];
		F(t, r.x, r.y, i.x, i.y);
	}
	return t;
}
function Ye(e) {
	let t = Math.cos(e);
	return t > .3 ? "start" : t < -.3 ? "end" : "middle";
}
//#endregion
//#region src/chart-model.ts
function Xe(e) {
	let t = e.getAttribute(_.model);
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return null;
	}
}
function Ze(e, t) {
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
function Qe(e) {
	return e.seriesPath !== null && e.seriesPath.length > 0;
}
//#endregion
//#region src/chart-rows.ts
function $e(e, t) {
	let n = e.getAttribute(_.rows);
	if (n === null || n.length === 0) return [];
	try {
		let e = JSON.parse(n), r = [];
		for (let n of e) {
			if (!Array.isArray(n)) {
				r.push(null);
				continue;
			}
			let e = Array.isArray(n[2]) ? n[2].map((e) => z(e, t)) : [], i = Array.isArray(n[4]) ? n[4].map((e) => z(e, t)) : [], a = n.length > 3 && n[3] !== null && n[3] !== void 0 ? String(n[3]) : null;
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
function et(e) {
	let t = [];
	for (let n of e) n !== null && t.push(n);
	return t;
}
function tt(e, t, n, r, i) {
	let a = n.xPath === null ? null : r(e, n.xPath), o = a == null ? null : pt(a);
	if (Qe(n)) {
		let a = pt(r(e, n.seriesPath)), s = mt(n, a), c = s?.valuePath ?? n.valuePath, l = s?.sizePath ?? null;
		return {
			key: t,
			x: o,
			values: [c === null ? null : z(r(e, c), i)],
			series: a,
			sizes: l === null ? [] : [z(r(e, l), i)]
		};
	}
	let s = [], c = [], l = !1;
	for (let t of n.series) {
		let a = t.valuePath ?? n.valuePath;
		s.push(a === null ? null : z(r(e, a), i)), c.push(t.sizePath === null ? null : z(r(e, t.sizePath), i)), l ||= t.sizePath !== null;
	}
	return {
		key: t,
		x: o,
		values: s,
		series: null,
		sizes: l ? c : []
	};
}
function nt(e, t, n, r, i, a, o) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	let s = /* @__PURE__ */ new Set();
	for (let t of e) t !== null && s.add(t.key);
	if (t === "Move") {
		for (let t of r) ot(e, s, t.key, t.oldIndex, t.newIndex);
		return;
	}
	for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (t === "Remove") {
			let t = it(e, s, n, r.index);
			t >= 0 && at(s, e.splice(t, 1)[0]);
			continue;
		}
		let c = rt(r.item, r.key ?? n ?? "", i, a, o), l = t === "Replace" ? it(e, s, r.oldKey ?? n, r.index) : it(e, s, n, null);
		l >= 0 ? (at(s, e[l]), e[l] = c) : r.index === null || r.index < 0 || r.index >= e.length ? e.push(c) : e.splice(r.index, 0, c), c !== null && s.add(c.key);
	}
}
function rt(e, t, n, r, i) {
	if (e == null) return null;
	let a = tt(e, t, n, r, i);
	return n.xPath !== null && a.x === null ? null : a;
}
function it(e, t, n, r) {
	if (n !== null && t.has(n)) {
		for (let t = 0; t < e.length; t++) if (e[t]?.key === n) return t;
	}
	return r !== null && r >= 0 && r < e.length && e[r] === null ? r : -1;
}
function at(e, t) {
	t != null && e.delete(t.key);
}
function ot(e, t, n, r, i) {
	let a = it(e, t, n, r);
	if (a < 0) return;
	let [o] = e.splice(a, 1), s = i === null || i < 0 || i > e.length ? e.length : i;
	e.splice(s, 0, o);
}
function st(e, t, n, r) {
	let i = [], a = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), o = Qe(t), s = lt(), c = lt(), l = lt();
	for (let u = 0; u < e.length; u++) {
		let d = e[u], f = t.xPath === null ? dt(u, t.x.kind, i) : d.x === null ? null : ft(d.x, t.x.kind, i, n, r);
		if (f !== null) {
			if (ut(s, f), o) {
				ct(ht(a, d.series ?? ""), d, f, d.values.length > 0 ? d.values[0] : null, d.sizes.length > 0 ? d.sizes[0] : null, c, l);
				continue;
			}
			for (let e = 0; e < a.length; e++) ct(a[e], d, f, e < d.values.length ? d.values[e] : null, e < d.sizes.length ? d.sizes[e] : null, c, l);
		}
	}
	for (let e of a) e.drawn = e.points;
	return {
		series: a,
		categories: i,
		xMin: s.min,
		xMax: s.max,
		yMin: c.min,
		yMax: c.max,
		sizeMin: l.min,
		sizeMax: l.max
	};
}
function ct(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && ut(a, r), i !== null && ut(o, i);
}
function lt() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function ut(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function dt(e, t, n) {
	return t === "Category" ? ft(String(e), t, n, () => null, () => null) ?? e : e;
}
function ft(e, t, n, r, i) {
	if (t === "Category") {
		let t = n.indexOf(e);
		return t >= 0 ? t : (n.push(e), n.length - 1);
	}
	let a = i(e);
	if (a !== null || t !== "Time") return a;
	let o = r(e);
	return o === null ? null : h(o);
}
function z(e, t) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "boolean" ? +!!e : typeof e == "string" ? t(e) : null;
}
function pt(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function mt(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function ht(e, t) {
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
function gt(e) {
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
var _t = .002;
function B(e) {
	return e.to - e.from;
}
function V(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * _t, a = Math.min(Math.max(Number.isFinite(B(e)) && B(e) > 0 ? B(e) : r, i), r);
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
function vt(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return V(e, r, i);
	let a = B(e) * n, o = B(e) > 0 ? Math.min(Math.max((t - e.from) / B(e), 0), 1) : .5;
	return V({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function yt(e, t, n, r) {
	return V(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function bt(e, t, n) {
	return V({
		from: n - B(e),
		to: n
	}, t, n);
}
function xt(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && St(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function St(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return Ct(r, r, n) || t + 1 < e.length && Ct(r, e[t + 1].x, n) || t > 0 && Ct(e[t - 1].x, r, n);
}
function Ct(e, t, n) {
	return Math.min(e, t) <= n.to && Math.max(e, t) >= n.from;
}
//#endregion
//#region src/chart-draw.ts
var wt = "http://www.w3.org/2000/svg", H = 12, Tt = 22, Et = 16, U = 8, Dt = 16, Ot = `:scope > .${v.area} > .${v.centre}`;
function kt(e, t) {
	let n = e.root.querySelector(`.${v.canvas}`);
	if (n === null) return null;
	let r = e.model, i = st(e.rows, r, t.temporal.parse, t.numbers.parseInvariant), a = i.series.filter((t) => !e.hidden.has(t.series.key));
	r.stacked && gt(a);
	let o = xe(r.x, i.xMin, i.xMax, i.categories.length);
	e.follow && e.view !== null && (e.view = bt(e.view, o.min, o.max)), e.follow = !1;
	let s = e.view === null ? null : V(e.view, o.min, o.max), c = xt(a.map((e) => e.drawn), s), l = s === null ? o : {
		...o,
		min: s.from,
		max: s.to
	}, u = xe(r.y, c.min, c.max, 0, r.kind === S.area || r.kind === S.bar || r.kind === S.radar), d = t.numbers.readCulture(e.root), f = t.temporal.readCulture(e.root), p = {
		x: r.x.format ?? be(r.x.kind, _e(r.x.kind, l.min, l.max, r.x.ticks)),
		y: r.y.format ?? be(r.y.kind, _e(r.y.kind, u.min, u.max, r.y.ticks))
	}, m = t.colors.count(e.root), h = r.kind === S.pie ? At(r, i, p, d, f, t, m) : i.series.map((e) => ({
		key: e.series.key,
		caption: e.series.caption,
		color: dn(e, m, t.colors)
	}));
	r.legend !== "None" && te(e.root, h, e.hidden, t.names, t.focusReturn), ae(e.root, r.legend);
	let g = r.kind === S.radar ? It(n, r, i, p, d, f, t) : null, _ = n.parentElement;
	_ !== null && se(e.root, _, r.legend, r.kind === S.pie ? 0 : g === null ? null : 2 * (g.across - g.down)), jt(n, h, t);
	let y = n.getBoundingClientRect(), b = Math.round(y.width), x = Math.round(y.height);
	if (e.width = b, e.height = x, b < 2 || x < 2) return null;
	n.setAttribute("viewBox", `0 0 ${I(b)} ${I(x)}`);
	let C = document.createElementNS(wt, "svg");
	if (r.kind === S.pie) return Nt(C, e, i, b, x, p, d, f, t, m), n.replaceChildren(...C.childNodes), null;
	if (g !== null) return Lt(C, g, e, i, a, u, b, x, p, d, f, t, m), n.replaceChildren(...C.childNodes), null;
	if (r.bare) {
		let r = {
			left: 2,
			top: 2,
			width: b - 4,
			height: x - 4
		};
		return $t(C, e, a, r, l, u, i.categories, p, d, f, t, m), n.replaceChildren(...C.childNodes), {
			plot: r,
			x: l,
			whole: {
				from: o.min,
				to: o.max
			},
			columns: []
		};
	}
	let w = Gt(n), T = e.rows.length > 0, E = Wt(r.x, p.x, l, i.categories, d, f, t, w.width, T), ee = Wt(r.y, p.y, u, i.categories, d, f, t, w.width, T), ne = (r.horizontal ? E : ee).reduce((e, t) => Math.max(e, t.width), 0);
	w.release();
	let D = Kt(r, b, x, ne);
	Yt(C, r, D, l, u, E, ee), Zt(C, r, D, l, u, E, ee, b, x), $t(C, e, a, D, l, u, i.categories, p, d, f, t, m, {
		min: i.sizeMin,
		max: i.sizeMax
	}), e.rows.length === 0 && sn(C, D, t);
	let re = r.sharedTooltip ? cn(r, a, D, l, i.categories, p, d, f, t) : [];
	return re.length > 0 && un(C, D, r.horizontal), n.replaceChildren(...C.childNodes), {
		plot: D,
		x: l,
		whole: {
			from: o.min,
			to: o.max
		},
		columns: re
	};
}
function At(e, t, n, r, i, a, o) {
	return (t.series.length > 0 ? t.series[0].points : []).map((s, c) => ({
		key: s.key,
		caption: W(e.x, n.x, s.x, t.categories, r, i, a),
		color: a.colors.color(c, o)
	}));
}
function jt(e, t, n) {
	let r = t.length > 0 ? Mt(t.map((e) => e.caption), n.strings) : n.strings.text(T.label);
	e.getAttribute("aria-label") !== r && e.setAttribute("aria-label", r);
}
function Mt(e, t) {
	let n = e.length > 0 ? e[0] : "";
	for (let r = 1; r < e.length; r++) n = t.format(T.list, {
		list: n,
		next: e[r]
	});
	return n;
}
function Nt(e, t, n, r, i, a, o, s, c, l) {
	let u = t.model, d = n.series.length > 0 ? n.series[0].points : [], f = [];
	for (let e = 0; e < d.length; e++) t.hidden.has(d[e].key) || f.push({
		point: d[e],
		index: e
	});
	let p = Be(f.map((e) => e.point.y)), m = {
		x: r / 2,
		y: i / 2
	}, h = Math.min(r, i) / 2 - H, g = h * u.donut, y = q(e, "g", v.plot);
	for (let e = 0; e < f.length; e++) {
		if (p[e].sweep <= 0 || h <= 0) continue;
		let t = f[e].point, r = q(y, "g", v.series);
		r.setAttribute(_.series, t.key), r.style.setProperty(b.seriesColor, c.colors.color(f[e].index, l));
		let i = q(r, "circle", v.sector);
		if (i.setAttribute("cx", I(m.x)), i.setAttribute("cy", I(m.y)), i.setAttribute("r", I((h + g) / 2)), i.setAttribute("stroke-width", I(h - g)), i.style.setProperty(b.arcStart, Pt(p[e].start)), i.style.setProperty(b.arcSweep, Pt(p[e].sweep)), i.setAttribute(_.point, t.key), i.setAttribute(_.series, n.series[0].series.key), !u.tooltip) continue;
		let d = L(m, (h + g) / 2, p[e].start + p[e].sweep / 2), x = q(r, "circle", v.sectorAnchor);
		i.setAttribute(_.sectorTooltip, an(u, n.series[0], t.x, t.y ?? 0, n.categories, a, o, s, c)), x.setAttribute("cx", I(d.x)), x.setAttribute("cy", I(d.y)), x.setAttribute("r", "1");
	}
	Ft(y, p, m, h, g);
	let x = t.root.querySelector(Ot), S = `${I(Math.max(g, 0) * Math.SQRT2)}px`;
	x !== null && x.style.maxWidth !== S && (x.style.maxWidth = S), x?.classList.toggle(v.centreHidden, d.length === 0), d.length === 0 && sn(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, c);
}
function Pt(e) {
	return `${I(e * 180 / Math.PI)}deg`;
}
function Ft(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = L(n, i, t.start), o = L(n, r, t.start), s = q(e, "line", v.sectorEdge);
		s.setAttribute("x1", I(a.x)), s.setAttribute("y1", I(a.y)), s.setAttribute("x2", I(o.x)), s.setAttribute("y2", I(o.y));
	}
}
function It(e, t, n, r, i, a, o) {
	let s = Ue(n.series.map((e) => e.drawn)), c = s.map((e) => W(t.x, r.x, e, n.categories, i, a, o)), l = Gt(e), u = c.reduce((e, t) => Math.max(e, l.width(t)), 0);
	return l.release(), {
		spokes: s,
		names: c,
		across: u + U + H,
		down: 36
	};
}
function Lt(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	let p = n.model, m = t.spokes, h = {
		x: o / 2,
		y: s / 2
	}, g = Ke(o, s, t.across, t.down), _ = (n.rows.length > 0 || p.y.min !== null || p.y.max !== null ? ve(p.y.kind, a, p.y.ticks) : []).map((e) => ({
		value: e,
		text: W(p.y, c.y, e, [], l, u, d)
	}));
	m.length > 0 && g > 0 && Rt(e, p, t.names, _, a, h, g);
	let y = q(e, "g", v.plot), b = q(y, "g", v.bands);
	for (let e of i) Vt(y, b, p, e, m, a, h, g, r.categories, c, l, u, d, f);
	m.length > 0 && g > 0 && Ut(e, _, a, h, g, m.length), n.rows.length === 0 && sn(e, {
		left: 0,
		top: 0,
		width: o,
		height: s
	}, d);
}
function Rt(e, t, n, r, i, a, o) {
	let s = n.length;
	if (t.y.grid) {
		let t = q(e, "g", v.grid);
		for (let e of r) {
			let n = We(i, e.value, o);
			n > 0 && n < o && zt(t, v.gridLine, s, a, n);
		}
	}
	let c = q(e, "g", v.axes);
	zt(c, v.axisLine, s, a, o);
	for (let e = 0; e < s; e++) {
		let r = R(e, s), i = L(a, o, r), l = L(a, o + U, r);
		t.x.grid && J(c, v.axisLine, a.x, a.y, i.x, i.y), Y(c, v.label, n[e], l.x, Bt(r, l.y), Ye(r));
	}
}
function zt(e, t, n, r, i) {
	let a = [];
	for (let e = 0; e < n; e++) a.push(L(r, i, R(e, n)));
	fn(e, t, Je(a));
}
function Bt(e, t) {
	let n = Math.sin(e);
	return n < -.3 ? t : n > .3 ? t + 12 : t + 4;
}
function Vt(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = r.series.markers ?? n.markers, h = /* @__PURE__ */ new Map();
	for (let e of r.drawn) h.has(e.x) || h.set(e.x, e);
	let g = i.map((e) => h.get(e) ?? null), y = g.map((e, t) => L(o, We(a, e?.y ?? null, s), R(t, i.length))), x = q(e, "g", v.series), S = dn(r, p, f.colors);
	if (x.setAttribute(_.series, r.series.key), x.style.setProperty(b.seriesColor, S), Ht(t, r.series.key, S, qe(y)), fn(x, v.line, Je(y)), m || n.tooltip) for (let e = 0; e < g.length; e++) {
		let t = g[e];
		if (t === null || t.y === null) continue;
		let i = n.tooltip ? an(n, r, t.x, t.y, c, l, u, d, f) : null;
		tn(x, t.key, y[e].x, y[e].y, m ? 3 : 5, m, i, f.names);
	}
}
function Ht(e, t, n, r) {
	let i = q(e, "path", v.fill);
	i.setAttribute(_.series, t), i.style.setProperty(b.seriesColor, n), i.setAttribute("d", r);
}
function Ut(e, t, n, r, i, a) {
	let o = q(e, "g", v.axes), s = NaN;
	for (let e of t) {
		let t = We(n, e.value, i), c = Ge(r, t, a);
		t <= 0 || Number.isFinite(s) && Math.abs(c.y - s) < Dt || (s = c.y, Y(o, `${v.label} ${v.ringLabel}`, e.text, c.x, c.y + 4, "middle"));
	}
}
function Wt(e, t, n, r, i, a, o, s, c) {
	return !c && e.min === null && e.max === null ? [] : ve(e.kind, n, e.ticks).map((n) => {
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
	return e.kind === "Time" ? o.temporal.format(g(n), t, a) : o.numbers.format(n, t, i);
}
function Gt(e) {
	let t = document.createElementNS(wt, "text");
	return t.setAttribute("class", v.label), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function Kt(e, t, n, r) {
	let i = r + 16 + (qt(e).caption === null ? 0 : Et), a = Tt + (Jt(e).caption === null ? 0 : Et);
	return {
		left: i,
		top: H,
		width: Math.max(1, t - i - H),
		height: Math.max(1, n - a - H)
	};
}
function qt(e) {
	return e.horizontal ? e.x : e.y;
}
function Jt(e) {
	return e.horizontal ? e.y : e.x;
}
function G(e, t, n, r) {
	return e.horizontal ? he(t, n, r) : M(t, n, r);
}
function K(e, t, n, r) {
	return e.horizontal ? M(t, n, r) : N(t, n, r);
}
function Yt(e, t, n, r, i, a, o) {
	if (!t.x.grid && !t.y.grid) return;
	let s = q(e, "g", v.grid);
	if (t.y.grid) for (let e of o) Xt(s, n, K(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) Xt(s, n, G(t, n, r, e.value), !t.horizontal);
}
function Xt(e, t, n, r) {
	r ? J(e, v.gridLine, n, t.top, n, P(t)) : J(e, v.gridLine, t.left, n, ge(t), n);
}
function Zt(e, t, n, r, i, a, o, s, c) {
	let l = q(e, "g", v.axes);
	J(l, v.axisLine, n.left, P(n), ge(n), P(n)), J(l, v.axisLine, n.left, n.top, n.left, P(n));
	let u = t.horizontal ? o : a, d = t.horizontal ? a : o, f = -Infinity;
	for (let e of u) {
		let a = e.width / 2, o = t.horizontal ? K(t, n, i, e.value) : G(t, n, r, e.value), c = Math.min(Math.max(o, a), s - a);
		c - a < f || (f = c + a + U, Y(l, v.label, e.text, c, P(n) + 16, "middle"));
	}
	let p = NaN;
	for (let e of d) {
		let a = t.horizontal ? G(t, n, r, e.value) : K(t, n, i, e.value);
		Number.isFinite(p) && Math.abs(a - p) < Dt || (p = a, Y(l, v.label, e.text, n.left - U, a + 4, "end"));
	}
	let m = Jt(t).caption, h = qt(t).caption;
	if (m !== null && Y(l, v.caption, m, n.left + n.width / 2, c - 2, "middle"), h !== null) {
		let e = n.top + n.height / 2;
		Y(l, v.caption, h, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${I(e)})`);
	}
}
function Qt(e, t, n, r, i) {
	let a = q(e, "clipPath", "");
	n.clip === null ? n.clip = i.ensureId(a, y) : a.setAttribute("id", n.clip);
	let o = q(a, "rect", "");
	o.setAttribute("x", I(r.left)), o.setAttribute("y", I(r.top)), o.setAttribute("width", I(r.width)), o.setAttribute("height", I(r.height)), t.setAttribute("clip-path", `url(#${n.clip})`);
}
function $t(n, r, a, o, s, c, l, u, d, f, p, m, h = {
	min: Infinity,
	max: -Infinity
}) {
	let g = q(n, "g", v.plot), y = r.model;
	r.view !== null && Qt(n, g, r, o, p);
	let x = y.kind === S.area ? q(g, "g", v.bands) : null, C = y.kind === S.bar ? t(y.horizontal ? o.height : o.width, e(a.map((e) => e.drawn), s)) : 0;
	for (let e = 0; e < a.length; e++) {
		let t = a[e], n = t.series.stepped ?? y.stepped, r = t.series.smooth ?? y.smooth, w = t.series.markers ?? y.markers, T = q(g, "g", v.series), E = dn(t, m, p.colors);
		if (T.setAttribute(_.series, t.series.key), T.style.setProperty(b.seriesColor, E), y.kind === S.bar) {
			nn(T, t, e, a.length, o, s, c, C, l, u, d, f, p, y);
			continue;
		}
		if (y.kind === S.scatter) {
			for (let e = 0; e < t.drawn.length; e++) en(T, t, e, o, s, c, i(t.drawn[e].size, h.min, h.max), !0, l, u, d, f, p, y);
			continue;
		}
		if (x !== null && Ht(x, t.series.key, E, De(t.drawn, s, c, o, n, r)), fn(T, v.line, Oe(t.drawn, s, c, o, n, r)), q(T, "path", v.lineHit).setAttribute("d", Ee(t.drawn, s, c, o, n, r)), w || y.tooltip) for (let e = 0; e < t.drawn.length; e++) en(T, t, e, o, s, c, w ? 3 : 5, w, l, u, d, f, p, y);
	}
}
function en(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	let m = t.drawn[n];
	if (m.y === null) return;
	let h = !p.tooltip || p.sharedTooltip ? null : an(p, t, m.x, rn(t, n), c, l, u, d, f);
	tn(e, m.key, M(r, i, m.x), N(r, a, m.y), o, s, h, f.names);
}
function tn(e, t, n, i, a, o, s, c) {
	let l = {
		x: I(n),
		y: I(i)
	}, u = q(e, "g", v.point);
	u.setAttribute(_.point, t);
	let d = q(u, "circle", o ? v.marker : `${v.marker} ${v.bareMarker}`);
	d.setAttribute("cx", l.x), d.setAttribute("cy", l.y), d.setAttribute("r", I(a));
	let f = q(u, "circle", v.hit);
	f.setAttribute("cx", l.x), f.setAttribute("cy", l.y), f.setAttribute("r", I(r(a))), s !== null && f.setAttribute(c.tooltip, s);
}
function nn(e, t, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h = m.horizontal;
	for (let g = 0; g < t.drawn.length; g++) {
		let y = t.drawn[g];
		if (y.y === null) continue;
		let b = n(G(m, a, o, y.x), c, r, i, m.stacked), x = K(m, a, s, y.y), S = K(m, a, s, me(s, y.base ?? 0)), C = Math.min(x, S), w = Math.max(1, Math.abs(x - S)), T = q(e, "rect", v.bar);
		T.setAttribute("x", I(h ? C : b.start)), T.setAttribute("y", I(h ? b.start : C)), T.setAttribute("width", I(h ? w : b.thickness)), T.setAttribute("height", I(h ? b.thickness : w)), T.setAttribute(_.point, y.key), m.tooltip && !m.sharedTooltip && T.setAttribute(p.names.tooltip, an(m, t, y.x, rn(t, g), l, u, d, f, p));
	}
}
function rn(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function an(e, t, n, r, i, a, o, s, c) {
	let l = W(e.x, a.x, n, i, o, s, c), u = W(e.y, a.y, r, i, o, s, c);
	return on(t.series.caption, l, u, c);
}
function on(e, t, n, r) {
	return r.strings.format(T.point, {
		series: r.escape(e),
		x: r.escape(t),
		y: r.escape(n)
	});
}
function sn(e, t, n) {
	let r = n.strings.text(T.empty);
	r.length !== 0 && Y(e, v.empty, r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function cn(e, t, n, r, i, a, o, s, c) {
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
					n.push(ln(t[r].series.caption, u, c));
				}
				return f = n.join("\n"), f;
			}
		};
	});
}
function ln(e, t, n) {
	return n.strings.format(T.reading, {
		series: n.escape(e),
		value: n.escape(t)
	});
}
function un(e, t, n) {
	let r = q(e, "rect", x.rule);
	r.setAttribute("x", n ? I(t.left) : "0"), r.setAttribute("y", n ? "0" : I(t.top)), r.setAttribute("width", n ? I(t.width) : "1"), r.setAttribute("height", n ? "1" : I(t.height));
}
function dn(e, t, n) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : n.color(e.index, t);
}
function q(e, t, n) {
	let r = document.createElementNS(wt, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function fn(e, t, n) {
	let r = q(e, "g", t);
	for (let e of n) {
		let t = document.createElementNS(wt, "line");
		t.setAttribute("x1", I(e.x1)), t.setAttribute("y1", I(e.y1)), t.setAttribute("x2", I(e.x2)), t.setAttribute("y2", I(e.y2)), r.appendChild(t);
	}
}
function J(e, t, n, r, i, a) {
	let o = q(e, "line", t);
	o.setAttribute("x1", I(n)), o.setAttribute("y1", I(r)), o.setAttribute("x2", I(i)), o.setAttribute("y2", I(a));
}
function Y(e, t, n, r, i, a) {
	let o = q(e, "text", t);
	return o.setAttribute("x", I(r)), o.setAttribute("y", I(i)), o.setAttribute("text-anchor", a), o.textContent = n, o;
}
//#endregion
//#region src/chart-gauge.ts
var pn = `.${v.gauge}`, mn = `.${v.gaugeNumber}`, hn = `.${v.gaugeUnit}`;
function gn(e, t, n) {
	let r = e.getAttribute(_.gaugeFormat) ?? "N0", i = typeof t == "number" ? t : typeof t == "string" ? n.numbers.parseInvariant(t) ?? NaN : NaN, a = Number.isFinite(i), o = a ? n.numbers.format(i, r, n.numbers.readCulture(e)) : n.strings.text(T.noReading);
	e.textContent !== o && (e.textContent = o);
	let s = e.parentElement?.querySelector(hn);
	s != null && s.hidden === a && (s.hidden = !a);
}
function _n(e, t) {
	for (let n of e.querySelectorAll(pn)) {
		let e = n.querySelector(mn);
		e !== null && gn(e, n.style.getPropertyValue(b.gaugeValue).trim(), t);
	}
}
//#endregion
//#region src/chart-press.ts
var vn = `[${_.point}]`, yn = `.${x.pendingPoint}`, bn = `.${v.series}`, xn = class {
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
}, Sn = class {
	wait;
	held = null;
	constructor(e) {
		this.wait = new xn(e);
	}
	press(e, t, n) {
		this.wait.press(e, () => {
			this.held === t && this.mark(null), n();
		}), this.mark(e > 1 ? null : t);
	}
	mark(e) {
		this.held !== null && Cn(this.held.root, null), this.held = e, e !== null && Cn(e.root, e);
	}
	cancel() {
		this.wait.cancel(), this.mark(null);
	}
	redrawn(e) {
		this.held?.root === e && Cn(e, this.held);
	}
};
function Cn(e, t) {
	if (t === null) {
		for (let t of e.querySelectorAll(yn)) t.classList.remove(x.pendingPoint);
		return;
	}
	for (let n of e.querySelectorAll(vn)) n.classList.toggle(x.pendingPoint, n.getAttribute(_.point) === t.point && wn(n) === t.series);
}
function wn(e) {
	return e.getAttribute(_.series) ?? e.closest(bn)?.getAttribute(_.series) ?? "";
}
//#endregion
//#region src/chart-wheel.ts
function Tn(e, t, n) {
	return !Number.isFinite(e.y) || Math.abs(e.x) > Math.abs(e.y) ? 0 : Math.min(Math.max(e.y / t, -n), n);
}
function En(e, t, n, r) {
	let i = e ?? t, a = vt(i, n, r, t.from, t.to);
	return Math.abs(a.to - a.from - (i.to - i.from)) <= kn(t) ? e : On(a, t);
}
function Dn(e, t) {
	return e === null || t === null ? e === t : e.from === t.from && e.to === t.to;
}
function On(e, t) {
	return e.to - e.from >= t.to - t.from - kn(t) ? null : e;
}
function kn(e) {
	return (e.to - e.from) * 1e-6;
}
//#endregion
//#region src/chart-words.ts
var An = `.${v.sector}`, jn = `.${v.sectorAnchor}`;
function Mn(e) {
	let t = e.closest(An), n = t?.getAttribute(_.sectorTooltip) ?? null, r = t?.parentElement?.querySelector(jn) ?? null;
	return t === null || n === null || r === null ? null : {
		sector: t,
		anchor: r,
		words: n
	};
}
function Nn(e, t, n) {
	let r = Mn(e);
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
var X = `.${v.root}`, Pn = `.${v.canvas}`, Fn = `.${v.plot}`, In = `.${v.series}`, Ln = `.${v.fill}`, Rn = `[${_.point}]`, zn = `.${v.area}`, Bn = `.${x.rule}`, Vn = `.${v.window}`, Hn = 250, Un = 1.2, Wn = 800, Gn = 3, Kn = 3, qn = `.${v.legendEntry}`, Jn = `.${v.bar}`, Yn = class {
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
	pointPress = new Sn(300);
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
		for (let e of t.querySelectorAll(X)) this.adopt(e);
		e.observeComponents(t, X, {
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
		for (let t of e.querySelectorAll(X)) {
			let e = this.charts.get(t), n = e === void 0 ? null : Xe(t);
			e !== void 0 && n !== null && (e.model = Ze(n, (e) => this.formatting.strings.resolveText(e)), this.schedule(t));
		}
		_n(e, this.formatting);
	}
	adopt(e) {
		let t = this.resolve(e);
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.schedule(e));
	}
	resolve(e) {
		let t = e.getAttribute(_.model) ?? "", n = e.getAttribute(_.rows) ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.slots.length = 0, r.slots.push(...$e(e, this.formatting.numbers.parseInvariant)), r.rows = et(r.slots), r.rowsText = n), r;
		let i = Xe(e);
		if (i === null) return null;
		let a = Ze(i, (e) => this.formatting.strings.resolveText(e)), o = $e(e, this.formatting.numbers.parseInvariant), s = {
			root: e,
			model: a,
			slots: o,
			rows: et(o),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r === void 0 ? Zn(Xn(e.querySelector(Vn) ?? e)) : r.view,
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
		let n = t.follow && t.view !== null;
		t.frame = kt(t, this.formatting), sr(t), this.pointPress.redrawn(e), n && this.settle(e);
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = ir(e);
		(n.width !== t.width || n.height !== t.height) && this.schedule(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute(_.model) ?? "") || t.rowsText !== (e.getAttribute(_.rows) ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && (nt(t.slots, e.action, e.items, e.moves, t.model, this.readPath, this.formatting.numbers.parseInvariant), t.rows = et(t.slots), t.model.followLatest && t.view !== null && t.anchored && (t.follow = !0), this.schedule(e.component));
	}
	applyWindow(e, t, n) {
		let r = e.closest(X), i = r === null ? void 0 : this.charts.get(r), a = Zn(t);
		a === null ? e.removeAttribute(_.window) : e.setAttribute(_.window, JSON.stringify(a)), !(r === null || i === void 0 || n) && (i.view = a === null ? null : {
			from: a.from,
			to: a.to
		}, i.follow = !1, this.schedule(r), tr(i));
	}
	applyGaugeValue(e, t) {
		gn(e, t, this.formatting);
	}
	answering(e) {
		return e instanceof Element && !this.states.isInert(e) ? e : null;
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element) || Z(e)) return;
		let t = e.target, n = t.closest(X), r = n === null ? void 0 : this.charts.get(n);
		e.type === "pointerout" && n !== null && e.relatedTarget instanceof Element && e.relatedTarget.closest(zn) !== null && n.contains(e.relatedTarget) || (e.type !== "pointermove" || n === null || r === void 0 || t.closest(zn) === null || this.states.isInert(t) || !this.showColumn(n, r, e, !0)) && this.closeShared();
	}
	showColumn(e, t, n, r) {
		let i = t.frame, a = e.querySelector(Pn), o = e.querySelector(Bn);
		if (i === null || i.columns.length === 0 || a === null || o === null) return !1;
		let s = a.getBoundingClientRect();
		if (!$n(i, n.clientX - s.left, n.clientY - s.top)) return !1;
		let c = t.model.horizontal, l = er(i.columns, c ? n.clientY - s.top : n.clientX - s.left);
		return this.shared === e && this.sharedColumn === l || (o.setAttribute(c ? "y" : "x", String(Math.round(l.at * 100) / 100)), o.classList.add(x.ruleOn), this.shared = e, this.sharedColumn = l, this.tooltips.show(o, l.text, { delay: r }), !0);
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(Bn)?.classList.remove(x.ruleOn), this.shared = null, this.sharedColumn = null, this.tooltips.hide());
	}
	zoomable(e) {
		let t = this.answering(e.target), n = t?.closest(X) ?? null, r = n === null ? void 0 : this.charts.get(n), i = n?.querySelector(Pn) ?? null;
		if (!(e instanceof MouseEvent) || t === null || n === null || r === void 0 || !r.model.zoomable || r.frame === null || i === null) return null;
		let a = i.getBoundingClientRect();
		return t.closest(zn) === null || !$n(r.frame, e.clientX - a.left, e.clientY - a.top) ? null : {
			root: n,
			entry: r,
			frame: r.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e);
		if (t === null || !(e instanceof WheelEvent)) return;
		let n = Tn(this.wheel.pixels(e, Wn), this.wheel.notch, Gn);
		if (n === 0) return;
		let { entry: r, frame: i } = t, a = r.view ?? i.whole, o = pe({
			...i.x,
			min: a.from,
			max: a.to
		}, nr(e, t.root, i, r.model.horizontal)), s = En(r.view, i.whole, o, Un ** n);
		Dn(s, r.view) || (e.preventDefault(), r.view = s, r.follow = !1, this.schedule(t.root), tr(r), this.settle(t.root));
	}
	settle(e) {
		let t = this.settling.get(e);
		t !== void 0 && window.clearTimeout(t), this.settling.set(e, window.setTimeout(() => this.send(e), Hn));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(Vn);
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
			start: rr(e, t.entry.model.horizontal),
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
		let r = n.model.horizontal, i = rr(e, r);
		if (t.moved = Math.max(t.moved, Math.abs(i - t.start)), t.moved <= Kn) return;
		let a = r ? n.frame.plot.height : n.frame.plot.width, o = t.window.to - t.window.from, s = a > 0 ? (t.start - i) / a * o : 0;
		t.root.classList.add(x.dragging), n.view = yt(t.window, s, n.frame.whole.from, n.frame.whole.to), n.follow = !1, this.schedule(t.root), tr(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > Kn, this.drag !== null && (this.drag.root.classList.remove(x.dragging), this.dragged && this.send(this.drag.root)), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e);
		t !== null && (this.pointPress.cancel(), t.entry.view !== null && (t.entry.view = null, t.entry.anchored = !0, t.entry.follow = !1, this.schedule(t.root), this.send(t.root)));
	}
	onReadingHover(e) {
		if (!(e.target instanceof Element) || Z(e)) return;
		let t = e.target.closest(X), n = t === null ? void 0 : this.charts.get(t);
		t !== null && n !== void 0 && ar(n, this.pointedAt(t, e));
	}
	pointedAt(e, t) {
		let n = t.type === "pointerover" ? t.target : t instanceof PointerEvent ? t.relatedTarget : null;
		return n instanceof Element && e.contains(n) ? this.answering(n) : null;
	}
	onSectorHover(e) {
		if (!(e.target instanceof Element) || Z(e)) return;
		if (e.type === "pointerout") {
			let t = e instanceof PointerEvent ? e.relatedTarget : null;
			this.sector !== null && this.sector.contains(e.target) && !(t instanceof Node && this.sector.contains(t)) && (this.sector = null, this.tooltips.hide());
			return;
		}
		let t = this.answering(e.target), n = t === null ? null : Mn(t);
		n !== null && n.sector !== this.sector && (this.sector = n.sector, this.tooltips.show(n.anchor, n.words, { delay: !0 }));
	}
	onTap(e) {
		if (this.fingerTap = Z(e), !this.fingerTap) return;
		let t = this.dragged ? null : this.answering(e.target), n = t?.closest(X) ?? null, r = n === null ? void 0 : this.charts.get(n);
		this.closeShared(), this.tapped !== null && this.tapped !== n && this.letGo(this.tapped), this.tapped = r === void 0 ? null : n, r !== void 0 && ar(r, t);
	}
	letGo(e) {
		let t = this.charts.get(e);
		t !== void 0 && ar(t, null);
	}
	onTapCancel(e) {
		Z(e) && (this.fingerTap = !1, this.tapped !== null && this.letGo(this.tapped), this.tapped = null, this.closeShared());
	}
	onTapWords(e) {
		let t = this.fingerTap;
		if (this.fingerTap = !1, !t || !(e instanceof MouseEvent) || e.detail === 0) return;
		let n = this.answering(e.target), r = n?.closest(X) ?? null, i = r === null ? void 0 : this.charts.get(r);
		if (n === null || r === null || i === void 0 || r !== this.tapped || n.closest(zn) !== null && this.showColumn(r, i, e, !1)) return;
		let a = Nn(n, r, this.tooltipAttribute);
		a !== null && this.tooltips.show(a.anchor, a.words);
	}
	onPress(e) {
		if (e.defaultPrevented || this.answering(e.target) === null || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest(Rn), n = t?.closest(X) ?? null, r = n === null ? void 0 : this.charts.get(n);
		if (t === null || n === null) return;
		let i = {
			point: t.getAttribute(_.point) ?? "",
			series: wn(t)
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
		let t = e.target.closest(qn), n = t?.closest(X) ?? null, r = t?.getAttribute(_.series) ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let a = i.hidden.has(r);
		return t.setAttribute("aria-pressed", a ? "false" : "true"), t.classList.toggle(x.legendOff, a), this.schedule(n), !0;
	}
};
function Xn(e) {
	let t = e.getAttribute(_.window);
	return t === null || t.length === 0 ? null : Qn(t);
}
function Zn(e) {
	let t = typeof e == "string" && e.length > 0 ? Qn(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function Qn(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function $n(e, t, n) {
	let r = e.plot;
	return t >= r.left && t <= r.left + r.width && n >= r.top && n <= r.top + r.height;
}
function er(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i].at < t ? n = i + 1 : r = i;
	}
	return n > 0 && Math.abs(e[n - 1].at - t) <= Math.abs(e[n].at - t) ? e[n - 1] : e[n];
}
function tr(e) {
	let t = e.frame?.whole ?? null;
	e.anchored = e.view === null || t === null || e.view.to >= t.to - (t.to - t.from) * 1e-6;
}
function nr(e, t, n, r) {
	let i = t.querySelector(Pn), a = r ? n.plot.height : n.plot.width;
	if (i === null || a <= 0) return .5;
	let o = i.getBoundingClientRect(), s = r ? o.top + n.plot.top : o.left + n.plot.left;
	return Math.min(Math.max((rr(e, r) - s) / a, 0), 1);
}
function rr(e, t) {
	return t ? e.clientY : e.clientX;
}
function ir(e) {
	let t = e.querySelector(Pn);
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
function Z(e) {
	return e instanceof PointerEvent && e.pointerType === "touch";
}
function ar(e, t) {
	let n = t === null ? null : or(t), r = t?.closest(Jn) ?? null, i = r === null ? null : {
		series: r.parentElement?.getAttribute(_.series) ?? "",
		point: r.getAttribute(_.point) ?? ""
	};
	if (n === e.front && i?.series === e.bar?.series && i?.point === e.bar?.point) return;
	let a = n !== e.front;
	e.front = n, e.bar = i, a ? sr(e) : lr(e);
}
function or(e) {
	let t = e.closest(qn);
	return t === null ? e.closest(Fn) === null || e.closest(Jn) !== null ? null : e.closest(Ln)?.getAttribute(_.series) ?? e.closest(In)?.getAttribute(_.series) ?? null : t.getAttribute(_.series);
}
function sr(e) {
	let t = cr(e);
	for (let n of e.root.querySelectorAll(`${In}, ${Ln}`)) n.classList.toggle(x.backSeries, t !== null && n.getAttribute(_.series) !== t && n.querySelector(Jn) === null);
	lr(e);
}
function cr(e) {
	return e.front !== null && !e.hidden.has(e.front) ? e.front : null;
}
function lr(e) {
	let t = cr(e), n = e.bar;
	for (let r of e.root.querySelectorAll(Jn)) {
		let e = r.parentElement?.getAttribute(_.series), i = n !== null && r.getAttribute(_.point) === n.point && e === n.series;
		r.classList.toggle(x.frontBar, i), r.classList.toggle(x.backBar, !i && (n !== null || t !== null && e !== t));
	}
}
//#endregion
//#region src/framework-api.ts
var ur = 4;
function dr() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	if (e.contractVersion !== ur) throw Error(`NE.Standard.UI.Web.Charts was built for plugin contract ${ur}, but the framework's client on the page implements ${String(e.contractVersion ?? "an older one")}; install the package version that matches the framework.`);
	return e;
}
//#endregion
//#region src/charts.ts
var Q = dr(), $ = null;
Q.registerEngine((e) => {
	$ = new Yn(e);
}), Q.registerCollectionSink({
	kind: w.sink,
	handler: (e) => $?.applyChange(e)
}), Q.registerValueReader({
	kind: w.window,
	read: Xn
}), Q.registerDomOperation({
	kind: w.window,
	handler: (e) => $?.applyWindow(e.target, e.value, e.local)
}), Q.registerEvent(C.windowChange, { settlesValue: !0 }), Q.registerEvent(C.pointClick, { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), Q.registerDomOperation({
	kind: w.gaugeValue,
	handler: (e) => $?.applyGaugeValue(e.target, e.value)
});
//#endregion
