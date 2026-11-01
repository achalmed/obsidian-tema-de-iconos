// prueba/clasificar.test.js — qué icono lleva cada ruta, con los datos generados: `npm test` (tras `npm run generar`).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { iconoMaterial, simboloDe, normalizar } from "../src/clasificar.js";

const datos = JSON.parse(fs.readFileSync(new URL("../src/generado/material.json", import.meta.url), "utf8"));
const simbolos = JSON.parse(fs.readFileSync(new URL("../src/generado/simbolos.json", import.meta.url), "utf8"));
const archivo = (ruta) => iconoMaterial(datos, ruta, false).cerrado;
const carpeta = (ruta) => iconoMaterial(datos, ruta, true);

test("archivos por extensión", () => {
    const esperado = {
        "a.md": "markdown", "a.pdf": "pdf", "a.docx": "word", "a.xlsx": "table", "a.pptx": "powerpoint",
        "a.json": "json", "a.yaml": "yaml", "a.py": "python", "a.js": "javascript", "a.tex": "tex",
        "a.bib": "bibliography", "a.qmd": "quarto", "a.csv": "table", "a.png": "image", "a.ipynb": "jupyter",
        "a.sh": "console", "a.canvas": "excalidraw", "a.base": "database", "MAYUS.PDF": "pdf",
    };
    for (const [ruta, icono] of Object.entries(esperado)) assert.equal(archivo("x/" + ruta), icono, ruta);
});

test("nombres especiales y extensiones compuestas", () => {
    assert.equal(archivo("README.md"), "readme");
    assert.equal(archivo("package.json"), "nodejs");
    assert.equal(archivo("dibujo.excalidraw.md"), "excalidraw");
    assert.equal(archivo("sin-extension"), "file");
    assert.equal(archivo("raro.qwerty"), "file");
});

test("carpetas en inglés y en español, con prefijo numérico y tildes", () => {
    const esperado = {
        images: "folder-images", "Imágenes": "folder-images", "fotografias": "folder-images",
        "00-bandeja": "folder-mail", "20-universidad": "folder-class", "notas": "folder-markdown",
        "datos": "folder-database", "Bibliografía": "folder-bibliography", "investigación": "folder-review",
        "plantillas": "folder-template", "proyectos": "folder-project", "tareas": "folder-tasks",
        "_por_revisar": "folder-mail", "50-examenes-y-practicas": "folder-examples", "src": "folder-src",
        "carpeta-cualquiera": "folder",
    };
    for (const [nombre, icono] of Object.entries(esperado)) assert.equal(carpeta("a/" + nombre).cerrado, icono, nombre);
});

test("las carpetas tienen icono abierto", () => {
    assert.equal(carpeta("images").abierto, "folder-images-open");
    assert.equal(carpeta("imagenes").abierto, "folder-images-open");
    assert.equal(carpeta("carpeta-cualquiera").abierto, "folder-open");
});

test("cada icono usado existe en los datos", () => {
    for (const r of ["a.md", "a.pdf", "x.unknown"]) assert.ok(datos.svg[archivo(r)], r);
    for (const r of ["imagenes", "datos", "x"]) {
        const c = carpeta(r);
        assert.ok(datos.svg[c.cerrado] && datos.svg[c.abierto], r);
    }
});

test("Material Symbols: símbolo y categoría", () => {
    assert.deepEqual(simboloDe("markdown", false), ["markdown", "markdown"]);
    assert.deepEqual(simboloDe("python", false), ["code", "codigo"]);
    assert.deepEqual(simboloDe("folder-images-open", true), ["photo_library", "imagen"]);
    assert.deepEqual(simboloDe("folder-raro", true), ["folder", "otro"]);
    assert.deepEqual(simboloDe("raro", false), ["draft", "otro"]);
    for (const [s] of [simboloDe("markdown"), simboloDe("folder-images", true)]) assert.ok(simbolos.estilos.outlined[s], s);
});

test("normalizar", () => {
    assert.equal(normalizar("20-Cursos y Formación"), "cursos-y-formacion");
    assert.equal(normalizar("_por_revisar"), "por-revisar");
    assert.equal(normalizar("Imágenes"), "imagenes");
});

test("nombres compuestos: la primera palabra reconocible", () => {
    const esperado = {
        "12-investigacion-y-metodologia": "folder-review", "15-proyectos-y-productividad": "folder-project",
        "11-datos-y-visualizacion": "folder-database", "06-derecho-y-tecnica-normativa": "folder-policy",
        "22-ciberseguridad-y-privacidad": "folder-secure", "23-inteligencia-artificial": "folder-robot",
        "02-documentos-academicos": "folder-docs", "14-docencia-y-presentaciones": "folder-class",
        "08-web-y-publicacion-digital": "folder-public", "y-de-la": "folder",
    };
    for (const [nombre, icono] of Object.entries(esperado)) assert.equal(carpeta("a/" + nombre).cerrado, icono, nombre);
});

test("carpetas por forma y por fecha, y formatos de análisis", () => {
    assert.equal(carpeta("diario/2019").cerrado, "folder-event");
    assert.equal(carpeta("a/index_files").cerrado, "folder-resource");
    assert.equal(carpeta("a/2025-05-31-taller-unsch-elaboracion-tesis").cerrado, "folder-class");
    assert.equal(carpeta("a/S01_solucion").cerrado, "folder-examples");
    assert.equal(carpeta("a/inbox").cerrado, "folder-mail");
    for (const [ruta, icono] of Object.entries({ "a.wf1": "database", "a.dta": "database", "a.smcl": "log", "a.rds": "r", "a.gdoc": "google" }))
        assert.equal(archivo(ruta), icono, ruta);
});
