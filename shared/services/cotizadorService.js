// shared/services/cotizadorService.js
// Servicio para enviar leads al endpoint APIMAZ (CRM Oportunidad — Cotizador Web Async).
// Mantiene la estructura exacta del payload requerido por el servicio.
//
// Patrón equivalente en Angular: un @Injectable que recibe HttpClient en el constructor
// y expone enviarCotizacion(form) -> Observable<Response>. Aquí lo implementamos como
// función pura con fetch para mantener paridad con el resto del prototipo.

(function () {
  const ENDPOINT = "https://apimazqa.grupokaufmann.com/qas/crm/oportunidad/v1/cotizador/web/async";

  // Valores fijos del flujo (no deben cambiar entre envíos)
  const FIXED = {
    IvCategorizacion: "C2_AR_04",
    IvOrigen: "Z10K",
    IvClaseOperacion: "ZSCR",
    IvLineaNegocio: "01",
    IvCampana: "C-00011945",
    IvDescripcion: "CAPTURA LEADS RAM COSTA RICA",
    IvCategoria: "Z37",
    IvPais: "CR",
  };

  /**
   * Construye el payload exacto que requiere APIMAZ a partir de los datos del formulario.
   * @param {Object} form  Datos crudos del formulario (nombre, email, telefono, region, comuna, version, terms)
   * @param {Object} ctx   Contexto adicional opcional (modelo, sucursal, sucursalCodigo, rut, leadsId)
   */
  function buildPayload(form, ctx = {}) {
    const timestamp = Date.now();

    const nombreCompleto = (form.nombre || "").trim();
    const partes = nombreCompleto.split(/\s+/);
    const nombre = partes[0] || "";
    const apellido = partes.slice(1).join(" ");

    const modelo = ctx.modelo || form.version || "SOUEAST S06";
    const sucursalNombre = ctx.sucursal || "AutoStar Santa Ana";
    const sucursalCodigo = ctx.sucursalCodigo || "01";
    const rut = ctx.rut || "";
    const leadsId = ctx.leadsId || "";
    const url = (typeof window !== "undefined" && window.location) ? window.location.href : "";

    // IvNota — formato textual con datos del usuario
    const nota =
      `Mail:${form.email || ""}||` +
      `Celular:${form.telefono || ""}||` +
      `NombreCliente:${nombre} ||` +
      `ApellidoCliente:${apellido}|| ` +
      `Modelo: ${modelo}|` +
      `leadsId: ${leadsId}|`;

    return {
      ...FIXED,
      IvTimestamp: timestamp,
      IvEmail: form.email || "",
      IvTelefonoMovil: form.telefono || "",
      IvCrearCaso: "",
      IvModelo: modelo,
      IvUrl: url,
      json: {
        sucursalNombre: sucursalNombre,
        Movil: form.telefono || "",
        rutEmpresa: "",
        nombre: nombre,
        modelo: modelo,
        url: url,
        rut: rut,
        razonSocial: "",
        sucursal: sucursalCodigo,
        apellido: apellido,
        consentimiento: !!form.terms,
        email: form.email || "",
        timestamp: timestamp,
      },
      IvNumClasFiscal: rut,
      IvSucursal: sucursalNombre,
      IvRazonSocial: "",
      IvApellidoCliente: apellido,
      IvTelefonoFijo: "",
      IvNota: nota,
      IvRutEmpresa: "",
      IvNombreCliente: nombre,
      IvCarterizacion: "",
    };
  }

  /**
   * Envía el lead al endpoint APIMAZ.
   * @returns {Promise<{ok: boolean, status: number, data?: any, error?: any}>}
   */
  async function enviarCotizacion(form, ctx) {
    // Guard defensivo: nunca enviar un lead sin consentimiento explícito.
    // La validación principal vive en los formularios; esto es una segunda
    // barrera para que ningún caller pueda saltársela.
    if (!form || !form.terms) {
      console.warn("[cotizadorService] envío bloqueado: consentimiento faltante");
      return { ok: false, status: 0, error: new Error("consent_required") };
    }
    // Validaciones mínimas — sin email/teléfono no hay forma de contactar al lead.
    if (!form.email || !form.telefono) {
      console.warn("[cotizadorService] envío bloqueado: email o teléfono faltante");
      return { ok: false, status: 0, error: new Error("contact_required") };
    }

    const subscriptionKey = (window.ENV && window.ENV.APIMAZ_SUBSCRIPTION_KEY) || "";
    if (!subscriptionKey) {
      console.warn("[cotizadorService] APIMAZ_SUBSCRIPTION_KEY no configurada");
    }

    const payload = buildPayload(form, ctx);

    // Log mínimo para QA (sin datos sensibles completos)
    console.info("[cotizadorService] POST", ENDPOINT, {
      IvModelo: payload.IvModelo,
      IvSucursal: payload.IvSucursal,
      IvTimestamp: payload.IvTimestamp,
    });

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await res.json(); } catch (_) { /* respuesta vacía */ }

      if (res.ok) {
        console.info("[cotizadorService] OK", res.status);
        return { ok: true, status: res.status, data };
      }
      console.warn("[cotizadorService] HTTP error", res.status, data);
      return { ok: false, status: res.status, data };
    } catch (err) {
      console.error("[cotizadorService] Network error", err);
      return { ok: false, status: 0, error: err };
    }
  }

  window.cotizadorService = { enviarCotizacion, buildPayload };
})();
