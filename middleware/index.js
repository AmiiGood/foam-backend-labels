const rateLimit = require("express-rate-limit");

// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  if (err.code === "ECONNREFUSED") {
    return res.status(503).json({
      success: false,
      message: "Error de conexión a la base de datos",
    });
  }
  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(503).json({
      success: false,
      message: "Error de autenticación con la base de datos",
    });
  }
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
  });
};

// Rate limiting con configuración para evitar el error X-Forwarded-For
const createRateLimit = () => {
  return rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      success: false,
      message: "Demasiadas peticiones, intenta más tarde",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Configuración para evitar el error X-Forwarded-For
    trustProxy: false,
    keyGenerator: (req) => {
      // Usar solo la IP directa, ignorando proxies
      return req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
    },
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  notFoundHandler,
  createRateLimit,
};
