const db = require('../backend/src/config/db');

async function run() {
  try {
    const hasHeaderText = await db.schema.hasColumn('configuracion_tema', 'header_text');
    if (!hasHeaderText) {
      await db.schema.table('configuracion_tema', table => {
        table.string('header_text', 20).defaultTo('#ffffff');
      });
      console.log('Columna header_text agregada.');
    }

    const hasPrimaryText = await db.schema.hasColumn('configuracion_tema', 'primary_text');
    if (!hasPrimaryText) {
      await db.schema.table('configuracion_tema', table => {
        table.string('primary_text', 20).defaultTo('#020617');
      });
      console.log('Columna primary_text agregada.');
    }

    console.log('Campos de tema actualizados correctamente.');
  } catch (err) {
    console.error('Error al actualizar campos de tema:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
