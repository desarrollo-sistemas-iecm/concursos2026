exports.up = async function(knex) {
  await knex.schema.alterTable('participantes', table => {
    table.specificType('fecha_descarga_acuse', 'datetime2').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('participantes', table => {
    table.dropColumn('fecha_descarga_acuse');
  });
};
