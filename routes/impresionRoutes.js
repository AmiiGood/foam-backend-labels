const express = require("express");
const ImpresionController = require("../controllers/impresionController");
const authWithLog = require("../middleware/authWithLog");

const router = express.Router();

// IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas con parámetros
router.get("/estadisticas", authWithLog, ImpresionController.getEstadisticas);
router.get(
  "/usuario/:usuario_id",
  authWithLog,
  ImpresionController.getByUsuario
);
router.get(
  "/articulo/:articulo_id",
  authWithLog,
  ImpresionController.getByArticulo
);
router.get("/", authWithLog, ImpresionController.getAll);
router.get("/:id", authWithLog, ImpresionController.getById);

module.exports = router;
