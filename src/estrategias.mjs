// Reglas de compra y venta. Todas compran solo a favor de la tendencia larga
// (precio arriba de la media de 200 días) y nunca se venden "en corto".
const ok = (...x) => x.every((v) => v != null);

export const ESTRATEGIAS = [
  {
    id: "tendencia",
    nombre: "Cambio de tendencia",
    plazo: "meses",
    explica: "Compra cuando la media de 20 días cruza hacia arriba la de 50, con el precio arriba de la media de 200. Vende cuando la de 20 vuelve a cruzar hacia abajo.",
    salidaTexto: "Sin objetivo fijo: vender cuando la media de 20 días cruce hacia abajo la de 50 (el sistema avisa).",
    objetivoR: null,
    entrada: (x, i) => ok(x.sma20[i], x.sma50[i], x.sma200[i], x.sma20[i - 1], x.sma50[i - 1]) &&
      x.c[i] > x.sma200[i] && x.sma20[i] > x.sma50[i] && x.sma20[i - 1] <= x.sma50[i - 1],
    salida: (x, i) => ok(x.sma20[i], x.sma50[i], x.sma20[i - 1], x.sma50[i - 1]) &&
      x.sma20[i] < x.sma50[i] && x.sma20[i - 1] >= x.sma50[i - 1],
  },
  {
    id: "rebote",
    nombre: "Rebote en tendencia",
    plazo: "semanas",
    explica: "En un activo que viene subiendo (arriba de la media de 200 días), compra cuando después de una caída fuerte el RSI vuelve a subir de 35. Vende al llegar al objetivo o cuando el RSI pasa 65.",
    salidaTexto: "Vender en el objetivo, o antes si el RSI pasa 65 (el sistema avisa).",
    objetivoR: 2,
    entrada: (x, i) => ok(x.sma200[i], x.rsi14[i], x.rsi14[i - 1]) &&
      x.c[i] > x.sma200[i] && x.rsi14[i - 1] < 35 && x.rsi14[i] >= 35,
    salida: (x, i) => ok(x.rsi14[i]) && x.rsi14[i] > 65,
  },
  {
    id: "ruptura",
    nombre: "Ruptura de máximos",
    plazo: "meses",
    explica: "Compra el primer día que el precio cierra arriba del máximo de los últimos 55 días (con tendencia larga a favor). Vende cuando cierra abajo del mínimo de los últimos 20 días.",
    salidaTexto: "Sin objetivo fijo: vender cuando cierre abajo del mínimo de los últimos 20 días (el sistema avisa).",
    objetivoR: null,
    entrada: (x, i) => ok(x.max55[i], x.max55[i - 1], x.sma200[i]) &&
      x.c[i] > x.max55[i] && x.c[i - 1] <= x.max55[i - 1] && x.c[i] > x.sma200[i],
    salida: (x, i) => ok(x.min20[i]) && x.c[i] < x.min20[i],
  },
];
