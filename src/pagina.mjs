// Arma la página local con las señales (un solo archivo, sin internet para verla).
export function generarPagina(datos) {
  const json = JSON.stringify(datos).replace(/</g, "\\u003c");
  return PLANTILLA
    .replace("__MINOPS__", datos.criterio.minOps)
    .replace("__MINPF__", String(datos.criterio.minPF).replace(".", ","))
    .replace("__DATOS__", () => json);
}

const PLANTILLA = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Señales de trading</title>
<meta name="robots" content="noindex">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Señales">
<style>
:root {
  --bg: #f6f7f9; --card: #fff; --txt: #1b1f24; --sub: #5f6b7a; --borde: #e3e7ec;
  --verde: #12805c; --verde-bg: #e3f5ee; --rojo: #c0362c; --rojo-bg: #fbe7e5;
  --azul: #2458c6; --azul-bg: #e6eefc; --gris-bg: #eef1f4; --aviso: #fff6dd; --aviso-b: #ecd27a;
  --linea: #1b1f24; --media: #9aa5b1;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111418; --card: #1a1e24; --txt: #e8ebef; --sub: #9aa5b1; --borde: #2a3038;
    --verde: #3fcf98; --verde-bg: #15322a; --rojo: #ff7b70; --rojo-bg: #3a1d1b;
    --azul: #7aa5ff; --azul-bg: #1c2840; --gris-bg: #232830; --aviso: #2e2816; --aviso-b: #6b5a20;
    --linea: #e8ebef; --media: #5f6b7a;
  }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--txt); font: 15px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 1100px; margin: 0 auto; padding: 20px 16px 60px; }
h1 { font-size: 24px; margin: 0 0 4px; }
h2 { font-size: 18px; margin: 32px 0 10px; }
.sub { color: var(--sub); font-size: 13px; }
.aviso { background: var(--aviso); border: 1px solid var(--aviso-b); border-radius: 10px; padding: 10px 14px; margin: 14px 0; font-size: 14px; }
.panel { background: var(--card); border: 1px solid var(--borde); border-radius: 12px; padding: 14px; margin: 12px 0; }
.fila { display: flex; flex-wrap: wrap; gap: 14px; align-items: end; }
label.campo { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--sub); }
input[type=text] { font: inherit; padding: 8px 10px; border: 1px solid var(--borde); border-radius: 8px; background: var(--bg); color: var(--txt); width: 170px; max-width: 100%; }
.seg { display: inline-flex; flex-wrap: wrap; background: var(--gris-bg); border-radius: 9px; padding: 3px; gap: 2px; }
.seg button { font: inherit; font-size: 13px; border: 0; background: transparent; color: var(--sub); padding: 6px 11px; border-radius: 7px; cursor: pointer; }
.seg button.on { background: var(--card); color: var(--txt); box-shadow: 0 1px 2px rgba(0,0,0,.12); font-weight: 600; }
.grupo { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--sub); }
.check { display: flex; gap: 8px; align-items: center; font-size: 13px; color: var(--sub); cursor: pointer; }
.grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(330px, 100%), 1fr)); gap: 12px; margin-top: 12px; }
.card { background: var(--card); border: 1px solid var(--borde); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.card.debil { opacity: .7; }
.cab { display: flex; justify-content: space-between; gap: 10px; align-items: start; }
.cab b { font-size: 16px; }
.chip { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 99px; background: var(--gris-bg); color: var(--sub); margin-right: 4px; }
.badge { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 99px; white-space: nowrap; letter-spacing: .03em; }
.b-comprar { background: var(--verde-bg); color: var(--verde); }
.b-vender { background: var(--rojo-bg); color: var(--rojo); }
.b-mantener { background: var(--azul-bg); color: var(--azul); }
.b-posible { background: var(--verde-bg); color: var(--verde); outline: 1.5px dashed var(--verde); }
.b-cerca { background: var(--aviso); color: var(--txt); }
.b-posible-venta { background: var(--rojo-bg); color: var(--rojo); outline: 1.5px dashed var(--rojo); }
.vivo { margin-top: 4px; color: var(--verde); }
.datos { display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; font-size: 14px; }
.datos span:nth-child(odd) { color: var(--sub); }
.pos { color: var(--verde); } .neg { color: var(--rojo); }
.hist { font-size: 13px; color: var(--sub); border-top: 1px solid var(--borde); padding-top: 8px; }
.hist b { color: var(--txt); font-weight: 600; }
details summary { cursor: pointer; font-size: 13px; color: var(--azul); }
details table { width: 100%; font-size: 12px; border-collapse: collapse; margin-top: 6px; }
details td { padding: 2px 4px; border-bottom: 1px solid var(--borde); }
svg { width: 100%; height: 80px; display: block; }
table.reglas { width: 100%; border-collapse: collapse; font-size: 14px; }
table.reglas th, table.reglas td { text-align: left; padding: 8px; border-bottom: 1px solid var(--borde); vertical-align: top; }
table.reglas th { color: var(--sub); font-weight: 600; font-size: 13px; }
.tabla-scroll { overflow-x: auto; }
.vacio { color: var(--sub); padding: 30px; text-align: center; }
ol li, ul li { margin-bottom: 6px; }
</style>
</head>
<body>
<main>
  <h1>Señales de trading</h1>
  <div class="sub" id="cabecera"></div>
  <div class="sub vivo" id="vivo-estado"></div>

  <div class="aviso"><b>Esto es una ayuda, no un consejo de inversión.</b> Las reglas se probaron con la historia de cada activo, pero lo que funcionó antes puede no funcionar ahora. El primer mes conviene seguirlas en papel, sin plata, y nunca poner plata que se necesite.</div>

  <div class="panel">
    <div class="fila">
      <label class="campo">Capital total (en pesos)<input type="text" id="capital" inputmode="decimal" placeholder="ej. 1.000.000"></label>
      <label class="campo">Riesgo por operación (%)<input type="text" id="riesgo" inputmode="decimal"></label>
      <div class="sub" style="max-width:460px" id="explica-capital"></div>
    </div>
  </div>

  <div class="panel">
    <div class="fila">
      <div class="grupo">Señal<div class="seg" data-f="estado"></div></div>
      <div class="grupo">Mercado<div class="seg" data-f="mercado"></div></div>
      <div class="grupo">Plazo<div class="seg" data-f="plazo"></div></div>
      <label class="check"><input type="checkbox" id="debiles"> Mostrar también reglas que en ese activo no funcionaron</label>
    </div>
  </div>

  <div id="lista" class="grilla"></div>

  <h2>Las reglas y cómo les fue</h2>
  <div class="panel tabla-scroll"><table class="reglas" id="reglas"></table></div>

  <h2>Cómo usarlo</h2>
  <div class="panel">
    <ol>
      <li><b>COMPRAR</b>: al día siguiente, en la apertura, comprar más o menos el monto que dice. En ese momento poner la orden de <b>stop</b> en el broker (vende sola si baja a ese precio).</li>
      <li><b>MANTENER</b>: la regla sigue comprada. No hacer nada; respetar el stop.</li>
      <li><b>VENDER</b>: si se compró por esa señal, vender al día siguiente en la apertura.</li>
      <li>Solo se muestran por defecto las reglas que en ese activo, en los últimos años, ganaron más de lo que perdieron (al menos __MINOPS__ operaciones y ganancias ≥ __MINPF__ veces las pérdidas).</li>
      <li>"Acertó" no es lo importante: una regla puede acertar 40% y ganar plata, porque cuando gana, gana más de lo que pierde cuando pierde.</li>
      <li>Las acciones argentinas y los CEDEARs se analizan pasados a dólar CCL, para que la inflación no parezca una suba. Los precios que ves están en pesos.</li>
    </ol>
  </div>
  <div class="sub" id="errores"></div>
</main>

<script id="datos" type="application/json">__DATOS__</script>
<script>
const D = JSON.parse(document.getElementById("datos").textContent);
const ACT = Object.fromEntries(D.activos.map(a => [a.ticker, a]));
const EST = Object.fromEntries(D.estrategias.map(e => [e.id, e]));
const MERCADOS = { cripto: "Cripto", eeuu: "EE.UU.", cedear: "CEDEARs", argentina: "Argentina" };
const FILTROS = {
  estado: [["todas", "Todas"], ["comprar", "Comprar"], ["vender", "Vender"], ["mantener", "Mantener"]],
  mercado: [["todos", "Todos"], ...Object.entries(MERCADOS)],
  plazo: [["todos", "Todos"], ["semanas", "Semanas"], ["meses", "Meses"]],
};
const f = { estado: "todas", mercado: "todos", plazo: "todos", debiles: false };

const guardado = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pct = (v, signo = true) => (signo && v > 0 ? "+" : "") + (v * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 }) + "%";
const clase = v => v > 0 ? "pos" : v < 0 ? "neg" : "";
const dec = v => v >= 1000 ? 0 : v >= 10 ? 2 : v >= 1 ? 3 : 4;
const plata = (v, moneda) => (moneda === "ARS" ? "$ " : "US$ ") + v.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: dec(Math.abs(v)) });
const fecha = s => s.split("-").reverse().join("/");
const numero = s => Number(String(s).replace(/\\./g, "").replace(",", ".")) || 0;

document.getElementById("cabecera").textContent =
  "Datos al cierre del " + fecha(D.activos.map(a => a.fecha).sort().at(-1)) +
  " · generado " + new Date(D.generado).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "short", timeStyle: "short", hour12: false }) + " h" +
  " · dólar CCL " + plata(D.ccl, "ARS");

const capIn = document.getElementById("capital"), rieIn = document.getElementById("riesgo");
// 1234567,5 -> 1.234.567,5 mientras se escribe (hasta 2 decimales)
function miles(v) {
  v = String(v).replace(/[^\\d,]/g, "");
  const coma = v.indexOf(",");
  const ent = (coma < 0 ? v : v.slice(0, coma)).replace(/^0+(?=\\d)/, "").replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".");
  return coma < 0 ? ent : (ent || "0") + "," + v.slice(coma + 1).replace(/,/g, "").slice(0, 2);
}
capIn.value = miles(guardado("capital", ""));
rieIn.value = guardado("riesgo", String(D.riesgo * 100).replace(".", ","));
capIn.oninput = () => { capIn.value = miles(capIn.value); guardar("capital", capIn.value); pintar(); };
rieIn.oninput = () => { guardar("riesgo", rieIn.value); pintar(); };

for (const el of document.querySelectorAll(".seg")) {
  const k = el.dataset.f;
  el.innerHTML = FILTROS[k].map(([v, t]) => '<button data-v="' + v + '">' + t + "</button>").join("");
  el.onclick = e => { const b = e.target.closest("button"); if (!b) return; f[k] = b.dataset.v; pintar(); };
}
document.getElementById("debiles").onchange = e => { f.debiles = e.target.checked; pintar(); };

// ---- Precios en vivo: Binance (cripto) y data912 (Argentina, CEDEARs, EE.UU.), cada 1 minuto ----
// Las señales se confirman con el precio de CIERRE; el precio en vivo solo avisa qué está por pasar.
const VIVO = {};
let cclVivo = null, horaVivo = null;
async function traerVivo() {
  const pedir = u => fetch(u).then(r => r.ok ? r.json() : []).catch(() => []);
  const cripto = D.activos.filter(a => a.vivo.fuente === "binance").map(a => a.vivo.simbolo);
  const [bin, arg, ced, usa, adr] = await Promise.all([
    pedir("https://api.binance.com/api/v3/ticker/24hr?symbols=" + encodeURIComponent(JSON.stringify(cripto))),
    pedir("https://data912.com/live/arg_stocks"),
    pedir("https://data912.com/live/arg_cedears"),
    pedir("https://data912.com/live/usa_stocks"),
    pedir("https://data912.com/live/usa_adrs"),
  ]);
  const M = { binance: new Map((Array.isArray(bin) ? bin : []).map(x => [x.symbol, { p: +x.lastPrice, var: +x.priceChangePercent / 100 }])) };
  for (const [k, arr] of [["arg_stocks", arg], ["arg_cedears", ced], ["usa_stocks", usa]])
    M[k] = new Map(arr.filter(x => x.c > 0).map(x => [x.symbol, { p: x.c, var: (x.pct_change || 0) / 100 }]));
  const gg = M.arg_stocks.get("GGAL"), ggAdr = adr.find(x => x.symbol === "GGAL");
  if (gg && ggAdr && ggAdr.c > 0) cclVivo = gg.p * 10 / ggAdr.c;
  for (const a of D.activos) {
    let v = M[a.vivo.fuente] && M[a.vivo.fuente].get(a.vivo.simbolo);
    if (!v && a.vivo.factorCedear) {
      const c = M.arg_cedears.get(a.vivo.simbolo);
      if (c) v = { p: c.p * a.vivo.factorCedear, var: c.var, aprox: true };
    }
    if (v && v.p > 0) VIVO[a.ticker] = v;
  }
  if (Object.keys(VIVO).length) horaVivo = new Date();
  pintar();
}

const cclAhora = () => cclVivo || D.ccl;
const precioAhora = a => VIVO[a.ticker] ? VIVO[a.ticker].p : a.precio;
const aPesos = (a, v) => a.moneda === "ARS" ? v : v * cclAhora();
const enMoneda = (a, usd) => a.moneda === "ARS" ? usd * cclAhora() : usd; // gatillos vienen en dólares (CCL para lo argentino)

// Qué mostrar de cada regla teniendo en cuenta el precio en vivo
function vista(s) {
  const a = ACT[s.ticker], v = VIVO[s.ticker], p = precioAhora(a);
  const g = s.gatillo ? Object.assign({}, s.gatillo, { local: enMoneda(a, s.gatillo.precio) }) : null;
  if (s.estado === "comprar") {
    if (v && p <= a.precio * (1 - s.stopPct)) return { grupo: "comprar", badge: "NO COMPRAR", cls: "vender", noComprar: true };
    return { grupo: "comprar", badge: "COMPRAR", cls: "comprar" };
  }
  if (s.estado === "vender") return { grupo: "vender", badge: "VENDER", cls: "vender" };
  if (s.estado === "mantener") {
    const stop = s.entradaPrecio * (1 - s.stopPct);
    if (v && p <= stop) return { grupo: "vender", badge: "VENDER YA", cls: "vender", vivo: "stop" };
    if (v && s.objetivoPct && p >= s.entradaPrecio * (1 + s.objetivoPct)) return { grupo: "vender", badge: "OBJETIVO", cls: "vender", vivo: "objetivo" };
    if (v && g && (g.dir === "abajo" ? p < g.local : p > g.local)) return { grupo: "vender", badge: "POSIBLE VENTA", cls: "posible-venta", vivo: "venta", g };
    return { grupo: "mantener", badge: "MANTENER", cls: "mantener", g };
  }
  if (s.estado === "nada" && v && g && g.tipo === "compra") {
    if (p > g.local) return { grupo: "comprar", badge: "POSIBLE COMPRA", cls: "posible", vivo: "compra", g };
    if (p > g.local * 0.97) return { grupo: "comprar", badge: "CERCA", cls: "cerca", vivo: "cerca", g };
  }
  return null;
}

// Cuánto comprar (en pesos) para que, si toca el stop, se pierda solo el riesgo elegido; y qué puede dejar
function cuanto(a, s, stopPct, objetivoPct) {
  const cap = numero(capIn.value), r = numero(rieIn.value) / 100;
  if (!cap || !r) return "<span>Cuánto comprar</span><span class=sub>Poné tu capital arriba y te lo calcula.</span>";
  const monto = Math.min(cap, cap * r / stopPct);
  const u = monto / aPesos(a, precioAhora(a));
  const unidades = a.mercado === "cripto" ? u.toLocaleString("es-AR", { maximumFractionDigits: 5 }) : Math.floor(u).toLocaleString("es-AR") + " u.";
  const st = s.stats;
  let h = "<span>Cuánto comprar</span><span><b>" + plata(monto, "ARS") + "</b>" + (a.moneda === "ARS" ? "" : " (≈ " + plata(monto / cclAhora(), "USD") + ")") + " · " + unidades + "</span>";
  h += "<span>Si sale bien</span><span class=pos>" + (objetivoPct
    ? "llega al objetivo: <b>+" + plata(monto * objetivoPct, "ARS") + "</b>"
    : "las que ganaron dejaron " + pct(st.promGanadora) + " en promedio: <b>+" + plata(monto * st.promGanadora, "ARS") + "</b>") + "</span>";
  h += "<span>Si sale mal</span><span class=neg>toca el stop: <b>−" + plata(monto * stopPct, "ARS") + "</b></span>";
  h += "<span>En promedio</span><span>contando las que ganan y las que pierden, esta regla dejó <b class='" + clase(st.promedio) + "'>" +
    (st.promedio >= 0 ? "+" : "−") + plata(Math.abs(monto * st.promedio), "ARS") + "</b> por operación</span>";
  return h;
}

function grafico(a, stop, entrada) {
  const g = a.grafico, W = 300, H = 80, P = 4;
  const vals = [...g.c, ...g.m50.filter(v => v != null)];
  if (stop) vals.push(stop);
  const min = Math.min(...vals), max = Math.max(...vals);
  const X = i => P + i * (W - 2 * P) / (g.c.length - 1);
  const Y = v => H - P - (v - min) / (max - min || 1) * (H - 2 * P);
  const linea = arr => arr.map((v, i) => v == null ? null : X(i).toFixed(1) + "," + Y(v).toFixed(1)).filter(Boolean).join(" ");
  let s = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">';
  s += '<polyline fill="none" stroke="var(--media)" stroke-width="1.2" stroke-dasharray="3 3" points="' + linea(g.m50) + '"/>';
  s += '<polyline fill="none" stroke="var(--linea)" stroke-width="1.6" points="' + linea(g.c) + '"/>';
  if (stop) s += '<line x1="0" x2="' + W + '" y1="' + Y(stop) + '" y2="' + Y(stop) + '" stroke="var(--rojo)" stroke-dasharray="4 3"/>';
  if (entrada) { const i = g.f.indexOf(entrada.fecha); if (i >= 0) s += '<circle cx="' + X(i) + '" cy="' + Y(entrada.precio) + '" r="3.5" fill="var(--azul)"/>'; }
  return s + "</svg>";
}

function lineaAhora(a) {
  const v = VIVO[a.ticker];
  if (!v) return "";
  return "<span>Ahora</span><span><b>" + plata(v.p, a.moneda) + "</b> <span class='" + clase(v.var) + "'>" + pct(v.var) + " hoy</span>" +
    (v.aprox ? " <span class=sub>(aprox., sacado del CEDEAR)</span>" : "") + "</span>";
}

function tarjeta(s, vi) {
  const a = ACT[s.ticker], e = EST[s.estrategia], st = s.stats, p = precioAhora(a);
  let filas = "", stop = null, entrada = null;
  if (s.estado === "comprar") {
    stop = a.precio * (1 - s.stopPct);
    filas += "<span>Qué hacer</span><span>" + (vi.noComprar
      ? "<b class=neg>No comprar:</b> ya bajó hasta el stop antes de entrar."
      : "Comprar en la apertura del día siguiente a la señal (cerró en <b>" + plata(a.precio, a.moneda) + "</b>)") + "</span>";
    filas += lineaAhora(a);
    filas += "<span>Stop</span><span class=neg>" + plata(stop, a.moneda) + " (" + pct(-s.stopPct) + ")</span>";
    filas += "<span>Objetivo</span><span>" + (s.objetivoPct ? '<span class="pos">' + plata(a.precio * (1 + s.objetivoPct), a.moneda) + " (" + pct(s.objetivoPct) + ")</span>" : esc(e.salidaTexto)) + "</span>";
    if (!vi.noComprar) filas += cuanto(a, s, s.stopPct, s.objetivoPct);
  } else if (s.estado === "nada") {
    const g = vi.g;
    stop = p * (1 - g.stopPct);
    filas += "<span>Qué hacer</span><span>" + (vi.vivo === "compra"
      ? "Si el próximo cierre queda arriba de <b>" + plata(g.local, a.moneda) + "</b>, se confirma la compra y se compra en la apertura siguiente. <b>Ahora está arriba.</b>"
      : "Le falta <b>" + pct(g.local / p - 1, false) + "</b> para dar compra: tiene que cerrar arriba de <b>" + plata(g.local, a.moneda) + "</b>. Todavía no comprar.") + "</span>";
    filas += lineaAhora(a);
    filas += "<span>Stop</span><span class=neg>≈ " + plata(stop, a.moneda) + " (" + pct(-g.stopPct) + ")</span>";
    filas += "<span>Objetivo</span><span>" + (e.id === "rebote" ? '<span class="pos">≈ ' + plata(p * (1 + 2 * g.stopPct), a.moneda) + " (" + pct(2 * g.stopPct) + ")</span>" : esc(e.salidaTexto)) + "</span>";
    filas += cuanto(a, s, g.stopPct, e.id === "rebote" ? 2 * g.stopPct : null);
  } else {
    entrada = { fecha: s.entradaFecha, precio: s.entradaPrecio };
    stop = s.entradaPrecio * (1 - s.stopPct);
    filas += "<span>Compra</span><span>" + fecha(s.entradaFecha) + " a " + plata(s.entradaPrecio, a.moneda) + "</span>";
    if (s.estado === "mantener") {
      const res = p / s.entradaPrecio - 1;
      if (vi.vivo === "stop") filas += "<span>Qué hacer</span><span><b class=neg>Bajó al stop:</b> si lo tenés, vender (si estaba la orden de stop puesta, ya se vendió).</span>";
      if (vi.vivo === "objetivo") filas += "<span>Qué hacer</span><span><b class=pos>Llegó al objetivo:</b> si lo tenés, vender y tomar la ganancia.</span>";
      if (vi.vivo === "venta") filas += "<span>Qué hacer</span><span>Si el próximo cierre queda " + (vi.g.dir === "abajo" ? "abajo" : "arriba") + " de <b>" + plata(vi.g.local, a.moneda) + "</b>, la regla dice vender. <b>Ahora está " + (vi.g.dir === "abajo" ? "abajo" : "arriba") + ".</b></span>";
      filas += "<span>" + (VIVO[a.ticker] ? "Ahora" : "Hoy") + "</span><span>" + plata(p, a.moneda) + ' <b class="' + clase(res) + '">' + pct(res) + "</b> desde la compra</span>";
      filas += "<span>Stop</span><span class=neg>" + plata(stop, a.moneda) + "</span>";
      filas += "<span>Salida</span><span>" + (s.objetivoPct ? "Objetivo " + plata(s.entradaPrecio * (1 + s.objetivoPct), a.moneda) : esc(e.salidaTexto)) +
        (vi.g && !vi.vivo ? " Hoy sería con un cierre " + (vi.g.dir === "abajo" ? "abajo" : "arriba") + " de " + plata(vi.g.local, a.moneda) + "." : "") + "</span>";
      filas += "<span></span><span class=sub>Si no lo compraste en esa fecha, no entres ahora: esperá una señal nueva de COMPRAR.</span>";
    } else {
      const txt = s.motivo === "regla" ? "La regla dice salir: vender en la apertura." :
        s.motivo === "stop" ? "Tocó el stop. Si estaba la orden puesta, ya se vendió." :
        "Llegó al objetivo. Si estaba la orden puesta, ya se vendió.";
      filas += "<span>Qué hacer</span><span>" + txt + "</span>";
      filas += "<span>Resultado</span><span class='" + clase(s.resultado) + "'><b>" + pct(s.resultado) + "</b> desde la compra</span>";
    }
  }
  const ult = s.ultimas.map(t => "<tr><td>" + fecha(t.desde) + "</td><td>" + fecha(t.hasta) + '</td><td class="' + clase(t.r) + '">' + pct(t.r) + "</td><td>" + ({ regla: "regla", stop: "stop", objetivo: "objetivo" })[t.motivo] + "</td></tr>").join("");
  return '<div class="card' + (s.probada ? "" : " debil") + '">' +
    '<div class="cab"><div><b>' + esc(a.nombre) + '</b><div><span class="chip">' + esc(a.ticker) + '</span><span class="chip">' + MERCADOS[a.mercado] + '</span><span class="chip">' + esc(e.nombre) + " · " + e.plazo + "</span></div></div>" +
    '<span class="badge b-' + vi.cls + '">' + vi.badge + "</span></div>" +
    grafico(a, stop, entrada) +
    '<div class="datos">' + filas + "</div>" +
    '<div class="hist">' + (s.probada ? "" : "<b>⚠ Regla floja en este activo.</b> ") +
    "En los últimos " + st.anios.toFixed(1).replace(".", ",") + " años esta regla dio <b>" + st.n + "</b> operaciones en " + esc(a.ticker) +
    ": acertó <b>" + pct(st.aciertos, false) + "</b>, promedio <b class='" + clase(st.promedio) + "'>" + pct(st.promedio) + "</b> por operación (" + Math.round(st.dias) + " días en promedio)" +
    ", total <b class='" + clase(st.total) + "'>" + pct(st.total) + "</b>; comprar y no tocar habría dado " + pct(st.comprarYMantener) +
    ". Peor racha: " + pct(-st.maxDD) + "." +
    (ult ? "<details><summary>Últimas operaciones</summary><table>" + ult + "</table></details>" : "") +
    "</div></div>";
}

const ORDEN = { comprar: 0, vender: 1, mantener: 2 };
const ORDEN_BADGE = { "COMPRAR": 0, "POSIBLE COMPRA": 1, "CERCA": 2, "NO COMPRAR": 3, "VENDER YA": 0, "OBJETIVO": 1, "VENDER": 2, "POSIBLE VENTA": 3, "MANTENER": 0 };
function explicarCapital() {
  const cap = numero(capIn.value), r = numero(rieIn.value) / 100;
  const el = document.getElementById("explica-capital");
  if (!cap || !r) {
    el.innerHTML = "Poné con cuánta plata operás y cuánto aceptás perder por operación. Con eso, cada señal de <b>COMPRAR</b> te dice cuánto comprar y cuánto puede ganar o perder.";
    return;
  }
  el.innerHTML = "Con " + plata(cap, "ARS") + " y " + rieIn.value + "%, si una compra sale mal y toca el stop perdés como mucho <b>" + plata(cap * r, "ARS") +
    "</b>. Cada señal de <b>COMPRAR</b> te dice cuánto comprar y cuánto puede dejar si sale bien (puede ser menos que todo tu capital)." +
    (r > 0.02 ? ' <b class="neg">Más de 2% por operación es mucho para empezar: con unas pocas seguidas que salgan mal perdés una buena parte.</b>' : "");
}

function pintar() {
  explicarCapital();
  document.getElementById("vivo-estado").innerHTML = horaVivo
    ? "● Precios en vivo, actualizados a las " + horaVivo.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }) + " h" + " (se refrescan solos cada minuto). Las señales se confirman con el precio de cierre."
    : "Buscando precios en vivo…";
  for (const el of document.querySelectorAll(".seg")) for (const b of el.children) b.classList.toggle("on", b.dataset.v === f[el.dataset.f]);
  const lista = D.senales
    .map(s => ({ s, vi: vista(s) }))
    .filter(x => x.vi)
    .filter(x => f.debiles || x.s.probada)
    .filter(x => f.estado === "todas" || x.vi.grupo === f.estado)
    .filter(x => f.mercado === "todos" || ACT[x.s.ticker].mercado === f.mercado)
    .filter(x => f.plazo === "todos" || EST[x.s.estrategia].plazo === f.plazo)
    .sort((a, b) => ORDEN[a.vi.grupo] - ORDEN[b.vi.grupo] || ORDEN_BADGE[a.vi.badge] - ORDEN_BADGE[b.vi.badge] || b.s.stats.pf - a.s.stats.pf);
  document.getElementById("lista").innerHTML = lista.length ? lista.map(x => tarjeta(x.s, x.vi)).join("") :
    '<div class="vacio">No hay señales con estos filtros. Es normal: las reglas dan pocas señales y esperar también es una decisión.</div>';
}

document.getElementById("reglas").innerHTML =
  "<tr><th>Regla</th><th>Plazo</th><th>Operaciones (todos los activos)</th><th>Acertó</th><th>Promedio por operación</th><th>Activos donde funciona</th></tr>" +
  D.estrategias.map(e => "<tr><td><b>" + esc(e.nombre) + "</b><div class=sub>" + esc(e.explica) + "</div></td><td>" + e.plazo + "</td><td>" + e.n +
    "</td><td>" + pct(e.aciertos, false) + '</td><td class="' + clase(e.promedio) + '">' + pct(e.promedio) + "</td><td>" + e.probadas + " de " + D.activos.length + "</td></tr>").join("");

if (D.errores.length) document.getElementById("errores").textContent = "Avisos: " + D.errores.join(" · ");
pintar();
traerVivo();
setInterval(traerVivo, 60000);
</script>
</body>
</html>`;
