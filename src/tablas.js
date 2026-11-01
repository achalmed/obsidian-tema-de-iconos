/**
 * tablas.js — lo que este tema añade a los mapas de Material Icon Theme: los nombres de carpeta en español, las
 * extensiones propias de Obsidian, y para cada icono de Material su símbolo de Material Symbols y su categoría
 * (que da el color con la paleta del tema de Obsidian).
 */

/**
 * Carpetas en español (sin tildes, en minúsculas, sin el prefijo numérico «00-», con «-» entre palabras) → icono de
 * carpeta de Material Icon Theme. Lo que no está aquí se busca tal cual en el mapa de Material, que está en inglés.
 */
export const CARPETAS_ES = {
    "folder-images": ["imagenes", "imagen", "fotos", "fotografias", "figuras", "capturas", "graficos", "ilustraciones", "img", "media"],
    "folder-docs": ["documentos", "documento", "documentacion", "anexos", "documentos-extras", "escritos", "guias", "guias-y-referencias", "ayudas-memoria", "manuales", "referencia"],
    "folder-database": ["datos", "base-de-datos", "bases-de-datos", "dataset", "datasets", "banco"],
    "folder-review": ["investigacion", "investigaciones", "estudios", "analisis", "revisiones", "revision"],
    "folder-bibliography": ["bibliografia", "referencias", "fuentes", "biblioteca", "libros", "lecturas", "citas"],
    "folder-project": ["proyectos", "proyecto"],
    "folder-tasks": ["tareas", "pendientes", "por-hacer", "rutina"],
    "folder-markdown": ["notas", "apuntes", "nota"],
    "folder-archive": ["archivo", "archivado", "archivados", "historico", "antiguos", "legado", "retirados"],
    "folder-template": ["plantillas", "plantilla", "modelos"],
    "folder-src": ["codigo", "fuente", "programas"],
    "folder-config": ["configuracion", "ajustes"],
    "folder-class": ["clase", "clases", "cursos", "curso", "sesiones", "sesion", "temas", "universidad", "capacitacion", "formacion", "cursos-y-formacion", "docencia", "aula"],
    "folder-test": ["examenes", "examen", "parciales", "evaluaciones", "evaluacion", "pruebas"],
    "folder-examples": ["ejercicios", "practicas", "practica", "solucionarios", "soluciones", "solucion", "ejemplos", "examenes-y-practicas"],
    "folder-resource": ["recursos", "material", "materiales", "material-de-apoyo"],
    "folder-attachment": ["adjuntos", "adjunto"],
    "folder-mail": ["bandeja", "entrada", "por-revisar", "por-clasificar", "correo", "inbox"],
    "folder-log": ["diario", "bitacora", "registro", "registros", "semanas"],
    "folder-private": ["personal", "privado", "secretos"],
    "folder-video": ["videos", "video"],
    "folder-audio": ["audios", "audio", "musica", "podcast", "radio"],
    "folder-download": ["descargas"],
    "folder-backup": ["respaldos", "respaldo", "copias"],
    "folder-temp": ["temporal", "temporales"],
    "folder-trash": ["papelera"],
    "folder-export": ["resultados", "salidas", "salida", "exportados", "output", "ouput"],
    "folder-views": ["presentaciones", "presentacion", "diapositivas"],
    "folder-tools": ["herramientas"],
    "folder-policy": ["normas", "leyes", "legal", "normativa", "legislativo"],
    "folder-shared": ["entidades", "personas", "contactos", "equipo"],
    "folder-migrations": ["migracion", "migraciones"],
    "folder-obsidian": ["vault-os", "boveda"],
};

/**
 * Palabras sueltas, para los nombres compuestos («12-investigacion-y-metodologia», «15-proyectos-y-productividad»):
 * si el nombre entero no se reconoce, se prueba palabra por palabra con estas, con las de CARPETAS_ES y con el mapa
 * en inglés de Material. Gana la primera palabra que se reconozca.
 */
export const PALABRAS_ES = {
    "folder-docs": ["informes", "informe", "reportes", "glosario", "documentacion", "escritura", "lengua", "redaccion", "tesis", "monografia", "articulo", "articulos"],
    "folder-bibliography": ["citacion", "lectura", "conocimiento", "publicacion"],
    "folder-policy": ["derecho", "juridico", "juridicos", "normativa", "tecnica-normativa", "politicas"],
    "folder-messages": ["periodismo", "comunicacion", "prensa", "mensajes"],
    "folder-theme": ["diseno", "identidad", "marca", "estilo"],
    "folder-public": ["web", "sitio", "sitios", "publicacion-digital"],
    "folder-src": ["ingenieria", "software", "programacion", "desarrollo", "codigos"],
    "folder-app": ["tecnologias", "plataformas", "aplicaciones"],
    "folder-secure": ["ciberseguridad", "seguridad", "privacidad"],
    "folder-robot": ["inteligencia", "ia"],
    "folder-ui": ["ux", "ui", "interfaz", "accesibilidad"],
    "folder-api": ["apis", "interoperabilidad"],
    "folder-layout": ["arquitectura"],
    "folder-test": ["calidad", "evaluacion"],
    "folder-project": ["estrategia", "liderazgo", "gestion", "productividad", "trabajo", "trabajos", "negocio", "negocios", "empresa", "empresas", "plan", "propuesta", "propuestas"],
    "folder-tools": ["sistemas", "herramientas"],
    "folder-tasks": ["listas", "comprobacion", "checklists"],
    "folder-database": ["visualizacion", "estadistica", "econometria", "encuestas", "encuesta"],
    "folder-skills": ["habilidades", "competencias", "profesional"],
    "folder-global": ["economia", "politicas-publicas", "mundo"],
    "folder-class": ["docencia", "orientacion", "universidad", "taller", "talleres", "seminario", "silabos", "silabo", "autoestudio"],
    "folder-shared": ["grupo", "grupos"],
};

/** Palabras que no deciden un icono. */
/** Carpetas que se reconocen por su forma: un año («2019»), las salidas de Quarto y Pandoc («index_files»). */
export const FORMAS = [
    [/^(19|20)\d{2}$/, "folder-event"],
    [/[_ ]files$/, "folder-resource"],
];

export const VACIAS = ["y", "e", "o", "de", "del", "la", "el", "los", "las", "en", "para", "con", "por", "a", "un", "una", "and", "of", "the"];

/** Extensiones y nombres de archivo de Obsidian que Material Icon Theme no trae. */
export const EXTENSIONES_EXTRA = {
    canvas: "excalidraw", base: "database", "excalidraw.md": "excalidraw",
    // datos y salidas de programas de análisis
    wf1: "database", dta: "database", sav: "database", rdata: "r", rds: "r", mpj: "database", gnucash: "table",
    smcl: "log", out: "log", emf: "image", ggb: "image", xopp: "document", rnote: "document",
    gdoc: "google", gsheet: "google", gslides: "google",
};

/** Categorías → color de la paleta de Obsidian (cada tema define estas variables). */
export const COLORES = {
    markdown: "var(--color-blue)",
    documento: "var(--color-blue)",
    pdf: "var(--color-red)",
    hoja: "var(--color-green)",
    presentacion: "var(--color-orange)",
    imagen: "var(--color-purple)",
    multimedia: "var(--color-pink)",
    comprimido: "var(--color-yellow)",
    codigo: "var(--color-cyan)",
    datos: "var(--color-yellow)",
    latex: "var(--color-green)",
    bibliografia: "var(--color-orange)",
    cuaderno: "var(--color-orange)",
    dibujo: "var(--color-purple)",
    proyecto: "var(--color-green)",
    tarea: "var(--color-red)",
    clase: "var(--color-green)",
    investigacion: "var(--color-cyan)",
    privado: "var(--color-red)",
    bandeja: "var(--color-orange)",
    otro: "var(--icon-color)",
};

/**
 * Icono de Material Icon Theme → [símbolo de Material Symbols, categoría]. Los iconos de lenguajes de programación
 * que no están aquí van a «code» (si el icono es de un lenguaje) o al genérico.
 */
export const SIMBOLOS = {
    // archivos
    file: ["draft", "otro"],
    markdown: ["markdown", "markdown"],
    mdx: ["markdown", "markdown"],
    quarto: ["article", "markdown"],
    pdf: ["picture_as_pdf", "pdf"],
    word: ["article", "documento"],
    document: ["text_snippet", "documento"],
    readme: ["info", "documento"],
    changelog: ["history", "documento"],
    license: ["license", "documento"],
    table: ["table_chart", "hoja"],
    powerpoint: ["slideshow", "presentacion"],
    image: ["image", "imagen"],
    svg: ["image", "imagen"],
    video: ["movie", "multimedia"],
    audio: ["music_note", "multimedia"],
    zip: ["folder_zip", "comprimido"],
    json: ["data_object", "datos"],
    yaml: ["data_object", "datos"],
    toml: ["data_object", "datos"],
    xml: ["code", "datos"],
    database: ["database", "datos"],
    tex: ["functions", "latex"],
    bibliography: ["menu_book", "bibliografia"],
    jupyter: ["labs", "cuaderno"],
    excalidraw: ["draw", "dibujo"],
    console: ["terminal", "codigo"],
    powershell: ["terminal", "codigo"],
    settings: ["settings", "otro"],
    lock: ["lock", "otro"],
    log: ["receipt_long", "otro"],
    email: ["mail", "documento"],
    font: ["match_case", "otro"],
    git: ["commit", "codigo"],
    docker: ["deployed_code", "codigo"],
    html: ["html", "codigo"],
    css: ["css", "codigo"],
    javascript: ["javascript", "codigo"],
    // carpetas
    folder: ["folder", "otro"],
    "folder-images": ["photo_library", "imagen"],
    "folder-docs": ["library_books", "documento"],
    "folder-markdown": ["sticky_note_2", "markdown"],
    "folder-database": ["database", "datos"],
    "folder-review": ["science", "investigacion"],
    "folder-bibliography": ["local_library", "bibliografia"],
    "folder-project": ["work", "proyecto"],
    "folder-tasks": ["task_alt", "tarea"],
    "folder-archive": ["inventory_2", "otro"],
    "folder-template": ["file_copy", "presentacion"],
    "folder-src": ["code", "codigo"],
    "folder-scripts": ["terminal", "codigo"],
    "folder-config": ["settings", "otro"],
    "folder-class": ["school", "clase"],
    "folder-test": ["quiz", "tarea"],
    "folder-examples": ["edit_note", "clase"],
    "folder-resource": ["folder_special", "datos"],
    "folder-attachment": ["attach_file", "imagen"],
    "folder-mail": ["inbox", "bandeja"],
    "folder-log": ["calendar_month", "imagen"],
    "folder-private": ["lock", "privado"],
    "folder-video": ["movie", "multimedia"],
    "folder-audio": ["headphones", "multimedia"],
    "folder-download": ["download", "otro"],
    "folder-backup": ["backup", "otro"],
    "folder-temp": ["schedule", "otro"],
    "folder-trash": ["delete", "otro"],
    "folder-export": ["output", "datos"],
    "folder-views": ["slideshow", "presentacion"],
    "folder-tools": ["build", "codigo"],
    "folder-policy": ["gavel", "bibliografia"],
    "folder-shared": ["group", "proyecto"],
    "folder-migrations": ["swap_horiz", "codigo"],
    "folder-obsidian": ["diamond", "imagen"],
    "folder-public": ["public", "otro"],
    "folder-messages": ["forum", "documento"],
    "folder-theme": ["palette", "imagen"],
    "folder-app": ["apps", "codigo"],
    "folder-secure": ["shield", "privado"],
    "folder-robot": ["smart_toy", "investigacion"],
    "folder-ui": ["web", "codigo"],
    "folder-api": ["api", "codigo"],
    "folder-layout": ["dashboard", "proyecto"],
    "folder-skills": ["psychology", "clase"],
    "folder-global": ["public", "datos"],
    "folder-event": ["calendar_month", "imagen"],
    "folder-dist": ["output", "otro"],
    "folder-node": ["deployed_code", "codigo"],
    "folder-git": ["commit", "codigo"],
    "folder-github": ["commit", "codigo"],
    "folder-python": ["code", "codigo"],
    "folder-javascript": ["code", "codigo"],
};

/** Iconos de Material que son lenguajes de programación: van a «code» en Material Symbols. */
export const LENGUAJES = [
    "python", "typescript", "r", "java", "c", "cpp", "csharp", "go", "rust", "php", "ruby", "lua", "kotlin", "swift",
    "scala", "dart", "julia", "matlab", "haskell", "perl", "elixir", "erlang", "clojure", "fsharp", "vue", "react",
    "react_ts", "svelte", "astro", "sass", "less", "stylus", "graphql", "sql", "stata", "sas", "fortran", "assembly",
    "nix", "vim", "makefile", "cmake", "nodejs", "npm", "pnpm", "yarn", "typescript-def", "lisp",
];

/** Los símbolos que hay que empaquetar, además de los de SIMBOLOS. */
export const SIMBOLOS_BASE = ["draft", "folder", "folder_open", "code"];
