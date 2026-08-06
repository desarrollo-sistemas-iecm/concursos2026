const db = require('../backend/src/config/db');

async function run() {
  try {
    const convocatorias = await db('convocatorias').select('*');
    console.log('--- CONVOCATORIAS ---');
    console.log(convocatorias);

    const requisitos = await db('cat_requisitos_documentos').select('*');
    console.log('--- CAT_REQUISITOS_DOCUMENTOS ---');
    console.log(requisitos);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
