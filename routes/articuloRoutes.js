const express = require('express');
const ArticuloController = require('../controllers/articuloController');
const authWithLog = require('../middleware/authWithLog');
const validarCampos = require('../middleware/validarCampos');

const router = express.Router();

// Rutas CRUD para artículos
router.get('/', authWithLog, ArticuloController.getAll);
router.get('/:id', authWithLog, ArticuloController.getById);
router.post('/', authWithLog, validarCampos, ArticuloController.create);
router.put('/:id', authWithLog, validarCampos, ArticuloController.update);
router.delete('/:id', authWithLog, ArticuloController.delete);
router.patch('/:id/restore', authWithLog, ArticuloController.restore);

// Ruta para búsqueda avanzada
router.post('/search', authWithLog, ArticuloController.search);

// Ruta para imprimir etiquetas
router.post('/print-labels', authWithLog, ArticuloController.printLabels);

module.exports = router;