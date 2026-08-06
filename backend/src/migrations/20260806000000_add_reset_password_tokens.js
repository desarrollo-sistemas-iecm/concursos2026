/**
 * Migración para agregar soporte de restablecimiento de contraseña vía Token y Correo
 */
exports.up = async function(knex) {
  const hasTokenCol = await knex.schema.hasColumn('usuarios', 'reset_password_token');
  if (!hasTokenCol) {
    await knex.schema.table('usuarios', table => {
      table.specificType('reset_password_token', 'varchar(255) COLLATE Modern_Spanish_CI_AS').nullable();
      table.specificType('reset_password_expires', 'datetime2').nullable();
    });
  }
};

exports.down = async function(knex) {
  const hasTokenCol = await knex.schema.hasColumn('usuarios', 'reset_password_token');
  if (hasTokenCol) {
    await knex.schema.table('usuarios', table => {
      table.dropColumn('reset_password_token');
      table.dropColumn('reset_password_expires');
    });
  }
};
