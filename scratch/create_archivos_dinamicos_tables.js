const db = require('../backend/src/config/db');

async function run() {
  try {
    // 1. Tabla cat_requisitos_documentos
    const hasRequisitos = await db.schema.hasTable('cat_requisitos_documentos');
    if (!hasRequisitos) {
      await db.schema.createTable('cat_requisitos_documentos', table => {
        table.increments('id_requisito').primary();
        table.integer('id_convocatoria').notNullable();
        table.string('nombre_requisito', 255).notNullable();
        table.string('descripcion', 500).nullable();
        table.string('extensiones_permitidas', 100).defaultTo('.pdf');
        table.tinyint('es_obligatorio').defaultTo(1);
        table.integer('orden').defaultTo(1);
        table.tinyint('status').defaultTo(1);
        table.specificType('fecha_alta', 'datetime2').defaultTo(db.fn.now());
      });
      console.log('Tabla cat_requisitos_documentos creada.');

      // Inserción de requisito inicial por defecto (Ensayo Principal) para la convocatoria activa
      const convActiva = await db('convocatorias').where({ status: 1 }).first() || await db('convocatorias').first();
      if (convActiva) {
        await db('cat_requisitos_documentos').insert({
          id_convocatoria: convActiva.id_convocatoria,
          nombre_requisito: 'Ensayo Principal (Obra)',
          descripcion: 'Documento en PDF con la obra concursante en formato anónimo sin datos personales.',
          extensiones_permitidas: '.pdf',
          es_obligatorio: 1,
          orden: 1,
          status: 1
        });
        console.log('Requisito por defecto "Ensayo Principal (Obra)" insertado.');
      }
    } else {
      console.log('Tabla cat_requisitos_documentos ya existía.');
    }

    // 2. Tabla participantes_archivos
    const hasArchivos = await db.schema.hasTable('participantes_archivos');
    if (!hasArchivos) {
      await db.schema.createTable('participantes_archivos', table => {
        table.increments('id_participante_archivo').primary();
        table.integer('id_participante').notNullable();
        table.integer('id_requisito').notNullable();
        table.string('nombre_original', 255).notNullable();
        table.string('nombre_guardado', 255).notNullable();
        table.string('mime_type', 100).nullable();
        table.bigInteger('tamanio_bytes').nullable();
        table.specificType('fecha_alta', 'datetime2').defaultTo(db.fn.now());

        // Restricción de Única combinación (id_participante, id_requisito)
        table.unique(['id_participante', 'id_requisito'], { indexName: 'uq_participante_requisito' });
      });
      console.log('Tabla participantes_archivos creada con índice único uq_participante_requisito.');
    } else {
      console.log('Tabla participantes_archivos ya existía.');
    }

  } catch (err) {
    console.error('Error al crear tablas de archivos dinámicos:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
