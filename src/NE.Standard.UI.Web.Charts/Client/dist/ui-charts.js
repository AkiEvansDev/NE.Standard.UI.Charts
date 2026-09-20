function e(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of n) t.add(e.x);
	return t.size;
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
//#region src/chart-model.ts
var a = "data-ui-chart", o = "data-ui-chart-rows", s = "data-ui-chart-series", c = "data-ui-chart-window", l = "data-ui-chart-point";
function u(e) {
	let t = e.getAttribute(a);
	if (t === null || t.length === 0) return null;
	try {
		return JSON.parse(t);
	} catch {
		return null;
	}
}
function d(e) {
	return e.seriesPath !== null && e.seriesPath.length > 0;
}
//#endregion
//#region src/chart-moment.ts
function f(e) {
	return Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function p(e) {
	let t = new Date(e + new Date(e).getTimezoneOffset() * 6e4);
	return new Date(e + t.getTimezoneOffset() * 6e4);
}
//#endregion
//#region src/chart-stack.ts
function m(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = [];
		for (let r of n.points) {
			if (r.y === null) {
				e.push(r);
				continue;
			}
			let n = (t.get(r.x) ?? 0) + r.y;
			t.set(r.x, n), e.push({
				...r,
				y: n
			});
		}
		n.drawn = e;
	}
}
function h(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.x, n.y ?? 0);
	return t;
}
//#endregion
//#region src/chart-ticks.ts
var g = 1e3, _ = 60 * g, v = 60 * _, y = 24 * v, b = 365 * y, x = [
	g,
	2 * g,
	5 * g,
	10 * g,
	15 * g,
	30 * g,
	_,
	2 * _,
	5 * _,
	10 * _,
	15 * _,
	30 * _,
	v,
	2 * v,
	3 * v,
	6 * v,
	12 * v,
	y,
	2 * y,
	7 * y,
	14 * y,
	30 * y,
	90 * y,
	180 * y,
	b
];
function S(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n <= 0 ? 0 : (t - e.min) / n;
}
function C(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	return e.min + t * (e.max - e.min);
}
function w(e, t, n) {
	return e.left + S(t, n) * e.width;
}
function T(e, t, n) {
	return e.top + (1 - S(t, n)) * e.height;
}
function E(e, t, n) {
	return e.top + S(t, n) * e.height;
}
function ee(e) {
	return e.left + e.width;
}
function D(e) {
	return e.top + e.height;
}
function O(e, t, n, r) {
	let i = (n - t) / Math.max(1, r);
	if (i <= 0 || !Number.isFinite(i) || e === "Category") return 1;
	if (e !== "Time") return k(i);
	for (let e of x) if (e >= i) return e;
	return k(i / b) * b;
}
function te(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return ie(t);
	let r = O(e, t.min, t.max, n), i = Math.ceil(t.min / r) * r, a = r * 1e-9, o = [];
	for (let e = i; e <= t.max + a && o.length < 200; e += r) o.push(e === 0 ? 0 : e);
	return o;
}
function ne(e, t) {
	return e === "Category" ? null : e === "Time" ? t < _ ? "HH:mm:ss" : t < y ? "HH:mm" : t < 30 * y ? "dd MMM" : "MMM yyyy" : t >= 1 ? "N0" : t >= .1 ? "N1" : t >= .01 ? "N2" : "N3";
}
function re(e, t, n, r, i = !1) {
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
		let t = Math.abs(o) > 0 ? Math.abs(o) / 8 : 1;
		return {
			min: e.min ?? o - t,
			max: e.max ?? s + t,
			logarithmic: !1
		};
	}
	let c = O(e.kind, o, s, e.ticks);
	return {
		min: e.min ?? Math.floor(o / c) * c,
		max: e.max ?? Math.ceil(s / c) * c,
		logarithmic: !1
	};
}
function k(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function ie(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(200, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
function ae(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: w(r, t, c.x),
				y: T(r, n, c.y)
			});
			continue;
		}
		o = j(o, s, i, a), s = [];
	}
	return j(o, s, i, a);
}
function oe(e, t, n, r, i, a, o) {
	let s = T(i, r, Math.min(Math.max(0, r.min), r.max)), c = t === null ? null : h(t), l = "", u = -1;
	for (let t = 0; t <= e.length; t++) {
		if (t < e.length && e[t].y !== null) {
			u < 0 && (u = t);
			continue;
		}
		u >= 0 && (l = ue(l, e, u, t - 1, c, n, r, i, a, o, s)), u = -1;
	}
	return l;
}
function A(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 100) / 100;
	return String(t === 0 ? 0 : t);
}
function j(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${A(t[0].x)} ${A(t[0].y)}` + se(t, n, r);
}
function se(e, t, n) {
	if (t) return ce(e);
	let r = "";
	for (let t = 1; t < e.length; t++) {
		if (n) {
			r += le(e, t);
			continue;
		}
		r += ` L${A(e[t].x)} ${A(e[t].y)}`;
	}
	return r;
}
function ce(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${A((e[n - 1].x + e[n].x) / 2)} V${A(e[n].y)}`;
	return t + ` H${A(e[e.length - 1].x)}`;
}
function le(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${A(i)} ${A(a)} ${A(o)} ${A(s)} ${A(e[t].x)} ${A(e[t].y)}`;
}
function ue(e, t, n, r, i, a, o, s, c, l, u) {
	let d = [];
	for (let e = n; e <= r; e++) d.push({
		x: w(s, a, t[e].x),
		y: T(s, o, t[e].y)
	});
	let f = j(e, d, c, l);
	if (i === null) return f + ` L${A(d[d.length - 1].x)} ${A(u)} L${A(d[0].x)} ${A(u)} Z`;
	let p = [];
	for (let e = r; e >= n; e--) p.push({
		x: w(s, a, t[e].x),
		y: T(s, o, i.get(t[e].x) ?? 0)
	});
	return f += ` L${A(p[0].x)} ${A(p[0].y)}`, f + se(p, c, l) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var de = Math.PI * 2, fe = -Math.PI / 2;
function pe(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = fe;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * de : 0;
		n.push({
			start: r,
			sweep: e
		}), r += e;
	}
	return n;
}
function me(e, t, n) {
	return {
		x: e.x + Math.cos(n) * t,
		y: e.y + Math.sin(n) * t
	};
}
//#endregion
//#region src/chart-rows.ts
function he(e) {
	let t = e.getAttribute(o);
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t), n = [];
		for (let t of e) {
			if (!Array.isArray(t)) continue;
			let e = Array.isArray(t[2]) ? t[2].map((e) => P(e)) : [], r = Array.isArray(t[4]) ? t[4].map((e) => P(e)) : [], i = t.length > 3 && t[3] !== null && t[3] !== void 0 ? String(t[3]) : null;
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
function ge(e, t, n, r) {
	let i = xe(n.xPath === null ? null : r(e, n.xPath));
	if (d(n)) {
		let a = xe(r(e, n.seriesPath)), o = Se(n, a), s = o?.valuePath ?? n.valuePath, c = o?.sizePath ?? null;
		return {
			key: t,
			x: i,
			values: [s === null ? null : P(r(e, s))],
			series: a,
			sizes: c === null ? [] : [P(r(e, c))]
		};
	}
	let a = [], o = [], s = !1;
	for (let t of n.series) {
		let i = t.valuePath ?? n.valuePath;
		a.push(i === null ? null : P(r(e, i))), o.push(t.sizePath === null ? null : P(r(e, t.sizePath))), s ||= t.sizePath !== null;
	}
	return {
		key: t,
		x: i,
		values: a,
		series: null,
		sizes: s ? o : []
	};
}
function _e(e, t, n, r, i, a) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	if (t === "Move") {
		for (let t of r) we(e, t.key, t.oldIndex, t.newIndex);
		return;
	}
	for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (n === null) continue;
		if (t === "Remove") {
			let t = F(e, n);
			t >= 0 && e.splice(t, 1);
			continue;
		}
		let o = ge(r.item, r.key ?? n, i, a), s = F(e, t === "Replace" ? r.oldKey ?? n : n);
		if (s >= 0) {
			e[s] = o;
			continue;
		}
		let c = r.index;
		c === null || c < 0 || c >= e.length ? e.push(o) : e.splice(c, 0, o);
	}
}
function ve(e, t, n) {
	let r = [], i = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), a = d(t), o = M(), s = M(), c = M();
	for (let l of e) {
		let e = be(l.x, t.x.kind, r, n);
		if (e !== null) {
			if (N(o, e), a) {
				ye(Ce(i, l.series ?? ""), l, e, l.values.length > 0 ? l.values[0] : null, l.sizes.length > 0 ? l.sizes[0] : null, s, c);
				continue;
			}
			for (let t = 0; t < i.length; t++) ye(i[t], l, e, t < l.values.length ? l.values[t] : null, t < l.sizes.length ? l.sizes[t] : null, s, c);
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
function ye(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && N(a, r), i !== null && N(o, i);
}
function M() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function N(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function be(e, t, n, r) {
	if (t === "Category") {
		let t = n.indexOf(e);
		return t >= 0 ? t : (n.push(e), n.length - 1);
	}
	if (t === "Time") {
		let t = r(e);
		return t === null ? null : f(t);
	}
	let i = Number(e);
	return e.length > 0 && Number.isFinite(i) ? i : null;
}
function P(e) {
	if (typeof e == "number") return Number.isFinite(e) ? e : null;
	if (typeof e == "boolean") return +!!e;
	if (typeof e == "string" && e.length > 0) {
		let t = Number(e);
		return Number.isFinite(t) ? t : null;
	}
	return null;
}
function xe(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function Se(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function Ce(e, t) {
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
function F(e, t) {
	for (let n = 0; n < e.length; n++) if (e[n].key === t) return n;
	return -1;
}
function we(e, t, n, r) {
	let i = t === null ? n ?? -1 : F(e, t);
	if (i < 0 || i >= e.length) return;
	let [a] = e.splice(i, 1), o = r === null || r < 0 || r > e.length ? e.length : r;
	e.splice(o, 0, a);
}
//#endregion
//#region src/chart-window.ts
var Te = .002;
function I(e) {
	return e.to - e.from;
}
function L(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * Te, a = Math.min(Math.max(Number.isFinite(I(e)) && I(e) > 0 ? I(e) : r, i), r), o = Math.min(Math.max(Number.isFinite(e.from) ? e.from : t, t), n - a);
	return {
		from: o,
		to: o + a
	};
}
function Ee(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return L(e, r, i);
	let a = I(e) * n, o = I(e) > 0 ? Math.min(Math.max((t - e.from) / I(e), 0), 1) : .5;
	return L({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function De(e, t, n, r) {
	return L(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function Oe(e, t, n) {
	return L({
		from: n - I(e),
		to: n
	}, t, n);
}
function ke(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && Ae(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function Ae(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return r >= n.from && r <= n.to || t + 1 < e.length && e[t + 1].x >= n.from && e[t + 1].x <= n.to || t > 0 && e[t - 1].x >= n.from && e[t - 1].x <= n.to;
}
//#endregion
//#region src/chart-draw.ts
var je = "http://www.w3.org/2000/svg", Me = "area", R = "bar", Ne = "pie", Pe = "scatter", z = "data-ui-tooltip", Fe = "ui-chart__point", Ie = "ui-chart__marker", Le = "ui-chart__marker--bare", Re = "ui-chart__hit", ze = "ui-chart__rule", Be = "ui.chart.empty", B = 12, Ve = 22, He = 16, V = 8, Ue = 16, We = 8;
function Ge(e, t) {
	let n = e.root.querySelector(".ui-chart__canvas");
	if (n === null) return null;
	let r = n.getBoundingClientRect(), i = Math.round(r.width), a = Math.round(r.height);
	if (i < 2 || a < 2) return null;
	let o = e.model, s = ve(e.rows, o, t.temporal.parse), c = s.series.filter((t) => !e.hidden.has(t.series.key));
	o.stacked && m(c);
	let l = re(o.x, s.xMin, s.xMax, s.categories.length), u = e.view === null ? null : L(e.view, l.min, l.max), d = ke(c.map((e) => e.drawn), u), f = u === null ? l : {
		...l,
		min: u.from,
		max: u.to
	}, p = re(o.y, d.min, d.max, 0, o.kind === Me || o.kind === R), h = t.numbers.readCulture(e.root), g = t.temporal.readCulture(e.root), _ = {
		x: o.x.format ?? ne(o.x.kind, O(o.x.kind, f.min, f.max, o.x.ticks)),
		y: o.y.format ?? ne(o.y.kind, O(o.y.kind, p.min, p.max, o.y.ticks))
	};
	if (n.setAttribute("viewBox", `0 0 ${A(i)} ${A(a)}`), o.kind === Ne) return H(n), Je(n, e, s, i, a, _, h, g, t), null;
	if (o.bare) {
		let r = {
			left: 2,
			top: 2,
			width: i - 4,
			height: a - 4
		};
		return H(n), ot(n, e, s.series, r, f, p, s.categories, _, h, g, t), {
			plot: r,
			x: f,
			whole: {
				from: l.min,
				to: l.max
			},
			columns: []
		};
	}
	let v = Qe(n), y = e.rows.length > 0, b = Ze(o.x, _.x, f, s.categories, h, g, t, v.width, y), x = Ze(o.y, _.y, p, s.categories, h, g, t, v.width, y), S = (o.horizontal ? b : x).reduce((e, t) => Math.max(e, t.width), 0);
	v.release();
	let C = $e(o, i, a, S);
	H(n), nt(n, o, C, f, p, b, x), it(n, o, C, f, p, b, x, i, a), ot(n, e, s.series, C, f, p, s.categories, _, h, g, t, {
		min: s.sizeMin,
		max: s.sizeMax
	}), e.rows.length === 0 && dt(n, C, t);
	let w = o.sharedTooltip ? Ke(o, c, C, f, s.categories, _, h, g, t) : [];
	return w.length > 0 && qe(n, C), {
		plot: C,
		x: f,
		whole: {
			from: l.min,
			to: l.max
		},
		columns: w
	};
}
function Ke(e, t, n, r, i, a, o, s, c) {
	let l = [], u = /* @__PURE__ */ new Set();
	for (let e of t) for (let t of e.points) t.y !== null && !u.has(t.x) && (u.add(t.x), l.push(t.x));
	return l.sort((e, t) => e - t), l.map((l) => {
		let u = [U(e.x, a.x, l, i, o, s, c)];
		for (let n of t) {
			let t = n.points.find((e) => e.x === l && e.y !== null);
			t !== void 0 && u.push(`${n.series.caption}: ${U(e.y, a.y, t.y, i, o, s, c)}`);
		}
		return {
			at: w(n, r, l),
			text: u.join("\n")
		};
	});
}
function qe(e, t) {
	let n = K(e, "rect", ze);
	n.setAttribute("x", "0"), n.setAttribute("y", A(t.top)), n.setAttribute("width", "1"), n.setAttribute("height", A(t.height));
}
function H(e) {
	for (; e.firstChild !== null;) e.removeChild(e.firstChild);
}
function Je(e, t, n, r, i, a, o, c, u) {
	let d = t.model, f = n.series.length > 0 ? n.series[0].points : [], p = [];
	for (let e = 0; e < f.length; e++) t.hidden.has(f[e].key) || p.push({
		point: f[e],
		index: e
	});
	let m = pe(p.map((e) => e.point.y)), h = {
		x: r / 2,
		y: i / 2
	}, g = Math.min(r, i) / 2 - B, _ = g * d.donut, v = K(e, "g", "ui-chart__plot"), y = mt(t.root);
	for (let e = 0; e < p.length; e++) {
		if (m[e].sweep <= 0 || g <= 0) continue;
		let t = p[e].point, r = K(v, "g", "ui-chart__series");
		r.setAttribute(s, t.key), r.style.setProperty("--ui-chart-series-color", pt(p[e].index, y));
		let i = K(r, "circle", "ui-chart__sector");
		if (i.setAttribute("cx", A(h.x)), i.setAttribute("cy", A(h.y)), i.setAttribute("r", A((g + _) / 2)), i.setAttribute("stroke-width", A(g - _)), i.style.setProperty("--ui-arc-start", Ye(m[e].start)), i.style.setProperty("--ui-arc-sweep", Ye(m[e].sweep)), i.setAttribute(l, t.key), !d.tooltip) continue;
		let f = U(d.x, a.x, t.x, n.categories, o, c, u), b = U(d.y, a.y, t.y ?? 0, n.categories, o, c, u);
		i.setAttribute(z, `${f} — ${b}`);
	}
	Xe(v, m, h, g, _), _ > 0 && d.centreCaption !== null && J(e, "ui-chart__centre", d.centreCaption, h.x, h.y + 4, "middle"), f.length === 0 && dt(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, u);
}
function Ye(e) {
	return `${A(e * 180 / Math.PI)}deg`;
}
function Xe(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = me(n, i, t.start), o = me(n, r, t.start), s = K(e, "line", "ui-chart__sector-edge");
		s.setAttribute("x1", A(a.x)), s.setAttribute("y1", A(a.y)), s.setAttribute("x2", A(o.x)), s.setAttribute("y2", A(o.y));
	}
}
function Ze(e, t, n, r, i, a, o, s, c) {
	return !c && e.min === null && e.max === null ? [] : te(e.kind, n, e.ticks).map((n) => {
		let c = U(e, t, n, r, i, a, o);
		return {
			value: n,
			text: c,
			width: s(c)
		};
	});
}
function U(e, t, n, r, i, a, o) {
	if (e.kind === "Category") {
		let e = Math.round(n);
		return e >= 0 && e < r.length ? r[e] : "";
	}
	return e.kind === "Time" ? o.temporal.format(p(n), t, a) : o.numbers.format(n, t, i);
}
function Qe(e) {
	let t = document.createElementNS(je, "text");
	return t.setAttribute("class", "ui-chart__label"), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function $e(e, t, n, r) {
	let i = r + 16 + (et(e).caption === null ? 0 : He), a = Ve + (tt(e).caption === null ? 0 : He);
	return {
		left: i,
		top: B,
		width: Math.max(1, t - i - B),
		height: Math.max(1, n - a - B)
	};
}
function et(e) {
	return e.horizontal ? e.x : e.y;
}
function tt(e) {
	return e.horizontal ? e.y : e.x;
}
function W(e, t, n, r) {
	return e.horizontal ? E(t, n, r) : w(t, n, r);
}
function G(e, t, n, r) {
	return e.horizontal ? w(t, n, r) : T(t, n, r);
}
function nt(e, t, n, r, i, a, o) {
	if (!t.x.grid && !t.y.grid) return;
	let s = K(e, "g", "ui-chart__grid");
	if (t.y.grid) for (let e of o) rt(s, n, G(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) rt(s, n, W(t, n, r, e.value), !t.horizontal);
}
function rt(e, t, n, r) {
	r ? q(e, "ui-chart__grid-line", n, t.top, n, D(t)) : q(e, "ui-chart__grid-line", t.left, n, ee(t), n);
}
function it(e, t, n, r, i, a, o, s, c) {
	let l = K(e, "g", "ui-chart__axes");
	q(l, "ui-chart__axis-line", n.left, D(n), ee(n), D(n)), q(l, "ui-chart__axis-line", n.left, n.top, n.left, D(n));
	let u = t.horizontal ? o : a, d = t.horizontal ? a : o, f = -Infinity;
	for (let e of u) {
		let a = e.width / 2, o = t.horizontal ? G(t, n, i, e.value) : W(t, n, r, e.value), c = Math.min(Math.max(o, a), s - a);
		c - a < f || (f = c + a + V, J(l, "ui-chart__label", e.text, c, D(n) + 16, "middle"));
	}
	let p = NaN;
	for (let e of d) {
		let a = t.horizontal ? W(t, n, r, e.value) : G(t, n, i, e.value);
		Number.isFinite(p) && Math.abs(a - p) < Ue || (p = a, J(l, "ui-chart__label", e.text, n.left - V, a + 4, "end"));
	}
	let m = tt(t).caption, h = et(t).caption;
	if (m !== null && J(l, "ui-chart__caption", m, n.left + n.width / 2, c - 2, "middle"), h !== null) {
		let e = n.top + n.height / 2;
		J(l, "ui-chart__caption", h, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${A(e)})`);
	}
}
function at(e, t, n, r) {
	let i = `ui-chart-clip-${n.getAttribute("data-ui-id") ?? "0"}`, a = K(e, "clipPath", "");
	a.setAttribute("id", i);
	let o = K(a, "rect", "");
	o.setAttribute("x", A(r.left)), o.setAttribute("y", A(r.top)), o.setAttribute("width", A(r.width)), o.setAttribute("height", A(r.height)), t.setAttribute("clip-path", `url(#${i})`);
}
function ot(n, r, a, o, c, l, u, d, f, p, m, h = {
	min: Infinity,
	max: -Infinity
}) {
	let g = K(n, "g", "ui-chart__plot"), _ = mt(r.root), v = r.model;
	r.view !== null && at(n, g, r.root, o);
	let y = v.kind === R ? t(v.horizontal ? o.height : o.width, e(a.map((e) => e.drawn))) : 0, b = G(v, o, l, Math.min(Math.max(0, l.min), l.max));
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		if (r.hidden.has(t.series.key)) continue;
		let n = t.series.stepped ?? v.stepped, x = t.series.smooth ?? v.smooth, S = t.series.markers ?? v.markers, C = K(g, "g", "ui-chart__series"), w = v.stacked && e > 0 ? a[e - 1].drawn : null;
		if (C.setAttribute(s, t.series.key), C.style.setProperty("--ui-chart-series-color", ft(t, _)), v.kind === R) {
			ct(C, t, e, a.length, w, o, c, l, y, b, u, d, f, p, m, v);
			continue;
		}
		if (v.kind === Pe) {
			for (let e = 0; e < t.drawn.length; e++) st(C, t, e, o, c, l, i(t.drawn[e].size, h.min, h.max), !0, u, d, f, p, m, v);
			continue;
		}
		v.kind === Me && K(C, "path", "ui-chart__fill").setAttribute("d", oe(t.drawn, w, c, l, o, n, x));
		let T = ae(t.drawn, c, l, o, n, x);
		if (K(C, "path", "ui-chart__line").setAttribute("d", T), K(C, "path", "ui-chart__line-hit").setAttribute("d", T), S || v.tooltip) for (let e = 0; e < t.drawn.length; e++) st(C, t, e, o, c, l, S ? 3 : 5, S, u, d, f, p, m, v);
	}
}
function st(e, t, n, i, a, o, s, c, u, d, f, p, m, h) {
	let g = t.drawn[n];
	if (g.y === null) return;
	let _ = {
		x: A(w(i, a, g.x)),
		y: A(T(i, o, g.y))
	}, v = K(e, "g", Fe);
	v.setAttribute(l, g.key);
	let y = K(v, "circle", c ? Ie : `${Ie} ${Le}`);
	y.setAttribute("cx", _.x), y.setAttribute("cy", _.y), y.setAttribute("r", A(s));
	let b = K(v, "circle", Re);
	b.setAttribute("cx", _.x), b.setAttribute("cy", _.y), b.setAttribute("r", A(r(s))), h.tooltip && !h.sharedTooltip && b.setAttribute(z, ut(h, t, g.x, lt(t, n), u, d, f, p, m));
}
function ct(e, t, r, i, a, o, s, c, u, d, f, p, m, g, _, v) {
	let y = v.horizontal, b = a === null ? null : h(a);
	for (let a = 0; a < t.drawn.length; a++) {
		let h = t.drawn[a];
		if (h.y === null) continue;
		let x = n(W(v, o, s, h.x), u, r, i, v.stacked), S = G(v, o, c, h.y), C = b === null ? d : G(v, o, c, b.get(h.x) ?? 0), w = Math.min(S, C), T = Math.max(1, Math.abs(S - C)), E = K(e, "rect", "ui-chart__bar");
		E.setAttribute("x", A(y ? w : x.start)), E.setAttribute("y", A(y ? x.start : w)), E.setAttribute("width", A(y ? T : x.thickness)), E.setAttribute("height", A(y ? x.thickness : T)), E.setAttribute(l, h.key), v.tooltip && !v.sharedTooltip && E.setAttribute(z, ut(v, t, h.x, lt(t, a), f, p, m, g, _));
	}
}
function lt(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function ut(e, t, n, r, i, a, o, s, c) {
	let l = U(e.x, a.x, n, i, o, s, c), u = U(e.y, a.y, r, i, o, s, c);
	return `${t.series.caption} — ${l}: ${u}`;
}
function dt(e, t, n) {
	let r = n.strings.text(Be);
	r.length !== 0 && J(e, "ui-chart__empty", r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function ft(e, t) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : pt(e.index, t);
}
function pt(e, t) {
	return `var(--ui-color-series-${e % t + 1})`;
}
function mt(e) {
	let t = Number(getComputedStyle(e).getPropertyValue("--ui-color-series-count"));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : We;
}
function K(e, t, n) {
	let r = document.createElementNS(je, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function q(e, t, n, r, i, a) {
	let o = K(e, "line", t);
	o.setAttribute("x1", A(n)), o.setAttribute("y1", A(r)), o.setAttribute("x2", A(i)), o.setAttribute("y2", A(a));
}
function J(e, t, n, r, i, a) {
	let o = K(e, "text", t);
	return o.setAttribute("x", A(r)), o.setAttribute("y", A(i)), o.setAttribute("text-anchor", a), o.textContent = n, o;
}
//#endregion
//#region src/chart-gauge.ts
var ht = "data-ui-gauge-format", gt = "data-ui-gauge-unit", _t = "ui.chart.no-reading";
function vt(e, t, n) {
	let r = e.getAttribute(ht) ?? "N0", i = e.getAttribute(gt) ?? "", a = typeof t == "number" ? t : typeof t == "string" && t.length > 0 ? Number(t) : NaN, o = Number.isFinite(a) ? n.numbers.format(a, r, n.numbers.readCulture(e)) + i : n.strings.text(_t);
	e.textContent !== o && (e.textContent = o);
}
//#endregion
//#region src/chart-engine.ts
var Y = ".ui-chart", X = ".ui-chart__canvas", yt = ".ui-chart__series", bt = "[data-ui-chart-point]", xt = "point-click", St = ".ui-chart__area", Ct = ".ui-chart__rule", wt = "ui-chart__rule--on", Tt = ".ui-chart__window", Et = "window-change", Dt = 250, Ot = 1.2, kt = 3, At = ".ui-chart__legend-entry", jt = "ui-chart__legend-entry--off", Mt = "ui-chart__series--back", Nt = ".ui-chart__bar", Pt = ".ui-chart__bar:hover", Ft = "ui-chart__bar--front", It = class {
	charts = /* @__PURE__ */ new WeakMap();
	formatting;
	tooltips;
	observeSize;
	readPath;
	shared = null;
	drag = null;
	dragged = !1;
	settling = /* @__PURE__ */ new Map();
	constructor(e) {
		let t = e.root;
		this.formatting = {
			numbers: e.numbers,
			temporal: e.temporal,
			strings: e.strings
		}, this.tooltips = e.tooltips, this.observeSize = e.observeSize, this.readPath = e.rows.readPath;
		for (let e of t.querySelectorAll(Y)) this.adopt(e);
		e.observeComponents(t, Y, {
			childList: !0,
			attributeFilter: [a, o]
		}, (e) => {
			for (let t of e) this.onMutated(t);
		}), t.addEventListener("click", (e) => this.onPress(e), !0), t.addEventListener("pointerover", (e) => this.onLegendHover(e), !0), t.addEventListener("pointerout", (e) => this.onLegendHover(e), !0), t.addEventListener("pointerover", (e) => this.onBarHover(e), !0), t.addEventListener("pointerout", (e) => this.onBarHover(e), !0), t.addEventListener("wheel", (e) => this.onWheel(e), {
			capture: !0,
			passive: !1
		}), t.addEventListener("pointerdown", (e) => this.onDragStart(e), !0), t.addEventListener("dblclick", (e) => this.onReset(e), !0), t.addEventListener("pointermove", (e) => this.onSharedTooltip(e), !0), t.addEventListener("pointerout", (e) => this.onSharedTooltip(e), !0);
	}
	adopt(e) {
		let t = this.resolve(e);
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.redraw(e));
	}
	resolve(e) {
		let t = e.getAttribute("data-ui-chart") ?? "", n = e.getAttribute("data-ui-chart-rows") ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.rows.length = 0, r.rows.push(...he(e)), r.rowsText = n), r;
		let i = u(e);
		if (i === null) return null;
		let a = {
			root: e,
			model: i,
			rows: he(e),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r?.view ?? null,
			anchored: r?.anchored ?? !0,
			frame: null,
			width: 0,
			height: 0,
			release: r?.release ?? null
		};
		return this.charts.set(e, a), a;
	}
	redraw(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		let n = Ut(e);
		t.width = n.width, t.height = n.height, t.frame = Ge(t, this.formatting), Wt(e, e.querySelector(Pt));
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = Ut(e);
		(n.width !== t.width || n.height !== t.height) && this.redraw(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute("data-ui-chart") ?? "") || t.rowsText !== (e.getAttribute("data-ui-chart-rows") ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && (_e(t.rows, e.action, e.items, e.moves, t.model, this.readPath), this.redraw(e.component), t.model.followLatest && t.view !== null && t.anchored && t.frame !== null && (t.view = Oe(t.view, t.frame.whole.from, t.frame.whole.to), this.redraw(e.component), this.settle(e.component)));
	}
	applyWindow(e, t, n) {
		let r = e.closest(Y), i = r === null ? void 0 : this.charts.get(r), a = Rt(t);
		a === null ? e.removeAttribute(c) : e.setAttribute(c, JSON.stringify(a)), !(r === null || i === void 0 || n) && (i.view = a === null ? null : {
			from: a.from,
			to: a.to
		}, this.redraw(r), Z(i));
	}
	applyGaugeValue(e, t) {
		vt(e, t, this.formatting);
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(Y), n = t === null ? void 0 : this.charts.get(t), r = n?.frame ?? null, i = e.type === "pointermove" && e.target.closest(St) !== null;
		if (t === null || n === void 0 || r === null || r.columns.length === 0 || !i) {
			this.closeShared();
			return;
		}
		let a = t.querySelector(X), o = t.querySelector(Ct);
		if (a === null || o === null) return;
		let s = Bt(r.columns, e.clientX - a.getBoundingClientRect().left);
		o.setAttribute("x", String(Math.round(s.at * 100) / 100)), o.classList.add(wt), this.shared = t, this.tooltips.show(o, s.text);
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(Ct)?.classList.remove(wt), this.shared = null, this.tooltips.hide());
	}
	zoomable(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(Y), n = t === null ? void 0 : this.charts.get(t);
		return t === null || n === void 0 || !n.model.zoomable || n.frame === null || e.closest(St) === null ? null : {
			root: t,
			entry: n,
			frame: n.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e.target);
		if (t === null || !(e instanceof WheelEvent) || e.deltaY === 0) return;
		e.preventDefault();
		let { entry: n, frame: r } = t, i = C(r.x, Ht(e.clientX, t.root, r));
		n.view = Vt(Ee(n.view ?? r.whole, i, e.deltaY > 0 ? Ot : 1 / Ot, r.whole.from, r.whole.to), r.whole), this.redraw(t.root), Z(n), this.settle(t.root);
	}
	settle(e) {
		let t = this.settling.get(e);
		t !== void 0 && window.clearTimeout(t), this.settling.set(e, window.setTimeout(() => this.send(e), Dt));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(Tt);
		if (this.settling.delete(e), t === void 0 || n === null) return;
		let r = t.view === null ? "" : JSON.stringify({
			from: t.view.from,
			to: t.view.to
		});
		r.length === 0 ? n.removeAttribute(c) : n.setAttribute(c, r), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent(Et, { bubbles: !0 }));
	}
	onDragStart(e) {
		this.dragged = !1;
		let t = this.zoomable(e.target);
		if (t === null || !(e instanceof PointerEvent) || e.button !== 0) return;
		this.drag = {
			root: t.root,
			clientX: e.clientX,
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
		if (t === null || n === void 0 || n.frame === null || !(e instanceof PointerEvent)) return;
		let r = n.frame.plot.width, i = t.window.to - t.window.from, a = r > 0 ? (t.clientX - e.clientX) / r * i : 0;
		t.moved = Math.max(t.moved, Math.abs(e.clientX - t.clientX)), n.view = De(t.window, a, n.frame.whole.from, n.frame.whole.to), this.redraw(t.root), Z(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > kt, this.dragged && this.drag !== null && this.send(this.drag.root), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e.target);
		t !== null && (t.entry.view = null, t.entry.anchored = !0, this.redraw(t.root), this.send(t.root));
	}
	onLegendHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(At), n = e.target.closest(Y);
		if (n === null) return;
		let r = e.type === "pointerover", i = e instanceof PointerEvent ? e.relatedTarget : null;
		if (!r && t !== null && i instanceof Node && t.contains(i)) return;
		let a = r && t !== null ? t.getAttribute(s) : null;
		for (let e of n.querySelectorAll(yt)) e.classList.toggle(Mt, a !== null && e.getAttribute("data-ui-chart-series") !== a);
	}
	onBarHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Y);
		t !== null && Wt(t, e.type === "pointerover" ? e.target.closest(Nt) : null);
	}
	onPress(e) {
		if (e.defaultPrevented || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest(bt), n = t?.closest(Y) ?? null;
		if (t === null || n === null) return;
		let r = t.closest(yt)?.getAttribute("data-ui-chart-series") ?? "";
		n.dispatchEvent(new CustomEvent(xt, {
			bubbles: !0,
			detail: {
				point: t.getAttribute("data-ui-chart-point") ?? "",
				series: r
			}
		}));
	}
	onLegendPress(e) {
		if (!(e.target instanceof Element)) return !1;
		let t = e.target.closest(At), n = t?.closest(Y) ?? null, r = t?.getAttribute("data-ui-chart-series") ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let a = i.hidden.has(r);
		return t.setAttribute("aria-pressed", a ? "false" : "true"), t.classList.toggle(jt, a), this.redraw(n), !0;
	}
};
function Lt(e) {
	let t = e.getAttribute(c);
	return t === null || t.length === 0 ? null : zt(t);
}
function Rt(e) {
	let t = typeof e == "string" && e.length > 0 ? zt(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function zt(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function Bt(e, t) {
	let n = e[0];
	for (let r of e) Math.abs(r.at - t) < Math.abs(n.at - t) && (n = r);
	return n;
}
function Z(e) {
	let t = e.frame?.whole ?? null;
	e.anchored = e.view === null || t === null || e.view.to >= t.to - (t.to - t.from) * 1e-6;
}
function Vt(e, t) {
	let n = (t.to - t.from) * 1e-6;
	return e.to - e.from >= t.to - t.from - n ? null : e;
}
function Ht(e, t, n) {
	let r = t.querySelector(X);
	if (r === null || n.plot.width <= 0) return .5;
	let i = r.getBoundingClientRect();
	return Math.min(Math.max((e - i.left - n.plot.left) / n.plot.width, 0), 1);
}
function Ut(e) {
	let t = e.querySelector(X);
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
function Wt(e, t) {
	for (let n of e.querySelectorAll(Nt)) n.classList.toggle(Ft, n === t);
}
//#endregion
//#region src/framework-api.ts
function Gt() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	return e;
}
//#endregion
//#region src/charts.ts
var Q = Gt(), $ = null;
Q.registerEngine((e) => {
	$ = new It(e);
}), Q.registerCollectionSink({
	kind: "chart",
	handler: (e) => $?.applyChange(e)
}), Q.registerValueReader({
	kind: "chart-window",
	read: Lt
}), Q.registerDomOperation({
	kind: "chart-window",
	handler: (e) => $?.applyWindow(e.target, e.value, e.local)
}), Q.registerEvent("window-change", { settlesValue: !0 }), Q.registerEvent("point-click", { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), Q.registerDomOperation({
	kind: "chart-gauge-value",
	handler: (e) => $?.applyGaugeValue(e.target, e.value)
});
//#endregion
