const db = require('../backend/src/config/db');

async function test() {
  const conv = await db('convocatorias').where({ status: 1 }).first();
  console.log('Convocatoria activa:', JSON.stringify(conv, null, 2));
  process.exit(0);
}

test();
