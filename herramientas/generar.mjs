#!/usr/bin/env node
// herramientas/generar.mjs — arma los datos del tema desde los paquetes de iconos (corre antes de compilar).
//
//   src/generado/material.json  Material Icon Theme: los SVG y los mapas de extensiones, nombres de archivo y carpetas
//                               (más las variantes para tema claro)
//   src/generado/simbolos.json  Material Symbols: solo los símbolos que usan las tablas, en sus tres estilos y rellenos
// Avisa de cada símbolo de las tablas que no existe en Material Symbols, y lo cambia por el genérico.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { CARPETAS_ES, PALABRAS_ES, FORMAS, EXTENSIONES_EXTRA, SIMBOLOS, SIMBOLOS_BASE } from "../src/tablas.js";

const requerir = createRequire(import.meta.url);
const raizMaterial = path.dirname(requerir.resolve("material-icon-theme/package.json"));
const raizSimbolos = path.dirname(requerir.resolve("@material-symbols/svg-400/package.json"));
const salida = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "src", "generado");
fs.mkdirSync(salida, { recursive: true });

const minimo = (svg) => svg.replace(/<!--[\s\S]*?-->/g, "").replace(/<\?xml[^>]*>/, "").replace(/\s+/g, " ").replace(/> </g, "><").trim();

// ── Material Icon Theme ──────────────────────────────────────────────────────────────────────────────────────────
const tema = JSON.parse(fs.readFileSync(path.join(raizMaterial, "dist", "material-icons.json"), "utf8"));
const minusculas = (m) => Object.fromEntries(Object.entries(m || {}).map(([k, v]) => [k.toLowerCase(), v]));
const material = {
    version: JSON.parse(fs.readFileSync(path.join(raizMaterial, "package.json"), "utf8")).version,
    archivo: tema.file,
    carpeta: tema.folder,
    carpetaAbierta: tema.folderExpanded,
    extensiones: { ...minusculas(tema.fileExtensions), ...EXTENSIONES_EXTRA },
    nombres: minusculas(tema.fileNames),
    carpetas: minusculas(tema.folderNames),
    carpetasAbiertas: minusculas(tema.folderNamesExpanded),
    claro: {
        extensiones: minusculas(tema.light.fileExtensions),
        nombres: minusculas(tema.light.fileNames),
        carpetas: minusculas(tema.light.folderNames),
        carpetasAbiertas: minusculas(tema.light.folderNamesExpanded),
    },
    svg: {},
};
const usados = new Set([tema.file, tema.folder, tema.folderExpanded, ...Object.values(EXTENSIONES_EXTRA)]);
for (const m of [material.extensiones, material.nombres, material.carpetas, material.carpetasAbiertas, ...Object.values(material.claro)])
    Object.values(m).forEach((v) => usados.add(v));
for (const icono of [...Object.keys(CARPETAS_ES), ...Object.keys(PALABRAS_ES), ...FORMAS.map(([, i]) => i)]) {
    usados.add(icono);
    usados.add(icono + "-open");
}
let faltan = 0;
for (const icono of usados) {
    const def = tema.iconDefinitions[icono];
    if (!def) {
        if (!icono.endsWith("-open")) console.warn(`  ! Material Icon Theme no tiene el icono ${icono}`), faltan++;
        continue;
    }
    material.svg[icono] = minimo(fs.readFileSync(path.join(raizMaterial, "dist", def.iconPath), "utf8"));
}
fs.writeFileSync(path.join(salida, "material.json"), JSON.stringify(material));

// ── Material Symbols ─────────────────────────────────────────────────────────────────────────────────────────────
const nombres = new Set(SIMBOLOS_BASE);
for (const [simbolo] of Object.values(SIMBOLOS)) nombres.add(simbolo);
const simbolos = { version: JSON.parse(fs.readFileSync(path.join(raizSimbolos, "package.json"), "utf8")).version, estilos: {}, sustituidos: {} };
for (const estilo of ["outlined", "rounded", "sharp"]) {
    simbolos.estilos[estilo] = {};
    for (const nombre of nombres)
        for (const variante of [nombre, nombre + "-fill"]) {
            const archivo = path.join(raizSimbolos, estilo, variante + ".svg");
            if (fs.existsSync(archivo)) simbolos.estilos[estilo][variante] = minimo(fs.readFileSync(archivo, "utf8"));
        }
}
for (const nombre of nombres)
    if (!simbolos.estilos.outlined[nombre]) {
        const sustituto = nombre.startsWith("folder") ? "folder" : "draft";
        console.warn(`  ! Material Symbols no tiene ${nombre}: se usa ${sustituto}`);
        simbolos.sustituidos[nombre] = sustituto;
        faltan++;
    }
fs.writeFileSync(path.join(salida, "simbolos.json"), JSON.stringify(simbolos));

const kb = (f) => Math.round(fs.statSync(path.join(salida, f)).size / 1024);
console.log(
    `[generar] Material Icon Theme ${material.version}: ${Object.keys(material.svg).length} iconos (${kb("material.json")} KB) · ` +
        `Material Symbols ${simbolos.version}: ${nombres.size} símbolos × 3 estilos (${kb("simbolos.json")} KB)` +
        (faltan ? ` · ${faltan} avisos` : ""),
);
