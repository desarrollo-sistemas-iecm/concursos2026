const db = require('../backend/src/config/db');

async function checkCols() {
  try {
    const res = await db.raw("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'calificaciones'");
    console.log('Columnas de calificaciones:', res.map(r => r.COLUMN_NAME));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
}

checkCols();
