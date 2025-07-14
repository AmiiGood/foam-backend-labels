const Rol = require("../models/Rol");

const { rolSchema } = require("../validators/usuarioValidator");

const Log = require("../models/Log")

module.exports = {
  getAll: async (req, res) => {
    try {
      const roles = await Rol.getAll();
      res.json({ success: true, data: roles });
    } catch (error) {
      req.logInfo.exito = false;
      console.error("Error en getAll:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener roles",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const rol = await Rol.getById(req.params.id);
      if (!rol) {
        req.logInfo.exito = false;
        return res
          .status(404)
          .json({ success: false, message: "No encontrado" });
      }
      res.json({ success: true, data: rol });
    } catch (error) {
      req.logInfo.exito = false;
      console.error("Error en getById:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener rol",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  create: async (req, res) => {
    try {
      const { error, value } = rolSchema.validate(req.body); // Usar rolSchema

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const nuevo = await Rol.create(value);
      await Log.create({
        usuario_id: req.usuario.id,
        accion: "POST /api/roles",
      });
      res.status(201).json({ success: true, data: nuevo });
    } catch (error) {
      console.error("Error en create:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear rol",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { error, value } = rolSchema.validate(req.body); // Usar rolSchema

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const actualizado = await Rol.update(req.params.id, value);
      if (!actualizado) {
        return res
          .status(404)
          .json({ success: false, message: "No encontrado" });
      }

      await Log.create({
        usuario_id: req.usuario.id,
        accion: "PUT /api/roles/" + req.params.id,
      });

      res.json({ success: true, data: actualizado });
    } catch (error) {
      console.error("Error en update:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar rol",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  delete: async (req, res) => {
    try {
      try {
        const eliminado = await Rol.delete(req.params.id);
        if (!eliminado) {
          return res
            .status(404)
            .json({ success: false, message: "No encontrado" });
        }

        // Solo crear log si la operación fue exitosa
        await Log.create({
          usuario_id: req.usuario.id,
          accion: "DELETE /api/roles/" + req.params.id,
        });

        res.json({ success: true, data: eliminado });
      } catch (error) {
        await req.dbConnection.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error en delete:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar rol",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};
