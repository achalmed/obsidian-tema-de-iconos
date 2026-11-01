# Tema de iconos

Complemento de Obsidian que aplica un **tema de iconos completo y automático** al explorador de archivos y a las
pestañas, como Material Icon Theme en VS Code y Positron: cada archivo y carpeta recibe su icono por su nombre, su
extensión o el nombre de la carpeta, sin configurar nada uno por uno.

## Colecciones

| | |
|---|---|
| **Material Icon Theme** | el tema de VS Code y Positron: más de 1 100 iconos a color, para 1 300 extensiones, 2 100 nombres especiales de archivo (`README.md`, `package.json`, `.gitignore`…) y 4 600 nombres de carpeta, con icono de carpeta abierta y variantes para el tema claro |
| **Material Symbols** | los símbolos de Google, de un solo trazo, en estilo contorno, redondeado o recto, con o sin relleno |

Colores: los del icono, **los del tema de Obsidian** (cada tipo toma un color de la paleta del tema: azul las notas,
rojo los PDF, verde las hojas de cálculo… y cambian con el tema) o monocromo, con el color del texto.

## Cómo reconoce cada cosa

- **Archivos**: primero el nombre completo (`README.md`, `package.json`), después la extensión de la más larga a la
  más corta (`dibujo.excalidraw.md` antes que `.md`). Además de las de Material: `.canvas` y `.base` de Obsidian, y
  formatos de análisis de datos (`.dta` y `.smcl` de Stata, `.sav` de SPSS, `.wf1` de EViews, `.rds` y `.rdata` de R,
  `.ggb` de GeoGebra…).
- **Carpetas**: el nombre tal cual (en inglés, como en Material: `images`, `docs`, `src`…), sin el prefijo numérico
  (`20-universidad` → `universidad`) y **en español**, sin tildes: `imágenes`, `documentos`, `datos`, `investigación`,
  `bibliografía`, `proyectos`, `tareas`, `notas`, `plantillas`, `clases`, `exámenes`, `ejercicios`, `bandeja`,
  `diario`, `personal`… Los años (`2019`) llevan un calendario y las salidas de Quarto (`index_files`) el de recursos.
- **Nombres compuestos**: si el nombre entero no se reconoce, se prueba palabra por palabra
  (`12-investigacion-y-metodologia` → investigación; `15-proyectos-y-productividad` → proyectos).

En un vault real de 630 carpetas y 3 400 archivos: el 100 % de los archivos y el 63 % de las carpetas reciben un
icono propio; el resto son nombres propios (personas, empresas, cursos) y llevan la carpeta genérica.

## Ajustes

Colección · colores · estilo y relleno de los símbolos · tamaño · iconos en las pestañas · ocultar la etiqueta de
extensión que Obsidian pone a los archivos que no son notas · respetar los iconos puestos a mano con
[Iconize](https://github.com/FlorianWoelki/obsidian-iconize).

## Cómo funciona

El explorador de Obsidian es virtual: solo existen las filas visibles. Un `MutationObserver` decora cada fila
(`.nav-file-title` / `.nav-folder-title`, con su `data-path`) cuando aparece. El icono es un `<span>` cuyo dibujo viene
de variables CSS (`--ti-img`, `--ti-img-a` para la carpeta abierta); las reglas con los SVG se escriben solo para los
iconos que aparecen. Con los colores del tema o monocromo, el SVG se usa como máscara sobre el color. Nada se guarda en
las notas ni en los ajustes de Obsidian: al desactivarlo, todo vuelve como estaba.

## Instalar

Desde una versión publicada: copia `main.js`, `manifest.json` y `styles.css` de la
[última versión](https://github.com/achalmed/obsidian-tema-de-iconos/releases/latest) a
`<vault>/.obsidian/plugins/tema-de-iconos/`, o instálalo con [BRAT](https://github.com/TfTHacker/obsidian42-brat)
dando `achalmed/obsidian-tema-de-iconos`. Después: Ajustes → Complementos de la comunidad → activar «Tema de iconos».

Desde este repo:

```bash
npm install
npm run build                              # genera los datos de iconos y main.js
./instalar.sh <ruta-del-vault>             # simula
./instalar.sh <ruta-del-vault> --aplicar   # copia a <vault>/.obsidian/plugins/tema-de-iconos/
```

## Desarrollar

```bash
npm test                                   # el clasificador, con los datos generados
node herramientas/muestra.mjs muestra.html # una página con el tema aplicado a un explorador de ejemplo
```

`src/tablas.js` tiene lo que este tema añade (carpetas en español, palabras, formatos de análisis, símbolos y colores);
`src/clasificar.js` decide el icono de una ruta; `herramientas/generar.mjs` arma los datos desde los paquetes de iconos.

## Licencia

El código, MIT. Los iconos: [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme)
(MIT) y [Material Symbols](https://github.com/google/material-design-icons) (Apache-2.0); ver `NOTICE`.
