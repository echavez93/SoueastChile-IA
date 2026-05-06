// shared/services/cotizarRouter.js
// Router central de "Cotizar". Resuelve la URL del formulario que corresponde
// al modelo activo o solicitado, con un solo punto de verdad.
//
// Por qué existe:
// El botón "Cotizar" aparece en Navbar, MegaMenu, Footer, hero de modelo, cards
// y handlers de click globales. Antes cada uno hardcodeaba "modelo-s06.html#cotizar",
// lo que rompe cuando el usuario está navegando un S07 o S09 (te mandaba al S06).
// Este servicio centraliza:
//
//   1. El MAPA modelo → URL del formulario.
//   2. La normalización del nombre del modelo (trim, lowercase, sin prefijos).
//   3. La detección del modelo actual desde la página (body[data-modelo]).
//
// Patrón equivalente en Angular: un @Injectable CotizarRouterService con los
// mismos métodos. Acá lo dejamos como IIFE + window.cotizarRouter.

(function () {
  // ── Mapa central: modelo → ruta del formulario ────────────────────────────
  // Cada slug en lowercase apunta a la página que contiene la sección #cotizar.
  // El hash final asegura el scroll a la sección.
  // Para agregar un modelo nuevo: una línea acá. Nada más.
  const COTIZAR_URLS = {
    s06: "modelo-s06.html#cotizar",
    s07: "modelo-s07.html#cotizar",
    s09: "modelo-s09.html#cotizar",
  };

  // Modelo por defecto si no se detecta uno en la página actual (caso típico:
  // botón "Cotizar" en Home o Sucursales, donde no hay un modelo seleccionado).
  const DEFAULT_MODELO = "s06";

  /**
   * Normaliza un nombre de modelo a su slug interno.
   * Acepta:  "S06", "s06", " SOUEAST S06 ", "soueast-s06", "Soueast  S06"
   * Devuelve: "s06"
   * @param {string} input
   * @returns {string} slug normalizado, o "" si no es válido
   */
  function normalize(input) {
    if (!input || typeof input !== "string") return "";
    return input
      .trim()
      .toLowerCase()
      .replace(/^soueast[\s\-_]*/i, "") // quita prefijo "SOUEAST " si viene
      .replace(/[\s\-_]+/g, "")          // colapsa separadores internos
      .trim();
  }

  /**
   * Devuelve la URL del formulario de cotización para un modelo dado.
   * Si el modelo no está en el mapa, cae al DEFAULT_MODELO.
   * @param {string} [modelo]  Nombre del modelo (cualquier formato)
   * @returns {string} URL absoluta o relativa del formulario
   */
  function getCotizarUrl(modelo) {
    const slug = normalize(modelo);
    if (slug && COTIZAR_URLS[slug]) {
      return COTIZAR_URLS[slug];
    }
    if (slug) {
      console.warn("[cotizarRouter] modelo desconocido:", modelo, "→ fallback", DEFAULT_MODELO);
    }
    return COTIZAR_URLS[DEFAULT_MODELO];
  }

  /**
   * Detecta el modelo activo en la vista actual.
   * Orden de búsqueda:
   *   1. body[data-modelo]          ← stamp explícito por página (preferido)
   *   2. window.__PAGE_MODELO       ← override programático
   *   3. nombre del archivo HTML    ← heurística (modelo-s06.html → "s06")
   * Si nada matchea, retorna "" — el caller decide qué hacer (típicamente,
   * caer al DEFAULT_MODELO via getCotizarUrl()).
   * @returns {string} slug normalizado o "" si no se detecta
   */
  function getCurrentModelo() {
    // 1. Stamp en <body data-modelo="S06">
    if (typeof document !== "undefined" && document.body) {
      const stamp = document.body.getAttribute("data-modelo");
      const fromStamp = normalize(stamp);
      if (fromStamp) return fromStamp;
    }
    // 2. Override programático
    if (typeof window !== "undefined" && window.__PAGE_MODELO) {
      const fromGlobal = normalize(window.__PAGE_MODELO);
      if (fromGlobal) return fromGlobal;
    }
    // 3. Heurística por filename
    if (typeof window !== "undefined" && window.location) {
      const m = window.location.pathname.match(/modelo-([a-z0-9]+)\.html/i);
      if (m && m[1]) {
        const fromUrl = normalize(m[1]);
        if (fromUrl && COTIZAR_URLS[fromUrl]) return fromUrl;
      }
    }
    return "";
  }

  /**
   * Atajo: URL del cotizador para el modelo actual de la vista.
   * Si la vista no tiene un modelo asociado (Home, Sucursales), cae a DEFAULT_MODELO.
   * Si la vista YA es la página del modelo, devuelve solo "#cotizar" para que
   * el handler de scroll suave intercepte y no se recargue la página.
   * @returns {string}
   */
  function getCurrentCotizarUrl() {
    const target = getCotizarUrl(getCurrentModelo());
    if (isSamePageCotizar(target)) return "#cotizar";
    return target;
  }

  /**
   * Indica si la URL pasada apunta al cotizador del modelo actual.
   * Útil para que un click handler sepa si tiene que hacer scroll suave (misma
   * página) o navegar a otra página.
   * @param {string} url
   * @returns {boolean}
   */
  function isSamePageCotizar(url) {
    if (!url) return false;
    if (url === "#cotizar") return true;
    const here = typeof window !== "undefined" && window.location
      ? window.location.pathname.split("/").pop()
      : "";
    // url tipo "modelo-s06.html#cotizar"
    const [path, hash] = url.split("#");
    return hash === "cotizar" && path === here;
  }

  window.cotizarRouter = {
    getCotizarUrl,
    getCurrentModelo,
    getCurrentCotizarUrl,
    isSamePageCotizar,
    normalize,
    // Exponemos el mapa por si alguien quiere iterar (tests, debugging).
    _COTIZAR_URLS: COTIZAR_URLS,
    _DEFAULT_MODELO: DEFAULT_MODELO,
  };
})();
