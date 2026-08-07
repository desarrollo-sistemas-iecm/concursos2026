const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const roles = require('../middlewares/roles.middleware');

// Proteger todas las rutas de este archivo para Administrador (2) y Superadmin (4)
router.use(auth, roles([2, 4]));

router.get('/participantes', adminController.getParticipantes);
router.get('/participante-archivos/:id_participante', adminController.getArchivosParticipante);
router.post('/validar/:id_participante', adminController.validarEnsayo);
router.post('/observaciones/:id_participante', adminController.rechazarEnsayo);
router.get('/reportes/excel', adminController.descargarExcel);

module.exports = router;

