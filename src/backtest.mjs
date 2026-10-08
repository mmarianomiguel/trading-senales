// Simula una regla sobre la historia de un activo, como la operaría una persona:
// la señal sale con el cierre del día y se compra/vende en la apertura del día siguiente.
// Stop = 2 ATR abajo de la compra, entre 5% y 10% (config). Si la regla tiene objetivo, es 2 veces lo arriesgado.

export const INICIO = 200; // hace falta la media de 200 días

export function distanciaStop(x, i, cfg) {
  const pct = (cfg.stop.atr * x.atr14[i]) / x.c[i];
  return Math.min(cfg.stop.max, Math.max(cfg.stop.min, pct));
}

export function simular(x, est, cfg, comision) {
  const n = x.c.length;
  const trades = [];
  let pos = null, pendEntrada = false, pendSalida = false;

  const cerrar = (i, precio, motivo) => {
    const r = (precio * (1 - comision)) / (pos.entrada * (1 + comision)) - 1;
    trades.push({ ...pos, iSal: i, salida: precio, motivo, r });
    pos = null;
  };

  for (let i = INICIO; i < n; i++) {
    if (pendEntrada && !pos) {
      const stopPct = distanciaStop(x, i - 1, cfg);
      const entrada = x.o[i];
      pos = {
        iEnt: i, entrada, stopPct,
        stop: entrada * (1 - stopPct),
        objetivo: est.objetivoR ? entrada * (1 + stopPct * est.objetivoR) : null,
      };
    }
    pendEntrada = false;
    if (pendSalida && pos) cerrar(i, x.o[i], "regla");
    pendSalida = false;

    if (pos) {
      if (x.o[i] <= pos.stop) cerrar(i, x.o[i], "stop");
      else if (x.l[i] <= pos.stop) cerrar(i, pos.stop, "stop");
      else if (pos.objetivo && x.o[i] >= pos.objetivo) cerrar(i, x.o[i], "objetivo");
      else if (pos.objetivo && x.h[i] >= pos.objetivo) cerrar(i, pos.objetivo, "objetivo");
    }

    if (pos && est.salida(x, i)) pendSalida = true;
    else if (!pos && est.entrada(x, i)) pendEntrada = true;
  }

  // Qué hacer HOY según cómo quedó la simulación al último cierre
  const ult = n - 1;
  let hoy = { estado: "nada" };
  const ultimoTrade = trades[trades.length - 1];
  if (pendEntrada) {
    const stopPct = distanciaStop(x, ult, cfg);
    hoy = { estado: "comprar", stopPct, objetivoPct: est.objetivoR ? stopPct * est.objetivoR : null };
  } else if (pos && pendSalida) {
    hoy = { estado: "vender", motivo: "regla", pos };
  } else if (pos) {
    hoy = { estado: "mantener", pos };
  } else if (ultimoTrade && ultimoTrade.iSal === ult && ultimoTrade.motivo !== "regla") {
    hoy = { estado: "vender", motivo: ultimoTrade.motivo, pos: ultimoTrade };
  }

  return { trades, hoy, stats: estadisticas(trades, x, n) };
}

function estadisticas(trades, x, n) {
  const r = trades.map((t) => t.r);
  const ganan = r.filter((v) => v > 0);
  const pierden = r.filter((v) => v <= 0);
  const sumG = ganan.reduce((a, b) => a + b, 0);
  const sumP = -pierden.reduce((a, b) => a + b, 0);
  let eq = 1, pico = 1, maxDD = 0;
  for (const v of r) {
    eq *= 1 + v;
    pico = Math.max(pico, eq);
    maxDD = Math.max(maxDD, 1 - eq / pico);
  }
  return {
    n: r.length,
    aciertos: r.length ? ganan.length / r.length : 0,
    promedio: r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0,
    promGanadora: ganan.length ? sumG / ganan.length : 0,
    promPerdedora: pierden.length ? -sumP / pierden.length : 0,
    pf: sumP > 0 ? sumG / sumP : sumG > 0 ? 99 : 0,
    total: eq - 1,
    maxDD,
    dias: r.length ? trades.reduce((a, t) => a + (t.iSal - t.iEnt), 0) / r.length : 0,
    comprarYMantener: x.c[n - 1] / x.c[Math.min(INICIO, n - 1)] - 1,
  };
}
