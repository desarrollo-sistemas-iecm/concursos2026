const express = require('express');
const router = express.Router();
const participanteController = require('../controllers/participante.controller');
const auth = require('../middlewares/auth.middleware');
const roles = require('../middlewares/roles.middleware');
const { upload, uploadDocumento } = require('../middlewares/upload.middleware');

// Rutas protegidas solo para participantes (rol 1)
router.use(auth, roles([1]));

router.get('/mi-registro', participanteController.getMiRegistro);
router.post('/completar-registro', upload.single('archivo_ensayo'), participanteController.completarRegistro);

// Archivos Dinámicos de Requisitos
router.get('/mis-archivos', participanteController.getMisArchivos);
router.post('/subir-archivo-requisito', uploadDocumento.single('archivo'), participanteController.subirArchivoRequisito);
router.delete('/eliminar-archivo-requisito/:id_requisito', participanteController.eliminarArchivoRequisito);

module.exports = router;
