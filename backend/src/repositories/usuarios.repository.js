const db = require('../config/db');

class UsuariosRepository {
  async findById(id_usuario) {
    return db('usuarios').where({ id_usuario }).first();
  }

  async findByUsername(usuario) {
    return db('usuarios')
      .where({ usuario })
      .first();
  }

  async findByEmail(correo) {
    return db('usuarios')
      .where({ correo })
      .first();
  }

  async findByCurp(curp) {
    if (!curp) return null;
    return db('usuarios')
      .where({ curp })
      .first();
  }

  async create(userData, trx = null) {
    const q = trx || db;
    // OUTPUT INSERTED garantiza el ID en la misma query, independiente del pool de conexiones
    const cols = Object.keys(userData).map(c => `[${c}]`).join(', ');
    const vals = Object.values(userData);
    const placeholders = vals.map(() => '?').join(', ');
    const result = await q.raw(
      `INSERT INTO [usuarios] (${cols}) OUTPUT INSERTED.[id_usuario] VALUES (${placeholders})`,
      vals
    );
    const id_usuario = result[0]?.id_usuario;
    return { ...userData, id_usuario };
  }

  async update(id_usuario, userData, trx = null) {
    const query = db('usuarios').where({ id_usuario });
    if (trx) query.transacting(trx);

    await query.update({
      ...userData,
      fecha_modifica: db.raw('GETDATE()')
    });
    return { id_usuario, ...userData };
  }

  async updateSessionId(id_usuario, session_id, trx = null) {
    const query = db('usuarios').where({ id_usuario });
    if (trx) query.transacting(trx);

    return query.update({
      session_id,
      fecha_modifica: db.raw('GETDATE()')
    });
  }

  async clearAllSessions(trx = null) {
    const query = db('usuarios');
    if (trx) query.transacting(trx);

    return query.update({
      session_id: null,
      fecha_modifica: db.raw('GETDATE()')
    });
  }

  async listAllActive() {
    return db('usuarios')
      .select('id_usuario', 'id_tipousuario', 'nombre', 'apellido_pat', 'apellido_mat', 'correo', 'usuario', 'session_id', 'status')
      .where({ status: 1 });
  }

  async saveResetToken(id_usuario, token, fechaExpiracion) {
    return db('usuarios')
      .where({ id_usuario })
      .update({
        reset_password_token: token,
        reset_password_expires: fechaExpiracion,
        fecha_modifica: db.raw('GETDATE()')
      });
  }

  async findByResetToken(token) {
    if (!token) return null;
    return db('usuarios')
      .where({ reset_password_token: token })
      .where('reset_password_expires', '>', db.raw('GETDATE()'))
      .first();
  }

  async updatePasswordAndClearToken(id_usuario, contrasenaHash) {
    return db('usuarios')
      .where({ id_usuario })
      .update({
        contrasena: contrasenaHash,
        reset_password_token: null,
        reset_password_expires: null,
        session_id: null, // Invalida cualquier sesión activa previa por seguridad
        fecha_modifica: db.raw('GETDATE()')
      });
  }
}

module.exports = new UsuariosRepository();
