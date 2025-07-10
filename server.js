const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

// Importar configuración y middlewares
const { testConnection } = require("./config/database");
const {
  requestLogger,
  errorHandler,
  notFoundHandler,
  createRateLimit,
} = require("./middleware");

// Importar rutas
const articuloRoutes = require("./routes/articuloRoutes");
const rolesRoutes = require("./routes/rolRoutes");
const usuariosRoutes = require("./routes/usuarioRoutes");
const logsRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/authRoutes");
const impresionesRoutes = require("./routes/impresionRoutes");

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);

// Middlewares de seguridad y optimización
app.use(helmet()); // Seguridad con headers HTTP
app.use(compression()); // Compresión gzip
app.use(cors()); // CORS
app.use(createRateLimit()); // Rate limiting

// Middlewares para parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging
app.use(requestLogger);

// Ruta de health check
app.get("/health", async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      success: true,
      message: "API funcionando correctamente",
      timestamp: new Date().toISOString(),
      database: dbConnected ? "conectada" : "desconectada",
      version: "1.0.0",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Error en el health check",
      timestamp: new Date().toISOString(),
      database: "error",
    });
  }
});

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Gestión de Artículos SKU",
    version: "1.0.0",
    endpoints: {
      articulos: "/api/articulos",
      health: "/health",
      documentation: "Revisa el README.md para más información",
    },
  });
});

// Rutas de la API
app.use("/api/articulos", articuloRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/impresiones", impresionesRoutes);

// Middlewares de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error("❌ No se pudo conectar a la base de datos");
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`📖 Documentación: http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Error iniciando el servidor:", error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on("uncaughtException", (error) => {
  console.error("❌ Error no capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promesa rechazada no manejada:", reason);
  process.exit(1);
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("👋 Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 Cerrando servidor...");
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
