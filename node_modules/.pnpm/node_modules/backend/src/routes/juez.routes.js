const express = require('express');
const router = express.Router();
const juezController = require('../controllers/juez.controller');
const auth = require('../middlewares/auth.middleware');
const roles = require('../middlewares/roles.middleware');

// Proteger todas las rutas de este archivo para Jueces (3)
router.use(auth, roles([3]));

router.get('/ensayos', juezController.getEnsayos);
router.post('/calificar', juezController.calificarEnsayo);

module.exports = router;
