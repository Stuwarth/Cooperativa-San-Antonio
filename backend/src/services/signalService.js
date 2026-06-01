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
  const { emiActive = false, emiNoiseLevel = 0, emiAttenuation = 0, ddosActive = false, linkCutActive = false } = simState;

  // Si hay un corte total, la física de la señal muere
  if (linkCutActive) {
    return {
      branchId: branch.id,
      branchName: branch.nombre,
      frecuencia: 0,
      nvp: 0,
      cableLongitud: branch.cableLongitud,
      propagationDelay: Infinity,
      atenuacion: 999.99, // Pérdida total
      snr: 0,
      next: 0,
      fext: 0,
      bandwidth: 0,
      latencia: 999.99,
      packetLoss: 100.0,
      emiActive,
      ddosActive,
      linkCutActive,
      timestamp: Date.now()
    };
  }

  // Fluctuación pequeña para simular mediciones en vivo
  const fluctuation = (scale = 0.4) => (Math.random() - 0.5) * scale;

  const emiNoise = emiActive ? emiNoiseLevel : 0;
  const ddosJitter = (ddosActive && branch.id === 0) ? 5 : 0;
  const finalEmiAttenuation = emiActive ? emiAttenuation : 0;

  // Cálculo de Diafonía (Crosstalk) - Mayor dB es mejor aislamiento
  // La norma Cat 6 exige un mínimo de ~39.3 dB a 250MHz.
  let baseNext = 46 + fluctuation(1.5);
  let baseFext = 42 + fluctuation(1.5);

  if (emiActive) {
    // El ruido electromagnético severo degrada el aislamiento interno
    baseNext -= (emiNoiseLevel * 0.8);
    baseFext -= (emiNoiseLevel * 0.9);
  }

  // Cálculo de Tráfico de Datos (Ancho de Banda en Mbps)
  // La central tiene más tráfico base (150-250 Mbps) que las agencias (10-50 Mbps)
  let bandwidth = branch.id === 0 ? 200 + fluctuation(50) : 30 + fluctuation(15);
  
  if (ddosActive && branch.id === 0) {
    // Ataque DDoS satura el enlace Gigabit de la central
    bandwidth = 980 + fluctuation(20);
  }

  return {
    branchId: branch.id,
    branchName: branch.nombre,
    frecuencia: branch.frecuencia,
    nvp: branch.nvp,
    cableLongitud: branch.cableLongitud,
    propagationDelay: parseFloat(calculatePropagationDelay(branch.cableLongitud).toFixed(2)),
    atenuacion: parseFloat((branch.atenuacion + finalEmiAttenuation + fluctuation()).toFixed(2)),
    snr: parseFloat(calculateSNR(branch.snr, emiNoise, ddosJitter).toFixed(2) ) + fluctuation(),
    next: parseFloat(baseNext.toFixed(2)),
    fext: parseFloat(baseFext.toFixed(2)),
    bandwidth: parseFloat(Math.max(0, bandwidth).toFixed(2)),
    latencia: parseFloat((12 + (branch.cableLongitud * 0.1) + (emiActive ? 25 : 0) + (ddosActive ? 45 : 0) + fluctuation()).toFixed(2)),
    packetLoss: parseFloat((emiActive ? 2.3 + Math.random() * 1.5 : 0.01 + Math.random() * 0.05).toFixed(3)),
    emiActive,
    ddosActive,
    timestamp: Date.now()
  };
};
