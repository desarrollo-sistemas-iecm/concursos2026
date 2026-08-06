const db = require('../backend/src/config/db');

async function checkCols() {
  try {
    const res1 = await db.raw("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notificaciones'");
    console.log('Columnas de notificaciones:', res1.map(r => r.COLUMN_NAME));

    const res2 = await db.raw("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notificaciones_lecturas'");
    console.log('Columnas de notificaciones_lecturas:', res2.map(r => r.COLUMN_NAME));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
}

checkCols();
