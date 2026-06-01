// ============================================================================
// SERVICIO: Cálculos Físicos de Señales en Cable UTP Cat 6 de Cobre
// Fórmulas reales de Análisis de Sistemas y Señales
// ============================================================================

const SPEED_OF_LIGHT = 3e8;       // Velocidad de la luz en el vacío (m/s)
const NVP_COPPER_CAT6 = 0.68;    // Velocidad nominal de propagación en cobre Cat 6
const ATTENUATION_COEFF = 0.00131; // Coeficiente de atenuación base (dB/m/MHz)

/**
 * Calcula el retardo de propagación físico de la señal en el cobre
 * τ = L / (NVP × c)
 * @param {number} lengthMeters - Longitud del cable en metros
 * @returns {number} Retardo en nanosegundos
 */
export const calculatePropagationDelay = (lengthMeters) => {
  const vp = NVP_COPPER_CAT6 * SPEED_OF_LIGHT;
  const delaySeconds = lengthMeters / vp;
  return delaySeconds * 1e9; // Convertir a nanosegundos
};

/**
 * Calcula la atenuación acumulada de la señal
 * A(dB) = α × f × L
 * @param {number} lengthMeters - Longitud del cable
 * @param {number} freqMHz - Frecuencia de operación (250 MHz para Cat 6)
 * @returns {number} Atenuación en decibelios (dB)
 */
export const calculateAttenuation = (lengthMeters, freqMHz = 250) => {
  return ATTENUATION_COEFF * freqMHz * lengthMeters;
};

/**
 * Calcula la relación señal/ruido considerando interferencias activas
 * @param {number} baseSNR - SNR base de la agencia (dB)
 * @param {number} emiNoise - Reducción por ruido electromagnético (dB)
 * @param {number} ddosJitter - Reducción por colisiones DDoS (dB)
 * @returns {number} SNR resultante en dB
 */
export const calculateSNR = (baseSNR, emiNoise = 0, ddosJitter = 0) => {
  return Math.max(0, baseSNR - emiNoise - ddosJitter);
};

/**
 * Genera las métricas completas de señal para una agencia
 * @param {object} branch - Datos de la agencia
 * @param {object} simState - Estado actual de las simulaciones
 * @returns {object} Métricas calculadas con fluctuaciones en tiempo real
 */
export const getSignalMetrics = (branch, simState = {}) => {
  const { emiActive = false, emiNoiseLevel = 0, emiAttenuation = 0, ddosActive = false } = simState;

  // Fluctuación pequeña para simular mediciones en vivo
  const fluctuation = () => (Math.random() - 0.5) * 0.4;

  const emiNoise = emiActive ? emiNoiseLevel : 0;
  const ddosJitter = (ddosActive && branch.id === 0) ? 5 : 0;
  const finalEmiAttenuation = emiActive ? emiAttenuation : 0;

  return {
    branchId: branch.id,
    branchName: branch.nombre,
    frecuencia: branch.frecuencia,
    nvp: branch.nvp,
    cableLongitud: branch.cableLongitud,
    propagationDelay: parseFloat(calculatePropagationDelay(branch.cableLongitud).toFixed(2)),
    atenuacion: parseFloat((branch.atenuacion + finalEmiAttenuation + fluctuation()).toFixed(2)),
    snr: parseFloat(calculateSNR(branch.snr, emiNoise, ddosJitter).toFixed(2) ) + fluctuation(),
    latencia: parseFloat((12 + (branch.cableLongitud * 0.1) + (emiActive ? 25 : 0) + (ddosActive ? 45 : 0) + fluctuation()).toFixed(2)),
    packetLoss: parseFloat((emiActive ? 2.3 + Math.random() * 1.5 : 0.01 + Math.random() * 0.05).toFixed(3)),
    emiActive,
    ddosActive,
    timestamp: Date.now()
  };
};
