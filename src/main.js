/**
 * main.js — Tema de iconos, complemento de Obsidian (https://github.com/achalmed/obsidian-tema-de-iconos).
 *
 * Pone un icono a cada archivo y carpeta del explorador (y a las pestañas) sin configurar nada uno por uno, como
 * Material Icon Theme en VS Code y Positron: por nombre especial, extensión y nombre de carpeta (también en español).
 *
 * El explorador de Obsidian es virtual: solo existen en el DOM las filas visibles. Un MutationObserver decora cada
 * fila (`.nav-file-title` / `.nav-folder-title`, con su `data-path`) cuando aparece. El icono es un <span> cuyo
 * dibujo viene de una variable CSS (`--ti-img`, `--ti-img-a` abierta); las reglas con los SVG se escriben solo para
 * los iconos que aparecen. Con colores del tema o monocromo, el SVG se usa como máscara sobre `--ti-color`.
 */
import { Plugin, PluginSettingTab, Setting } from "obsidian";
import material from "./generado/material.json";
import simbolos from "./generado/simbolos.json";
import { iconoMaterial, simboloDe, categoriaDe } from "./clasificar.js";
import { COLORES } from "./tablas.js";

const AJUSTES = {
    coleccion: "material",    // material (Material Icon Theme) · simbolos (Material Symbols)
    color: "original",        // original (los del icono) · tema (paleta del tema de Obsidian) · mono (color del texto)
    estilo: "rounded",        // Material Symbols: outlined · rounded · sharp
    relleno: false,           // Material Symbols: variante rellena
    tamano: 16,
    pestanas: true,
    ocultarEtiqueta: true,    // la etiqueta de extensión (PDF, PNG…) que Obsidian pone a los archivos que no son notas
    respetarIconize: true,
};

const SELECTOR = ".nav-file-title[data-path], .nav-folder-title[data-path]";
const claseDe = (nombre) => nombre.replace(/[^a-zA-Z0-9_-]/g, "_");
const urlDe = (svg) => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

export default class TemaDeIconos extends Plugin {
    async onload() {
        this.ajustes = { ...AJUSTES, ...((await this.loadData()) || {}) };
        this.addSettingTab(new PestanaTema(this.app, this));
        this.estilo = document.head.createEl("style", { attr: { id: "tema-de-iconos-reglas" } });
        this.register(() => this.estilo.remove());
        this.observadores = new Map();   // contenedor del explorador → MutationObserver
        this.reiniciar();
        this.app.workspace.onLayoutReady(() => {
            this.vigilarExploradores();
            this.decorarPestanas();
        });
        this.registerEvent(this.app.workspace.on("layout-change", () => {
            this.vigilarExploradores();
            this.decorarPestanas();
        }));
        this.registerEvent(this.app.workspace.on("file-open", () => this.decorarPestanas()));
        this.registerEvent(this.app.vault.on("rename", () => this.decorarPestanas()));
    }

    onunload() {
        for (const o of this.observadores.values()) o.disconnect();
        document.querySelectorAll(".ti-icono").forEach((e) => e.remove());
        document.querySelectorAll(".ti-con-icono").forEach((e) => e.removeClass("ti-con-icono"));
        document.body.removeClass("ti-pintar", "ti-mono", "ti-ocultar-etiqueta");
        document.body.style.removeProperty("--ti-tam");
    }

    /** Vuelve a empezar con los ajustes actuales: reglas, clases del cuerpo y todas las filas visibles. */
    reiniciar() {
        const a = this.ajustes;
        this.reglas = new Set();
        this.cache = new Map();
        const colores = Object.entries(COLORES).map(([c, v]) => `.ti-c-${c}{--ti-color:${v}}`).join("\n");
        this.estilo.textContent = colores + "\n";
        const pintar = a.coleccion === "simbolos" || a.color !== "original";
        document.body.toggleClass("ti-pintar", pintar);
        document.body.toggleClass("ti-mono", a.color === "mono");
        document.body.toggleClass("ti-ocultar-etiqueta", a.ocultarEtiqueta);
        document.body.style.setProperty("--ti-tam", `${a.tamano}px`);
        document.querySelectorAll(".ti-icono").forEach((e) => e.remove());
        document.querySelectorAll(SELECTOR).forEach((el) => this.decorar(el));
        this.decorarPestanas();
    }

    vigilarExploradores() {
        for (const hoja of this.app.workspace.getLeavesOfType("file-explorer")) {
            const contenedor = hoja.view.containerEl.querySelector(".nav-files-container");
            if (!contenedor || this.observadores.has(contenedor)) continue;
            const observador = new MutationObserver((cambios) => {
                for (const c of cambios) {
                    if (c.type === "attributes") this.decorar(c.target);
                    else
                        for (const n of c.addedNodes) {
                            if (!(n instanceof HTMLElement)) continue;
                            if (n.matches(SELECTOR)) this.decorar(n);
                            n.querySelectorAll(SELECTOR).forEach((el) => this.decorar(el));
                        }
                }
            });
            observador.observe(contenedor, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-path"] });
            this.observadores.set(contenedor, observador);
            contenedor.querySelectorAll(SELECTOR).forEach((el) => this.decorar(el));
        }
        for (const [contenedor, o] of this.observadores)
            if (!contenedor.isConnected) o.disconnect(), this.observadores.delete(contenedor);
    }

    /** Las clases del icono de una ruta (con caché). */
    clases(ruta, esCarpeta) {
        const clave = (esCarpeta ? "d:" : "f:") + ruta;
        if (this.cache.has(clave)) return this.cache.get(clave);
        const m = iconoMaterial(material, ruta, esCarpeta);
        const clases = ["ti-icono", "ti-c-" + categoriaDe(m.cerrado, esCarpeta)];
        if (this.ajustes.coleccion === "simbolos") {
            const [cerrado] = simboloDe(m.cerrado, esCarpeta);
            clases.push(this.regla("i", this.simbolo(cerrado)));
            if (esCarpeta) clases.push(this.regla("a", this.simbolo(cerrado === "folder" ? "folder_open" : cerrado)));
        } else {
            clases.push(this.regla("i", "m:" + m.cerrado));
            if (esCarpeta) clases.push(this.regla("a", "m:" + m.abierto));
            if (m.claroCerrado) clases.push(this.regla("il", "m:" + m.claroCerrado));
            if (esCarpeta && m.claroAbierto) clases.push(this.regla("al", "m:" + m.claroAbierto));
        }
        this.cache.set(clave, clases);
        return clases;
    }

    /** La clave de un símbolo con el estilo y el relleno elegidos (o sin relleno, si no hay variante rellena). */
    simbolo(nombre) {
        const estilo = simbolos.estilos[this.ajustes.estilo] || simbolos.estilos.outlined;
        const base = simbolos.sustituidos[nombre] || nombre;
        const elegido = this.ajustes.relleno && estilo[base + "-fill"] ? base + "-fill" : base;
        return "s:" + this.ajustes.estilo + ":" + elegido;
    }

    /** Escribe (una vez) la regla CSS de un icono y devuelve su clase. tipo: i (cerrado) · a (abierto) · il/al (claro). */
    regla(tipo, clave) {
        const clase = `ti-${tipo}-${claseDe(clave)}`;
        if (this.reglas.has(clase)) return clase;
        const [coleccion, ...resto] = clave.split(":");
        const svg = coleccion === "m" ? material.svg[resto[0]] : (simbolos.estilos[resto[0]] || simbolos.estilos.outlined)[resto[1]];
        if (!svg) return "ti-sin-icono";
        const variable = tipo === "i" || tipo === "il" ? "--ti-img" : "--ti-img-a";
        const selector = tipo.endsWith("l") ? `.theme-light .${clase}` : `.${clase}`;
        this.estilo.sheet.insertRule(`${selector}{${variable}:${urlDe(svg)}}`, this.estilo.sheet.cssRules.length);
        this.reglas.add(clase);
        return clase;
    }

    decorar(fila) {
        const ruta = fila.getAttribute("data-path");
        if (!ruta) return;
        const esCarpeta = fila.classList.contains("nav-folder-title");
        if (this.ajustes.respetarIconize && fila.querySelector(".iconize-icon")) return fila.querySelector(".ti-icono")?.remove();
        let icono = fila.querySelector(":scope > .ti-icono");
        if (icono && icono.dataset.ruta === ruta) return;
        if (!icono) {
            icono = createSpan();
            const contenido = fila.querySelector(":scope > .tree-item-inner");
            fila.insertBefore(icono, contenido || fila.firstChild);
        }
        icono.className = this.clases(ruta, esCarpeta).join(" ");
        icono.dataset.ruta = ruta;
    }

    decorarPestanas() {
        if (!this.reglas) return;
        this.app.workspace.iterateAllLeaves((hoja) => {
            const lugar = hoja.tabHeaderInnerIconEl;
            if (!lugar) return;
            // Solo las pestañas de documentos: las de las barras laterales (enlaces, esquema) también tienen un
            // `file`, el de la nota a la que están ligadas, y conservan su propio icono.
            const raiz = hoja.getRoot && hoja.getRoot();
            if (raiz === this.app.workspace.leftSplit || raiz === this.app.workspace.rightSplit) return;
            // Las pestañas diferidas (no vistas aún) no tienen view.file: la ruta está en su estado.
            const estado = hoja.isDeferred && hoja.getViewState && hoja.getViewState();
            const ruta = (hoja.view && hoja.view.file && hoja.view.file.path) || (estado && estado.state && estado.state.file);
            let icono = lugar.querySelector(":scope > .ti-icono");
            if (!this.ajustes.pestanas || typeof ruta !== "string") {
                icono?.remove();
                lugar.removeClass("ti-con-icono");
                return;
            }
            if (!icono) icono = lugar.createSpan();
            icono.className = this.clases(ruta, false).join(" ");
            lugar.addClass("ti-con-icono");
        });
    }
}

class PestanaTema extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        const p = this.plugin;
        const a = p.ajustes;
        const cambiar = async (clave, valor, redibujar) => {
            a[clave] = valor;
            await p.saveData(a);
            p.reiniciar();
            if (redibujar) this.display();
        };
        containerEl.empty();

        new Setting(containerEl)
            .setName("Colección")
            .setDesc(`Material Icon Theme ${material.version}: el de VS Code y Positron, a color. Material Symbols ${simbolos.version}: los símbolos de Google, de un trazo, con los colores del tema.`)
            .addDropdown((d) =>
                d.addOptions({ material: "Material Icon Theme", simbolos: "Material Symbols" })
                    .setValue(a.coleccion)
                    .onChange((v) => cambiar("coleccion", v, true)),
            );
        new Setting(containerEl)
            .setName("Colores")
            .setDesc("«Del tema» pinta cada tipo con la paleta del tema de Obsidian (azul las notas, rojo los PDF…), así cambia con el tema.")
            .addDropdown((d) => {
                if (a.coleccion === "material") d.addOption("original", "Los del icono");
                d.addOptions({ tema: "Del tema de Obsidian", mono: "Monocromo (color del texto)" });
                d.setValue(a.coleccion === "simbolos" && a.color === "original" ? "tema" : a.color).onChange((v) => cambiar("color", v));
            });
        if (a.coleccion === "simbolos") {
            new Setting(containerEl)
                .setName("Estilo de los símbolos")
                .addDropdown((d) =>
                    d.addOptions({ outlined: "Contorno", rounded: "Redondeado", sharp: "Recto" })
                        .setValue(a.estilo)
                        .onChange((v) => cambiar("estilo", v)),
                );
            new Setting(containerEl)
                .setName("Símbolos rellenos")
                .addToggle((t) => t.setValue(a.relleno).onChange((v) => cambiar("relleno", v)));
        }
        new Setting(containerEl)
            .setName("Tamaño")
            .setDesc("En píxeles.")
            .addSlider((s) => s.setLimits(12, 24, 1).setValue(a.tamano).setDynamicTooltip().onChange((v) => cambiar("tamano", v)));
        new Setting(containerEl)
            .setName("Iconos en las pestañas")
            .addToggle((t) => t.setValue(a.pestanas).onChange((v) => cambiar("pestanas", v)));
        new Setting(containerEl)
            .setName("Ocultar la etiqueta de extensión")
            .setDesc("La que Obsidian pone a los archivos que no son notas (PDF, PNG…): el icono ya lo dice.")
            .addToggle((t) => t.setValue(a.ocultarEtiqueta).onChange((v) => cambiar("ocultarEtiqueta", v)));
        new Setting(containerEl)
            .setName("Respetar los iconos de Iconize")
            .setDesc("Si un archivo o carpeta tiene un icono puesto a mano con Iconize, se deja ese.")
            .addToggle((t) => t.setValue(a.respetarIconize).onChange((v) => cambiar("respetarIconize", v)));
    }
}
