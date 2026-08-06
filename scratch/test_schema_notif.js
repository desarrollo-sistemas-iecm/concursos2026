const db = require('../backend/src/config/db');

async function checkTypes() {
  try {
    const res = await db.raw("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notificaciones'");
    console.log('Tipos de columnas notificaciones:', res);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
}

checkTypes();
