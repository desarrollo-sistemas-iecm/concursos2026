const db = require('./src/config/db');
const participantesRepository = require('./src/repositories/participantes.repository');
const catalogosRepository = require('./src/repositories/catalogos.repository');
const usuariosRepository = require('./src/repositories/usuarios.repository');

async function testGetMiRegistro() {
  try {
    const id_usuario = 4; // Renato
    console.log('Iniciando prueba de getMiRegistro para id_usuario = 4...');

    const convocatoriaActiva = await catalogosRepository.getConvocatoriaActiva();
    console.log('Convocatoria Activa:', convocatoriaActiva);

    const participante = await participantesRepository.findByUsuarioAndConvocatoria(
      id_usuario,
      convocatoriaActiva.id_convocatoria
    );
    console.log('Participante Encontrado:', participante);

    if (!participante) {
      console.log('ERROR: Participante no encontrado.');
      return;
    }

    const manifestaciones = await participantesRepository.getManifestacionesByParticipante(
      participante.id_participante
    );
    console.log('Manifestaciones:', manifestaciones);

    const usuario = await usuariosRepository.findById(id_usuario);
    console.log('Usuario:', usuario);

    const responseData = {
      participante,
      manifestaciones,
      fecha_nacimiento: usuario?.fecha_nacimiento,
      curp: usuario?.curp
    };
    console.log('RESPUESTA EXITOSA:', responseData);

  } catch (err) {
    console.error('ERROR EN GET_MI_REGISTRO:', err);
  } finally {
    await db.destroy();
  }
}

testGetMiRegistro();
