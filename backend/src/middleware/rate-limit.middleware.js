import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP cada 15 minutos
  message: {
    status: "error",
    message: "Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos."
  },
  standardHeaders: true, // Retorna `RateLimit-*` headers
  legacyHeaders: false, // Deshabilita los `X-RateLimit-*` headers
});

export const simulationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 simulaciones por minuto para no saturar el servidor
  message: {
    status: "error",
    message: "Límite de simulaciones alcanzado. Intente en un minuto."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
