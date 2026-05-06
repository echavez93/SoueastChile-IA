// shared/services/env.js
// Configuración centralizada — la subscription key se lee desde window.__APP_CONFIG
// (inyectado en index.html antes de cargar los servicios).
// En el entorno Angular real, esto vendrá de environment.ts / environment.prod.ts.
const ENV = (window.__APP_CONFIG || {});
window.ENV = ENV;
