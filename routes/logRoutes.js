const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/', logController.getAll);
router.get('/:id', logController.getById);
router.post('/', logController.create);
router.delete('/:id', logController.delete);

module.exports = router;
