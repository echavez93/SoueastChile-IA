// Configuración del cotizador - Variables para el envío al API CRM
// IMPORTANTE: Modifica estos valores según tus necesidades
// Última actualización: 30/04/2026

window.COTIZADOR_CONFIG = {
  // API Key para Ocp-Apim-Subscription-Key header
  API_KEY: "6f6695354e7b4bd783aa6ea2e0e7cc15",
  
  // URL del endpoint
  API_URL: "https://apimazqa.grupokaufmann.com/qas/crm/oportunidad/v1/cotizador/web/async",
  
  // Variables fijas para el body JSON
  vCategoria: "M1_AS_",
  vOrigen: "Z11K",
  vCrearCaso: "1",
  vClaseOperacion: "ZSMD",
  vLineaNegocio: "01",
  vCampana: "CLAM_AU_0000005369",
  vDescripcion: "Cotización Prueba",
  vPais: "CL",
  
  // Modelos disponibles
  MODELOS: ["S06", "S06 PHEV", "S07", "S09"]
};
