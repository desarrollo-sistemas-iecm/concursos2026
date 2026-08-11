exports.up = async function(knex) {
  const hasInicioAcceso = await knex.schema.hasColumn('convocatorias', 'fecha_inicio_acceso');
  if (!hasInicioAcceso) {
    await knex.schema.alterTable('convocatorias', table => {
      table.date('fecha_inicio_acceso').nullable();
      table.date('fecha_fin_acceso').nullable();
      table.specificType('roles_restringidos_acceso', 'varchar(50) COLLATE Modern_Spanish_CI_AS').nullable().defaultTo('1');
    });
  }
};

exports.down = async function(knex) {
  const hasInicioAcceso = await knex.schema.hasColumn('convocatorias', 'fecha_inicio_acceso');
  if (hasInicioAcceso) {
    await knex.schema.alterTable('convocatorias', table => {
      table.dropColumn('fecha_inicio_acceso');
      table.dropColumn('fecha_fin_acceso');
      table.dropColumn('roles_restringidos_acceso');
    });
  }
};
