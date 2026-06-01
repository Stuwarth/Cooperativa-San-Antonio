// ============================================================================
// CONFIGURACIÓN CENTRAL DE EXPRESS (app.js)
// ============================================================================

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import { corsMiddleware } from './middleware/cors.js';
import { requestLogger } from './middleware/logger.js';
import { apiLimiter } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';

import branchRoutes from './routes/branchRoutes.js';
import signalRoutes from './routes/signalRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware global de seguridad y rendimiento
// Desactivamos temporalmente el CSP estricto para no bloquear los assets del frontend en desarrollo/túneles
app.use(helmet({ contentSecurityPolicy: false }));
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

// Ruta raíz de salud de la API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SMAT-SR Backend', cooperativa: 'San Antonio R.L.' });
});

// Servir frontend empaquetado (producción)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Capturar rutas de la API no encontradas
app.use('/api', (req, res, next) => {
  next(new NotFoundError(`La ruta API ${req.originalUrl} no existe en este servidor`));
});

// Cualquier otra ruta que no sea de la API, se la enviamos a la aplicación Frontend (React)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    next(new NotFoundError(`Ruta no válida: ${req.originalUrl}`));
  }
});

// Middleware centralizado de manejo de errores (siempre al final)
app.use(errorHandler);

export default app;
