const db = require('../backend/src/config/db');

async function run() {
  try {
    const existing = await db('configuracion_tema').first();
    if (!existing) {
      await db('configuracion_tema').insert({
        sidebar_bg: '#0f172a',
        sidebar_text: '#94a3b8',
        sidebar_active_bg: '#14b8a620',
        sidebar_active_text: '#14b8a6',
        header_bg: '#020617',
        content_bg: '#020617',
        primary_color: '#14b8a6',
        primary_hover: '#0d9488'
      });
      console.log('Fila inicial de tema insertada con éxito.');
    } else {
      console.log('Fila inicial de tema ya existía:', existing);
    }
  } catch (err) {
    console.error('Error al insertar fila inicial:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
