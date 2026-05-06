// Mapeo de Comuna → Sucursal → Código CRM
// Datos extraídos del Excel "sucursal soueast.xlsx"

window.SUCURSALES_CRM = [
  { comuna: "ANTOFAGASTA", sucursal: "ANDES RETAIL - ANTOFAGASTA", codigoCRM: 42 },
  { comuna: "CALAMA", sucursal: "ANDES RETAIL - MALL PLAZA CALAMA", codigoCRM: 49 },
  { comuna: "PUDAHUEL", sucursal: "ANDES RETAIL - VESPUCIO", codigoCRM: 38 },
  { comuna: "HUECHURABA", sucursal: "ANDES RETAIL - MALL PLAZA NORTE", codigoCRM: 51 },
  { comuna: "HUECHURABA", sucursal: "ANDES RETAIL - MOVICENTER", codigoCRM: 54 },
  { comuna: "SAN FERNANDO", sucursal: "ANTIVERO - SAN FERNANDO", codigoCRM: 100 },
  { comuna: "SAN FERNANDO", sucursal: "ANTIVERO - SAN FERNANDO RUTA 5 SUR", codigoCRM: 100 },
  { comuna: "LA REINA", sucursal: "AUTO SUMMIT - MALLPLAZA EGAÑA", codigoCRM: 189 },
  { comuna: "SAN BERNARDO", sucursal: "AUTO SUMMIT - MALLPLAZA SUR", codigoCRM: 101 },
  { comuna: "SAN JOAQUIN", sucursal: "AUTO SUMMIT - SAN JOAQUIN", codigoCRM: 103 },
  { comuna: "LOS ANDES", sucursal: "AUTOFIP - LOS ANDES", codigoCRM: 104 },
  { comuna: "SAN FELIPE", sucursal: "AUTOFIP - SAN FELIPE", codigoCRM: 105 },
  { comuna: "COPIAPÓ", sucursal: "AUTOMOTRIZ CARMONA - COPIAPÓ", codigoCRM: 106 },
  { comuna: "LA SERENA", sucursal: "AUTOMOTRIZ CARMONA - LA SERENA", codigoCRM: 107 },
  { comuna: "COLINA", sucursal: "AVENTURA MOTORS - CHICUREO", codigoCRM: 172 },
  { comuna: "INDEPENDENCIA", sucursal: "AVENTURA MOTORS - MALL BARRIO INDEPENDENCIA", codigoCRM: 171 },
  { comuna: "LA REINA", sucursal: "DANIEL ACHONDO - LA REINA", codigoCRM: 169 },
  { comuna: "CASTRO", sucursal: "DIFOR - CASTRO", codigoCRM: 193 },
  { comuna: "LA FLORIDA", sucursal: "DIFOR - LA FLORIDA", codigoCRM: 119 },
  { comuna: "PUENTE ALTO", sucursal: "DIFOR - MALL PLAZA TOBALABA", codigoCRM: 120 },
  { comuna: "LA FLORIDA", sucursal: "DIFOR - MALL PLAZA VESPUCIO", codigoCRM: 121 },
  { comuna: "OSORNO", sucursal: "DIFOR - OSORNO", codigoCRM: 191 },
  { comuna: "PUERTO MONTT", sucursal: "DIFOR - PUERTO MONTT", codigoCRM: 192 },
  { comuna: "RANCAGUA", sucursal: "DIFOR - RANCAGUA", codigoCRM: 122 },
  { comuna: "VIÑA DEL MAR", sucursal: "H. MOTORES - 15 NORTE", codigoCRM: 132 },
  { comuna: "VIÑA DEL MAR", sucursal: "H. MOTORES - CAMINO INTERNACIONAL TORQUEMADA", codigoCRM: 133 },
  { comuna: "MAIPÚ", sucursal: "H. MOTORES - MAIPÚ", codigoCRM: 130 },
  { comuna: "CERRILLOS", sucursal: "H. MOTORES - MALL PLAZA OESTE", codigoCRM: 134 },
  { comuna: "SAN ANTONIO", sucursal: "H. MOTORES - SAN ANTONIO", codigoCRM: 135 },
  { comuna: "VALPARAÍSO", sucursal: "H. MOTORES - VALPARAISO", codigoCRM: 131 },
  { comuna: "CHILLÁN", sucursal: "MARITANO Y EBENSPERGER - CHILLÁN", codigoCRM: 138 },
  { comuna: "CONCEPCIÓN", sucursal: "MARITANO Y EBENSPERGER - CONCEPCIÓN", codigoCRM: 139 },
  { comuna: "CONCEPCIÓN", sucursal: "MARITANO Y EBENSPERGER - ESPACIO URBANO CONCEPCIÓN", codigoCRM: 163 },
  { comuna: "LOS ANGELES", sucursal: "MARITANO Y EBENSPERGER - LOS ÁNGELES", codigoCRM: 140 },
  { comuna: "TEMUCO", sucursal: "MARITANO Y EBENSPERGER - TEMUCO", codigoCRM: 141 },
  { comuna: "CERRILLOS", sucursal: "SALAZAR ISRAEL - CERRILLOS", codigoCRM: 170 },
  { comuna: "VITACURA", sucursal: "SALAZAR ISRAEL - VITACURA", codigoCRM: 148 },
  { comuna: "CON CON", sucursal: "SUMMIT STORE - CON CON", codigoCRM: 183 },
  { comuna: "QUILPUÉ", sucursal: "SUMMIT STORE - EL BELLOTO", codigoCRM: 187 },
  { comuna: "QUILLOTA", sucursal: "SUMMIT STORE - QUILLOTA", codigoCRM: 185 },
  { comuna: "CURAUMA", sucursal: "SUMMIT STORE- CURAUMA", codigoCRM: 184 },
  { comuna: "CALAMA", sucursal: "ANDES RETAIL - CALAMA", codigoCRM: 200 },
  { comuna: "LAS CONDES", sucursal: "DANIEL ACHONDO - LAS CONDES", codigoCRM: 169 }
];

// Función helper: obtener sucursales por comuna
window.getSucursalesPorComuna = function(comuna) {
  const comunaNorm = comuna.toUpperCase().trim();
  return window.SUCURSALES_CRM.filter(s => s.comuna === comunaNorm);
};

// Función helper: obtener código CRM de una sucursal
window.getCodigoCRMPorSucursal = function(nombreSucursal) {
  const suc = window.SUCURSALES_CRM.find(s => s.sucursal === nombreSucursal);
  return suc ? suc.codigoCRM : null;
};
