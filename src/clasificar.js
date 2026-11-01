/**
 * clasificar.js — qué icono lleva una ruta, sin Obsidian. Para Material Icon Theme: nombre especial de archivo →
 * extensión (de la más larga a la más corta: «excalidraw.md» antes que «md») → genérico; para carpetas: el nombre
 * tal cual, sin el prefijo numérico («20-universidad» → «universidad») y su equivalente en español, abierta y
 * cerrada. Para Material Symbols, el símbolo y la categoría del icono de Material que le tocaría.
 */
import { CARPETAS_ES, PALABRAS_ES, FORMAS, VACIAS, SIMBOLOS, LENGUAJES } from "./tablas.js";

const ALIAS = {};
for (const [icono, nombres] of Object.entries(CARPETAS_ES)) for (const n of nombres) ALIAS[n] = icono;
const PALABRA = { ...ALIAS };
for (const [icono, nombres] of Object.entries(PALABRAS_ES)) for (const n of nombres) PALABRA[n] = icono;
const VACIA = new Set(VACIAS);

/** El icono de la primera palabra reconocible de un nombre compuesto, en español o en el mapa de Material. */
function porPalabras(datos, nombre) {
    for (const palabra of normalizar(nombre).split("-")) {
        if (palabra.length < 2 || VACIA.has(palabra)) continue;
        const icono = PALABRA[palabra] || (palabra.length > 2 ? datos.carpetas[palabra] : null);
        if (icono && datos.svg[icono]) return icono;
    }
    return null;
}

/** «20-Universidad», «Imágenes», «por_revisar» → «universidad», «imagenes», «por-revisar». */
export const normalizar = (nombre) =>
    nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/^\d{4}-\d{2}-\d{2}[-_. ]*/, "")
        .replace(/^\d+[-_. ]*/, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");

const nombreDe = (ruta) => ruta.slice(ruta.lastIndexOf("/") + 1);

/** Las claves con que se busca un archivo: su nombre y sus extensiones, de la más larga a la más corta. */
function clavesDeArchivo(nombre) {
    const partes = nombre.toLowerCase().split(".");
    const extensiones = [];
    for (let i = 1; i < partes.length; i++) extensiones.push(partes.slice(i).join("."));
    return { nombre: nombre.toLowerCase(), extensiones };
}

function buscarArchivo(mapas, nombre) {
    const { nombre: n, extensiones } = clavesDeArchivo(nombre);
    if (mapas.nombres[n]) return mapas.nombres[n];
    for (const e of extensiones) if (mapas.extensiones[e]) return mapas.extensiones[e];
    return null;
}

function buscarCarpeta(mapa, nombre) {
    const l = nombre.toLowerCase();
    const sinNumero = l.replace(/^\d+[-_. ]*/, "");
    return mapa[l] || mapa[sinNumero] || mapa[normalizar(nombre)] || null;
}

/**
 * El icono de Material Icon Theme de una ruta: { cerrado, abierto, claroCerrado, claroAbierto } (abierto solo en
 * carpetas; los «claro» solo si el tema claro usa otro).
 */
export function iconoMaterial(datos, ruta, esCarpeta) {
    const nombre = nombreDe(ruta);
    if (!esCarpeta) {
        const cerrado = buscarArchivo(datos, nombre) || datos.archivo;
        const claro = buscarArchivo(datos.claro, nombre);
        return { cerrado, claroCerrado: claro && claro !== cerrado ? claro : null };
    }
    const alias = ALIAS[normalizar(nombre)];
    const cerrado =
        buscarCarpeta(datos.carpetas, nombre) ||
        (alias && datos.svg[alias] ? alias : null) ||
        (FORMAS.find(([rx]) => rx.test(nombre.toLowerCase())) || [])[1] ||
        porPalabras(datos, nombre) ||
        datos.carpeta;
    let abierto = buscarCarpeta(datos.carpetasAbiertas, nombre);
    if (!abierto) abierto = datos.svg[cerrado + "-open"] ? cerrado + "-open" : cerrado === datos.carpeta ? datos.carpetaAbierta : cerrado;
    const claroCerrado = buscarCarpeta(datos.claro.carpetas, nombre);
    const claroAbierto = buscarCarpeta(datos.claro.carpetasAbiertas, nombre);
    return {
        cerrado,
        abierto,
        claroCerrado: claroCerrado && claroCerrado !== cerrado ? claroCerrado : null,
        claroAbierto: claroAbierto && claroAbierto !== abierto ? claroAbierto : null,
    };
}

/** [símbolo, categoría] de Material Symbols para un icono de Material Icon Theme. */
export function simboloDe(iconoDeMaterial, esCarpeta) {
    const base = iconoDeMaterial.replace(/-open$/, "").replace(/_light$/, "");
    if (SIMBOLOS[base]) return SIMBOLOS[base];
    if (LENGUAJES.includes(base) || (esCarpeta && LENGUAJES.includes(base.replace(/^folder-/, ""))))
        return ["code", "codigo"];
    return esCarpeta ? ["folder", "otro"] : ["draft", "otro"];
}

/** La categoría de color de un icono de Material Icon Theme (la misma que su símbolo). */
export const categoriaDe = (iconoDeMaterial, esCarpeta) => simboloDe(iconoDeMaterial, esCarpeta)[1];
