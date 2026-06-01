// ============================================================================
// MODELO DE ESTADO: Enlaces WAN de Cobre (COMTECO y ENTEL)
// ============================================================================

let wanLinks = [
  {
    id: "comteco",
    provider: "COMTECO",
    type: "Enlace Cobre HFC",
    role: "Principal",
    status: "active",
    latency: 12,
    bandwidth: "100 Mbps"
  },
  {
    id: "entel",
    provider: "ENTEL",
    type: "Enlace Cobre ADSL",
    role: "Respaldo",
    status: "standby",
    latency: 42,
    bandwidth: "50 Mbps"
  }
];

export const getWanLinks = () => wanLinks.map(l => ({ ...l }));

export const setLinkStatus = (id, status, latency) => {
  const link = wanLinks.find(l => l.id === id);
  if (link) {
    link.status = status;
    if (latency !== undefined) link.latency = latency;
  }
};

export const resetLinks = () => {
  wanLinks[0] = { ...wanLinks[0], status: "active", latency: 12 };
  wanLinks[1] = { ...wanLinks[1], status: "standby", latency: 42 };
};

export default wanLinks;
