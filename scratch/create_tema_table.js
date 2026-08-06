const db = require('../backend/src/config/db');

async function run() {
  try {
    const hasTable = await db.schema.hasTable('configuracion_tema');
    if (!hasTable) {
      await db.schema.createTable('configuracion_tema', table => {
        table.increments('id_tema').primary();
        table.string('sidebar_bg', 20).defaultTo('#0f172a');
        table.string('sidebar_text', 20).defaultTo('#94a3b8');
        table.string('sidebar_active_bg', 20).defaultTo('#14b8a620');
        table.string('sidebar_active_text', 20).defaultTo('#14b8a6');
        table.string('header_bg', 20).defaultTo('#020617');
        table.string('content_bg', 20).defaultTo('#020617');
        table.string('primary_color', 20).defaultTo('#14b8a6');
        table.string('primary_hover', 20).defaultTo('#0d9488');
        table.specificType('fecha_modifica', 'datetime2').nullable();
      });
      console.log('Tabla configuracion_tema creada.');

      // Insertar registro inicial por defecto
      await db('configuracion_tema').insert({
        id_tema: 1,
        sidebar_bg: '#0f172a',
        sidebar_text: '#94a3b8',
        sidebar_active_bg: '#14b8a620',
        sidebar_active_text: '#14b8a6',
        header_bg: '#020617',
        content_bg: '#020617',
        primary_color: '#14b8a6',
        primary_hover: '#0d9488'
      });
      console.log('Configuración de tema por defecto insertada.');
    } else {
      console.log('La tabla configuracion_tema ya existía.');
    }
  } catch (err) {
    console.error('Error al crear tabla configuracion_tema:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
