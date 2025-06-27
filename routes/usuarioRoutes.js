const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const authWithLog = require('../middleware/authWithLog');

router.get('/', authWithLog, UsuarioController.getAll);
router.get('/:id', authWithLog, UsuarioController.getById);
router.post('/', authWithLog, UsuarioController.create);
router.put('/:id', authWithLog, UsuarioController.update);
router.delete('/:id', authWithLog, UsuarioController.delete);

module.exports = router;
