// shared/services/bloomreachService.js
// Wrapper para Bloomreach (Exponea). Centraliza inicialización, identificación
// y tracking de eventos. Todas las llamadas son seguras: si window.exponea no
// existe (script aún no cargó o falló), la función registra un warn y retorna.
//
// En el port a Angular: este archivo se traduce a un @Injectable AnalyticsService
// con los mismos métodos. La carga del snippet se hace en index.html (head).

(function () {
  function ready() {
    return typeof window !== "undefined" && !!window.exponea && typeof window.exponea.track === "function";
  }

  /**
   * Marca como inicializado. El snippet ya ejecuta exponea.start() en el head;
   * este método existe para mantener un punto de entrada explícito desde la app
   * (logging QA + posibilidad futura de re-inicializar con customer dinámico).
   */
  function initBloomreach() {
    if (!ready()) {
      console.warn("[bloomreach] window.exponea no disponible (script aún cargando o bloqueado)");
      return false;
    }
    console.info("[bloomreach] init OK — snippet v", window.exponea.snippetVersion || "?");
    return true;
  }

  /**
   * Identifica un cliente en Bloomreach. Llamar cuando se conozca el ID
   * (login, RUT, lead enviado, etc.).
   * @param {string} customerId  Identificador único del cliente (registered).
   * @param {Object} [customerData]  Atributos adicionales (first_name, email, ...).
   */
  function identifyCustomer(customerId, customerData) {
    if (!ready()) {
      console.warn("[bloomreach] identifyCustomer: exponea no disponible");
      return;
    }
    if (!customerId) {
      console.warn("[bloomreach] identifyCustomer: customerId vacío, abortando");
      return;
    }
    try {
      window.exponea.identify({ registered: String(customerId) }, customerData || {});
      console.info("[bloomreach] identify", customerId);
    } catch (err) {
      console.error("[bloomreach] identify error", err);
    }
  }

  /**
   * Envía un evento personalizado.
   * @param {string} eventName  Nombre del evento (page_visit, form_submit, lead_sent, ...).
   * @param {Object} [properties]  Atributos del evento.
   */
  function trackEvent(eventName, properties) {
    if (!ready()) {
      console.warn("[bloomreach] trackEvent: exponea no disponible —", eventName);
      return;
    }
    if (!eventName) return;
    try {
      window.exponea.track(eventName, properties || {});
      console.info("[bloomreach] track", eventName, properties || {});
    } catch (err) {
      console.error("[bloomreach] track error", err);
    }
  }

  /**
   * Actualiza atributos del cliente actual sin re-identificarlo.
   * @param {Object} attributes
   */
  function updateCustomer(attributes) {
    if (!ready()) {
      console.warn("[bloomreach] updateCustomer: exponea no disponible");
      return;
    }
    try {
      window.exponea.update(attributes || {});
      console.info("[bloomreach] update", Object.keys(attributes || {}));
    } catch (err) {
      console.error("[bloomreach] update error", err);
    }
  }

  window.bloomreachService = {
    initBloomreach,
    identifyCustomer,
    trackEvent,
    updateCustomer,
    isReady: ready,
  };
})();
