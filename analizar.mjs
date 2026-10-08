// Corre todo: baja precios, aplica las reglas, las prueba con la historia y arma "00 Señales.html".
// Uso: node analizar.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { velas, sinVelaAbierta, serieCCL, dolarizar } from "./src/datos.mjs";
import { calcular, sma } from "./src/indicadores.mjs";
import { ESTRATEGIAS } from "./src/estrategias.mjs";
import { simular, INICIO } from "./src/backtest.mjs";
import { generarPagina } from "./src/pagina.mjs";
import { gatillo } from "./src/gatillos.mjs";

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const DIA = 864e5;

// De dónde saca la página el precio en vivo: Binance (cripto) o data912 (Argentina, CEDEARs, EE.UU.)
function fuenteEnVivo(a) {
  if (a.mercado === "cripto") return { fuente: "binance", simbolo: a.ticker.replace("-USD", "USDT") };
  if (a.mercado === "argentina") return { fuente: "arg_stocks", simbolo: a.ticker.replace(".BA", "") };
  if (a.mercado === "cedear") return { fuente: "arg_cedears", simbolo: a.ticker.replace(".BA", "") };
  return { fuente: "usa_stocks", simbolo: a.ticker };
}
const dias = (a, b) => Math.round((new Date(b) - new Date(a)) / DIA);

// 1. Bajar precios (GGAL en Nueva York hace falta para el dólar CCL)
const tickers = [...new Set([...cfg.activos.map((a) => a.ticker), "GGAL.BA", "GGAL"])];
const series = {};
const errores = [];
for (let i = 0; i < tickers.length; i += 5) {
  await Promise.all(tickers.slice(i, i + 5).map(async (t) => {
    try { series[t] = await velas(t); } catch (e) { errores.push(e.message); }
  }));
}
if (!series["GGAL.BA"] || !series["GGAL"]) throw new Error("No se pudo bajar GGAL para calcular el dólar CCL");
const ccl = serieCCL(series["GGAL.BA"], series["GGAL"]);
const cclHoy = [...ccl.values()].at(-1);

// 2. Aplicar las reglas a cada activo
const activos = [];
const senales = [];
const todasLasOps = Object.fromEntries(ESTRATEGIAS.map((e) => [e.id, []]));

for (const a of cfg.activos) {
  const s = series[a.ticker];
  if (!s) continue;
  sinVelaAbierta(s, a.mercado);
  const orig = s.velas;
  let calc, idx;
  if (s.moneda === "ARS") ({ velas: calc, indices: idx } = dolarizar(s, ccl));
  else { calc = orig; idx = orig.map((_, i) => i); }
  if (calc.length < INICIO + 120) { errores.push(`${a.ticker}: poca historia (${calc.length} días)`); continue; }

  const x = calcular(calc);
  const fechas = calc.map((v) => v.fecha);
  const precio = orig.at(-1).c;
  const anios = dias(fechas[INICIO], fechas.at(-1)) / 365.25;
  const cOrig = orig.map((v) => v.c);
  const m50 = sma(cOrig, 50);
  const N = 130;
  activos.push({
    ticker: a.ticker, nombre: a.nombre, mercado: a.mercado, moneda: s.moneda,
    precio, fecha: orig.at(-1).fecha, vivo: fuenteEnVivo(a),
    grafico: { f: orig.slice(-N).map((v) => v.fecha), c: cOrig.slice(-N), m50: m50.slice(-N) },
  });

  const precioOrig = (i) => orig[idx[i]];
  for (const est of ESTRATEGIAS) {
    const { trades, hoy, stats } = simular(x, est, cfg, cfg.comisionPorLado[a.mercado]);
    todasLasOps[est.id].push(...trades.map((t) => t.r));
    stats.anios = anios;
    stats.dias = trades.length ? trades.reduce((acc, t) => acc + dias(fechas[t.iEnt], fechas[t.iSal]), 0) / trades.length : 0;
    const probada = stats.n >= cfg.minimoOperaciones && stats.pf >= cfg.minimoProfitFactor && stats.promedio > 0;

    const sen = {
      ticker: a.ticker, estrategia: est.id, estado: hoy.estado, motivo: hoy.motivo ?? null, probada, stats,
      gatillo: gatillo(x, est, hoy, cfg),
      ultimas: trades.slice(-5).reverse().map((t) => ({
        desde: fechas[t.iEnt], hasta: fechas[t.iSal], r: t.r, motivo: t.motivo,
      })),
    };
    if (hoy.estado === "comprar") {
      sen.stopPct = hoy.stopPct;
      sen.objetivoPct = hoy.objetivoPct;
    } else if (hoy.pos) {
      const p = hoy.pos;
      sen.entradaFecha = fechas[p.iEnt];
      sen.entradaPrecio = precioOrig(p.iEnt).o;
      sen.stopPct = p.stopPct;
      sen.objetivoPct = p.objetivo ? p.objetivo / p.entrada - 1 : null;
      sen.resultado = p.r ?? precio / sen.entradaPrecio - 1;
    }
    senales.push(sen);
  }
}

// Los ETF de EE.UU. no están en data912: el precio en vivo se estima con su CEDEAR
for (const a of activos) {
  if (a.mercado !== "eeuu") continue;
  const ced = activos.find((b) => b.ticker === a.ticker + ".BA");
  if (ced) a.vivo.factorCedear = a.precio / ced.precio;
}

// 3. Cómo le fue a cada regla sumando todos los activos
const resumen = ESTRATEGIAS.map((e) => {
  const r = todasLasOps[e.id];
  const g = r.filter((v) => v > 0).reduce((a, b) => a + b, 0);
  const p = -r.filter((v) => v <= 0).reduce((a, b) => a + b, 0);
  return {
    id: e.id, nombre: e.nombre, plazo: e.plazo, explica: e.explica, salidaTexto: e.salidaTexto,
    n: r.length,
    aciertos: r.length ? r.filter((v) => v > 0).length / r.length : 0,
    promedio: r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0,
    pf: p > 0 ? g / p : 0,
    probadas: senales.filter((s) => s.estrategia === e.id && s.probada).length,
  };
});

const datos = {
  generado: new Date().toISOString(),
  ccl: cclHoy,
  riesgo: cfg.riesgoPorOperacion,
  criterio: { minOps: cfg.minimoOperaciones, minPF: cfg.minimoProfitFactor },
  estrategias: resumen,
  activos, senales, errores,
};
fs.mkdirSync("datos", { recursive: true });
fs.writeFileSync("datos/resultado.json", JSON.stringify(datos, null, 1));
const pagina = generarPagina(datos);
fs.writeFileSync("00 Señales.html", pagina);
fs.mkdirSync("publico", { recursive: true });
fs.writeFileSync("publico/index.html", pagina); // lo que publica GitHub Pages
fs.copyFileSync("src/guia.html", "publico/guia.html");

const cuenta = (e) => senales.filter((s) => s.estado === e && s.probada).length;
console.log(`Listo: ${activos.length} activos, CCL ${cclHoy.toFixed(0)}.`);
console.log(`Señales con reglas probadas -> comprar: ${cuenta("comprar")}, vender: ${cuenta("vender")}, mantener: ${cuenta("mantener")}`);
if (errores.length) console.log("Avisos:\n - " + errores.join("\n - "));
