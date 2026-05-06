// shared/services/strapiService.js
// Cliente liviano para Strapi v4/v5 — sigue el mismo patrón que cotizadorService
// y bloomreachService: IIFE que cuelga un objeto en window.strapiService.
//
// Responsabilidades:
//   1. Construir URLs con query params (qs-style flat: filters[campo][$eq]=valor).
//   2. Normalizar la respuesta de Strapi (data.attributes.x → x; relaciones planas).
//      Funciona tanto con Strapi v4 (data.attributes) como v5 (objetos planos).
//   3. Resolver URLs de assets (media) — prefijar STRAPI_URL si la URL es relativa.
//   4. Cachear en memoria por (endpoint+query) para evitar refetch en la misma sesión.
//   5. Exponer métodos de alto nivel para los content types del proyecto:
//        listModelos, getModelo, listSucursales, getFooter, ...
//
// Configuración esperada en window.__APP_CONFIG (vía env.js):
//   STRAPI_URL    → "https://strapi.grupokaufmann.com" (sin slash final)
//   STRAPI_TOKEN  → API token con scope find/findOne (read-only). Opcional si el
//                   content type es público.
//
// Patrón equivalente Angular: @Injectable StrapiService con HttpClient.

(function () {
  // ── Config ────────────────────────────────────────────────────────────────
  function getConfig() {
    const env = window.ENV || window.__APP_CONFIG || {};
    return {
      baseUrl: (env.STRAPI_URL || "").replace(/\/+$/, ""),
      token: env.STRAPI_TOKEN || "",
    };
  }

  // ── Cache en memoria ──────────────────────────────────────────────────────
  // Key: "endpoint?qs". Value: Promise<NormalizedData>.
  // Cachear la Promise (no el valor resuelto) deduplica fetches en vuelo.
  const _cache = new Map();

  function cacheKey(endpoint, query) {
    return endpoint + "?" + buildQueryString(query || {});
  }

  function clearCache(prefix) {
    if (!prefix) {
      _cache.clear();
      return;
    }
    for (const k of _cache.keys()) {
      if (k.startsWith(prefix)) _cache.delete(k);
    }
  }

  // ── Query string builder (estilo qs flat) ─────────────────────────────────
  // Strapi espera: filters[region][$eq]=Metropolitana&populate=*&pagination[pageSize]=50
  // Soporta objetos anidados, arrays (con índices) y valores primitivos.
  function buildQueryString(obj, prefix) {
    const parts = [];
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val === undefined || val === null) continue;
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(val)) {
        val.forEach((item, i) => {
          if (item !== null && typeof item === "object") {
            parts.push(buildQueryString(item, `${fullKey}[${i}]`));
          } else {
            parts.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(item)}`);
          }
        });
      } else if (typeof val === "object") {
        parts.push(buildQueryString(val, fullKey));
      } else {
        parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(val)}`);
      }
    }
    return parts.filter(Boolean).join("&");
  }

  // ── Normalización ─────────────────────────────────────────────────────────
  // Strapi v4 envuelve cada entidad en { id, attributes: { ... } } y las relaciones
  // en { data: { id, attributes: ... } } o { data: [...] }. Aplanamos todo a un
  // objeto plano para que los componentes consuman entity.campo directamente.
  function normalize(node) {
    if (node === null || node === undefined) return node;

    // Lista paginada: { data: [...], meta: {...} }
    if (Array.isArray(node)) {
      return node.map(normalize);
    }

    if (typeof node !== "object") return node;

    // Wrapper de relación v4: { data: ... }  → desenvolver
    if ("data" in node && Object.keys(node).length <= 2 /* data + meta a veces */) {
      return normalize(node.data);
    }

    // Entidad v4: { id, attributes: {...} }
    if ("attributes" in node && node.attributes && typeof node.attributes === "object") {
      const flat = { id: node.id, ...node.attributes };
      // Recorrer cada attr — relaciones y components anidados también pueden venir envueltos
      const result = {};
      for (const k of Object.keys(flat)) {
        result[k] = normalize(flat[k]);
      }
      return result;
    }

    // Objeto plano (v5 o componentes) — recorrer recursivamente
    const result = {};
    for (const k of Object.keys(node)) {
      result[k] = normalize(node[k]);
    }
    return result;
  }

  // ── Asset URLs ────────────────────────────────────────────────────────────
  // Strapi devuelve URLs relativas para assets locales ("/uploads/foo.jpg") y
  // absolutas para providers (S3, Cloudinary). Esta función se encarga de los dos.
  function assetUrl(media, format) {
    if (!media) return "";
    const cfg = getConfig();
    // media puede ser: string, objeto media plano, objeto con .url, o array (toma el primero)
    if (Array.isArray(media)) media = media[0];
    if (!media) return "";
    if (typeof media === "string") {
      return /^https?:\/\//.test(media) ? media : cfg.baseUrl + media;
    }
    let url = media.url || "";
    if (format && media.formats && media.formats[format] && media.formats[format].url) {
      url = media.formats[format].url;
    }
    if (!url) return "";
    return /^https?:\/\//.test(url) ? url : cfg.baseUrl + url;
  }

  // ── Core fetch ────────────────────────────────────────────────────────────
  // Devuelve { data, meta } — data ya normalizada. Lanza si hay error de red o HTTP.
  async function request(endpoint, query, opts) {
    opts = opts || {};
    const cfg = getConfig();
    if (!cfg.baseUrl) {
      throw new Error("[strapi] STRAPI_URL no configurada en window.__APP_CONFIG");
    }

    const key = cacheKey(endpoint, query);
    if (!opts.bypassCache && _cache.has(key)) {
      return _cache.get(key);
    }

    const qs = buildQueryString(query || {});
    const url = `${cfg.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}${qs ? "?" + qs : ""}`;

    const headers = { "Accept": "application/json" };
    if (cfg.token) headers["Authorization"] = `Bearer ${cfg.token}`;

    const promise = fetch(url, { headers })
      .then(async (res) => {
        if (!res.ok) {
          let body = null;
          try { body = await res.json(); } catch (_) {}
          const err = new Error(`[strapi] HTTP ${res.status} en ${endpoint}`);
          err.status = res.status;
          err.body = body;
          throw err;
        }
        const json = await res.json();
        // Strapi siempre responde { data, meta? } salvo en errores
        return {
          data: normalize(json.data),
          meta: json.meta || null,
        };
      })
      .catch((err) => {
        // No cachear errores — al refrescar debe reintentar
        _cache.delete(key);
        throw err;
      });

    _cache.set(key, promise);
    return promise;
  }

  // ── Helpers de alto nivel (uno por content type del proyecto) ─────────────

  /**
   * Lineup para el MegaMenu — modelos publicados, agrupados por categoría
   * y con un subset de destacados para el estado "initial". Una sola llamada
   * cubre los dos estados del menú; el cache global del servicio asegura que
   * no se repita el fetch al navegar entre páginas.
   */
  async function getLineup(opts) {
    const query = {
      populate: "*",
      sort: ["orden:asc", "nombre:asc"],
      pagination: { pageSize: 100 },
      ...(opts || {}),
    };
    const res = await request("/api/modelos", query);
    const modelos = res.data || [];
    // Si Strapi está accesible pero no hay modelos publicados todavía
    // (caso típico durante la migración), lanzamos para que useStrapi
    // entregue el fallback estático en vez de un menú vacío.
    if (!modelos.length) {
      throw new Error("getLineup: sin modelos publicados — usando fallback");
    }
    // Agrupar por categoría preservando orden de inserción.
    const byCategoria = {};
    for (const m of modelos) {
      const cat = m.categoria || "SUV";
      if (!byCategoria[cat]) byCategoria[cat] = [];
      byCategoria[cat].push(m);
    }
    return {
      modelos,
      destacados: modelos.filter((m) => m.destacado),
      byCategoria,
    };
  }

  /**
   * Lista todos los modelos publicados. populate=* para que la galería e
   * imagen principal vengan resueltas en la misma llamada.
   */
  async function listModelos(opts) {
    const query = {
      populate: "*",
      sort: "orden:asc",
      pagination: { pageSize: 100 },
      ...(opts || {}),
    };
    const res = await request("/api/modelos", query);
    return res.data || [];
  }

  /**
   * Obtiene un modelo por slug (UID único). Retorna null si no existe.
   */
  async function getModelo(slug, opts) {
    if (!slug) return null;
    const query = {
      filters: { slug: { $eq: slug } },
      populate: "*",
      ...(opts || {}),
    };
    const res = await request("/api/modelos", query);
    const list = res.data || [];
    return list[0] || null;
  }

  /**
   * Lista sucursales. Acepta filtros opcionales por región o por tipo de servicio
   * (ventas/repuestos/servicio) — replica el shape del array hardcoded actual.
   */
  async function listSucursales(filters, opts) {
    filters = filters || {};
    const strapiFilters = {};
    if (filters.region) strapiFilters.region = { $eq: filters.region };
    if (filters.servicio) strapiFilters.servicios = { $contains: filters.servicio };
    if (filters.q) {
      strapiFilters.$or = [
        { nombre: { $containsi: filters.q } },
        { comuna: { $containsi: filters.q } },
        { direccion: { $containsi: filters.q } },
      ];
    }

    const query = {
      filters: strapiFilters,
      populate: "*",
      sort: "nombre:asc",
      pagination: { pageSize: 200 },
      ...(opts || {}),
    };
    const res = await request("/api/sucursales", query);
    return res.data || [];
  }

  /**
   * Single Type "footer" — retorna el objeto plano (o null si no está publicado).
   */
  async function getFooter(opts) {
    const query = { populate: "*", ...(opts || {}) };
    const res = await request("/api/footer", query);
    return res.data || null;
  }

  /**
   * Single Type "global" — typically nav lineup, mega-menu config, ...
   */
  async function getGlobal(opts) {
    const query = { populate: { lineup: { populate: "*" } }, ...(opts || {}) };
    const res = await request("/api/global", query);
    return res.data || null;
  }

  // ── Exponer en window ─────────────────────────────────────────────────────
  window.strapiService = {
    // Bajo nivel
    request,
    assetUrl,
    clearCache,
    // Alto nivel (uno por content type)
    listModelos,
    getModelo,
    getLineup,
    listSucursales,
    getFooter,
    getGlobal,
    // Utilidades expuestas para tests / depuración
    _normalize: normalize,
    _buildQueryString: buildQueryString,
    _cache,
  };
})();
