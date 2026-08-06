const db = require('../backend/src/config/db');

async function run() {
  try {
    const hasColumn = await db.schema.hasColumn('convocatorias', 'lema');
    if (!hasColumn) {
      await db.schema.table('convocatorias', table => {
        table.specificType('lema', 'varchar(255) COLLATE Modern_Spanish_CI_AS').nullable().defaultTo('Conversando con los clásicos');
      });
      console.log('Columna "lema" añadida a la tabla convocatorias con éxito.');
    } else {
      console.log('La columna "lema" ya existe en convocatorias.');
    }
  } catch (err) {
    console.error('Error al modificar tabla convocatorias:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
