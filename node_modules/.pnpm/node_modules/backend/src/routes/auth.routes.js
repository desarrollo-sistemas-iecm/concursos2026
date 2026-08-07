const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolesMiddleware = require('../middlewares/roles.middleware');

// Rutas Públicas
router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.post('/solicitar-recuperacion', authController.solicitarRecuperacion);
router.post('/validar-token-recuperacion', authController.validarTokenRecuperacion);
router.post('/restablecer-password', authController.restablecerPassword);

// Rutas Privadas (Requieren Token de Sesión Única)
router.post('/logout', authMiddleware, authController.logout);
router.get('/perfil', authMiddleware, authController.obtenerPerfil);

// Ruta Restringida (Solo Superadmin - Rol 4)
router.post('/forzar-logout-global', authMiddleware, rolesMiddleware([4]), authController.forzarLogoutGlobal);

module.exports = router;
