import { API_BASE } from '../utils/constants';

const api = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return res.json();
};

export const fetchBranches = () => api('/branches');
export const fetchBranchById = (id) => api(`/branches/${id}`);
export const fetchSignalMetrics = (branchId) => api(`/signals/${branchId}`);
export const simulateWanFailure = () => api('/simulate/wan-failure', { method: 'POST' });
export const simulateEmiNoise = () => api('/simulate/emi-noise', { method: 'POST' });
export const simulateDdosAttack = () => api('/simulate/ddos-attack', { method: 'POST' });
export const simulateLinkCut = () => api('/simulate/link-cut', { method: 'POST' });
export const restoreAll = () => api('/simulate/restore', { method: 'POST' });
export const getSystemStatus = () => api('/simulate/status');
