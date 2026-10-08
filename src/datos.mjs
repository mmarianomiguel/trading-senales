// Baja velas diarias de Yahoo Finance (sin clave) y las guarda en datos/cache.
import fs from "node:fs";
import path from "node:path";

const CACHE = path.resolve("datos/cache");
const HORAS_CACHE = 4;

export async function velas(ticker) {
  fs.mkdirSync(CACHE, { recursive: true });
  const archivo = path.join(CACHE, ticker.replace(/[^A-Za-z0-9.-]/g, "_") + ".json");
  if (fs.existsSync(archivo) && Date.now() - fs.statSync(archivo).mtimeMs < HORAS_CACHE * 3600e3) {
    return JSON.parse(fs.readFileSync(archivo, "utf8"));
  }
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=10y&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${ticker}: Yahoo respondió ${res.status}`);
  const json = await res.json();
  if (json.chart.error) throw new Error(`${ticker}: ${json.chart.error.description}`);
  const r = json.chart.result[0];
  const q = r.indicators.quote[0];
  const off = r.meta.gmtoffset ?? 0;
  const out = { ticker, moneda: r.meta.currency, velas: [] };
  r.timestamp.forEach((t, i) => {
    const [o, h, l, c] = [q.open[i], q.high[i], q.low[i], q.close[i]];
    if ([o, h, l, c].some((x) => x == null || !(x > 0))) return;
    out.velas.push({ fecha: new Date((t + off) * 1000).toISOString().slice(0, 10), o, h, l, c });
  });
  fs.writeFileSync(archivo, JSON.stringify(out));
  return out;
}

// Saca la vela que todavía no cerró, para no dar señales con un precio a medio día.
// Cripto: el día de Yahoo es UTC. Bolsas: se considera cerrado después de las 18 h de Argentina.
export function sinVelaAbierta(serie, mercado) {
  const ahora = new Date();
  const v = serie.velas;
  if (!v.length) return serie;
  const ultima = v[v.length - 1].fecha;
  if (mercado === "cripto") {
    if (ultima === ahora.toISOString().slice(0, 10)) v.pop();
  } else {
    const ar = new Date(ahora.getTime() - 3 * 3600e3);
    if (ultima === ar.toISOString().slice(0, 10) && ar.getUTCHours() < 18) v.pop();
  }
  return serie;
}

// Dólar CCL implícito: GGAL en pesos × 10 / ADR de GGAL en dólares (1 ADR = 10 acciones).
export function serieCCL(ggalBA, ggalADR) {
  const adr = new Map(ggalADR.velas.map((v) => [v.fecha, v.c]));
  const ccl = new Map();
  for (const v of ggalBA.velas) {
    const d = adr.get(v.fecha);
    if (d) ccl.set(v.fecha, (v.c * 10) / d);
  }
  return ccl;
}

// Pasa a dólares CCL una serie en pesos (con el CCL de ese día o el último conocido),
// así las reglas no confunden inflación/devaluación con tendencia.
export function dolarizar(serie, ccl) {
  const fechas = [...ccl.keys()].sort();
  let j = 0;
  let actual = null;
  const velas = [];
  const indices = [];
  serie.velas.forEach((v, i) => {
    while (j < fechas.length && fechas[j] <= v.fecha) actual = ccl.get(fechas[j++]);
    if (!actual) return;
    velas.push({ fecha: v.fecha, o: v.o / actual, h: v.h / actual, l: v.l / actual, c: v.c / actual });
    indices.push(i);
  });
  return { velas, indices };
}
