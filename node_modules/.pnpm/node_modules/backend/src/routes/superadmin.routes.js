const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadmin.controller');
const auth = require('../middlewares/auth.middleware');
const roles = require('../middlewares/roles.middleware');

// Proteger todas las rutas de este archivo únicamente para el rol Superadmin (4)
router.use(auth, roles([4]));

// Convocatorias y Categorías
router.get('/convocatorias', superadminController.getConvocatorias);
router.post('/convocatorias', superadminController.crearOEditarConvocatoria);
router.get('/categorias/:id_convocatoria', superadminController.getCategorias);
router.post('/categorias', superadminController.guardarCategorias);

// Sesiones en Vivo
router.get('/sesiones', superadminController.getSesionesActivas);
router.post('/sesiones/kick', superadminController.forzarLogoutUsuario);
router.post('/sesiones/kick-all', superadminController.forzarLogoutGlobal);


// Usuarios (CRUD con borrado lógico)
router.get('/usuarios', superadminController.getUsuarios);
router.post('/usuarios', superadminController.crearUsuario);
router.put('/usuarios/:id_usuario', superadminController.actualizarUsuario);
router.patch('/usuarios/:id_usuario/status', superadminController.toggleEstatusUsuario);

// Manifestaciones (CRUD con desactivación lógica)
router.get('/manifestaciones', superadminController.getManifestaciones);
router.post('/manifestaciones', superadminController.crearManifestacion);
router.put('/manifestaciones/:id_manifestacion', superadminController.actualizarManifestacion);
router.patch('/manifestaciones/:id_manifestacion/status', superadminController.toggleEstatusManifestacion);

// Personalización de Colores e Interfaz
router.post('/tema', superadminController.guardarTema);

// Requisitos de Archivos Dinámicos
router.get('/requisitos-archivos/:id_convocatoria', superadminController.obtenerRequisitosArchivos);
router.post('/requisitos-archivos', superadminController.guardarRequisitoArchivo);
router.patch('/requisitos-archivos/:id_requisito/status', superadminController.cambiarStatusRequisitoArchivo);

// Estadísticas Globales
router.get('/estadisticas', superadminController.getEstadisticas);

module.exports = router;
