import { AppError, ValidationError } from '../utils/errors.js';
import { logger } from './logger.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err instanceof ValidationError && { errors: err.errors }),
    });
  }

  // Errores de sintaxis JSON en el body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: "error",
      message: "JSON inválido enviado en la petición",
    });
  }

  // Registrar errores inesperados
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // No exponer detalles internos en producción
  const message = process.env.NODE_ENV === "production" 
    ? "Error interno del servidor" 
    : err.message;

  res.status(500).json({
    status: "error",
    message,
  });
};
