const express = require('express');
const router = express.Router();
const catalogosController = require('../controllers/catalogos.controller');

router.get('/alcaldias', catalogosController.obtenerAlcaldias);
router.get('/te-enteraste', catalogosController.obtenerTeEnteraste);
router.get('/manifestaciones', catalogosController.obtenerManifestaciones);
router.get('/categorias', catalogosController.obtenerCategorias);
router.get('/convocatoria-activa', catalogosController.obtenerConvocatoriaActiva);
router.get('/tema', catalogosController.obtenerTemaConfiguracion);
router.get('/requisitos-archivos', catalogosController.obtenerRequisitosActivos);

module.exports = router;
