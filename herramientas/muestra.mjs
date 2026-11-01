#!/usr/bin/env node
// herramientas/muestra.mjs — una página HTML con el tema aplicado a un explorador de ejemplo, sin Obsidian.
//
// Uso: node herramientas/muestra.mjs <salida.html>
// Usa el mismo clasificador, los mismos datos generados y el mismo styles.css que el complemento, con el marcado del
// explorador de Obsidian: sirve para ver el tema (y las capturas del README) sin abrir el vault.
import fs from "node:fs";
import path from "node:path";
import { iconoMaterial, simboloDe, categoriaDe } from "../src/clasificar.js";
import { COLORES } from "../src/tablas.js";

const raiz = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const material = JSON.parse(fs.readFileSync(path.join(raiz, "src/generado/material.json"), "utf8"));
const simbolos = JSON.parse(fs.readFileSync(path.join(raiz, "src/generado/simbolos.json"), "utf8"));
const estilos = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");

const ARBOL = [
    ["00-bandeja", true, true], ["20-universidad", true, false], ["40-cursos-y-formacion", true, false],
    ["60-guias-y-referencias", true, true], ["imagenes", true, false], ["bibliografia", true, false],
    ["investigacion", true, false], ["proyectos", true, false], ["plantillas", true, false], ["datos", true, false],
    ["2025", true, false], ["carpeta-cualquiera", true, false],
    ["README.md", false], ["nota.md", false], ["informe.qmd", false], ["articulo.pdf", false], ["oficio.docx", false],
    ["presupuesto.xlsx", false], ["exposicion.pptx", false], ["datos.json", false], ["config.yaml", false],
    ["modelo.py", false], ["script.js", false], ["tesis.tex", false], ["referencias.bib", false],
    ["encuesta.dta", false], ["mapa.canvas", false], ["foto.png", false], ["package.json", false],
];

const reglas = new Map();
const urlDe = (svg) => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
function regla(tipo, clave) {
    const clase = `ti-${tipo}-${clave.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    if (reglas.has(clase)) return clase;
    const [coleccion, a, b] = clave.split(":");
    const svg = coleccion === "m" ? material.svg[a] : simbolos.estilos[a][b];
    const variable = tipo === "i" || tipo === "il" ? "--ti-img" : "--ti-img-a";
    reglas.set(clase, `${tipo.endsWith("l") ? ".theme-light " : ""}.${clase}{${variable}:${urlDe(svg)}}`);
    return clase;
}
function clases(ruta, esCarpeta, coleccion) {
    const m = iconoMaterial(material, ruta, esCarpeta);
    const c = ["ti-icono", "ti-c-" + categoriaDe(m.cerrado, esCarpeta)];
    if (coleccion === "simbolos") {
        const [s] = simboloDe(m.cerrado, esCarpeta);
        c.push(regla("i", "s:rounded:" + s));
        if (esCarpeta) c.push(regla("a", "s:rounded:" + (s === "folder" ? "folder_open" : s)));
    } else {
        c.push(regla("i", "m:" + m.cerrado));
        if (esCarpeta) c.push(regla("a", "m:" + m.abierto));
        if (m.claroCerrado) c.push(regla("il", "m:" + m.claroCerrado));
        if (esCarpeta && m.claroAbierto) c.push(regla("al", "m:" + m.claroAbierto));
    }
    return c.join(" ");
}
function panel(titulo, tema, coleccion) {
    const filas = ARBOL.map(([nombre, esCarpeta, abierta]) =>
        esCarpeta
            ? `<div class="tree-item nav-folder${abierta ? "" : " is-collapsed"}"><div class="tree-item-self nav-folder-title" data-path="${nombre}"><span class="flecha">${abierta ? "⌄" : "›"}</span><span class="${clases(nombre, true, coleccion)}"></span><div class="tree-item-inner">${nombre}</div></div></div>`
            : `<div class="tree-item nav-file"><div class="tree-item-self nav-file-title" data-path="${nombre}"><span class="flecha"></span><span class="${clases(nombre, false, coleccion)}"></span><div class="tree-item-inner">${nombre.replace(/\.md$/, "")}</div></div></div>`,
    ).join("");
    return `<section class="${tema} ${coleccion === "simbolos" ? "ti-pintar" : ""}"><h2>${titulo}</h2>${filas}</section>`;
}

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tema de iconos</title>
<style>
:root{font:14px/1.4 system-ui,sans-serif}
body{margin:0;padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;background:#888}
section{border-radius:8px;padding:12px 8px}
.theme-dark{--background:#1e1e1e;--text:#dadada;--icon-color:#a3a3a3;--color-red:#fb464c;--color-orange:#e9973f;--color-yellow:#e0de71;--color-green:#44cf6e;--color-cyan:#53dfdd;--color-blue:#027aff;--color-purple:#a882ff;--color-pink:#fa99cd;background:var(--background);color:var(--text)}
.theme-light{--background:#fff;--text:#222;--icon-color:#5c5c5c;--color-red:#e93147;--color-orange:#ec7500;--color-yellow:#e0ac00;--color-green:#08b94e;--color-cyan:#00bfbc;--color-blue:#086ddd;--color-purple:#7852ee;--color-pink:#d53984;background:var(--background);color:var(--text)}
h2{font-size:13px;margin:0 8px 8px;opacity:.7}
.tree-item-self{display:flex;align-items:center;padding:2px 8px;border-radius:4px}
.flecha{width:14px;opacity:.6;font-size:12px}
section.ti-pintar .ti-icono{background:var(--ti-color,var(--icon-color));-webkit-mask:var(--ti-img) center/contain no-repeat;mask:var(--ti-img) center/contain no-repeat}
section.ti-pintar .nav-folder:not(.is-collapsed)>.nav-folder-title>.ti-icono{-webkit-mask-image:var(--ti-img-a,var(--ti-img));mask-image:var(--ti-img-a,var(--ti-img))}
${estilos.replace(/body\.ti-[a-z-]+[^{]*\{[^}]*\}/g, "")}
${Object.entries(COLORES).map(([c, v]) => `.ti-c-${c}{--ti-color:${v}}`).join("\n")}
</style><style id="reglas"></style></head><body>
${panel("Material Icon Theme · oscuro", "theme-dark", "material")}
${panel("Material Icon Theme · claro", "theme-light", "material")}
${panel("Material Symbols · colores del tema · oscuro", "theme-dark", "simbolos")}
${panel("Material Symbols · colores del tema · claro", "theme-light", "simbolos")}
<script>document.getElementById("reglas").textContent=${JSON.stringify([...reglas.values()].join("\n"))}</script>
</body></html>`;
fs.writeFileSync(process.argv[2] || "muestra.html", html);
console.log(`[muestra] ${reglas.size} reglas · ${process.argv[2] || "muestra.html"}`);
