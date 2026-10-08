// Precio "gatillo" de cada regla para el cierre de HOY: a partir de qué precio de cierre
// sale la señal de compra (o de venta, si la regla está comprada). Con eso la página,
// mirando el precio en vivo, puede avisar "si cierra así, mañana se compra".
// Es la cuenta exacta de cada regla despejando el precio del próximo cierre (p).
import { distanciaStop } from "./backtest.mjs";

export function gatillo(x, est, hoy, cfg) {
  const g = calcularGatillo(x, est, hoy, cfg);
  return g && g.precio > 0 ? g : null; // negativo = mañana no puede pasar con ningún precio
}

function calcularGatillo(x, est, hoy, cfg) {
  const n = x.c.length, u = n - 1;
  const suma = (k) => { let s = 0; for (let i = n - k; i < n; i++) s += x.c[i]; return s; };
  const sobre200 = suma(199) / 199;                    // p > media de 200 con p adentro
  const cruce2050 = (20 * suma(49) - 50 * suma(19)) / 30; // media 20 = media 50 con p adentro
  const { g, p } = x.rsi14;                            // promedios de Wilder al último cierre
  const rsiCruza = (nivel) => x.c[u] + 13 * ((nivel / (100 - nivel)) * p - g); // RSI de mañana = nivel
  const maxH = (k) => Math.max(...x.h.slice(n - k, n));
  const minL = (k) => Math.min(...x.l.slice(n - k, n));

  if (hoy.estado === "nada") {
    let precio = null;
    if (est.id === "tendencia" && x.sma20[u] <= x.sma50[u]) precio = Math.max(cruce2050, sobre200);
    if (est.id === "rebote" && x.rsi14[u] < 35) precio = Math.max(rsiCruza(35), sobre200);
    if (est.id === "ruptura" && x.c[u] <= x.max55[u]) precio = Math.max(maxH(55), sobre200);
    if (precio == null) return null;
    return { tipo: "compra", dir: "arriba", precio, stopPct: distanciaStop(x, u, cfg) };
  }
  if (hoy.estado === "mantener") {
    if (est.id === "tendencia") return { tipo: "venta", dir: "abajo", precio: cruce2050 };
    if (est.id === "rebote") return { tipo: "venta", dir: "arriba", precio: Math.max(x.c[u], rsiCruza(65)) };
    if (est.id === "ruptura") return { tipo: "venta", dir: "abajo", precio: minL(20) };
  }
  return null;
}
