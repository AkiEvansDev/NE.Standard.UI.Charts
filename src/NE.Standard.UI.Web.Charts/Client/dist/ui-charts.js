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
//#region src/chart-calendar.ts
var f = 864e5, p = 365 * f, m = -621355968e5, h = 0xe677d21fdbff;
function g(e) {
	return e < 30 * f ? 0 : e < 90 * f ? 1 : e < 180 * f ? 3 : e < p ? 6 : Math.max(12, Math.round(e / p) * 12);
}
function _(e) {
	let t = x(Math.floor(e / f));
	return t.year * 12 + t.month - 1;
}
function v(e) {
	let t = Math.floor(e / 12);
	return b(t, e - t * 12 + 1, 1) * f;
}
function y(e, t) {
	return Math.floor(e / t) * t;
}
function b(e, t, n) {
	let r = t <= 2 ? e - 1 : e, i = Math.floor(r / 400), a = r - i * 400, o = Math.floor((153 * (t > 2 ? t - 3 : t + 9) + 2) / 5) + n - 1, s = a * 365 + Math.floor(a / 4) - Math.floor(a / 100) + o;
	return i * 146097 + s - 719468;
}
function x(e) {
	let t = e + 719468, n = Math.floor(t / 146097), r = t - n * 146097, i = Math.floor((r - Math.floor(r / 1460) + Math.floor(r / 36524) - Math.floor(r / 146096)) / 365), a = r - (365 * i + Math.floor(i / 4) - Math.floor(i / 100)), o = Math.floor((5 * a + 2) / 153), s = o < 10 ? o + 3 : o - 9;
	return {
		year: i + n * 400 + +(s <= 2),
		month: s
	};
}
//#endregion
//#region src/chart-moment.ts
function S(e) {
	return b(e.year, e.month, e.day) * 864e5 + ((e.hour * 60 + e.minute) * 60 + e.second) * 1e3 + e.millisecond;
}
function C(e) {
	let t = new Date(e + new Date(e).getTimezoneOffset() * 6e4);
	return new Date(e + t.getTimezoneOffset() * 6e4);
}
//#endregion
//#region src/chart-ticks.ts
var w = 200, T = 15, E = 1e3, D = 60 * E, O = 60 * D, k = 24 * O, A = 365 * k, ee = [
	E,
	2 * E,
	5 * E,
	10 * E,
	15 * E,
	30 * E,
	D,
	2 * D,
	5 * D,
	10 * D,
	15 * D,
	30 * D,
	O,
	2 * O,
	3 * O,
	6 * O,
	12 * O,
	k,
	2 * k,
	7 * k,
	14 * k,
	30 * k,
	90 * k,
	180 * k,
	A
];
function te(e, t) {
	if (e.logarithmic) {
		if (t <= 0 || e.min <= 0 || e.max <= 0) return 0;
		let n = Math.log10(e.min), r = Math.log10(e.max) - n;
		return r <= 0 ? 0 : (Math.log10(t) - n) / r;
	}
	let n = e.max - e.min;
	return n <= 0 ? 0 : (t - e.min) / n;
}
function ne(e, t) {
	if (e.logarithmic) {
		if (e.min <= 0 || e.max <= 0) return e.min;
		let n = Math.log10(e.min);
		return 10 ** (n + t * (Math.log10(e.max) - n));
	}
	return e.min + t * (e.max - e.min);
}
function re(e, t) {
	return Math.min(Math.max(t, Math.min(e.min, e.max)), Math.max(e.min, e.max));
}
function j(e, t, n) {
	return e.left + te(t, n) * e.width;
}
function M(e, t, n) {
	return e.top + (1 - te(t, n)) * e.height;
}
function ie(e, t, n) {
	return e.top + te(t, n) * e.height;
}
function ae(e) {
	return e.left + e.width;
}
function N(e) {
	return e.top + e.height;
}
function P(e, t, n, r) {
	let i = (n - t) / Math.max(1, r);
	if (i <= 0 || !Number.isFinite(i) || e === "Category") return 1;
	if (e === "Logarithmic") return t > 0 ? 10 ** Math.floor(Math.log10(t)) : 1;
	if (e !== "Time") return de(i);
	for (let e of ee) if (e >= i) return e;
	return de(i / A) * A;
}
function oe(e, t, n) {
	if (t.max <= t.min) return [];
	if (e === "Logarithmic") return fe(t);
	let r = P(e, t.min, t.max, n), i = r * 1e-9, a = e === "Time" ? g(r) : 0;
	if (a > 0) return se(t, a, i);
	e === "Category" && (r = Math.max(1, Math.ceil((Math.floor(t.max) - Math.ceil(t.min) + 1) / w)));
	let o = Math.ceil(t.min / r) * r, s = [];
	for (let e = o; e <= t.max + i && s.length < w; e += r) s.push(e === 0 ? 0 : e);
	return s;
}
function se(e, t, n) {
	let r = y(_(e.min), t);
	v(r) < e.min - n && (r += t);
	let i = [];
	for (let a = v(r); a <= e.max + n && i.length < w; a = v(r)) i.push(a === 0 ? 0 : a), r += t;
	return i;
}
function ce(e, t) {
	if (e === "Category") return null;
	if (e === "Time") return t < D ? "HH:mm:ss" : t < k ? "HH:mm" : t < 30 * k ? "dd MMM" : "MMM yyyy";
	if (t >= 1) return "N0";
	let n = -Math.floor(Math.log10(t) + 1e-9);
	return `N${Math.min(T, n)}`;
}
function le(e, t, n, r, i = !1) {
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
		let t = e.kind === "Time" ? k : Math.abs(o) > 0 ? Math.abs(o) / 8 : 1;
		return ue(e.kind, e.min ?? Math.min(o, s) - t, e.max ?? Math.max(o, s) + t);
	}
	let c = P(e.kind, o, s, e.ticks), l = e.kind === "Time" ? g(c) : 0;
	if (l === 0) return ue(e.kind, e.min ?? Math.floor(o / c) * c, e.max ?? Math.ceil(s / c) * c);
	let u = y(_(s), l);
	return v(u) < s && (u += l), ue(e.kind, e.min ?? v(y(_(o), l)), e.max ?? v(u));
}
function ue(e, t, n) {
	if (e !== "Time") return {
		min: t,
		max: n,
		logarithmic: !1
	};
	let r = Math.min(Math.max(t, m), h), i = Math.min(Math.max(n, m), h);
	return i > r ? {
		min: r,
		max: i,
		logarithmic: !1
	} : r > -621355968e5 ? {
		min: r - k,
		max: r,
		logarithmic: !1
	} : {
		min: r,
		max: r + k,
		logarithmic: !1
	};
}
function de(e) {
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return n <= 1 ? t : n <= 2 ? 2 * t : n <= 5 ? 5 * t : 10 * t;
}
function fe(e) {
	if (e.min <= 0) return [];
	let t = Math.ceil(Math.log10(e.min)), n = Math.floor(Math.log10(e.max));
	if (n - t + 1 < 2) return [e.min, e.max];
	let r = [];
	for (let e = 0; e < Math.min(w, n - t + 1); e++) r.push(10 ** (t + e));
	return r;
}
//#endregion
//#region src/chart-path.ts
function pe(e, t, n, r, i, a) {
	let o = "", s = [];
	for (let c of e) {
		if (c.y !== null) {
			s.push({
				x: j(r, t, c.x),
				y: M(r, n, c.y)
			});
			continue;
		}
		o = he(o, s, i, a), s = [];
	}
	return he(o, s, i, a);
}
function me(e, t, n, r, i, a) {
	let o = M(r, n, re(n, 0)), s = "", c = -1;
	for (let l = 0; l <= e.length; l++) {
		if (l < e.length && e[l].y !== null) {
			c < 0 && (c = l);
			continue;
		}
		c >= 0 && (s = ye(s, e, c, l - 1, t, n, r, i, a, o)), c = -1;
	}
	return s;
}
function F(e) {
	if (!Number.isFinite(e)) return "0";
	let t = Math.round(e * 100) / 100;
	return String(t === 0 ? 0 : t);
}
function he(e, t, n, r) {
	return t.length === 0 ? e : (e.length > 0 ? e + " " : "") + `M${F(t[0].x)} ${F(t[0].y)}` + ge(t, n, r);
}
function ge(e, t, n) {
	if (t) return _e(e);
	let r = "";
	for (let t = 1; t < e.length; t++) {
		if (n) {
			r += ve(e, t);
			continue;
		}
		r += ` L${F(e[t].x)} ${F(e[t].y)}`;
	}
	return r;
}
function _e(e) {
	if (e.length < 2) return "";
	let t = "";
	for (let n = 1; n < e.length; n++) t += ` H${F((e[n - 1].x + e[n].x) / 2)} V${F(e[n].y)}`;
	return t + ` H${F(e[e.length - 1].x)}`;
}
function ve(e, t) {
	let n = Math.max(0, t - 2), r = Math.min(e.length - 1, t + 1), i = e[t - 1].x + (e[t].x - e[n].x) / 6, a = e[t - 1].y + (e[t].y - e[n].y) / 6, o = e[t].x - (e[r].x - e[t - 1].x) / 6, s = e[t].y - (e[r].y - e[t - 1].y) / 6;
	return ` C${F(i)} ${F(a)} ${F(o)} ${F(s)} ${F(e[t].x)} ${F(e[t].y)}`;
}
function ye(e, t, n, r, i, a, o, s, c, l) {
	let u = [];
	for (let e = n; e <= r; e++) u.push({
		x: j(o, i, t[e].x),
		y: M(o, a, t[e].y)
	});
	let d = he(e, u, s, c);
	if (t[n].base === void 0 || t[n].base === null) return d + ` L${F(u[u.length - 1].x)} ${F(l)} L${F(u[0].x)} ${F(l)} Z`;
	let f = [];
	for (let e = r; e >= n; e--) f.push({
		x: j(o, i, t[e].x),
		y: M(o, a, t[e].base ?? 0)
	});
	return d += ` L${F(f[0].x)} ${F(f[0].y)}`, d + ge(f, s, c) + " Z";
}
//#endregion
//#region src/chart-pie.ts
var be = Math.PI * 2, xe = -Math.PI / 2;
function Se(e) {
	let t = 0;
	for (let n of e) n !== null && n > 0 && (t += n);
	let n = [], r = xe;
	for (let i of e) {
		let e = t > 0 && i !== null && i > 0 ? i / t * be : 0;
		n.push({
			start: r,
			sweep: e
		}), r += e;
	}
	return n;
}
function Ce(e, t, n) {
	return {
		x: e.x + Math.cos(n) * t,
		y: e.y + Math.sin(n) * t
	};
}
//#endregion
//#region src/chart-rows.ts
function we(e) {
	let t = e.getAttribute(o);
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t), n = [];
		for (let t of e) {
			if (!Array.isArray(t)) continue;
			let e = Array.isArray(t[2]) ? t[2].map((e) => L(e)) : [], r = Array.isArray(t[4]) ? t[4].map((e) => L(e)) : [], i = t.length > 3 && t[3] !== null && t[3] !== void 0 ? String(t[3]) : null;
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
function Te(e, t, n, r) {
	let i = Pe(n.xPath === null ? null : r(e, n.xPath));
	if (d(n)) {
		let a = Pe(r(e, n.seriesPath)), o = Fe(n, a), s = o?.valuePath ?? n.valuePath, c = o?.sizePath ?? null;
		return {
			key: t,
			x: i,
			values: [s === null ? null : L(r(e, s))],
			series: a,
			sizes: c === null ? [] : [L(r(e, c))]
		};
	}
	let a = [], o = [], s = !1;
	for (let t of n.series) {
		let i = t.valuePath ?? n.valuePath;
		a.push(i === null ? null : L(r(e, i))), o.push(t.sizePath === null ? null : L(r(e, t.sizePath))), s ||= t.sizePath !== null;
	}
	return {
		key: t,
		x: i,
		values: a,
		series: null,
		sizes: s ? o : []
	};
}
function Ee(e, t, n, r, i, a) {
	if (t === "Reset") {
		e.length = 0;
		return;
	}
	if (t === "Move") {
		for (let t of r) Le(e, t.key, t.oldIndex, t.newIndex);
		return;
	}
	let o = /* @__PURE__ */ new Set();
	for (let t of e) o.add(t.key);
	for (let r of n) {
		let n = r.key ?? r.oldKey;
		if (n === null) continue;
		if (t === "Remove") {
			let t = o.has(n) ? R(e, n) : -1;
			t >= 0 && (e.splice(t, 1), o.delete(n));
			continue;
		}
		let s = Te(r.item, r.key ?? n, i, a), c = t === "Replace" ? r.oldKey ?? n : n, l = o.has(c) ? R(e, c) : -1;
		if (l >= 0) {
			e[l] = s, o.delete(c), o.add(s.key);
			continue;
		}
		let u = r.index;
		u === null || u < 0 || u >= e.length ? e.push(s) : e.splice(u, 0, s), o.add(s.key);
	}
}
function De(e, t, n) {
	let r = [], i = t.series.map((e, t) => ({
		series: e,
		index: t,
		points: [],
		drawn: []
	})), a = d(t), o = ke(), s = ke(), c = ke();
	for (let l = 0; l < e.length; l++) {
		let u = e[l], d = t.xPath === null ? Ae(l, t.x.kind, r) : je(u.x, t.x.kind, r, n);
		if (d !== null) {
			if (I(o, d), a) {
				Oe(Ie(i, u.series ?? ""), u, d, u.values.length > 0 ? u.values[0] : null, u.sizes.length > 0 ? u.sizes[0] : null, s, c);
				continue;
			}
			for (let e = 0; e < i.length; e++) Oe(i[e], u, d, e < u.values.length ? u.values[e] : null, e < u.sizes.length ? u.sizes[e] : null, s, c);
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
function Oe(e, t, n, r, i, a, o) {
	e.points.push({
		key: t.key,
		x: n,
		y: r,
		size: i
	}), r !== null && I(a, r), i !== null && I(o, i);
}
function ke() {
	return {
		min: Infinity,
		max: -Infinity
	};
}
function I(e, t) {
	e.min = Math.min(e.min, t), e.max = Math.max(e.max, t);
}
function Ae(e, t, n) {
	return t === "Category" ? je(String(e), t, n, () => null) ?? e : e;
}
function je(e, t, n, r) {
	if (t === "Category") {
		let t = n.indexOf(e);
		return t >= 0 ? t : (n.push(e), n.length - 1);
	}
	let i = Ne(e);
	if (i !== null || t !== "Time") return i;
	let a = r(e);
	return a === null ? null : S(a);
}
var Me = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function Ne(e) {
	if (!Me.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function L(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "boolean" ? +!!e : typeof e == "string" ? Ne(e) : null;
}
function Pe(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function Fe(e, t) {
	for (let n of e.series) if (n.key === t) return n;
	return null;
}
function Ie(e, t) {
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
function R(e, t) {
	for (let n = 0; n < e.length; n++) if (e[n].key === t) return n;
	return -1;
}
function Le(e, t, n, r) {
	let i = t === null ? n ?? -1 : R(e, t);
	if (i < 0 || i >= e.length) return;
	let [a] = e.splice(i, 1), o = r === null || r < 0 || r > e.length ? e.length : r;
	e.splice(o, 0, a);
}
//#endregion
//#region src/chart-stack.ts
function Re(e) {
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
var ze = .002;
function z(e) {
	return e.to - e.from;
}
function B(e, t, n) {
	if (!Number.isFinite(t) || !Number.isFinite(n) || n <= t) return {
		from: t,
		to: n
	};
	let r = n - t, i = r * ze, a = Math.min(Math.max(Number.isFinite(z(e)) && z(e) > 0 ? z(e) : r, i), r);
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
function Be(e, t, n, r, i) {
	if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(t)) return B(e, r, i);
	let a = z(e) * n, o = z(e) > 0 ? Math.min(Math.max((t - e.from) / z(e), 0), 1) : .5;
	return B({
		from: t - o * a,
		to: t - o * a + a
	}, r, i);
}
function Ve(e, t, n, r) {
	return B(Number.isFinite(t) ? {
		from: e.from + t,
		to: e.to + t
	} : e, n, r);
}
function He(e, t, n) {
	return B({
		from: n - z(e),
		to: n
	}, t, n);
}
function Ue(e, t) {
	let n = Infinity, r = -Infinity;
	for (let i of e) for (let e = 0; e < i.length; e++) {
		let a = i[e].y;
		a !== null && We(i, e, t) && (n = Math.min(n, a), r = Math.max(r, a));
	}
	return {
		min: n,
		max: r
	};
}
function We(e, t, n) {
	if (n === null) return !0;
	let r = e[t].x;
	return r >= n.from && r <= n.to || t + 1 < e.length && e[t + 1].x >= n.from && e[t + 1].x <= n.to || t > 0 && e[t - 1].x >= n.from && e[t - 1].x <= n.to;
}
//#endregion
//#region src/chart-draw.ts
var V = "http://www.w3.org/2000/svg", Ge = "area", H = "bar", Ke = "pie", qe = "scatter", U = "data-ui-tooltip", Je = "ui-chart__point", Ye = "ui-chart__marker", Xe = "ui-chart__marker--bare", Ze = "ui-chart__hit", Qe = "ui-chart__rule", $e = "ui.chart.empty", et = "ui.chart.label", tt = "ui-chart__legend", nt = "ui-chart__legend-entry", rt = "ui-chart__legend-entry--off", it = "ui-chart__legend-mark", at = "ui-chart__legend-caption", ot = "--ui-chart-series-color", W = 12, st = 22, ct = 16, lt = 8, ut = 16, dt = 8;
function ft(e, t) {
	let n = e.root.querySelector(".ui-chart__canvas");
	if (n === null) return null;
	let r = n.getBoundingClientRect(), i = Math.round(r.width), a = Math.round(r.height);
	if (i < 2 || a < 2) return null;
	let o = e.model, s = De(e.rows, o, t.temporal.parse), c = s.series.filter((t) => !e.hidden.has(t.series.key));
	o.stacked && Re(c);
	let l = le(o.x, s.xMin, s.xMax, s.categories.length);
	e.follow && e.view !== null && (e.view = He(e.view, l.min, l.max)), e.follow = !1;
	let u = e.view === null ? null : B(e.view, l.min, l.max), d = Ue(c.map((e) => e.drawn), u), f = u === null ? l : {
		...l,
		min: u.from,
		max: u.to
	}, p = le(o.y, d.min, d.max, 0, o.kind === Ge || o.kind === H), m = t.numbers.readCulture(e.root), h = t.temporal.readCulture(e.root), g = {
		x: o.x.format ?? ce(o.x.kind, P(o.x.kind, f.min, f.max, o.x.ticks)),
		y: o.y.format ?? ce(o.y.kind, P(o.y.kind, p.min, p.max, o.y.ticks))
	};
	n.setAttribute("viewBox", `0 0 ${F(i)} ${F(a)}`);
	let _ = document.createElementNS(V, "svg"), v = Bt(e.root);
	if (o.kind === Ke) {
		let r = pt(o, s, g, m, h, t, v);
		return vt(_, e, s, i, a, g, m, h, t, v), n.replaceChildren(..._.childNodes), mt(e, r), ht(n, r, t), null;
	}
	let y = s.series.map((e) => ({
		key: e.series.key,
		caption: e.series.caption,
		color: Rt(e, v)
	}));
	if (mt(e, y), ht(n, y, t), o.bare) {
		let r = {
			left: 2,
			top: 2,
			width: i - 4,
			height: a - 4
		};
		return At(_, e, c, r, f, p, s.categories, g, m, h, t, v), n.replaceChildren(..._.childNodes), {
			plot: r,
			x: f,
			whole: {
				from: l.min,
				to: l.max
			},
			columns: []
		};
	}
	let b = St(n), x = e.rows.length > 0, S = xt(o.x, g.x, f, s.categories, m, h, t, b.width, x), C = xt(o.y, g.y, p, s.categories, m, h, t, b.width, x), w = (o.horizontal ? S : C).reduce((e, t) => Math.max(e, t.width), 0);
	b.release();
	let T = Ct(o, i, a, w);
	Et(_, o, T, f, p, S, C), Ot(_, o, T, f, p, S, C, i, a), At(_, e, c, T, f, p, s.categories, g, m, h, t, v, {
		min: s.sizeMin,
		max: s.sizeMax
	}), e.rows.length === 0 && Ft(_, T, t);
	let E = o.sharedTooltip ? It(o, c, T, f, s.categories, g, m, h, t) : [];
	return E.length > 0 && Lt(_, T, o.horizontal), n.replaceChildren(..._.childNodes), {
		plot: T,
		x: f,
		whole: {
			from: l.min,
			to: l.max
		},
		columns: E
	};
}
function pt(e, t, n, r, i, a, o) {
	return (t.series.length > 0 ? t.series[0].points : []).map((s, c) => ({
		key: s.key,
		caption: G(e.x, n.x, s.x, t.categories, r, i, a),
		color: zt(c, o)
	}));
}
function mt(e, t) {
	if (e.model.legend === "None") return;
	let n = e.root, r = null;
	for (let e of n.children) e.classList.contains(tt) && (r = e);
	if (t.length === 0) {
		r?.remove();
		return;
	}
	let i = r === null ? [] : [...r.children];
	i.length === t.length && t.every((e, t) => gt(i[t], e)) || (r === null && (r = document.createElement("div"), r.className = tt, n.append(r)), r.replaceChildren(...t.map((t) => _t(t, e.hidden.has(t.key)))));
}
function ht(e, t, n) {
	let r = t.length > 0 ? t.map((e) => e.caption).join(", ") : n.strings.text(et);
	e.getAttribute("aria-label") !== r && e.setAttribute("aria-label", r);
}
function gt(e, t) {
	return e instanceof HTMLElement && e.getAttribute("data-ui-chart-series") === t.key && e.querySelector(`.${at}`)?.textContent === t.caption && e.style.getPropertyValue(ot) === t.color;
}
function _t(e, t) {
	let n = document.createElement("button"), r = document.createElement("span"), i = document.createElement("span");
	return n.className = `${nt} ui-button ui-button--ghost ui-button--small`, n.type = "button", n.setAttribute(s, e.key), n.setAttribute("aria-pressed", t ? "false" : "true"), n.classList.toggle(rt, t), n.style.setProperty(ot, e.color), r.className = it, i.className = at, i.textContent = e.caption, n.append(r, i), n;
}
function vt(e, t, n, r, i, a, o, c, u, d) {
	let f = t.model, p = n.series.length > 0 ? n.series[0].points : [], m = [];
	for (let e = 0; e < p.length; e++) t.hidden.has(p[e].key) || m.push({
		point: p[e],
		index: e
	});
	let h = Se(m.map((e) => e.point.y)), g = {
		x: r / 2,
		y: i / 2
	}, _ = Math.min(r, i) / 2 - W, v = _ * f.donut, y = J(e, "g", "ui-chart__plot");
	for (let e = 0; e < m.length; e++) {
		if (h[e].sweep <= 0 || _ <= 0) continue;
		let t = m[e].point, r = J(y, "g", "ui-chart__series");
		r.setAttribute(s, t.key), r.style.setProperty("--ui-chart-series-color", zt(m[e].index, d));
		let i = J(r, "circle", "ui-chart__sector");
		if (i.setAttribute("cx", F(g.x)), i.setAttribute("cy", F(g.y)), i.setAttribute("r", F((_ + v) / 2)), i.setAttribute("stroke-width", F(_ - v)), i.style.setProperty("--ui-arc-start", yt(h[e].start)), i.style.setProperty("--ui-arc-sweep", yt(h[e].sweep)), i.setAttribute(l, t.key), i.setAttribute(s, n.series[0].series.key), !f.tooltip) continue;
		let p = G(f.x, a.x, t.x, n.categories, o, c, u), b = G(f.y, a.y, t.y ?? 0, n.categories, o, c, u);
		i.setAttribute(U, `${p} — ${b}`);
	}
	bt(y, h, g, _, v), v > 0 && f.centreCaption !== null && X(e, "ui-chart__centre", f.centreCaption, g.x, g.y + 4, "middle"), p.length === 0 && Ft(e, {
		left: 0,
		top: 0,
		width: r,
		height: i
	}, u);
}
function yt(e) {
	return `${F(e * 180 / Math.PI)}deg`;
}
function bt(e, t, n, r, i) {
	let a = t.filter((e) => e.sweep > 0);
	if (!(a.length < 2 || r <= 0)) for (let t of a) {
		let a = Ce(n, i, t.start), o = Ce(n, r, t.start), s = J(e, "line", "ui-chart__sector-edge");
		s.setAttribute("x1", F(a.x)), s.setAttribute("y1", F(a.y)), s.setAttribute("x2", F(o.x)), s.setAttribute("y2", F(o.y));
	}
}
function xt(e, t, n, r, i, a, o, s, c) {
	return !c && e.min === null && e.max === null ? [] : oe(e.kind, n, e.ticks).map((n) => {
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
	return e.kind === "Time" ? o.temporal.format(C(n), t, a) : o.numbers.format(n, t, i);
}
function St(e) {
	let t = document.createElementNS(V, "text");
	return t.setAttribute("class", "ui-chart__label"), t.setAttribute("visibility", "hidden"), e.appendChild(t), {
		width: (e) => (t.textContent = e, t.getComputedTextLength()),
		release: () => t.remove()
	};
}
function Ct(e, t, n, r) {
	let i = r + 16 + (wt(e).caption === null ? 0 : ct), a = st + (Tt(e).caption === null ? 0 : ct);
	return {
		left: i,
		top: W,
		width: Math.max(1, t - i - W),
		height: Math.max(1, n - a - W)
	};
}
function wt(e) {
	return e.horizontal ? e.x : e.y;
}
function Tt(e) {
	return e.horizontal ? e.y : e.x;
}
function K(e, t, n, r) {
	return e.horizontal ? ie(t, n, r) : j(t, n, r);
}
function q(e, t, n, r) {
	return e.horizontal ? j(t, n, r) : M(t, n, r);
}
function Et(e, t, n, r, i, a, o) {
	if (!t.x.grid && !t.y.grid) return;
	let s = J(e, "g", "ui-chart__grid");
	if (t.y.grid) for (let e of o) Dt(s, n, q(t, n, i, e.value), t.horizontal);
	if (t.x.grid) for (let e of a) Dt(s, n, K(t, n, r, e.value), !t.horizontal);
}
function Dt(e, t, n, r) {
	r ? Y(e, "ui-chart__grid-line", n, t.top, n, N(t)) : Y(e, "ui-chart__grid-line", t.left, n, ae(t), n);
}
function Ot(e, t, n, r, i, a, o, s, c) {
	let l = J(e, "g", "ui-chart__axes");
	Y(l, "ui-chart__axis-line", n.left, N(n), ae(n), N(n)), Y(l, "ui-chart__axis-line", n.left, n.top, n.left, N(n));
	let u = t.horizontal ? o : a, d = t.horizontal ? a : o, f = -Infinity;
	for (let e of u) {
		let a = e.width / 2, o = t.horizontal ? q(t, n, i, e.value) : K(t, n, r, e.value), c = Math.min(Math.max(o, a), s - a);
		c - a < f || (f = c + a + lt, X(l, "ui-chart__label", e.text, c, N(n) + 16, "middle"));
	}
	let p = NaN;
	for (let e of d) {
		let a = t.horizontal ? K(t, n, r, e.value) : q(t, n, i, e.value);
		Number.isFinite(p) && Math.abs(a - p) < ut || (p = a, X(l, "ui-chart__label", e.text, n.left - lt, a + 4, "end"));
	}
	let m = Tt(t).caption, h = wt(t).caption;
	if (m !== null && X(l, "ui-chart__caption", m, n.left + n.width / 2, c - 2, "middle"), h !== null) {
		let e = n.top + n.height / 2;
		X(l, "ui-chart__caption", h, 10, e, "middle").setAttribute("transform", `rotate(-90 10 ${F(e)})`);
	}
}
function kt(e, t, n, r) {
	let i = `ui-chart-clip-${n.getAttribute("data-ui-id") ?? "0"}`, a = J(e, "clipPath", "");
	a.setAttribute("id", i);
	let o = J(a, "rect", "");
	o.setAttribute("x", F(r.left)), o.setAttribute("y", F(r.top)), o.setAttribute("width", F(r.width)), o.setAttribute("height", F(r.height)), t.setAttribute("clip-path", `url(#${i})`);
}
function At(n, r, a, o, c, l, u, d, f, p, m, h, g = {
	min: Infinity,
	max: -Infinity
}) {
	let _ = J(n, "g", "ui-chart__plot"), v = r.model;
	r.view !== null && kt(n, _, r.root, o);
	let y = v.kind === H ? t(v.horizontal ? o.height : o.width, e(a.map((e) => e.drawn), c)) : 0;
	for (let e = 0; e < a.length; e++) {
		let t = a[e], n = t.series.stepped ?? v.stepped, r = t.series.smooth ?? v.smooth, b = t.series.markers ?? v.markers, x = J(_, "g", "ui-chart__series");
		if (x.setAttribute(s, t.series.key), x.style.setProperty("--ui-chart-series-color", Rt(t, h)), v.kind === H) {
			Mt(x, t, e, a.length, o, c, l, y, u, d, f, p, m, v);
			continue;
		}
		if (v.kind === qe) {
			for (let e = 0; e < t.drawn.length; e++) jt(x, t, e, o, c, l, i(t.drawn[e].size, g.min, g.max), !0, u, d, f, p, m, v);
			continue;
		}
		v.kind === Ge && J(x, "path", "ui-chart__fill").setAttribute("d", me(t.drawn, c, l, o, n, r));
		let S = pe(t.drawn, c, l, o, n, r);
		if (J(x, "path", "ui-chart__line").setAttribute("d", S), J(x, "path", "ui-chart__line-hit").setAttribute("d", S), b || v.tooltip) for (let e = 0; e < t.drawn.length; e++) jt(x, t, e, o, c, l, b ? 3 : 5, b, u, d, f, p, m, v);
	}
}
function jt(e, t, n, i, a, o, s, c, u, d, f, p, m, h) {
	let g = t.drawn[n];
	if (g.y === null) return;
	let _ = {
		x: F(j(i, a, g.x)),
		y: F(M(i, o, g.y))
	}, v = J(e, "g", Je);
	v.setAttribute(l, g.key);
	let y = J(v, "circle", c ? Ye : `${Ye} ${Xe}`);
	y.setAttribute("cx", _.x), y.setAttribute("cy", _.y), y.setAttribute("r", F(s));
	let b = J(v, "circle", Ze);
	b.setAttribute("cx", _.x), b.setAttribute("cy", _.y), b.setAttribute("r", F(r(s))), h.tooltip && !h.sharedTooltip && b.setAttribute(U, Pt(h, t, g.x, Nt(t, n), u, d, f, p, m));
}
function Mt(e, t, r, i, a, o, s, c, u, d, f, p, m, h) {
	let g = h.horizontal;
	for (let _ = 0; _ < t.drawn.length; _++) {
		let v = t.drawn[_];
		if (v.y === null) continue;
		let y = n(K(h, a, o, v.x), c, r, i, h.stacked), b = q(h, a, s, v.y), x = q(h, a, s, re(s, v.base ?? 0)), S = Math.min(b, x), C = Math.max(1, Math.abs(b - x)), w = J(e, "rect", "ui-chart__bar");
		w.setAttribute("x", F(g ? S : y.start)), w.setAttribute("y", F(g ? y.start : S)), w.setAttribute("width", F(g ? C : y.thickness)), w.setAttribute("height", F(g ? y.thickness : C)), w.setAttribute(l, v.key), h.tooltip && !h.sharedTooltip && w.setAttribute(U, Pt(h, t, v.x, Nt(t, _), u, d, f, p, m));
	}
}
function Nt(e, t) {
	return (t < e.points.length ? e.points[t].y : null) ?? 0;
}
function Pt(e, t, n, r, i, a, o, s, c) {
	let l = G(e.x, a.x, n, i, o, s, c), u = G(e.y, a.y, r, i, o, s, c);
	return `${t.series.caption} — ${l}: ${u}`;
}
function Ft(e, t, n) {
	let r = n.strings.text($e);
	r.length !== 0 && X(e, "ui-chart__empty", r, t.left + t.width / 2, t.top + t.height / 2, "middle");
}
function It(e, t, n, r, i, a, o, s, c) {
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
					l != null && n.push(`${t[r].series.caption}: ${G(e.y, a.y, l, i, o, s, c)}`);
				}
				return f = n.join("\n"), f;
			}
		};
	});
}
function Lt(e, t, n) {
	let r = J(e, "rect", Qe);
	r.setAttribute("x", n ? F(t.left) : "0"), r.setAttribute("y", n ? "0" : F(t.top)), r.setAttribute("width", n ? F(t.width) : "1"), r.setAttribute("height", n ? "1" : F(t.height));
}
function Rt(e, t) {
	return e.series.color !== null && e.series.color.length > 0 ? e.series.color : zt(e.index, t);
}
function zt(e, t) {
	return `var(--ui-color-series-${e % t + 1})`;
}
function Bt(e) {
	let t = Number(getComputedStyle(e).getPropertyValue("--ui-color-series-count"));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : dt;
}
function J(e, t, n) {
	let r = document.createElementNS(V, t);
	return r.setAttribute("class", n), e.appendChild(r), r;
}
function Y(e, t, n, r, i, a) {
	let o = J(e, "line", t);
	o.setAttribute("x1", F(n)), o.setAttribute("y1", F(r)), o.setAttribute("x2", F(i)), o.setAttribute("y2", F(a));
}
function X(e, t, n, r, i, a) {
	let o = J(e, "text", t);
	return o.setAttribute("x", F(r)), o.setAttribute("y", F(i)), o.setAttribute("text-anchor", a), o.textContent = n, o;
}
//#endregion
//#region src/chart-gauge.ts
var Vt = "data-ui-gauge-format", Ht = "data-ui-gauge-unit", Ut = "ui.chart.no-reading";
function Wt(e, t, n) {
	let r = e.getAttribute(Vt) ?? "N0", i = e.getAttribute(Ht) ?? "", a = typeof t == "number" ? t : typeof t == "string" && t.length > 0 ? Number(t) : NaN, o = Number.isFinite(a) ? n.numbers.format(a, r, n.numbers.readCulture(e)) + i : n.strings.text(Ut);
	e.textContent !== o && (e.textContent = o);
}
//#endregion
//#region src/chart-engine.ts
var Z = ".ui-chart", Gt = ".ui-chart__canvas", Kt = ".ui-chart__series", qt = "[data-ui-chart-point]", Jt = "point-click", Yt = ".ui-chart__area", Xt = ".ui-chart__rule", Zt = "ui-chart__rule--on", Qt = ".ui-chart__window", $t = "window-change", en = 250, tn = 1.2, nn = 100, rn = nn / 3, an = 800, on = 3, sn = 3, cn = ".ui-chart__legend-entry", ln = "ui-chart__legend-entry--off", un = "ui-chart__series--back", dn = ".ui-chart__bar", fn = ".ui-chart__bar:hover", pn = "ui-chart__bar--front", mn = class {
	charts = /* @__PURE__ */ new WeakMap();
	formatting;
	tooltips;
	observeSize;
	readPath;
	shared = null;
	sharedColumn = null;
	dirty = /* @__PURE__ */ new Set();
	frameRequested = !1;
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
		for (let e of t.querySelectorAll(Z)) this.adopt(e);
		e.observeComponents(t, Z, {
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
		t !== null && (t.release ??= this.observeSize(e, () => this.onResize(e)), this.schedule(e));
	}
	resolve(e) {
		let t = e.getAttribute("data-ui-chart") ?? "", n = e.getAttribute("data-ui-chart-rows") ?? "", r = this.charts.get(e);
		if (r !== void 0 && r.modelText === t) return r.rowsText !== n && (r.rows.length = 0, r.rows.push(...we(e)), r.rowsText = n), r;
		let i = u(e);
		if (i === null) return null;
		let a = {
			root: e,
			model: i,
			rows: we(e),
			hidden: r?.hidden ?? /* @__PURE__ */ new Set(),
			modelText: t,
			rowsText: n,
			view: r === void 0 ? gn(hn(e.querySelector(Qt) ?? e)) : r.view,
			anchored: r?.anchored ?? !0,
			follow: !1,
			frame: null,
			width: 0,
			height: 0,
			release: r?.release ?? null
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
		let n = wn(e), r = t.follow && t.view !== null;
		t.width = n.width, t.height = n.height, t.frame = ft(t, this.formatting), Tn(e, e.querySelector(fn)), r && this.settle(e);
	}
	onResize(e) {
		let t = this.charts.get(e);
		if (t === void 0) return;
		if (!e.isConnected) {
			t.release?.(), t.release = null, this.charts.delete(e);
			return;
		}
		let n = wn(e);
		(n.width !== t.width || n.height !== t.height) && this.schedule(e);
	}
	onMutated(e) {
		let t = this.charts.get(e);
		(t === void 0 || t.modelText !== (e.getAttribute("data-ui-chart") ?? "") || t.rowsText !== (e.getAttribute("data-ui-chart-rows") ?? "")) && this.adopt(e);
	}
	applyChange(e) {
		if (!(e.component instanceof HTMLElement)) return;
		let t = this.resolve(e.component);
		t !== null && (Ee(t.rows, e.action, e.items, e.moves, t.model, this.readPath), t.model.followLatest && t.view !== null && t.anchored && (t.follow = !0), this.schedule(e.component));
	}
	applyWindow(e, t, n) {
		let r = e.closest(Z), i = r === null ? void 0 : this.charts.get(r), a = gn(t);
		a === null ? e.removeAttribute(c) : e.setAttribute(c, JSON.stringify(a)), !(r === null || i === void 0 || n) && (i.view = a === null ? null : {
			from: a.from,
			to: a.to
		}, i.follow = !1, this.schedule(r), bn(i));
	}
	applyGaugeValue(e, t) {
		Wt(e, t, this.formatting);
	}
	onSharedTooltip(e) {
		if (!(e instanceof PointerEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(Z), n = t === null ? void 0 : this.charts.get(t), r = n?.frame ?? null, i = e.type === "pointermove" && e.target.closest(Yt) !== null;
		if (t === null || n === void 0 || r === null || r.columns.length === 0 || !i) {
			this.closeShared();
			return;
		}
		let a = t.querySelector(Gt), o = t.querySelector(Xt);
		if (a === null || o === null) return;
		let s = a.getBoundingClientRect(), c = n.model.horizontal, l = vn(r.columns, c ? e.clientY - s.top : e.clientX - s.left);
		(this.shared !== t || this.sharedColumn !== l) && (o.setAttribute(c ? "y" : "x", String(Math.round(l.at * 100) / 100)), o.classList.add(Zt), this.shared = t, this.sharedColumn = l, this.tooltips.show(o, l.text));
	}
	closeShared() {
		this.shared !== null && (this.shared.querySelector(Xt)?.classList.remove(Zt), this.shared = null, this.sharedColumn = null, this.tooltips.hide());
	}
	zoomable(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(Z), n = t === null ? void 0 : this.charts.get(t);
		return t === null || n === void 0 || !n.model.zoomable || n.frame === null || e.closest(Yt) === null ? null : {
			root: t,
			entry: n,
			frame: n.frame
		};
	}
	onWheel(e) {
		let t = this.zoomable(e.target);
		if (t === null || !(e instanceof WheelEvent) || e.deltaY === 0) return;
		e.preventDefault();
		let { entry: n, frame: r } = t, i = n.view ?? r.whole;
		n.view = xn(Be(i, ne({
			...r.x,
			min: i.from,
			max: i.to
		}, Sn(e, t.root, r, n.model.horizontal)), tn ** Math.min(Math.max(yn(e) / nn, -3), on), r.whole.from, r.whole.to), r.whole), n.follow = !1, this.schedule(t.root), bn(n), this.settle(t.root);
	}
	settle(e) {
		let t = this.settling.get(e);
		t !== void 0 && window.clearTimeout(t), this.settling.set(e, window.setTimeout(() => this.send(e), en));
	}
	send(e) {
		let t = this.charts.get(e), n = e.querySelector(Qt);
		if (this.settling.delete(e), t === void 0 || n === null) return;
		let r = t.view === null ? "" : JSON.stringify({
			from: t.view.from,
			to: t.view.to
		});
		r.length === 0 ? n.removeAttribute(c) : n.setAttribute(c, r), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent($t, { bubbles: !0 }));
	}
	onDragStart(e) {
		this.dragged = !1;
		let t = this.zoomable(e.target);
		if (t === null || !(e instanceof PointerEvent) || e.button !== 0) return;
		this.drag = {
			root: t.root,
			start: Cn(e, t.entry.model.horizontal),
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
		let r = n.model.horizontal, i = r ? n.frame.plot.height : n.frame.plot.width, a = t.window.to - t.window.from, o = Cn(e, r), s = i > 0 ? (t.start - o) / i * a : 0;
		t.moved = Math.max(t.moved, Math.abs(o - t.start)), n.view = Ve(t.window, s, n.frame.whole.from, n.frame.whole.to), n.follow = !1, this.schedule(t.root), bn(n);
	}
	onDragEnd() {
		this.dragged = this.drag !== null && this.drag.moved > sn, this.dragged && this.drag !== null && this.send(this.drag.root), this.drag = null;
	}
	onReset(e) {
		let t = this.zoomable(e.target);
		t !== null && t.entry.view !== null && (t.entry.view = null, t.entry.anchored = !0, t.entry.follow = !1, this.schedule(t.root), this.send(t.root));
	}
	onLegendHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(cn), n = e.target.closest(Z);
		if (n === null) return;
		let r = e.type === "pointerover", i = e instanceof PointerEvent ? e.relatedTarget : null;
		if (!r && t !== null && i instanceof Node && t.contains(i)) return;
		let a = r && t !== null ? t.getAttribute(s) : null;
		for (let e of n.querySelectorAll(Kt)) e.classList.toggle(un, a !== null && e.getAttribute("data-ui-chart-series") !== a);
	}
	onBarHover(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Z);
		t !== null && Tn(t, e.type === "pointerover" ? e.target.closest(dn) : null);
	}
	onPress(e) {
		if (e.defaultPrevented || !(e.target instanceof Element) || this.onLegendPress(e)) return;
		if (this.dragged) {
			this.dragged = !1;
			return;
		}
		let t = e.target.closest(qt), n = t?.closest(Z) ?? null;
		if (t === null || n === null) return;
		let r = t.getAttribute("data-ui-chart-series") ?? t.closest(Kt)?.getAttribute("data-ui-chart-series") ?? "";
		n.dispatchEvent(new CustomEvent(Jt, {
			bubbles: !0,
			detail: {
				point: t.getAttribute("data-ui-chart-point") ?? "",
				series: r
			}
		}));
	}
	onLegendPress(e) {
		if (!(e.target instanceof Element)) return !1;
		let t = e.target.closest(cn), n = t?.closest(Z) ?? null, r = t?.getAttribute("data-ui-chart-series") ?? null;
		if (t === null || n === null || r === null) return !1;
		let i = this.charts.get(n);
		if (i === void 0) return !1;
		e.preventDefault(), i.hidden.has(r) ? i.hidden.delete(r) : i.hidden.add(r);
		let a = i.hidden.has(r);
		return t.setAttribute("aria-pressed", a ? "false" : "true"), t.classList.toggle(ln, a), this.schedule(n), !0;
	}
};
function hn(e) {
	let t = e.getAttribute(c);
	return t === null || t.length === 0 ? null : _n(t);
}
function gn(e) {
	let t = typeof e == "string" && e.length > 0 ? _n(e) : e;
	if (typeof t != "object" || !t) return null;
	let n = t.from, r = t.to;
	return typeof n == "number" && typeof r == "number" && r > n ? {
		from: n,
		to: r
	} : null;
}
function _n(e) {
	try {
		return JSON.parse(e);
	} catch {
		return null;
	}
}
function vn(e, t) {
	let n = 0, r = e.length - 1;
	for (; n < r;) {
		let i = n + r >> 1;
		e[i].at < t ? n = i + 1 : r = i;
	}
	return n > 0 && Math.abs(e[n - 1].at - t) <= Math.abs(e[n].at - t) ? e[n - 1] : e[n];
}
function yn(e) {
	return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * rn : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? e.deltaY * an : e.deltaY;
}
function bn(e) {
	let t = e.frame?.whole ?? null;
	e.anchored = e.view === null || t === null || e.view.to >= t.to - (t.to - t.from) * 1e-6;
}
function xn(e, t) {
	let n = (t.to - t.from) * 1e-6;
	return e.to - e.from >= t.to - t.from - n ? null : e;
}
function Sn(e, t, n, r) {
	let i = t.querySelector(Gt), a = r ? n.plot.height : n.plot.width;
	if (i === null || a <= 0) return .5;
	let o = i.getBoundingClientRect(), s = r ? o.top + n.plot.top : o.left + n.plot.left;
	return Math.min(Math.max((Cn(e, r) - s) / a, 0), 1);
}
function Cn(e, t) {
	return t ? e.clientY : e.clientX;
}
function wn(e) {
	let t = e.querySelector(Gt);
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
function Tn(e, t) {
	for (let n of e.querySelectorAll(dn)) n.classList.toggle(pn, n === t);
}
//#endregion
//#region src/framework-api.ts
var En = 1;
function Dn() {
	let e = window.NEStandardUI;
	if (e === void 0 || typeof e.registerEngine != "function") throw Error("NE.Standard.UI.Web.Charts needs the framework's client (ui.js) on the page before it.");
	if (e.contractVersion !== En) throw Error(`NE.Standard.UI.Web.Charts was built for plugin contract ${En}, but the framework's client on the page implements ${String(e.contractVersion ?? "an older one")}; install the package version that matches the framework.`);
	return e;
}
//#endregion
//#region src/charts.ts
var Q = Dn(), $ = null;
Q.registerEngine((e) => {
	$ = new mn(e);
}), Q.registerCollectionSink({
	kind: "chart",
	handler: (e) => $?.applyChange(e)
}), Q.registerValueReader({
	kind: "chart-window",
	read: hn
}), Q.registerDomOperation({
	kind: "chart-window",
	handler: (e) => $?.applyWindow(e.target, e.value, e.local)
}), Q.registerEvent("window-change", { settlesValue: !0 }), Q.registerEvent("point-click", { dynamicParameters: (e) => [e.domEvent.detail?.point ?? "", e.domEvent.detail?.series ?? ""] }), Q.registerDomOperation({
	kind: "chart-gauge-value",
	handler: (e) => $?.applyGaugeValue(e.target, e.value)
});
//#endregion
