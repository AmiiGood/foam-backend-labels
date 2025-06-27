const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const authWithLog = require('../middleware/authWithLog');

router.get('/', authWithLog, rolController.getAll);
router.get('/:id', authWithLog, rolController.getById);
router.post('/', authWithLog, rolController.create);
router.put('/:id', authWithLog, rolController.update);
router.delete('/:id', authWithLog, rolController.delete);

module.exports = router;
