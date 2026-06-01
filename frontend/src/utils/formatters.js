export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

export const formatNumber = (num, decimals = 2) => parseFloat(num).toFixed(decimals);
export const formatFrequency = (mhz) => `${mhz} MHz`;
