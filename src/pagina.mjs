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

  <div class="aviso"><b>Esto es una ayuda, no un consejo de inversión.</b> Las reglas se probaron con la historia de cada activo, pero lo que funcionó antes puede no funcionar ahora. El primer mes conviene seguirlas en papel, sin plata, y nunca poner plata que se necesite.</div>

  <div class="panel">
    <div class="fila">
      <label class="campo">Capital total (en pesos)<input type="text" id="capital" inputmode="numeric" placeholder="ej. 1.000.000"></label>
      <label class="campo">Riesgo por operación (%)<input type="text" id="riesgo" inputmode="decimal"></label>
      <div class="sub" style="max-width:420px">Con esto cada señal te dice cuánto comprar. El riesgo es lo máximo que perdés si toca el stop: con 1% y $1.000.000, perdés como mucho $10.000 por operación.</div>
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
const plata = (v, moneda) => (moneda === "ARS" ? "$ " : "US$ ") + v.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: dec(Math.abs(v)) });
const fecha = s => s.split("-").reverse().join("/");
const numero = s => Number(String(s).replace(/\\./g, "").replace(",", ".")) || 0;

document.getElementById("cabecera").textContent =
  "Datos al cierre del " + fecha(D.activos.map(a => a.fecha).sort().at(-1)) +
  " · generado " + new Date(D.generado).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "short", timeStyle: "short", hour12: false }) + " h" +
  " · dólar CCL " + plata(D.ccl, "ARS");

const capIn = document.getElementById("capital"), rieIn = document.getElementById("riesgo");
capIn.value = guardado("capital", "");
rieIn.value = guardado("riesgo", String(D.riesgo * 100).replace(".", ","));
capIn.oninput = () => { guardar("capital", capIn.value); pintar(); };
rieIn.oninput = () => { guardar("riesgo", rieIn.value); pintar(); };

for (const el of document.querySelectorAll(".seg")) {
  const k = el.dataset.f;
  el.innerHTML = FILTROS[k].map(([v, t]) => '<button data-v="' + v + '">' + t + "</button>").join("");
  el.onclick = e => { const b = e.target.closest("button"); if (!b) return; f[k] = b.dataset.v; pintar(); };
}
document.getElementById("debiles").onchange = e => { f.debiles = e.target.checked; pintar(); };

function cuanto(a, stopPct) {
  const capArs = numero(capIn.value), r = numero(rieIn.value) / 100;
  if (!capArs || !r) return "";
  const cap = a.moneda === "ARS" ? capArs : capArs / D.ccl;
  const monto = Math.min(cap, cap * r / stopPct);
  const u = monto / a.precio;
  const unidades = a.mercado === "cripto" ? u.toLocaleString("es-AR", { maximumFractionDigits: 5 }) : Math.floor(u).toLocaleString("es-AR");
  return "<span>Cuánto comprar</span><span><b>" + plata(monto, a.moneda) + "</b> (" + unidades + (a.mercado === "cripto" ? "" : " u.") +
    ") · si toca el stop perdés " + plata(monto * stopPct, a.moneda) + "</span>";
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

function tarjeta(s) {
  const a = ACT[s.ticker], e = EST[s.estrategia], st = s.stats;
  let filas = "", stop = null, entrada = null;
  if (s.estado === "comprar") {
    stop = a.precio * (1 - s.stopPct);
    filas += "<span>Qué hacer</span><span>Comprar mañana en la apertura (hoy cerró en <b>" + plata(a.precio, a.moneda) + "</b>)</span>";
    filas += "<span>Stop</span><span class=neg>" + plata(stop, a.moneda) + " (" + pct(-s.stopPct) + ")</span>";
    filas += "<span>Objetivo</span><span>" + (s.objetivoPct ? '<span class="pos">' + plata(a.precio * (1 + s.objetivoPct), a.moneda) + " (" + pct(s.objetivoPct) + ")</span>" : esc(e.salidaTexto)) + "</span>";
    filas += cuanto(a, s.stopPct);
  } else {
    entrada = { fecha: s.entradaFecha, precio: s.entradaPrecio };
    stop = s.entradaPrecio * (1 - s.stopPct);
    filas += "<span>Compra</span><span>" + fecha(s.entradaFecha) + " a " + plata(s.entradaPrecio, a.moneda) + "</span>";
    if (s.estado === "mantener") {
      filas += "<span>Hoy</span><span>" + plata(a.precio, a.moneda) + ' <b class="' + clase(s.resultado) + '">' + pct(s.resultado) + "</b></span>";
      filas += "<span>Stop</span><span class=neg>" + plata(stop, a.moneda) + "</span>";
      filas += "<span>Salida</span><span>" + (s.objetivoPct ? "Objetivo " + plata(s.entradaPrecio * (1 + s.objetivoPct), a.moneda) : esc(e.salidaTexto)) + "</span>";
      filas += "<span></span><span class=sub>Si no lo compraste en esa fecha, no entres ahora: esperá una señal nueva de COMPRAR.</span>";
    } else {
      const txt = s.motivo === "regla" ? "La regla dice salir: vender mañana en la apertura." :
        s.motivo === "stop" ? "Tocó el stop hoy. Si estaba la orden puesta, ya se vendió." :
        "Llegó al objetivo hoy. Si estaba la orden puesta, ya se vendió.";
      filas += "<span>Qué hacer</span><span>" + txt + "</span>";
      filas += "<span>Resultado</span><span class='" + clase(s.resultado) + "'><b>" + pct(s.resultado) + "</b> desde la compra</span>";
    }
  }
  const ult = s.ultimas.map(t => "<tr><td>" + fecha(t.desde) + "</td><td>" + fecha(t.hasta) + '</td><td class="' + clase(t.r) + '">' + pct(t.r) + "</td><td>" + ({ regla: "regla", stop: "stop", objetivo: "objetivo" })[t.motivo] + "</td></tr>").join("");
  return '<div class="card' + (s.probada ? "" : " debil") + '">' +
    '<div class="cab"><div><b>' + esc(a.nombre) + '</b><div><span class="chip">' + esc(a.ticker) + '</span><span class="chip">' + MERCADOS[a.mercado] + '</span><span class="chip">' + esc(e.nombre) + " · " + e.plazo + "</span></div></div>" +
    '<span class="badge b-' + s.estado + '">' + s.estado.toUpperCase() + "</span></div>" +
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
function pintar() {
  for (const el of document.querySelectorAll(".seg")) for (const b of el.children) b.classList.toggle("on", b.dataset.v === f[el.dataset.f]);
  const lista = D.senales
    .filter(s => s.estado !== "nada")
    .filter(s => f.debiles || s.probada)
    .filter(s => f.estado === "todas" || s.estado === f.estado)
    .filter(s => f.mercado === "todos" || ACT[s.ticker].mercado === f.mercado)
    .filter(s => f.plazo === "todos" || EST[s.estrategia].plazo === f.plazo)
    .sort((a, b) => ORDEN[a.estado] - ORDEN[b.estado] || b.stats.pf - a.stats.pf);
  document.getElementById("lista").innerHTML = lista.length ? lista.map(tarjeta).join("") :
    '<div class="vacio">No hay señales con estos filtros. Es normal: las reglas dan pocas señales y esperar también es una decisión.</div>';
}

document.getElementById("reglas").innerHTML =
  "<tr><th>Regla</th><th>Plazo</th><th>Operaciones (todos los activos)</th><th>Acertó</th><th>Promedio por operación</th><th>Activos donde funciona</th></tr>" +
  D.estrategias.map(e => "<tr><td><b>" + esc(e.nombre) + "</b><div class=sub>" + esc(e.explica) + "</div></td><td>" + e.plazo + "</td><td>" + e.n +
    "</td><td>" + pct(e.aciertos, false) + '</td><td class="' + clase(e.promedio) + '">' + pct(e.promedio) + "</td><td>" + e.probadas + " de " + D.activos.length + "</td></tr>").join("");

if (D.errores.length) document.getElementById("errores").textContent = "Avisos: " + D.errores.join(" · ");
pintar();
</script>
</body>
</html>`;
