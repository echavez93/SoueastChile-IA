// features/modelo/modeloFallbacks.js
// Datos embebidos por modelo — se usan cuando Strapi no está configurado o falla.
// Mismo shape que window.strapiService.getModelo(slug) devuelve, pero estático.
//
// Cuando Strapi esté en producción, estos objetos pueden quedar como
// "ultimate fallback" o eliminarse. Por ahora son la fuente de verdad.
//
// Shape alineado con el schema Strapi (strapi/src/api/modelo/content-types/modelo/schema.json):
//   slug · nombre · tagline · descripcion · precio_desde · precio_legal
//   imagen_principal · imagen_lateral
//   versiones[]   → componente shared.version    { nombre }
//   galeria[]     → componente modelo.feature    { feat, desc, imagen? }
//   seguridad[]   → componente modelo.feature    { feat, desc, imagen? }
//   colores[]     → componente modelo.color      { name, hex, tipo }

const _DEFAULT_VERSIONES = [
  { nombre: "1.5T-6DCT" },
  { nombre: "1.5T-6DCT Lite" },
  { nombre: "1.6TD-7DCT Pro Max" },
];
const _DEFAULT_COLORES = [
  { name: "Color 1", hex: "#92B1B9", tipo: "Exterior" },
  { name: "Color 2", hex: "#1E1E1E", tipo: "Exterior" },
  { name: "Color 3", hex: "#F3F3F1", tipo: "Exterior" },
  { name: "Color 4", hex: "#D9845B", tipo: "Exterior" },
  { name: "Color 5", hex: "#3A6F8F", tipo: "Exterior" },
];
const _DEFAULT_GALERIA = [
  { feat: "Característica 1", desc: "Descripción de la característica destacada." },
  { feat: "Característica 2", desc: "Descripción de la característica destacada." },
  { feat: "Característica 3", desc: "Descripción de la característica destacada." },
  { feat: "Característica 4", desc: "Descripción de la característica destacada." },
];
const _DEFAULT_SEGURIDAD = [
  { feat: "Sistema de seguridad 1", desc: "Descripción del sistema de seguridad." },
  { feat: "Sistema de seguridad 2", desc: "Descripción del sistema de seguridad." },
  { feat: "Sistema de seguridad 3", desc: "Descripción del sistema de seguridad." },
];
const _DEFAULT_PRECIO_LEGAL =
  "*Precio referencial. Sujeto a stock y condiciones del mercado. No incluye derechos de inscripción.";

function _modeloFallback(slug, nombre, tagline, descripcion, precio_desde) {
  return {
    slug,
    nombre,
    tagline,
    descripcion,
    precio_desde,
    precio_legal: _DEFAULT_PRECIO_LEGAL,
    imagen_principal: null,
    imagen_lateral: null,
    versiones: _DEFAULT_VERSIONES,
    galeria: _DEFAULT_GALERIA,
    colores: _DEFAULT_COLORES,
    seguridad: _DEFAULT_SEGURIDAD,
  };
}

window.MODELO_FALLBACKS = {
  s06: _modeloFallback(
    "s06", "S06", "Más estilo",
    "Descripción del modelo SOUEAST S06. Reemplazar este texto con el copy definitivo del modelo.",
    0,
  ),
  s07: _modeloFallback(
    "s07", "S07", "Más estilo",
    "Descripción del modelo SOUEAST S07. Reemplazar este texto con el copy definitivo del modelo.",
    0,
  ),
  s09: _modeloFallback(
    "s09", "S09", "Más estilo",
    "Descripción del modelo SOUEAST S09. Reemplazar este texto con el copy definitivo del modelo.",
    0,
  ),
};
