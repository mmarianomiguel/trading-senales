// Arma la página con las señales: src/plantilla.html + los datos del día adentro.
import fs from "node:fs";

export function generarPagina(datos) {
  const json = JSON.stringify(datos).replace(/</g, "\\u003c");
  return fs.readFileSync(new URL("./plantilla.html", import.meta.url), "utf8")
    .replace("__MINOPS__", datos.criterio.minOps)
    .replace("__MINPF__", String(datos.criterio.minPF).replace(".", ","))
    .replace("__DATOS__", () => json);
}
