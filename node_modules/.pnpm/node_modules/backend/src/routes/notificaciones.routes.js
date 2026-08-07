const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificaciones.controller');
const auth = require('../middlewares/auth.middleware');

// Proteger todas las rutas de este archivo
router.use(auth);

router.get('/', notificacionesController.getMisNotificaciones);
router.post('/marcar-leida', notificacionesController.marcarLeida);
router.post('/crear', notificacionesController.crearNotificacion);

module.exports = router;
