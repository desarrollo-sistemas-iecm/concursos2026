exports.up = async function(knex) {
  // 1. cat_tipousuarios
  await knex.schema.createTable('cat_tipousuarios', table => {
    table.increments('id_tipousuario').primary();
    table.specificType('descripcion', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_modifica', 'datetime2').nullable();
    table.specificType('fecha_baja', 'datetime2').nullable();
  });

  // 2. usuarios
  await knex.schema.createTable('usuarios', table => {
    table.increments('id_usuario').primary();
    table.integer('id_tipousuario').notNullable().references('id_tipousuario').inTable('cat_tipousuarios');
    table.specificType('nombre', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('apellido_pat', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('apellido_mat', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('curp', 'varchar(18) COLLATE Modern_Spanish_CI_AS').nullable().unique();
    table.specificType('genero', 'varchar(10) COLLATE Modern_Spanish_CI_AS').nullable();
    table.date('fecha_nacimiento').nullable();
    table.specificType('correo', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable().unique();
    table.specificType('usuario', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable().unique();
    table.specificType('contrasena', 'varchar(255) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('telefono_casa', 'varchar(15) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('celular_personal', 'varchar(15) COLLATE Modern_Spanish_CI_AS').nullable();
    table.integer('id_distrito').nullable();
    table.specificType('session_id', 'varchar(255) COLLATE Modern_Spanish_CI_AS').nullable();
    table.smallint('status').notNullable().defaultTo(1);
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_modifica', 'datetime2').nullable();
    table.specificType('fecha_baja', 'datetime2').nullable();
  });

  // 3. convocatorias
  await knex.schema.createTable('convocatorias', table => {
    table.increments('id_convocatoria').primary();
    table.integer('anio').notNullable().unique();
    table.specificType('nombre', 'varchar(150) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.date('fecha_inicio').notNullable();
    table.date('fecha_fin').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_modifica', 'datetime2').nullable();
  });

  // 4. cat_categorias
  await knex.schema.createTable('cat_categorias', table => {
    table.increments('id_categoria').primary();
    table.integer('id_convocatoria').notNullable().references('id_convocatoria').inTable('convocatorias');
    table.specificType('nombre', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.smallint('edad_min').notNullable();
    table.smallint('edad_max').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
  });
  await knex.schema.raw('ALTER TABLE cat_categorias ADD CONSTRAINT CK_categorias_rango CHECK (edad_max >= edad_min)');

  // 5. cat_alcaldias
  await knex.schema.createTable('cat_alcaldias', table => {
    table.increments('id_alcaldia').primary();
    table.specificType('nombre', 'varchar(100) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
  });

  // 6. cat_te_enteraste
  await knex.schema.createTable('cat_te_enteraste', table => {
    table.increments('id_te_enteraste').primary();
    table.specificType('descripcion', 'varchar(100) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
  });

  // 7. cat_manifestaciones
  await knex.schema.createTable('cat_manifestaciones', table => {
    table.increments('id_manifestacion').primary();
    table.specificType('texto', 'varchar(1000) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.smallint('orden').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
  });

  // 8. participantes
  await knex.schema.createTable('participantes', table => {
    table.increments('id_participante').primary();
    table.integer('id_usuario').notNullable().references('id_usuario').inTable('usuarios');
    table.integer('id_convocatoria').notNullable().references('id_convocatoria').inTable('convocatorias');
    table.integer('id_categoria').nullable().references('id_categoria').inTable('cat_categorias');
    table.integer('id_alcaldia').nullable().references('id_alcaldia').inTable('cat_alcaldias');
    table.integer('id_te_enteraste').nullable().references('id_te_enteraste').inTable('cat_te_enteraste');
    table.integer('id_validador').nullable().references('id_usuario').inTable('usuarios');
    table.specificType('folio', 'varchar(30) COLLATE Modern_Spanish_CI_AS').nullable().unique();
    table.specificType('seudonimo', 'varchar(50) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('titulo_ensayo', 'varchar(100) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('obra', 'varchar(500) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('entidad', 'varchar(200) COLLATE Modern_Spanish_CI_AS').nullable();
    table.boolean('soy_originario').nullable();
    table.specificType('archivo_ensayo', 'varchar(255) COLLATE Modern_Spanish_CI_AS').nullable();
    table.smallint('status_ensayo').notNullable().defaultTo(0);
    table.specificType('observaciones', 'varchar(800) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('nombre_tutor', 'varchar(50) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('apellido_pat_tutor', 'varchar(50) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('apellido_mat_tutor', 'varchar(50) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('clave_elector_tutor', 'varchar(18) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('tel1', 'varchar(15) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('tel2', 'varchar(15) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_modifica', 'datetime2').nullable();
    
    table.unique(['id_usuario', 'id_convocatoria']);
  });

  // 9. participante_manifestaciones
  await knex.schema.createTable('participante_manifestaciones', table => {
    table.integer('id_participante').notNullable().references('id_participante').inTable('participantes');
    table.integer('id_manifestacion').notNullable().references('id_manifestacion').inTable('cat_manifestaciones');
    table.smallint('respuesta').notNullable();
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    
    table.primary(['id_participante', 'id_manifestacion']);
  });

  // 10. calificaciones
  await knex.schema.createTable('calificaciones', table => {
    table.increments('id_calificacion').primary();
    table.integer('id_participante').notNullable().references('id_participante').inTable('participantes');
    table.integer('id_juez').notNullable().references('id_usuario').inTable('usuarios');
    table.decimal('califica1', 4, 1).notNullable();
    table.decimal('califica2', 4, 1).notNullable();
    table.decimal('califica3', 4, 1).notNullable();
    table.decimal('califica4', 4, 1).notNullable();
    table.decimal('califica5', 4, 1).notNullable();
    table.decimal('califica6', 4, 1).notNullable();
    table.decimal('total', 4, 1).notNullable();
    table.specificType('observaciones', 'nvarchar(500)').nullable();
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_modifica', 'datetime2').nullable();

    table.unique(['id_participante', 'id_juez']);
  });

  // 11. vw_calificaciones (View)
  await knex.schema.raw(`
    CREATE VIEW vw_calificaciones AS
    SELECT
        id_participante,
        ROUND(AVG(total), 1, 1)   AS prom_global,
        COUNT(*)                  AS jueces_que_calificaron,
        MIN(fecha_alta)           AS fecha_alta,
        MAX(fecha_modifica)       AS fecha_modifica
    FROM calificaciones
    GROUP BY id_participante;
  `);

  // 12. auditoria_impersonacion
  await knex.schema.createTable('auditoria_impersonacion', table => {
    table.increments('id_impersonacion').primary();
    table.integer('id_superadmin').notNullable().references('id_usuario').inTable('usuarios');
    table.integer('id_usuario_target').notNullable().references('id_usuario').inTable('usuarios');
    table.specificType('motivo', 'varchar(255) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('ip_origen', 'varchar(45) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('fecha_inicio', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_fin', 'datetime2').nullable();
  });

  // 13. notificaciones
  await knex.schema.createTable('notificaciones', table => {
    table.increments('id_notificacion').primary();
    table.integer('id_remitente').notNullable().references('id_usuario').inTable('usuarios');
    table.integer('id_tipousuario_destino').nullable().references('id_tipousuario').inTable('cat_tipousuarios');
    table.integer('id_usuario_destino').nullable().references('id_usuario').inTable('usuarios');
    table.smallint('tipo').notNullable();
    table.specificType('asunto', 'varchar(150) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('mensaje', 'varchar(1000) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.smallint('status').notNullable().defaultTo(1);
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
    table.specificType('fecha_atendida', 'datetime2').nullable();
  });
  await knex.schema.raw(`
    ALTER TABLE notificaciones ADD CONSTRAINT CK_notif_destino CHECK (
        (id_tipousuario_destino IS NOT NULL AND id_usuario_destino IS NULL)
        OR (id_tipousuario_destino IS NULL AND id_usuario_destino IS NOT NULL)
    )
  `);

  // 14. notificaciones_lecturas
  await knex.schema.createTable('notificaciones_lecturas', table => {
    table.integer('id_notificacion').notNullable().references('id_notificacion').inTable('notificaciones');
    table.integer('id_usuario').notNullable().references('id_usuario').inTable('usuarios');
    table.boolean('leido').notNullable().defaultTo(false);
    table.specificType('fecha_leido', 'datetime2').nullable();

    table.primary(['id_notificacion', 'id_usuario']);
  });

  // 15. bitacora_acciones
  await knex.schema.createTable('bitacora_acciones', table => {
    table.bigIncrements('id_bitacora').primary();
    table.integer('id_usuario').notNullable().references('id_usuario').inTable('usuarios');
    table.specificType('accion', 'varchar(100) COLLATE Modern_Spanish_CI_AS').notNullable();
    table.specificType('entidad', 'varchar(100) COLLATE Modern_Spanish_CI_AS').nullable();
    table.integer('id_entidad').nullable();
    table.specificType('detalle', 'nvarchar(1000)').nullable();
    table.specificType('ip_origen', 'varchar(45) COLLATE Modern_Spanish_CI_AS').nullable();
    table.specificType('fecha_alta', 'datetime2').notNullable().defaultTo(knex.raw('GETDATE()'));
  });
  await knex.schema.raw('CREATE INDEX IX_bitacora_usuario_fecha ON bitacora_acciones (id_usuario, fecha_alta)');
};

exports.down = async function(knex) {
  await knex.schema.raw('DROP INDEX IF EXISTS IX_bitacora_usuario_fecha ON bitacora_acciones');
  await knex.schema.dropTableIfExists('bitacora_acciones');
  await knex.schema.dropTableIfExists('notificaciones_lecturas');
  await knex.schema.dropTableIfExists('notificaciones');
  await knex.schema.dropTableIfExists('auditoria_impersonacion');
  await knex.schema.raw('DROP VIEW IF EXISTS vw_calificaciones');
  await knex.schema.dropTableIfExists('calificaciones');
  await knex.schema.dropTableIfExists('participante_manifestaciones');
  await knex.schema.dropTableIfExists('participantes');
  await knex.schema.dropTableIfExists('cat_manifestaciones');
  await knex.schema.dropTableIfExists('cat_te_enteraste');
  await knex.schema.dropTableIfExists('cat_alcaldias');
  await knex.schema.dropTableIfExists('cat_categorias');
  await knex.schema.dropTableIfExists('convocatorias');
  await knex.schema.dropTableIfExists('usuarios');
  await knex.schema.dropTableIfExists('cat_tipousuarios');
};
