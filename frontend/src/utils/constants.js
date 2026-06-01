export const SPEED_OF_LIGHT = 3e8;
export const NVP_COPPER_CAT6 = 0.68;
export const MAX_FREQ_CAT6 = 250;
export const ATTENUATION_COEFF = 0.00131;

export const VLANS = [
  { id: 10, name: 'TRANSACT', label: 'Transaccional (Cajas)', color: '#0095ff' },
  { id: 20, name: 'ADMIN', label: 'Administración', color: '#8b5cf6' },
  { id: 30, name: 'VOIP', label: 'Telefonía IP', color: '#06b6d4' },
  { id: 40, name: 'SEGURIDAD', label: 'CCTV / Seguridad', color: '#f59e0b' },
  { id: 50, name: 'TI_MGMT', label: 'Gestión TI', color: '#10b981' },
  { id: 90, name: 'WIFI_INV', label: 'WiFi Invitados', color: '#64748b' },
];

export const API_BASE = 'http://localhost:3001/api';
export const SOCKET_URL = 'http://localhost:3001';
