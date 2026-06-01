// ============================================================================
// MODELO DE DATOS: Agencias de la Cooperativa San Antonio R.L. (Cochabamba)
// Parámetros reales de ubicación y cálculos físicos de cableado UTP Cat 6
// ============================================================================

const branches = [
  {
    id: 0,
    nombre: "Oficina Central",
    direccion: "Calle Tarata Nro. 352 (Mercado San Antonio)",
    zona: "Centro / La Cancha",
    cableLongitud: 8,
    atenuacion: 1.8,
    snr: 32.4,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Aloja el Data Center principal y el Core bancario regulado por ASFI."
  },
  {
    id: 1,
    nombre: "Agencia Ayacucho",
    direccion: "Av. Ayacucho esquina Calle Jordán",
    zona: "Centro Financiero",
    cableLongitud: 12,
    atenuacion: 2.2,
    snr: 34.1,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Zona corporativa central. Conectividad estable de baja latencia."
  },
  {
    id: 2,
    nombre: "Agencia Loreto",
    direccion: "Av. Panamericana e/ calle T.M. Cabrera y Villa Tunari",
    zona: "Zona Sur",
    cableLongitud: 25,
    atenuacion: 3.5,
    snr: 31.8,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Ubicada en eje comercial del sur. Alta afluencia de socios."
  },
  {
    id: 3,
    nombre: "Agencia Libertador",
    direccion: "Av. América e/ Adela Zamudio y Av. Libertador",
    zona: "Zona Norte",
    cableLongitud: 15,
    atenuacion: 2.5,
    snr: 33.5,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Zona residencial norte. Equipos switches gigabit."
  },
  {
    id: 4,
    nombre: "Agencia 6 de Agosto",
    direccion: "Av. 6 de Agosto Nro. 2001 esq. Av. Barrientos",
    zona: "Zona Central-Sur",
    cableLongitud: 30,
    atenuacion: 4.1,
    snr: 30.2,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Punto de alto tránsito. Cableado Cat 6 con canalización metálica."
  },
  {
    id: 5,
    nombre: "Agencia Barrientos",
    direccion: "Av. Suecia Nro. 1548 esquina Pasaje 21",
    zona: "Zona Sur-Este",
    cableLongitud: 22,
    atenuacion: 3.1,
    snr: 31.0,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Atención enfocada a gremiales y microempresarios productores."
  },
  {
    id: 6,
    nombre: "Agencia Sacaba",
    direccion: "Av. Monseñor Alcocer y Capitán Lozada (Sacaba)",
    zona: "Eje Metropolitano Este",
    cableLongitud: 45,
    atenuacion: 5.8,
    snr: 29.5,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Enlaces WAN redundantes de cobre ADSL de proveedores locales."
  },
  {
    id: 7,
    nombre: "Agencia Quillacollo",
    direccion: "Calle Ballivián e/ Av. Gral. Pando y Cochabamba",
    zona: "Eje Metropolitano Oeste",
    cableLongitud: 55,
    atenuacion: 6.9,
    snr: 28.1,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Altísima transaccionalidad. Tramo horizontal de 55m."
  },
  {
    id: 8,
    nombre: "Oficina Ferial S. Pagador",
    direccion: "Av. Humberto Asin e/ Av. Machacamarca y c/ Saucari",
    zona: "Zona Este",
    cableLongitud: 18,
    atenuacion: 2.7,
    snr: 32.0,
    frecuencia: 250,
    nvp: 0.68,
    status: "connected",
    notas: "Apertura en días específicos de feria local."
  },
  {
    id: 9,
    nombre: "Agencia Villa Tunari",
    direccion: "Av. Integración (Región del Trópico)",
    zona: "Trópico de Cochabamba",
    cableLongitud: 90,
    atenuacion: 14.2,
    snr: 22.4,
    frecuencia: 250,
    nvp: 0.68,
    status: "warning",
    notas: "Condiciones húmedas extremas. Longitud al límite de la norma (90m)."
  }
];

export const getAllBranches = () => [...branches];
export const getBranchById = (id) => branches.find(b => b.id === parseInt(id));
export default branches;
