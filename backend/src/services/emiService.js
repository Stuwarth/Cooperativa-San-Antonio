// ============================================================================
// SERVICIO: Simulación de Ruido Electromagnético (EMI) - Feria de La Cancha
// Integración de Skill "kicad-happy/emc": Radiación de Bucle Diferencial
// ============================================================================

let emiState = {
  active: false,
  noiseLevel: 0,         // dB de ruido inyectado
  snrReduction: 0,       // Reducción de SNR
  attenuationIncrease: 0, // Incremento de atenuación
  source: null,
  physics: null
};

/**
 * Skill EMC: Calcula el campo eléctrico radiado por un bucle diferencial
 * E = 2.632 x 10^-14 * f^2 * A * I / r
 * @param {number} freqHz - Frecuencia del ruido (ej. armónicos de 500kHz)
 * @param {number} loopAreaM2 - Área del bucle expuesto en m^2
 * @param {number} currentA - Corriente inducida en Amperios
 * @param {number} distanceM - Distancia a la fuente en metros
 * @returns {number} Campo E en V/m
 */
const calculateEmiLoopRadiation = (freqHz, loopAreaM2, currentA, distanceM) => {
  return (2.632e-14 * Math.pow(freqHz, 2) * loopAreaM2 * currentA) / distanceM;
};

/**
 * Convierte el campo eléctrico (V/m) a degradación de ruido SNR (dB)
 * Simplificado para el modelo del enlace de cobre.
 */
const convertFieldToSNRReduction = (fieldVm) => {
  // Conversión logarítmica simplificada para la demostración
  const dbMicroV = 20 * Math.log10(fieldVm * 1e6);
  return Math.min(30, Math.max(0, dbMicroV * 0.15)); // Tope máximo de 30dB de pérdida
};

/**
 * Activa la simulación de ruido EMI de la zona de La Cancha
 * @returns {object} Estado de EMI actualizado
 */
export const injectNoise = () => {
  // Simulación: Transformadores ruidosos cerca del UTP
  const freqHz = 500000; // Armónicos de fuentes conmutadas (500kHz)
  const loopAreaM2 = 0.5; // Espira de área de bucle por mal aislamiento (0.5m^2)
  const currentA = 5.0; // Corriente de 5A
  const distanceM = 2.0; // UTP a 2 metros de la fuente de ruido

  const electricField = calculateEmiLoopRadiation(freqHz, loopAreaM2, currentA, distanceM);
  const snrReduction = convertFieldToSNRReduction(electricField);

  emiState = {
    active: true,
    noiseLevel: parseFloat(snrReduction.toFixed(2)),
    snrReduction: parseFloat(snrReduction.toFixed(2)),
    attenuationIncrease: 4.5,
    source: "Radiación diferencial de bucle EMC: Transformadores en calle Tarata (La Cancha)",
    physics: {
      formula: "E = 2.632e-14 × f² × A × I / r",
      field_Vm: electricField.toExponential(2),
      distance: `${distanceM}m`
    }
  };
  return { ...emiState };
};

/**
 * Desactiva el ruido EMI
 * @returns {object} Estado restaurado
 */
export const removeNoise = () => {
  emiState = {
    active: false,
    noiseLevel: 0,
    snrReduction: 0,
    attenuationIncrease: 0,
    source: null,
    physics: null
  };
  return { ...emiState };
};

/**
 * Devuelve el estado actual del ruido electromagnético
 */
export const getEmiState = () => ({ ...emiState });
