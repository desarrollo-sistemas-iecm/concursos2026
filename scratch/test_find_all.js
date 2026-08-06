const db = require('../backend/src/config/db');
const participantesRepo = require('../backend/src/repositories/participantes.repository');

async function test() {
  try {
    const res = await participantesRepo.findAllWithUser(1);
    console.log('EXITO:', res.length, 'participantes encontrados');
    console.log('Muestra:', res[0]);
  } catch (err) {
    console.error('ERROR EN FIND ALL:', err);
  } finally {
    process.exit(0);
  }
}

test();
