// ============================================================================
// CONFIGURACIÓN CENTRAL DE EXPRESS (app.js)
// ============================================================================

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { corsMiddleware } from './middleware/cors.js';
import { requestLogger } from './middleware/logger.js';
import { apiLimiter } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';

import branchRoutes from './routes/branchRoutes.js';
import signalRoutes from './routes/signalRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';

const app = express();

// Middleware global de seguridad y rendimiento
app.use(helmet());
app.use(corsMiddleware);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(requestLogger);

// Rate limiting general
app.use('/api', apiLimiter);

// Rutas de la API REST
app.use('/api/branches', branchRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/simulate', simulationRoutes);

// Ruta raíz de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SMAT-SR Backend', cooperativa: 'San Antonio R.L.' });
});

// Capturar rutas no encontradas
app.use((req, res, next) => {
  next(new NotFoundError(`La ruta ${req.originalUrl} no existe en este servidor`));
});

// Middleware centralizado de manejo de errores (siempre al final)
app.use(errorHandler);

export default app;
