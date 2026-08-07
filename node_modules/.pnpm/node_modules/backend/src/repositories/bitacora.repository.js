const db = require('../config/db');

class BitacoraRepository {
  /**
   * Registra una acción de auditoría en la bitácora de acciones del sistema.
   * @param {number} id_usuario - ID del usuario que realiza la acción
   * @param {string} accion - Nombre de la acción (ej. LOGIN, REGISTRO, etc.)
   * @param {string} [entidad] - Tabla afectada
   * @param {number} [id_entidad] - ID del registro afectado
   * @param {string|object} [detalle] - Información complementaria
   * @param {string} [ip_origen] - IP de donde provino la petición
   */
  async registrar(id_usuario, accion, entidad = null, id_entidad = null, detalle = null, ip_origen = null) {
    try {
      const parsedDetalle = detalle && typeof detalle === 'object' ? JSON.stringify(detalle) : detalle;
      await db('bitacora_acciones').insert({
        id_usuario,
        accion,
        entidad,
        id_entidad,
        detalle: parsedDetalle,
        ip_origen,
        fecha_alta: db.raw('GETDATE()')
      });
    } catch (err) {
      // Evitamos tirar la petición principal si falla la bitácora de auditoría
      console.error('Error al insertar en bitácora de acciones:', err.message);
    }
  }
}

module.exports = new BitacoraRepository();
