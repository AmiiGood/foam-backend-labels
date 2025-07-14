const Log = require("../models/Log");

module.exports = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15;

      // Validar parámetros
      if (page < 1) {
        return res.status(400).json({
          success: false,
          message: "El número de página debe ser mayor a 0",
        });
      }

      if (limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 100",
        });
      }

      const result = await Log.getAll(page, limit);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error al obtener logs:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const log = await Log.getById(req.params.id);
      if (!log) {
        return res.status(404).json({
          success: false,
          message: "Log no encontrado",
        });
      }
      res.json({ success: true, data: log });
    } catch (error) {
      console.error("Error al obtener log:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await Log.create(req.body);
      res.status(201).json({ success: true, data: nuevo });
    } catch (error) {
      if (error.message.includes("El usuario especificado no existe")) {
        return res.status(400).json({
          success: false,
          message: "El usuario especificado no existe",
        });
      }
      console.error("Error al crear log:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const eliminado = await Log.delete(req.params.id);
      if (!eliminado) {
        return res.status(404).json({
          success: false,
          message: "Log no encontrado",
        });
      }
      res.json({ success: true, data: eliminado });
    } catch (error) {
      console.error("Error al eliminar log:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
