export function sma(v, n) {
  const out = Array(v.length).fill(null);
  let s = 0;
  for (let i = 0; i < v.length; i++) {
    s += v[i];
    if (i >= n) s -= v[i - n];
    if (i >= n - 1) out[i] = s / n;
  }
  return out;
}

// RSI de Wilder
export function rsi(c, n = 14) {
  const out = Array(c.length).fill(null);
  let g = 0, p = 0;
  for (let i = 1; i < c.length; i++) {
    const d = c[i] - c[i - 1];
    const up = Math.max(d, 0), dn = Math.max(-d, 0);
    if (i <= n) {
      g += up; p += dn;
      if (i < n) continue;
      g /= n; p /= n;
    } else {
      g = (g * (n - 1) + up) / n;
      p = (p * (n - 1) + dn) / n;
    }
    out[i] = p === 0 ? 100 : 100 - 100 / (1 + g / p);
  }
  out.g = g; out.p = p; // promedios al último día (para calcular el RSI de mañana)
  return out;
}

// ATR de Wilder
export function atr(h, l, c, n = 14) {
  const out = Array(c.length).fill(null);
  let a = 0;
  for (let i = 1; i < c.length; i++) {
    const tr = Math.max(h[i] - l[i], Math.abs(h[i] - c[i - 1]), Math.abs(l[i] - c[i - 1]));
    if (i <= n) {
      a += tr;
      if (i < n) continue;
      a /= n;
    } else {
      a = (a * (n - 1) + tr) / n;
    }
    out[i] = a;
  }
  return out;
}

// Máximo / mínimo de las n velas ANTERIORES (sin contar la de hoy)
export function maxPrevio(v, n) {
  return v.map((_, i) => (i < n ? null : Math.max(...v.slice(i - n, i))));
}
export function minPrevio(v, n) {
  return v.map((_, i) => (i < n ? null : Math.min(...v.slice(i - n, i))));
}

export function calcular(velas) {
  const o = velas.map((v) => v.o), h = velas.map((v) => v.h), l = velas.map((v) => v.l), c = velas.map((v) => v.c);
  return {
    o, h, l, c,
    sma20: sma(c, 20), sma50: sma(c, 50), sma200: sma(c, 200),
    rsi14: rsi(c, 14), atr14: atr(h, l, c, 14),
    max55: maxPrevio(h, 55), min20: minPrevio(l, 20),
  };
}
